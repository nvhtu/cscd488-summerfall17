$(document).ready(loaded);

function loaded() {
   $.post("/cscd488-summerfall17/ape/get_all_apes.php", 
        {requester_id: "1",
        requester_type: "Admin"}, 
        loadTable,
        "json");

    //Automatic GLOBAL variables
    userId = "1";
    userType = "Admin";
    userSessionId = "0";

    $("#create-button").click(createButtonClick);
    $("#submit-button").click(submitForm);
}

function loadTable(data) {
    $.each(data, function(i, item) {
        var row = buildRow(item);
        appendRow(row);
    });
}

function createButtonClick()
{
    $("#requester-id").val(userId);
    $("#requester-type").val(userType);
    $("#requester-session").val(userSessionId);

    getAllLoc();
}

function getAllLoc()
{
    $.post("../location/get_all_locations.php",{
                                requester_id: userId,
                                requester_type: userType,
                                requester_session_id: userSessionId
                                }, populateLocation, "json");
}

function populateLocation(data)
{
    $("#ape-loc").empty();
    $.each(data, function(i){
        $("#ape-loc").append($("<option></option")
                    .attr("value", data[i]["loc_id"])
                    .text(data[i]["name"]));
    });
}

function submitForm ()
{
    $.post("../ape/create_ape.php", $("#add-exam-form").serialize());                 
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