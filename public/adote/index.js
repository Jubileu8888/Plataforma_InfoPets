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
    formData.append('nameuser', nameuser);
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

            var img = document.createElement('img');
            img.src = advertisement.images;
            img.alt = advertisement.title;

            var h3 = document.createElement('h3');
            h3.textContent = advertisement.title;

            var p = document.createElement('p');
            p.textContent = advertisement.description;

            var btn = document.createElement('button');
            btn.onclick = details;
            btn.id = `${advertisement.id}`
            btn.className = 'btn btn-primary';
            btn.textContent = 'Ver Detalhes';

            listingCard.appendChild(img);
            listingCard.appendChild(h3);
            listingCard.appendChild(p);
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