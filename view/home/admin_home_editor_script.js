var _userId = "";
var _userType = "";
var _userSessionId = "";

var _contentChanged = false;

$(document).ready(loaded);

function loaded()
{
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");
}


function init()
{
    getHomepageContent();

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);
    
    $("#submit-button").click(submitForm);
    
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
            console.log(jqxhr.responseText);
            $(".msg-box").addClass("alert-danger");
            $(".msg-box").fadeIn();
            $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

}

function getHomepageContent()
{
    $.get("../homepage/get_all_sections.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_all"}, 
    loadHomepageContent,
    "json");
}

function loadHomepageContent(data)
{
    $sectionNum = data.length;
    $(data).each(function(i, section){
        var temp = i+1;
        $("#panel-title-" + temp + " a").text(section.title);
        $("#panel-body-content-" + temp).html(section.html_content);
        addEditBtns(temp);
    });
}

function addEditBtns(id)
{
    var $editTitleBtn = $('<button type="button" class="btn btn-warning edit-title-btn" data-toggle="modal" data-target="#edit-modal" data-edit="title" data-id="' + id + '"><i class="glyphicon glyphicon-pencil"></i></button>');
    var $editBodyBtn = $('<button type="button" class="btn btn-warning edit-body-btn" data-toggle="modal" data-target="#edit-modal" data-edit="body" data-id="' + id + '"><i class="glyphicon glyphicon-pencil"></i></button>');
    $editTitleBtn.click(onclickEdit);
    $editBodyBtn.click(onclickEdit);
    $("#panel-title-" + id + " a").after($editTitleBtn);
    $("#panel-body-content-" + id).after($editBodyBtn);
}

function onclickEdit(e)
{
    $("#main-form .form-group").html("");
    $("#item-id").val(e.currentTarget.dataset["id"]);
    _contentChanged = false;

    if(e.currentTarget.dataset["edit"] == "title")
    {
        onclickEditTitle(e);
    }
    else
    {
        onclickEditBody(e);
    }
}

function onclickEditTitle(e)
{
    var id = e.currentTarget.dataset["id"];
    $(".modal-title").text("Edit Section Title");
    
    $("#submit-button").attr("data-edit", "title");
    
    $.get("../homepage/get_all_sections.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_by_id",
    content_id: id}, 
    loadEditTitleModal,
    "json");
}

function loadEditTitleModal(data)
{
    var $titleInputBox = $('<input type="text" class="form-control" name="title"/>');
    $titleInputBox.val(data[0]["title"]);
    $("#main-form .form-group").append($titleInputBox);
}

function onclickEditBody(e)
{
    var id = e.currentTarget.dataset["id"];
    $(".modal-title").text("Edit Section Content");
    
    $("#submit-button").attr("data-edit", "body");
    
    $.get("../homepage/get_all_sections.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_by_id",
    content_id: id}, 
    loadEditBodyModal,
    "json");
}

function loadEditBodyModal(data)
{
    var $summernoteEditor = $('<div id="summernote"></div>');
    $("#main-form .form-group").append($summernoteEditor);

    $('#summernote').summernote({
        height: 300,
        focus: true, 
        dialogsInBody: true,
        toolbar: [
          // [groupName, [list of button]]
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['strikethrough', 'superscript', 'subscript', 'hr']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['link']],
          ['view', ['codeview']]
        ],
        callbacks: {
            onChange: function(contents, $editable) {
              _contentChanged = true; 
            }
          }
      });

    //Override float right of btn-group set in custom.css
    $(".note-toolbar .btn-group").css("float","none");

    $('#summernote').summernote('code', data[0]["html_content"]);

}

function submitForm(e)
{
    if(e.currentTarget.dataset["edit"] == "title")
    {
        updateTitle();
    }
    else
    {
        updateBody();
    }

    
}

function updateTitle()
{
    $.post("../homepage/update_section.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "update_title",
    content_id: $("#item-id").val(),
    content: $("input[name=title]").val()},
    function(){
        $("#panel-title-" + $("#item-id").val() + " a").text($("input[name=title]").val());
    });
}

function updateBody()
{

    var content = $('#summernote').summernote('code');

    $.post("../homepage/update_section.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "update_body",
    content_id: $("#item-id").val(),
    content: content},
    function(){
        var id = $("#item-id").val();
        $("#panel-body-content-" + id).html(content);
    });
}

