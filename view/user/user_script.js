/**
 * Exam page script
 * @author: Tu Nguyen
 * @version: 1.0
 */

$(document).ready(loaded);

function loaded() 
{

    //Automatic GLOBAL variables
    _userId = "111";
    _userType = "Admin";
    _userSessionId = "0";
    
    _targetModal = "detail-modal";
    _tableId = "main-table";
    _formId = "main-form";

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);
    
    checkTypeFunction();

    buildTable();

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);

    $("a[href='#Admins-panel']").click(function(){getAllItems("Admin")});
    $("a[href='#Teachers-panel']").click(function(){getAllItems("Teacher")});
    $("a[href='#Graders-panel']").click(function(){getAllItems("Grader")});
    $("a[href='#Students-panel']").click(function(){getAllItems("Student")});
}

function buildTable()
{
    //build Admins table
    var headersArr = ["EWU ID", "First Name", "Last Name", "Email", "Action"];
    var table = buildMainTable(headersArr);
    $("#Admins-panel > .table-responsive").html(table);
    getAllItems("Admin");

    //build Teachers table
    $("#Teachers-panel > .table-responsive").html(table);
    getAllItems("Teacher");

    //build Graders table
    $("#Graders-panel > .table-responsive").html(table);
    getAllItems("Grader");

    //build Student table
    var headersArr = ["EWU ID", "First Name", "Last Name", "Email", "State", "Action"];
    var table = buildMainTable(headersArr);
    $("#Students-panel > .table-responsive").html(table);
    getAllItems("Student");
}

function buildItemSummaryRow(item, type)
{
    var summaryData;
    if(type == "Student")
    {
        summaryData = {
            id: item.user_id,
            ewu_id: item.user_id,
            f_name: item.f_name,
            l_name: item.l_name,
            email: item.email,
            state: item.state
        };
    }
    else
    {
        summaryData = {
            id: item.user_id,
            ewu_id: item.user_id,
            f_name: item.f_name,
            l_name: item.l_name,
            email: item.email
        };
    }
    

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

function loadTable(data, type) 
{
    //console.log(data);
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item, type);

        var detailRow = buildItemDetailRow(item);

        //console.log(detailExamRow);

        $("#" + type + "s-panel > .table-responsive > ." + _tableId).append(row);
        
        //$("." + _tableId).append(detailRow);
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

    //build "type" string
    var type = new Array();
    if($("#type-admin-checkbox").prop("checked"))
        type.push("Admin");
    if($("#type-teacher-checkbox").prop("checked"))
        type.push("Teacher");
    if($("#type-grader-checkbox").prop("checked"))
        type.push("Grader");
    if($("#type-student-checkbox").prop("checked"))
        type.push("Student");

    //console.log(type);

    

    $.post("../account/update_account.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "update_type_info",
    id: $("input[name='user_id']").val(),
    f_name: $("input[name='f_name']").val(),
    l_name: $("input[name='l_name']").val(),
    email: $("input[name='email']").val(),
    type: type});
    
}

function onclickCreate()
{
    clearForm();
    //getAllLoc();
    $(".modal-title").html("Create a User");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").html("Create");


}

function onclickEdit(e) 
{
    clearForm();
    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit a User");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");

    $.get("../account/get_account_info.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_by_id",
    id: itemId}, 
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
    if(window.confirm("Are you sure you want to delete this user?"))
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

function getAllItems(type)
{
    $("#" + type + "s-panel > .table-responsive > ."+_tableId + " .item-row").empty();
    
    $.get("../account/get_account_info.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_type",
        type: type}, 
        function(data){
            loadTable(data, type);
        },
        "json");
}

//disable and hide controls based on user type
function checkTypeFunction()
{
        
        switch(_userType)
        {
            case "Teacher": $("#type-admin").remove();
                            $("#type-grader").remove();
                            $("#type-teacher").remove();
                            $("#type-student-checkbox").prop('checked', true);
                            break;
            case "Grader": $("#create-button").remove();
                            break;
        }
}