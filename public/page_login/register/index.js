document.addEventListener('DOMContentLoaded', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/verify2', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("...")
            } else {
                console.error("Erro na requisição: " + xhr.status);
            }
        }
    }
    xhr.send();
});