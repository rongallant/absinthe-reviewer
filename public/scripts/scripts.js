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

// Extension materialize.css
$.validator.setDefaults({
    errorClass: 'invalid',
    validClass: "valid",
    errorPlacement: function (error, element) {
        console.log(element)
        console.log(element.attr("id"))
        $(element)
            .closest(".input-field")
            .find("label[for='" + element.attr("id") + "']")
            .attr('data-error', error.text());
    },
    submitHandler: function (form) {
        console.log('form ok');
    }
});

$(function() {
    $(".button-collapse").sideNav();
    $('.modal-trigger').leanModal();
})
