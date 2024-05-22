document.addEventListener('DOMContentLoaded', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getedit', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseArray = JSON.parse(xhr.responseText);
                var name = responseArray[0].name;
                var img = responseArray[0].img;
                var email = responseArray[0].email;
                var phone = responseArray[0].telephone;

                document.getElementById('name').value = name;
                document.getElementById('email').value = email;
                document.getElementById('phone').value = phone;
                document.getElementById('previewImg').src = img;
            } else {
                console.error("Erro na requisição: " + xhr.status);
            }
        }
    }
    xhr.send();
});
document.querySelector('.edit-form').addEventListener('submit', function (event) {
    event.preventDefault();

    document.getElementById('loadingOverlay').style.visibility = 'visible';

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var avatarFile = document.getElementById('avatar').files[0];

    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('avatar', avatarFile);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/save', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Dados salvos com sucesso!");
                document.getElementById('loadingOverlay').style.visibility = 'hidden';

                window.location.replace('/home/index.html')
            } else {
                console.error("Erro ao salvar os dados: " + xhr.status);
                document.getElementById('loadingOverlay').style.visibility = 'hidden';
            }
        }
    };
    xhr.send(formData);
});
document.getElementById('avatar').addEventListener('change', function (event) {
    var previewImg = document.getElementById('previewImg');
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        previewImg.src = e.target.result;
    }

    reader.readAsDataURL(file);
});