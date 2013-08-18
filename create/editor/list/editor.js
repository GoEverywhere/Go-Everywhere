function reloadEvents() {
    $("#blocks .sortable-script").sortable({
        axis: "y"
    });
}
$(document).ready(function(){
    reloadEvents();
});