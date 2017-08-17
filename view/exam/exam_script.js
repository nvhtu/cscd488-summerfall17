/**
 * Exam page script
 * @author: Tu Nguyen
 * @version: 1.0
 */

$(document).ready(loaded);

function loaded() 
{

    //Automatic GLOBAL variables
    _userId = "222";
    _userType = "Teacher";
    _userSessionId = "0";
    
    _targetModal = "detail-modal";
    _tableId = "main-table";
    _formId = "main-form";

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    getAllItems();
    getAllLoc();

    buildTable();

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
}

function buildTable()
{
    var headersArr = ["Name", "Date", "Start Time", "Location", "Action"];
    var table = buildMainTable(headersArr);
    $(".table-responsive").html(table);
}

function buildItemSummaryRow(item)
{
    var summaryData = {
        id: item.exam_id,
        name: item.name,
        date: item.date,
        start_time: item.start_time,
        location: item.location
    };

    var row = buildItemRow(summaryData);

    return row;
}

function buildItemDetailRow(item)
{
    var detailData = {
        id: item.exam_id,
        duration: item.duration,
        passing_grade: item.passing_grade,
        cutoff: item.cutoff
    };

    var namesArr = ["Duration", "Passing Grade", "Cutoff"];
    var detailRow = buildDetailRow(detailData, namesArr);

    return detailRow;
}

function loadTable(data) 
{
    //console.log(data);
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item);

        var detailRow = buildItemDetailRow(item);

        //console.log(detailExamRow);

        $("#" + _tableId).append(row);
        $("#" + _tableId).append(detailRow);
    });
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
    if(e.currentTarget.dataset["action"] == "create")
    {
        createItem();
    }
        
    if(e.currentTarget.dataset["action"] == "update")
    {
        updateItem();
    }
        
}

function createItem()
{
    //console.log($("#" + _formId).serialize());
    $.post("../ape/create_ape.php", $("#" + _formId).serialize(), function(lastInsertId){
        $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: lastInsertId}, 
        function(item){

            //console.log(item);
            loadTable(item);
        },
        "json");
    });
}

function updateItem()
{
    //console.log($("#" + _formId).serialize());
    $.post("../ape/update_ape.php", $("#" + _formId).serialize(), function(){
        var item = $("#" + _formId).serialize();
        $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: $("#item-id").val()}, 
        function(item){
            var row = buildItemSummaryRow(item[0]);
            var detailRow = buildItemDetailRow(item[0]);

            //console.log(row);
            //console.log(detailRow);
            $("tr[data-target='#item-" + item[0].exam_id + "']").replaceWith(row);
            $("tr[data-id='item-" + item[0].exam_id + "']").replaceWith(detailRow);
        },
        "json");
    }); 
}

function onclickCreate()
{
    clearForm();
    //getAllLoc();
    $(".modal-title").html("Create an Exam");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").html("Create");
}

function onclickEdit(e) 
{
    clearForm();
    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit an Exam");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");

    $.get("../ape/get_all_apes.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    exam_id: itemId}, 
    function(item){
        $.each(item[0], function(name, val){
            var el = $('[name="'+name+'"]');
            el.val(val);
        });
    },
    "json");

}

function onclickDelete(e) 
{
    if(window.confirm("Are you sure you want to delete this exam?"))
    {
        var itemId = e.currentTarget.dataset["id"];
        
        $.post("../ape/remove_ape.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        exam_id: itemId},
        function(){
            $("tr[data-target='#item-" + itemId + "']").remove();
            $("tr[id='item-" + itemId + "']").remove();
        });
    }
}

function clearForm()
{
    $("#" + _formId).find("input[type=text], textarea").val(""); 
}

function getAllItems()
{
    $("#"+_tableId + " .item-row").empty();
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        loadTable,
        "json");
}
