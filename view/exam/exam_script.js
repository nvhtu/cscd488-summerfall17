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
        var detailRow = buildDetailRow(item);
        appendRow(detailRow);
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
    $.post("../ape/create_ape.php", $("form").serialize());                 
}


function buildRow(item) {
   //create info button
   var $bttnInfo = $('<button type="button" class="btn btn-info" data-target="#' + item.exam_id + '" data-toggle="collapse"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><span class="sr-only">Info</span></button>');
    
   //create edit button
   var $bttnEdit = $('<button type="button" class="btn btn-warning"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
   $bttnEdit.attr("data-id", item.cat_id); //add unique ID from item as a data tag
   $bttnEdit.click(onclickEdit);

   //create delete button
   var $bttnDel = $('<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
   $bttnDel.attr("data-id", item.cat_id);
   $bttnDel.click(onclickDelete);

   //wrap each piece of data in <td> tags, then wrap them all in a <tr> tag and return row
   return $('<tr data-toggle="collapse" class="accordion-toggle" aria-expanded="true">')
      .append(
         $("<td>").text(item.name),
         $("<td>").text(item.quarter),
         $("<td>").text(item.date),
         $("<td>").text(item.start_time),
         $("<td>").text(item.state),
         $("<td>").append(
            $('<div class="btn-group" role="group">').append(
               $bttnInfo, $bttnEdit, $bttnDel)
         )
      );
}

function buildDetailRow(item) {
   return $('<tr class="collapse" id="' + item.exam_id + '">').append(
      $('<td colspan="6" class="well">').append(
         $('<div class="panel panel-default">').append(
            $('<table class="table table-condensed">').append(
               $('<thead>').append(
                  $('<tr>').append(
                     $('<th>').text("Location"),
                     $('<th>').text("Duration"),
                     $('<th>').text("Passing Grade"),
                     $('<th>').text("Cutoff")
                  )
               ),
               $('<tbody>').append(
                  $('<tr>').append(
                     $('<td>').text(item.location),
                     $('<td>').text(item.duration + " hours"),
                     $('<td>').text(item.passing_grade + "%"),
                     $('<td>').text(item.cutoff + " hours")
                  )
               )
            )
         )
      )
   );
}

function appendRow(row){
    row.appendTo("#exam-table");
}
   
function onclickEdit(e) {
    
}

function onclickDelete(e) {
    
}