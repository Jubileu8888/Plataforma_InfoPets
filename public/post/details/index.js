document.addEventListener('DOMContentLoaded', function () {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    let advertisementId = getParameterByName('id');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/details', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var advertisement = response.advertisement;
                var account = response.account;

                document.getElementById('advertisement-title').textContent = advertisement.title;
                document.getElementById('advertisement-image').src = advertisement.images;
                document.getElementById('advertisement-description').textContent = advertisement.description;
                document.getElementById('advertisement-user').textContent = account.name;

                var profileDot = document.getElementById('profile-dot');
                profileDot.style.backgroundImage = `url('${account.image_profille}')`;
            } else {
                console.log("Erro na requisição.");
            }
        }
    };
    xhr.send('id=' + encodeURIComponent(advertisementId));
});