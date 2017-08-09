$(document).ready(loaded);

function loaded() {
   $.post("/cscd488-summerfall17/ape/get_all_apes.php", 
        {requester_id: "1",
        requester_type: "Admin"}, 
        loadTable,
        "json");
}

function loadTable(data) {
    $.each(data, function(i, item) {
        var row = buildRow(item);
        appendRow(row);
    });
}

function buildRow(item) {
    //create edit button
    var $bttnEdit = $('<button type="button" class="btn btn-info btn-sm"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
    $bttnEdit.attr("data-id", item.cat_id); //add unique ID from item as a data tag
    $bttnEdit.click(onclickEdit);

    //create delete button
    var $bttnDel = $('<button type="button" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
    $bttnDel.attr("data-id", item.cat_id);
    $bttnDel.click(onclickDelete);

    //wrap each piece of data in <td> tags, then wrap them all in a <tr> tag and return row
    return $("<tr>")
        .append(
            $("<td>").text(item.date),
            $("<td>").text(item.start_time),
            $("<td>").text(item.state),
            $("<td>").text(item.passing_grade),
            $("<td>").text(item.duration),
            $("<td>").text(item.cutoff),
            $("<td>").append($bttnEdit),
            $("<td>").append($bttnDel)
        );
}

function appendRow(row){
    row.appendTo("#exam-table");
}
   
function onclickEdit(e) {
    
}

function onclickDelete(e) {
    
}