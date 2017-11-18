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

var _validator;

$(document).ready(loaded);

function loaded() 
{

    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");
    
    
}


function init()
{
    var URLPage = getURLParameter("page");
    if(URLPage == "teacher_user")
    {
        _userType = "Teacher";
    }
    else if(URLPage == "admin_user")
    {
        _userType = "Admin";
    }
        checkTypeFunction();
    
        buildTable();
        $(".main-table>thead th").not("th:last-of-type")
         .click(onClickSort)
         .mousedown(function(e){ e.preventDefault(); });
    
        $("#upload-button").click(onsubmitUploadForm);
        $("#lookup-button").click(onsubmitLookupForm);
        
    
        $("input[name='requester_id']").val(_userId);
        $("input[name='requester_type']").val(_userType);
        $("input[name='requester_session']").val(_userSessionId);
    
        //Create import button in Students tab
        //$("#create-button").after('<button type="button" class="btn btn-primary pull-left students-specific-btn" data-toggle="modal" data-target="#upload-modal" id="import-students-button">Import Students</button>');
        
        if(_userType != "Teacher")
        {
            //Create look up button in Students tab
            $("#create-button").after('<button type="button" class="btn btn-primary pull-left students-specific-btn" data-toggle="modal" data-target="#lookup-modal" id="lookup-students-button">Look up Students</button>');
        }
        else
        {
            $("#create-button").after('<button type="button" class="btn btn-primary pull-left students-specific-btn" data-toggle="modal" data-target="#upload-modal" id="import-students-button">Import Students</button>');
        }
        
        


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
            _validator.element("[name='checkboxes'");
            
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
            $(".msg-box").addClass("alert-danger");
            $(".msg-box").fadeIn();
            $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
        });

        jQuery.validator.addMethod("isName", function(value, element) {
            return this.optional(element) || /^[a-z ,.'-]+$/i.test(value);
            }, "Please enter a valid name");

        jQuery.validator.addMethod("alphaNum", function(value, element) {
            return this.optional(element) || /^[a-z0-9]+$/i.test(value);
            }, "Please enter only digits and letters");

        _validator = $("#main-form").validate({
            invalidHandler: function(form, validator) {
                var errors = validator.numberOfInvalids();
                if (errors) {
                    validator.errorList[0].element.focus();
                }
            },
            ignore: [],
            rules: {
                user_id: {
                    alphaNum: true
                },
                f_name: {
                    isName: true
                },
                l_name: {
                    isName: true
                },
                email: {
                    email: true
                },
                checkboxes: {
                    required: function (element) {
                        return $('[type="checkbox"]:checked').length == 0;
                    }
                },
                state: {
                    required: function (element) {
                        return $("#type-student-checkbox").prop("checked");
                    }
                }
            },
            messages: {
                checkboxes: "Please select a user type"
            }
        });
}

function buildTable()
{
        
        
        
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

            //build Student table
            var headersArr = ["EWU ID", "First Name", "Last Name", "Email", "State", "Action"];
            var table = buildMainTable(headersArr);
            $("#Students-panel > .table-responsive").html(table);

        }        
        else if(_userType == "Teacher")
        {
            //build Student table
            var headersArr = ["EWU ID", "First Name", "Last Name", "Email", "State", "Action"];
            var table = buildMainTable(headersArr);
            $(".table-responsive").html(table);

            getAllItems("Student");
        }        
}

function buildItemSummaryRow(item, type)
{
    var summaryData;
    if(type == "Student")
    {
        if(_userType == "Teacher")
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
                email: item.email,
                state: item.state
            };
        }

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

function loadTable(data, type) 
{
    //console.log(data);
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item, type);

      //   var detailRow = buildItemDetailRow(item);

        //console.log(detailExamRow);

        if(_userType == "Teacher")
        {
            $(".table-responsive > ." + _tableId).append(row);
        }
        else
        {
            $("#" + type + "s-panel > .table-responsive > ." + _tableId).append(row);
        }
        
        
        //$("." + _tableId).append(detailRow);
    });

    $(".tab-pane.active .main-table>thead th:nth-of-type(1)").trigger('click');
    $(".btn-group > .btn-danger").remove();
}


function submitForm (e)
{
    if(e.currentTarget.dataset["action"] == "create" && $("#main-form").valid())
    {
        createItem();
        $("#detail-modal").modal("hide");
    }
        
    if(e.currentTarget.dataset["action"] == "update" && $("#main-form").valid())
    {
        updateItem();
        $("#detail-modal").modal("hide");
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
    state: $("select[name='state']").val(),
    comment: $("input[name='comment']").val(),
    edited_by: _userId},
    function(){
        if($(".type-checkbox[value='" + _selectedTab + "']").prop("checked")){
            $.get("../account/get_account_info.php",
                {
                    requester_id: _userId,
                    requester_type: _userType,
                    requester_session_id: _userSessionId,
                    request: "get_by_id",
                    id: $("#item-id").val()
                }, function(item){
                    var row = buildItemSummaryRow(item[0], _selectedTab);
                    //console.log($("tr[data-id='#item-" + item[0].user_id + "']"));
                    $("tr[data-id='item-" + item[0].user_id + "']").replaceWith(row);
                    $(".btn-group > .btn-danger").remove();
                }, "json");
        }
        else{
            $("tr[data-id='item-" + $("#item-id").val() + "']").remove();
        }
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
    $("#modal-title").html("Create a User");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").html("Create");

    $("#type-admin-checkbox, #type-teacher-checkbox, #type-grader-checkbox, #type-student-checkbox").prop("disabled",false);
    $("input[name='user_id']").prop("disabled", false);
    $("#state-form-group").hide();
    $("#type-student-wrap").show();
    $(".type-nonstudent-wrap").show();
    $(".student-exam-history-form").hide();
    $(".student-comment-form").hide();
    $("select[name='state']").unbind("change");
    $("input[name='type']").prop('disabled', false);

    clearForm();

}

function onclickDetails(e) 
{
    clearForm();
    $("select[name='state']").on("change", function(){$(".student-comment-form").show()});
    //$("input[name='user_id']").prop("disabled", true);
    $("#type-admin-checkbox, #type-teacher-checkbox, #type-grader-checkbox, #type-student-checkbox").prop("disabled",false);
    

    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);
    $("#modal-title").html("Edit a User");
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
            if(name != "edited_by" && name != "comment")
            {
                $('[name="'+name+'"]').val(val);
            }
            else
            {
                if(val != "" && val != null && val != "System System")
                {
                    $(".student-comment-form").show();

                    if (name == "comment")
                    {
                        $('[name="'+name+'"]').val(val);
                    }
                    
                    if (name == "edited_by")
                    {
                        $('[name="'+name+'"]').html("by " + val);
                    }
                }
                else
                {
                    $(".student-comment-form").hide();
                }
            }
            
        });
    },
    "json");

    if(_selectedTab == "Student")
    {
        $("#state-form-group").show();
        $("#type-student-wrap").show();
        $("input[name='type']").prop('disabled', true);
        $(".type-nonstudent-wrap").hide();

        $(".student-exam-history-form").show();
        $(".student-comment-form").show();

        buildStudentHistory(itemId);
    }
    else
    {
        $("#type-student-wrap").hide();
        $("#state-form-group").hide();
        $(".type-nonstudent-wrap").show();
        $("input[name='type']").prop('disabled', false);

        $(".student-exam-history-form").hide();
        $(".student-comment-form").hide();
    }

    

}

function buildStudentHistory(studentId)
{
    headersArr = ["Name", "Date", "Start Time", "Overall Grade", "Result", "Action"];
    var table = buildMainTable(headersArr);
    
    $("#exams-student-table-wrapper").html(table);

    $.get("../ape/get_all_apes.php", 
    {requester_id: studentId,
    requester_type: "Student",
    request: "get_all"}, 
    loadStudentTable,
    "json");
}

function onclickDelete(e) 
{

}


function clearForm()
{
    $("input[type=text]").val("");
    $("input[type=checkbox]").prop("checked", false);
    _validator.resetForm(); 
}

function getAllItems(type)
{
    if(_userType == "Teacher")
    {
        $(".panel .table-responsive > ."+_tableId + " tbody").empty();
    }
    else
    {
        $("#" + type + "s-panel > .table-responsive > ."+_tableId + " tbody").empty();
    }
    
    
    $.get("../account/get_account_info.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_type",
        type: type}, 
        function(data,asd, xhr){
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


function onsubmitUploadForm(e)
{


    e.preventDefault();
    var uploadForm = document.getElementById('upload-form');
    var formData = new FormData(uploadForm);
    //console.log(formData);

    $.ajax({
        url: '../account/upload_student_csv.php',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
            getAllItems("Student");
            alert(returndata);
        }
      });
}

function onsubmitLookupForm(e)
{
    search($("#lookup-string").val());
    e.preventDefault();
}