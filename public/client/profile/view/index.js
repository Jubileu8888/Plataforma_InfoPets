document.addEventListener('DOMContentLoaded', function () {
    getinfo();
});

function getinfo() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/getinfo', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseArray = JSON.parse(xhr.responseText);
                console.log(responseArray)
                var name = responseArray[0].name;
                var img = responseArray[0].img;

                document.getElementById('name').innerHTML = '<h2 class="mb-4">' + name + '</h2>';

                var profileImg = document.getElementById('profileImg');
                profileImg.src = img
                document.getElementById('editProfileBtn').style.display = 'block';
            } else {
                console.error(`Erro na requisição: ${xhr.status}`);
            }
        }
    };
    xhr.send();
}