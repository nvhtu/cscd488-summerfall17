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

    _selectedTab = "";

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    
    
    checkTypeFunction();

    buildTable();

    $(".btn-group > .btn-danger").remove();
    $("#state-form-group").hide();



    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);

    $("a[href='#Admins-panel']").click(function(){getAllItems("Admin"); _selectedTab = "Admin";});
    $("a[href='#Teachers-panel']").click(function(){getAllItems("Teacher"); _selectedTab = "Teacher";});
    $("a[href='#Graders-panel']").click(function(){getAllItems("Grader"); _selectedTab = "Grader";});
    $("a[href='#Students-panel']").click(function(){getAllItems("Student"); _selectedTab = "Student";});

    $("#btn-search").click(function(){search($("input[name='search']").val())});

    //show/hide student state select when check/uncheck student type

    $(".type-checkbox").click(function(){
        $("#type-admin-checkbox, #type-teacher-checkbox, #type-grader-checkbox, #type-student-checkbox").prop("disabled", false);
        
        if($("#type-student-checkbox").prop("checked"))
        {
            $("#state-form-group").fadeIn(100);
            $("#type-admin-checkbox, #type-teacher-checkbox, #type-grader-checkbox").prop("disabled", true);

        } 
            
        else
        {
            if($("#type-admin-checkbox").prop("checked") || $("#type-teacher-checkbox").prop("checked") || $("#type-grader-checkbox").prop("checked"))
            {
                $("#type-student-checkbox").prop("disabled", true);
            }
            else
            {
                $("#type-admin-checkbox, #type-teacher-checkbox, #type-grader-checkbox").prop("disabled", false);
            }
            
            $("#state-form-group").fadeOut(100);
        }

    });
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

    $(".btn-group > .btn-danger").remove();
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

    var type = buildTypeString();

    $.post("../account/create_account.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        id: $("#ewu-id").val(),
        f_name: $("input[name='f_name']").val(),
        l_name: $("input[name='l_name']").val(),
        email: $("input[name='email']").val(),
        type: type,
        state: $("select[name='state']").val()}, 
        function(lastInsertId){
            $.get("../account/get_account_info.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            request: "get_by_id",
            id: lastInsertId},
            function(item){
                //console.log(item);
                $.each(type, function(i, theType){
                    loadTable(item, theType);
                });
                
            },
        "json");
    });
}

function updateItem()
{
    //console.log($("#" + _formId).serialize());

    //build "type" string
    var type = buildTypeString();
    

    //console.log(type);

    var request = "";

    if(_selectedTab == "Student")
    {
        request = "update_state_info";
    }
    else
    {
        request = "update_type_info";
    }

    $.post("../account/update_account.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: request,
    id: $("input[name='user_id']").val(),
    f_name: $("input[name='f_name']").val(),
    l_name: $("input[name='l_name']").val(),
    email: $("input[name='email']").val(),
    type: type,
    state: $("select[name='state']").val()},
    function(){
        $.get("../account/get_account_info.php",
            {
                requester_id: _userId,
                requester_type: _userType,
                requester_session_id: _userSessionId,
                request: "get_by_id",
                id: $("#item-id").val()
            }, function(item){
                var row = buildItemSummaryRow(item[0], _selectedTab);
                $("tr[data-target='#item-" + item[0].user_id + "']").replaceWith(row);
                $(".btn-group > .btn-danger").remove();
            }, "json");
    });

    
}

function buildTypeString()
{

    type = Array();

    if($("#type-admin-checkbox").prop("checked"))
        type.push("Admin");
    if($("#type-teacher-checkbox").prop("checked"))
        type.push("Teacher");
    if($("#type-grader-checkbox").prop("checked"))
        type.push("Grader");
    if($("#type-student-checkbox").prop("checked"))
        type.push("Student");

    return type;
}

function onclickCreate()
{
    
    //getAllLoc();
    $(".modal-title").html("Create a User");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").html("Create");

    $("#type-admin-checkbox, #type-teacher-checkbox, #type-grader-checkbox, #type-student-checkbox").prop("disabled",false);
    $("input[name='user_id']").prop("disabled", false);
    $("#state-form-group").hide();
    $("#type-student-wrap").show();
    $(".type-nonstudent-wrap").show();
    $("input[name='type']").prop('disabled', false);

    clearForm();

}

function onclickEdit(e) 
{
    clearForm();
    $("input[name='user_id']").prop("disabled", true);
    $("#type-admin-checkbox, #type-teacher-checkbox, #type-grader-checkbox, #type-student-checkbox").prop("disabled",false);
    

    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit a User");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");

    if(_selectedTab == "Student")
    {
        $("#state-form-group").show();
        $("#type-student-wrap").show();
        $("input[name='type']").prop('disabled', true);
        $(".type-nonstudent-wrap").hide();
    }
    else
    {
        $("#type-student-wrap").hide();
        $("#state-form-group").hide();
        $(".type-nonstudent-wrap").show();
        $("input[name='type']").prop('disabled', false);
    }

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

}


function clearForm()
{
    $("input[type=text]").val("");
    $("input[type=checkbox]").prop("checked", false); 
}

function getAllItems(type)
{
    $("#" + type + "s-panel > .table-responsive > ."+_tableId + " tbody").empty();
    
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
            case "Teacher": $("#type-admin-wrap").remove();
                            $("#type-grader-wrap").remove();
                            $("#type-teacher-wrap").remove();
                            $("#type-student-wrap").prop('checked', true);
                            break;
            case "Grader": $("#create-button").remove();
                            break;
            
            case "Student": 
        }
}

function search(searchStr)
{
    if(searchStr != "")
    {
        $("#Students-panel > .table-responsive > ."+_tableId + " tbody").empty();
        $.get("../account/student_search.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        search_str: searchStr}, 
        function(data){
            
            loadTable(data, "Student");
        },
        "json");
    }

}