$(document).ready(loaded);

function loaded() {

    //Automatic GLOBAL variables
    _userId = "111";
    _userType = "Admin";
    _userSessionId = "0";
    
    _targetModal = "examModal";

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    getAllAPE();
    getAllLoc();

    buildTable();

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
}

function buildTable()
{
    var tableId = "exam-table";
    var headersArr = ["Name", "Date", "Start Time", "Location", "Action"];
    var table = buildMainTable(tableId, headersArr);
    $(".table-responsive").html(table);
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
    if(e.currentTarget.dataset["operation"] == "create")
    {
        console.log($("#exam-form").serialize());
        $.post("../ape/create_ape.php", $("#exam-form").serialize(), function(lastInsertId){
            $.get("../ape/get_all_apes.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: lastInsertId}, 
            function(item){

                console.log(item);
                loadTable(item);
            },
            "json");
        });

    }
        
    if(e.currentTarget.dataset["operation"] == "update")
    {
        console.log($("#exam-form").serialize());
        $.post("../ape/update_ape.php", $("#exam-form").serialize(), function(){
            var item = $("#exam-form").serialize();
            $.get("../ape/get_all_apes.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            exam_id: $("#exam-id").val()}, 
            function(item){
                var row = buildRow(item[0]);
                var detailRow = buildDetailRow(item[0]);
                console.log(item);

                var dataTarget = "#" + item[0].exam_id;
                $("[name = 'item-row'][id = " + item[0].exam_id + "]").replaceWith(row);
                $("[name = 'row-detail'][id = " + item[0].exam_id + "]").replaceWith(detailRow);
            },
            "json");
        }); 
    }
        
}

function loadTable(data) {
    console.log(data);
    $.each(data, function(i, item) {
        //build summaryData object
        var summaryData = {
            id: item.exam_id,
            name: item.name,
            date: item.date,
            start_time: item.start_time,
            location: item.location
        };

        var examRow = buildItemRow(summaryData, _targetModal);

        //build detailData object
        var detailData = {
            id: item.exam_id,
            duration: item.duration,
            passing_grade: item.passing_grade,
            cutoff: item.cutoff
        };

        var namesArr = ["Duration", "Passing Grade", "Cutoff"];

        var detailExamRow = buildDetailRow(detailData, namesArr);

        console.log(detailExamRow);

        $("#exam-table").append(examRow);
        $("#exam-table").append(detailExamRow);
    });
}

function onclickCreate()
{
    clearForm();
    //getAllLoc();
    $(".modal-title").html("Create an Exam");
    $("#submit-button").attr("data-operation", "create");
    $("#submit-button").html("Create");


}

   
function onclickEdit(e) 
{
    clearForm();
    var exam_id = e.currentTarget.dataset["id"];
    $("#exam-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit an Exam");
    $("#submit-button").attr("data-operation", "update");
    $("#submit-button").html("Save changes");

    $.get("../ape/get_all_apes.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    exam_id: exam_id}, 
    function(item){
        $.each(item[0], function(name, val){
            var el = $('[name="'+name+'"]');
            el.val(val);
        });
    },
    "json");

}

function onclickDelete(e) {
    
}

function clearForm()
{
    $("#exam-form").find("input[type=text], textarea").val(""); 
}

function getAllAPE()
{
    $("#exam-table .item-row").empty();
    
    $.get("../ape/get_all_apes.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId}, 
        loadTable,
        "json");
}
