$(document).ready(function () {
    // Atualizar o Preview conforme o usuário preenche o formulário
    $("#anuncio-form").change(function () {
        var titulo = $("#titulo").val();
        var descricao = $("#descricao").val();
        var imagem = $("#imagem")[0].files[0];

        if (titulo !== "" || descricao !== "" || imagem) {
            $("#preview-titulo").text(titulo);
            $("#preview-descricao").text(descricao);
            $("#preview-imagem").attr("src", URL.createObjectURL(imagem));
            $("#preview").removeClass("d-none");
        } else {
            $("#preview").addClass("d-none");
        }
    });
});

document.querySelector('.edit-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var title = document.getElementById('titulo').value;
    var description = document.getElementById('descricao').value;
    var image = document.getElementById('imagem').files[0];

    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/post', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("dados salvos")
                window.location.replace('/home/index.html')
            } else {
                console.log("test")
                window.location.replace('/home/index.html')
            }
        }
    }
    xhr.send(formData);

});