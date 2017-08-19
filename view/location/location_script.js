
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

    getAllItems();

    buildTable();

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
}

function buildTable()
{
    var headersArr = ["Name", "Seats", "Action"];
    var table = buildMainTable(headersArr);
    $(".table-responsive").html(table);
}

function buildItemSummaryRow(item)
{
    var summaryData = {
        id: item.loc_id,
        name: item.name,
        seats: item.seats
    };

    var row = buildItemRow(summaryData);

    return row;
}

function loadTable(data) 
{
    $.each(data, function(i, item) {
        var row = buildItemSummaryRow(item);
        $(row).find(".btn-info").remove();

        $("." + _tableId).append(row);
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
    $.post("../location/create_location.php", $("#" + _formId).serialize(), function(lastInsertId){
        $.get("../location/get_all_locations.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        loc_id: lastInsertId}, 
        function(item){
            loadTable(item);
        },
        "json");
    });
}

function updateItem()
{    
    $.post("../location/update_location.php", $("#" + _formId).serialize(), function(){
        var item = $("#" + _formId).serialize();
        $.get("../location/get_all_locations.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        loc_id: $("#item-id").val()}, 
        function(item){
            var row = buildItemSummaryRow(item[0]);
            $(row).find(".btn-info").remove();

            $("tr[data-target='#item-" + item[0].loc_id + "']").replaceWith(row);
        },
        "json");
    }); 
}

function onclickCreate()
{
    clearForm();

    $(".modal-title").html("Create a Location");
    $("#submit-button").attr("data-action", "create");
    $("#submit-button").html("Create");
}

function onclickEdit(e) 
{
    clearForm();
    var itemId = e.currentTarget.dataset["id"];
    $("#item-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit a Location");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");

    $.get("../location/get_all_locations.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    loc_id: itemId}, 
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
    if(window.confirm("Are you sure you want to delete this location?"))
    {
        var itemId = e.currentTarget.dataset["id"];
        $.post("../location/remove_location.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        loc_id: itemId},
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
    
    $.get("../location/get_all_locations.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        loadTable,
        "json");
}
