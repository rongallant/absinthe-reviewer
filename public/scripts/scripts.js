function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
function existy(x) {
    return typeof (x) != 'undefined' && x != null;
}

// JQuery form validation defaults.
$.validator.setDefaults({
    errorClass: 'invalid',
    validClass: "valid",
    errorPlacement: function (error, element) {
        $(element)
            .closest(".input-field")
            .find("label[for='" + element.attr("id") + "']")
            .attr('data-error', error.text());
    },
    submitHandler: function (form) {
        return true;
    }
});

$(function() {
    $(".button-collapse").sideNav();
    $('.modal-trigger').leanModal();
})
