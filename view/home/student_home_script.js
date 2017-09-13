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
    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    $(".msg-box").hide();
    
    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
            console.log(jqxhr.responseText);
            $(".msg-box").addClass("alert-danger");
            $(".msg-box").fadeIn();
            $("#msg-box-text").html("<strong>Error!</strong> " + jqxhr.responseText);
    });

    getAllLoc()

    buildTable();

    
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
    _locData = data;
    $.each(data, function(i){
        $("#ape-loc").append($("<option></option")
                    .attr("value", data[i]["loc_id"])
                    .text(data[i]["name"]));
    });

    getUpcomingExam();
}

function buildTable()
{
    var headersArr = ["Name", "Date", "Start Time", "Duration", "Location", "Available Seats", "Action"];
    var table = buildMainTable(headersArr);
    console.log($(".table-responsive"));
    $(".table-reponsive").html(table);
}

function getUpcomingExam()
{
    $(".table-responsive > ."+_tableId + " tbody").empty();
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_state",
        state: "Open"}, 
        loadTable,
        "json");
}

function loadTable(data) 
{
    //console.log(data);
    $.each(data, function(i, item) {

        //console.log(item.state);

        var row = buildItemSummaryRow(item);

        //var detailRow = buildItemDetailRow(item);

        $("." + _tableId).append(row);
        //$("#" + item.state + "-panel > .table-responsive > ." + _tableId).append(detailRow);
    });
}

function buildItemSummaryRow(item)
{
    var locName = "";

    $.each(_locData, function(i,locItem){
        if(item.location == locItem.loc_id)
        {
            locName = locItem.name;
        }
    });

    var summaryData = {
        id: item.exam_id,
        name: item.name,
        date: item.date,
        start_time: item.start_time,
        duration: item.duration + " hours",
        location: locName,
        available: item.remaining_seats + " seats"
        
    };

    var row = buildItemRow(summaryData, false);
    
    
    //create Register button
    var $bttnRegister = $('<button type="button" class="btn btn-primary" data-target="#item-' + summaryData.id + '" data-toggle="modal">Register</button>');

    return row.append($('<td>').append($('<div class="btn-group" role="group">').append($bttnRegister)));
}



function onclickEdit()
{}

function onclickDelete()
{}
