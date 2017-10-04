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

$(document).ready(loaded);

function loaded() 
{
    $.get("../util/get_cur_user_info.php", {is_client: true}, loadUserInfo, "json");

    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
        console.log(jqxhr.responseText);
        $(".msg-box").addClass("alert-danger");
        $(".msg-box").fadeIn();
        $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
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
    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    $(".msg-box").hide();

    getAllItems();

    buildTable();
    $(".main-table>thead th").not("th:last-of-type")
     .click(onClickSort)
     .mousedown(function(e){ e.preventDefault(); });

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
        $(row).find(".btn-info").remove();

        $("." + _tableId).append(row);
    });
    $(".main-table>thead th:nth-of-type(1)").trigger('click');
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
            $(row).find(".btn-info").remove();

            $("tr[data-target='#item-" + item[0].cat_id + "']").replaceWith(row);
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
}

function onclickEdit(e) 
{
    clearForm();
    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit a Category");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");

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
    $("."+_tableId + " .item-row").empty();
    
    $.get("../category/get_all_categories.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        loadTable,
        "json");
}
