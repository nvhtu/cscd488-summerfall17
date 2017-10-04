/**
 * Exam page script
 * @author: Tu Nguyen
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";

var _targetModal = "detail-modal";
var _tableId = "main-table";
var _formId = "main-form";

var _locData = Array();

var _selectedTab = "";

$(document).ready(loaded);

function loaded() 
{

    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");
    
    
}

function loadUserInfo(data)
{
    _userId = data.userId;
    _userType = data.userType;
    _userSessionId = data.userSession;

    init();
}

function init()
{
        checkTypeFunction();
    
        buildTable();
        $(".main-table>thead th").not("th:last-of-type")
         .click(onClickSort)
         .mousedown(function(e){ e.preventDefault(); });
    
        buildUploadModal();
        buildLookUpModal();
    
        $("input[name='requester_id']").val(_userId);
        $("input[name='requester_type']").val(_userType);
        $("input[name='requester_session']").val(_userSessionId);
    
        //Create import button in Students tab
        $("#create-button").after('<button type="button" class="btn btn-primary pull-left students-specific-btn" data-toggle="modal" data-target="#upload-modal" id="import-students-button">Import Students</button>');
        //Create look up button in Students tab
        $("#import-students-button").after('<button type="button" class="btn btn-primary pull-left students-specific-btn" data-toggle="modal" data-target="#lookup-modal" id="lookup-students-button">Look up Students</button>');
        


        if(_userType == "Admin")
            $(".students-specific-btn").hide();
        else if(_userType == "Teacher")
                _selectedTab = "Student"; 
    
        $(".btn-group > .btn-danger").remove();
        $("#state-form-group").hide();
    
    
    
        $("#create-button").click(onclickCreate);
        $("#submit-button").click(submitForm);
    
        $("a[href='#Admins-panel']").click(function(){getAllItems("Admin"); _selectedTab = "Admin"; $(".students-specific-btn").hide();});
        $("a[href='#Teachers-panel']").click(function(){getAllItems("Teacher"); _selectedTab = "Teacher"; $(".students-specific-btn").hide();});
        $("a[href='#Graders-panel']").click(function(){getAllItems("Grader"); _selectedTab = "Grader"; $(".students-specific-btn").hide();});
        $("a[href='#Students-panel']").click(function(){_selectedTab = "Student"; $(".students-specific-btn").show()});
    
        //$("#btn-search").click(function(){search($("#search").val())});
    
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
    
        $(".msg-box").hide();
    
        $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
            console.log(jqxhr.responseText);
            $(".msg-box").addClass("alert-danger");
            $(".msg-box").fadeIn();
            $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
        });
}

function buildTable()
{
        //build Student table
        var headersArr = ["EWU ID", "First Name", "Last Name", "Email", "State", "Action"];
        var table = buildMainTable(headersArr);
        $("#Students-panel > .table-responsive").html(table);
        
        
        if (_userType == "Admin")
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
        }                 
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
    

    var row = buildItemRow(summaryData, true);

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

    $(".tab-pane.active .main-table>thead th:nth-of-type(1)").trigger('click');
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
                console.log(xhr.status);
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
        function(data,asd, xhr){
            console.log("asfdsf");
            console.log(xhr);
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
                            /*$(".nav-tabs > li > a[href='#Admins-panel']").parent().remove();
                            $("#Admins-panel").remove();
                            $(".nav-tabs > li > a[href='#Teachers-panel']").parent().remove();
                            $("#Teachers-panel").remove();
                            $(".nav-tabs > li > a[href='#Graders-panel']").parent().remove();
                            $("#Graders-panel").remove();*/
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

function buildUploadModal()
{
    var modalHTML = '<div class="modal fade" id="upload-modal" tabindex="-1" role="dialog" aria-hidden="true">' +
    '<div class="modal-dialog">' +
       '<div class="modal-content">' +
          '<div class="modal-header">' +
             '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
             '<h4 class="modal-title">Import Students</h4>' +
          '</div>' +

          '<form id="upload-form" name="upload-form">' +
          '<div class="modal-body form-horizontal">' +
                
                                         '<!--' +
                                         'Hidden input fields for requester id, requester type, requester session, and item id that auto populated ' +
                                         'so $("#main-form").serialize() will include those values' +
                                         '!-->' +
                                         '<input type="hidden" class="form-control" id="requester-id" name="requester_id"/>' +
                                         '<input type="hidden" class="form-control" id="requester-type" name="requester_type"/>' +
                                         '<input type="hidden" class="form-control" id="requester-session" name="requester_session"/>' +
                    '<div class="form-group">' +
                        '<label for="user_id" class="col-sm-12">Select a CSV to upload. The CSV file must contains a header row.</label>' +
                        '<div class="col-sm-12">' +
                            '<label class="btn btn-default" for="fileToUpload">' +
                                '<input type="file" name="fileToUpload" id="fileToUpload" hidden>' +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                
          '</div>' +
          '<div class="modal-footer">' +
             '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
             '<input type="submit" id="upload-button" class="btn btn-primary" value="Import CSV">' +
          '</div>' +
          '</form>    ' +
       '</div>' +
    '</div>' +
 '</div>';

 $("#detail-modal").after(modalHTML);
 $("#upload-button").click(onsubmitUploadForm);
}

function buildLookUpModal()
{
    var modalHTML = '<div class="modal fade" id="lookup-modal" tabindex="-1" role="dialog" aria-hidden="true">' +
    '<div class="modal-dialog">' +
       '<div class="modal-content">' +
          '<div class="modal-header">' +
             '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
             '<h4 class="modal-title">Look up Students</h4>' +
          '</div>' +

          '<form id="lookup-form" name="lookup-form">' +
          '<div class="modal-body form-horizontal">' +
                
                                         '<!--' +
                                         'Hidden input fields for requester id, requester type, requester session, and item id that auto populated ' +
                                         'so $("#main-form").serialize() will include those values' +
                                         '!-->' +
                                         '<input type="hidden" class="form-control" id="requester-id" name="requester_id"/>' +
                                         '<input type="hidden" class="form-control" id="requester-type" name="requester_type"/>' +
                                         '<input type="hidden" class="form-control" id="requester-session" name="requester_session"/>' +
                    '<div class="form-group">' +
                        '<label for="user_id" class="col-sm-12">Look up a student by student ID, first name, last name, or email:</label>' +
                        '<div class="col-sm-12">' +
                    
                                '<input type="text" name="lookup-string" id="lookup-string">' +
                            
                        '</div>' +
                    '</div>' +
                
          '</div>' +
          '<div class="modal-footer">' +
             '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
             '<button type="button" data-dismiss="modal" id="lookup-button" class="btn btn-primary">Look up</button>' +
          '</div>' +
          '</form>    ' +
       '</div>' +
    '</div>' +
 '</div>';

 $("#detail-modal").after(modalHTML);
 $("#lookup-button").click(onsubmitLookupForm);
}

function onsubmitUploadForm(e)
{


    e.preventDefault();
    var uploadForm = document.getElementById('upload-form');
    var formData = new FormData(uploadForm);
    console.log(formData);

    $.ajax({
        url: '../account/upload_student_csv.php',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
          alert(returndata);
        }
      });
}

function onsubmitLookupForm(e)
{
    search($("#lookup-string").val());
    e.preventDefault();
}