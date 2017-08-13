$(document).ready(loaded);

function loaded() {

    //Automatic GLOBAL variables
    _userId = "111";
    _userType = "Admin";
    _userSessionId = "0";

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    getAllAPE();
    getAllLoc();

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
}




function getAllLoc()
{
    $.get("../location/get_all_locations.php",{
                                requester_id: _userId,
                                requester_type: _userType,
                                requester_session_id: _userSessionId
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



function submitForm (e)
{
    if(e.currentTarget.dataset["operation"] == "create")
    {
        console.log($("#exam-form").serialize());
        $.post("../ape/create_ape.php", $("#exam-form").serialize(), function(lastInsertId){
            $.get("../ape/get_all_apes.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: lastInsertId}, 
            function(item){

                console.log(item);
                loadTable(item);
            },
            "json");
        });

    }
        
    if(e.currentTarget.dataset["operation"] == "update")
    {
        console.log($("#exam-form").serialize());
        $.post("../ape/update_ape.php", $("#exam-form").serialize(), function(){
            var item = $("#exam-form").serialize();
            $.get("../ape/get_all_apes.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: $("#exam-id").val()}, 
            function(item){
                var row = buildRow(item[0]);
                var detailRow = buildDetailRow(item[0]);
                console.log(item);

                var dataTarget = "#" + item[0].exam_id;
                $("[name = 'item-row'][id = " + item[0].exam_id + "]").replaceWith(row);
                $("[name = 'row-detail'][id = " + item[0].exam_id + "]").replaceWith(detailRow);
            },
            "json");
        }); 
    }
        
}

function loadTable(data) {
    console.log(data);
    $.each(data, function(i, item) {
        var row = buildRow(item);
        appendRow(row);
        var detailRow = buildDetailRow(item);
        appendRow(detailRow);
    });
}


function buildRow(item) {
   //create info button
   var $bttnInfo = $('<button type="button" class="btn btn-info" data-target="#item-' + item.exam_id + '" data-toggle="collapse"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><span class="sr-only">Info</span></button>');
    
   //create edit button
   var $bttnEdit = $('<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#addExamModal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
   $bttnEdit.attr("data-id", item.exam_id); //add unique ID from item as a data tag
   $bttnEdit.click(onclickEdit);

   //create delete button
   var $bttnDel = $('<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#addExamModal"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
   $bttnDel.attr("data-id", item.exam_id);
   $bttnDel.click(onclickDelete);



   //wrap each piece of data in <td> tags, then wrap them all in a <tr> tag and return row
   return $('<tr name="item-row"  aria-expanded="true">')
      .append(
         $("<td>").text(item.name),
         $("<td>").text(item.date),
         $("<td>").text(item.start_time),
         $("<td>").text(item.location),
         $("<td>").append(
            $('<div class="btn-group" role="group">').append(
               $bttnInfo, $bttnEdit, $bttnDel)
         )
      );
}

function buildDetailRow(item) {
   return $('<tr class="collapse" id="#item-' + item.exam_id + '" name="row-detail">').append(
      $('<td colspan="6" class="well">').append(
         $('<div class="panel panel-default">').append(
            $('<table class="table table-condensed">').append(
               $('<thead>').append(
                  $('<tr>').append(
                     $('<th>').text("Passing Grade"),
                     $('<th>').text("Duration"),
                     $('<th>').text("State"),
                     $('<th>').text("Cutoff")
                  )
               ),
               $('<tbody>').append(
                  $('<tr>').append(
                     $('<td>').text(item.passing_grade + "%"),
                     $('<td>').text(item.duration + " hours"),
                     $('<td>').text(item.state),
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

function onclickCreate()
{
    clearForm();
    //getAllLoc();
    $(".modal-title").html("Create an Exam");
    $("#submit-button").attr("data-operation", "create");
    $("#submit-button").html("Create");


}

   
function onclickEdit(e) 
{
    clearForm();
    var exam_id = e.currentTarget.dataset["id"];
    $("#exam-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit an Exam");
    $("#submit-button").attr("data-operation", "update");
    $("#submit-button").html("Save changes");

    $.get("../ape/get_all_apes.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    exam_id: exam_id}, 
    function(item){
        $.each(item[0], function(name, val){
            var el = $('[name="'+name+'"]');
            el.val(val);
        });
    },
    "json");

}

function onclickDelete(e) {
    
}

function clearForm()
{
    $("#exam-form").find("input[type=text], textarea").val(""); 
}

function getAllAPE()
{
    $("#exam-table .item-row").empty();
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        loadTable,
        "json");
}

function getAnAPE (exam_id)
{

}