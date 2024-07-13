document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("anuncio-form").addEventListener('change', function () {
        
    var namepet = document.getElementById("namepet").value;
    var racapet = document.getElementById("raca").value;
    var nameuser = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var telephone = document.getElementById("telephone").value;
    var imagem = document.getElementById("imagem").files[0];


    if (namepet !== "" || racapet !== "" || imagem) {
        document.getElementById("preview-namepet").textContent = namepet;
        document.getElementById("preview-namepet2").textContent = namepet;
        // document.getElementById("preview-descricao").textContent = descricao;
        if (imagem) {
            document.getElementById("preview-imagem").src = URL.createObjectURL(imagem);
        } else {
            document.getElementById("preview-imagem").src = "";
        }
        document.getElementById("preview").classList.remove("d-none");
    } else {
        document.getElementById("preview").classList.add("d-none");
    }
});

  document.querySelector('.edit-form').addEventListener('submit', function (event) {
    event.preventDefault();

    
    var namepet = document.getElementById("namepet").value;
    var racapet = document.getElementById("raca").value;
    var nameuser = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var telephone = document.getElementById("telephone").value;
    var imagem = document.getElementById("imagem").files[0];

    var formData = new FormData();
    formData.append('namepet', namepet);
    formData.append('racapet', racapet);
    formData.append('email', email);
    formData.append('telephone', telephone);
    formData.append('image', imagem);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/post', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Data saved successfully");
                window.location.replace('/adote/index.html');
            } else {
                console.log("Error occurred");
                window.location.replace('/adote/index.html');
            }
        }
    };
    xhr.send(formData);
  });


  

  function fazerRequisicao() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/verifyprofile', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var responseArray = JSON.parse(xhr.responseText);
          if (xhr.responseText == "NaN") {
            console.log("Não está logado");
          } else {
            var profileBall = document.createElement("a");
            profileBall.href = "../client/profile/view/index.html"
            profileBall.classList.add("profile-ball");


            var profileImage = document.createElement("img");
            profileImage.src = responseArray[0].img;
            profileImage.alt = "Imagem de Perfil";
            profileBall.appendChild(profileImage);

            var loginButton = document.getElementById("locateimgorlogin");
            loginButton.parentNode.replaceChild(profileBall, loginButton);
          }
        } else {
          console.error('Erro na requisição: ' + xhr.status);
        }
      }
    };
    xhr.send();
  };

  function srcad() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/srcposts', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var advertisementArray = JSON.parse(xhr.responseText);
          var listingContainer = document.getElementById('container');
          listingContainer.innerHTML = '';

          var title = document.createElement('h2');
          title.className = 'text-center mb-4';
          title.textContent = 'Lista de animais';
          listingContainer.appendChild(title);

          var row = document.createElement('div');
          row.className = 'row';
          listingContainer.appendChild(row);

          for (var i = 0; i < advertisementArray.length; i++) {
            var advertisement = advertisementArray[i];

            var colDiv = document.createElement('div');
            colDiv.className = 'col-md-4';

            var listingCard = document.createElement('div');
            listingCard.className = 'listing-card';

            var listingContainermodal = document.getElementById('containermodal')


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////


            const modalDiv = document.createElement('div');
            modalDiv.classList.add('modal', 'fade');
            modalDiv.id = `details${advertisement.id}`;
            modalDiv.setAttribute('data-bs-backdrop', 'static');
            modalDiv.setAttribute('data-bs-keyboard', 'false');
            modalDiv.setAttribute('aria-labelledby', `details${advertisement.id}`);
            modalDiv.tabIndex = '-1';
            modalDiv.setAttribute('aria-hidden', 'true');
            modalDiv.style.display = 'none';

            const modalDialog = document.createElement('div');
            modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            const modalHeader = document.createElement('div');
            modalHeader.classList.add('modal-header');

            const modalTitle = document.createElement('h1');
            modalTitle.classList.add('modal-title', 'fs-5');
            modalTitle.id = 'exampleModalToggleLabel2';
            modalTitle.textContent = ''; // Coloque o título desejado aqui

            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.classList.add('btn-close');
            closeButton.setAttribute('data-bs-dismiss', 'modal');
            closeButton.setAttribute('aria-label', 'Close');

            modalHeader.appendChild(modalTitle);
            modalHeader.appendChild(closeButton);

            const modalBody = document.createElement('div');
            modalBody.classList.add('modal-body');

            const centerElement = document.createElement('center');
            const imgmod = document.createElement('img');
            imgmod.src = `${advertisement.images}`;
            imgmod.alt = 'imgcao';
            imgmod.classList.add('imgdetailmod')
            centerElement.appendChild(imgmod);
            

            const namePetParagraph = document.createElement('p');
            namePetParagraph.textContent = ``;

            const nameAnimal = document.createElement('h6');
            nameAnimal.textContent = `Nome (animal): ${advertisement.namepet}`;
            nameAnimal.appendChild(namePetParagraph);

            const race = document.createElement('h6');
            race.textContent = `Raça: ${advertisement.racapet}`;
            race.appendChild(namePetParagraph.cloneNode(true));

            const email = document.createElement('h6');
            email.textContent = `E-mail: ${advertisement.email}`;
            email.appendChild(namePetParagraph.cloneNode(true));

            const phone = document.createElement('h6');
            phone.textContent = `Telefone: ${advertisement.phone}`;
            phone.appendChild(namePetParagraph.cloneNode(true));

            modalBody.appendChild(document.createElement('br'));
            modalBody.appendChild(centerElement);
            modalBody.appendChild(document.createElement('br'));
            modalBody.appendChild(nameAnimal);
            modalBody.appendChild(race);
            modalBody.appendChild(email);
            modalBody.appendChild(phone);

            const modalFooter = document.createElement('div');
            modalFooter.classList.add('modal-footer');

            const closeButtonFooter = document.createElement('button');
            closeButtonFooter.type = 'button';
            closeButtonFooter.classList.add('btn', 'btn-primary');
            closeButtonFooter.setAttribute('data-bs-dismiss', 'modal');
            closeButtonFooter.textContent = 'Fechar';

            modalFooter.appendChild(closeButtonFooter);

            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalFooter);

            modalDialog.appendChild(modalContent);

            modalDiv.appendChild(modalDialog);

            // Inserção na página
            document.body.appendChild(modalDiv);

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////


            // FICA
            var img = document.createElement('img');
            img.src = advertisement.images;
            img.alt = advertisement.title;

            // FICA
            var h3 = document.createElement('h3');
            h3.textContent = advertisement.title;

            // FICA
            var btn = document.createElement('button');
            btn.setAttribute('onclick', `openmodaldetails(${advertisement.id})`);
            btn.setAttribute('data-bs-target', `#details${advertisement.id}`);
            btn.setAttribute('data-bs-toogle', 'modal');
            btn.id = `${advertisement.id}`
            btn.className = 'btn btn-primary';
            btn.textContent = 'Ver Detalhes';

            listingCard.appendChild(img);
            listingCard.appendChild(h3);
            listingCard.appendChild(btn);

            colDiv.appendChild(listingCard);

            row.appendChild(colDiv);

            if ((i + 1) % 3 === 0 && i !== advertisementArray.length - 1) {
              row = document.createElement('div');
              row.className = 'row';
              listingContainer.appendChild(row);
            }
          }
        } else {
          console.error('Erro na requisição: ' + xhr.status);
        }
      }
    };
    xhr.send();
  }
  function details(event) {
    var buttonClicked = event.target;
    var advertisementId = buttonClicked.id;
    window.location.href = '/post/details/detail.html?id=' + advertisementId;
  }

  fazerRequisicao();
  srcad();
});

function verif() {

  var namepet = document.getElementById("namepet").value;
  var racapet = document.getElementById("raca").value;
  var nameuser = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var telephone = document.getElementById("telephone").value;
  var imagem = document.getElementById("imagem").files[0];

  var error = document.getElementById('erros');

  error.innerHTML = ""

  if (namepet && racapet && nameuser && email && telephone && imagem) {
      
      var modalConfirm = new bootstrap.Modal(document.getElementById('modalconfim'));
      modalConfirm.show();

      var modalCad = bootstrap.Modal.getInstance(document.getElementById('modalcad'));
      modalCad.hide();
  } else {
      error.innerHTML = "Preencha todos os campos para continuar."  
  }
}

function returnmod() {

  var modalCad = new bootstrap.Modal(document.getElementById('modalcad'));
  modalCad.show();
  
  var modalConfirm = bootstrap.Modal.getInstance(document.getElementById('modalconfim'));
  modalConfirm.hide();
}


function openmodaldetails(id) {
  var modaldetail = new bootstrap.Modal(document.getElementById(`details${id}`));
  modaldetail.show();
}