function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
$(function() {
    $('.ui.dropdown').dropdown();
    // $('.ui.checkbox').checkbox();
});