/**
 * Category page script
 * @author: Andrew Robinson
 * @version: 1.0
 */

var _userId = "";
var _userType = "";
var _userSessionId = "";

var _targetModal = "detail-modal";
var _tableId = "main-table";
var _formId = "main-form";

var _origClickEvent;
var _validator;

$(document).ready(loaded);

function loaded() 
{
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
    $('#discard-button').click(onclickDiscard);
    $('#edit-button').click(function(){toggleSubmitEdit(false);});
}



function init()
{
    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);
    $(".msg-box").hide();
    jQuery.validator.setDefaults({
        errorElement: 'span',
        errorClass: 'error help-block',
        errorPlacement: function(error, element) {
              if (element.parent().hasClass('input-group')) {
                    error.insertAfter(element.parent());
              } else {
                    error.insertAfter(element);
              }
        },
        highlight: function(element, errorClass) {
              $(element).removeClass('help-block');
              $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element, errorClass) {
              //console.log($(element).closest('.form-group'));
              $(element).closest('.form-group').removeClass('has-error');
        }
    });

    _validator = $("#main-form").validate({
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                validator.errorList[0].element.focus();
            }
        },
        rules: {
            name: {
                maxlength: 20
            }
        }
    });

    getAllItems();

    buildTable();
    $(".main-table>thead th").not("th:last-of-type")
     .click(onClickSort)
     .mousedown(function(e){ e.preventDefault(); });

    $("form, input").attr("autocomplete", "off");
}

function buildTable()
{
    var headersArr = ["Name", "Action"];
    var table = buildMainTable(headersArr);
    $(".table-responsive").html(table);
}

function buildItemSummaryRow(item)
{
    var summaryData = {
        id: item.cat_id,
        name: item.name,
    };

    var row = buildItemRow(summaryData, true);

    return row;
}

function loadTable(data) 
{
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item);
        //$(row).find(".btn-info").remove();

        $("." + _tableId).append(row);
    });
    $(".main-table>thead th:nth-of-type(1)").trigger('click');
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
    $.post("../category/create_category.php", $("#" + _formId).serialize(), function(lastInsertId){
        $.get("../category/get_all_categories.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        cat_id: lastInsertId}, 
        function(item){
            loadTable(item);
        },
        "json");
    });
}

function updateItem()
{    
    $.post("../category/update_category.php", $("#" + _formId).serialize(), function(){
        var item = $("#" + _formId).serialize();
        $.get("../category/get_all_categories.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        cat_id: $("#item-id").val()}, 
        function(item){
            var row = buildItemSummaryRow(item[0]);
            //$(row).find(".btn-info").remove();

            $("tr[data-id='item-" + item[0].cat_id + "']").replaceWith(row);
        },
        "json");
    }); 
}

function onclickCreate()
{
    clearForm();
    $(".modal-title").html("Create a Category");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").html("Create");
    toggleSubmitEdit(false, true);
}

function onclickDetails(e) 
{
    if (e !== undefined) {
        _origClickEvent = e;
    }

    clearForm();
    var itemId = _origClickEvent.currentTarget.dataset["id"];
    $("#item-id").val(_origClickEvent.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit a Category");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");
    toggleSubmitEdit(true);

    $.get("../category/get_all_categories.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    cat_id: itemId}, 
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
    if(window.confirm("Click 'OK' to confirm deletion of this category:"))
    {
        var itemId = e.currentTarget.dataset["id"];
        $.post("../category/remove_category.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        cat_id: itemId},
        function(){
            $("tr[data-id='item-" + itemId + "']").remove();
        });
    }
}

function clearForm()
{
    $("#" + _formId).find("input[type=text], textarea").val(""); 
    _validator.resetForm();
}

function getAllItems()
{
    $("."+_tableId + " .item-row").empty();
    
    $.get("../category/get_all_categories.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        loadTable,
        "json");
}