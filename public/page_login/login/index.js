$(document).ready(function () {
    $("#show-register").click(function () {
        $("#register-form").removeClass("d-none");
        $(".btn-login").addClass("d-none");
        $("#show-register").addClass("d-none");
    });

    $("#show-login").click(function () {
        $("#register-form").addClass("d-none");
        $(".btn-login").removeClass("d-none");
        $("#show-register").removeClass("d-none");
    });
});