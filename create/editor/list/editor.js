function reloadEvents() {
    $("#blocks ul").sortable({
        axis: "y"
    });
}
$(document).ready(function(){
    reloadEvents();
});