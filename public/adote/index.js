document.addEventListener('DOMContentLoaded', function () {
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
            title.textContent = 'Doações em Destaque';
            listingContainer.appendChild(title);

            var btn = document.createElement('div');
            btn.className = 'text-center mb-4';
            var link = document.createElement('a');
            link.className = 'btn btn-anuncie';
            link.href = '../post/index.html';
            link.textContent = 'Doe agora';
            btn.appendChild(link);
            listingContainer.appendChild(btn);

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