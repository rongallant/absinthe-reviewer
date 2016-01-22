function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
$(function() {
      $(".button-collapse").sideNav()
    //   $(".dropdown-button").dropdown()
    // if (message) {
    //     Materialize.toast(message, 4000)
    // }
})
