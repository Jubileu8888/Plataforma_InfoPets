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
  

    fazerRequisicao();
  });

  const button = document.querySelector('.btn-anime');
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });