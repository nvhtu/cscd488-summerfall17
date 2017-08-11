$(document).ready(loaded);

function loaded() {

    getAllAPE();
    
    //Automatic GLOBAL variables
    userId = "1";
    userType = "Admin";
    userSessionId = "0";

    $("#requester-id").val(userId);
    $("#requester-type").val(userType);
    $("#requester-session").val(userSessionId);

    getAllLoc();

    $("#create-button").click(onclickCreate);
    $("#submit-button").click(submitForm);
}




function getAllLoc()
{
    $.post("../location/get_all_locations.php",{
                                requester_id: userId,
                                requester_type: userType,
                                requester_session_id: userSessionId
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
        $.post("../ape/create_ape.php", $("#exam-form").serialize());   
    }
        
    if(e.currentTarget.dataset["operation"] == "update")
    {
        console.log($("#exam-form").serialize());
        $.post("../ape/update_ape.php", $("#exam-form").serialize()); 
    }

    getAllAPE();
        
}

function loadTable(data) 
{
    _allAPEdata = data;
    console.log(_allAPEdata);
    $.each(data, function(i, item) {
        var row = buildRow(i, item);
        appendRow(row);
    });
}

function buildRow(i, item) {
    //create edit button
    var $bttnEdit = $('<button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#addExamModal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
    $bttnEdit.attr("data-id", item.exam_id); //item id from database
    $bttnEdit.attr("data-index", i); //index of the item in the data array
    $bttnEdit.click(onclickEdit);

    //create delete button
    var $bttnDel = $('<button type="button" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
    $bttnDel.attr("data-id", item.exam_id);
    $bttnDel.click(onclickDelete);

    //wrap each piece of data in <td> tags, then wrap them all in a <tr> tag and return row
    return $("<tr class='item-row'>")
        .append(
            $("<td>").text(item.name),
            $("<td>").text(item.date),
            $("<td>").text(item.start_time),
            $("<td>").text(item.state),
            $("<td>").text(item.passing_grade),
            $("<td>").text(item.duration),
            $("<td>").text(item.cutoff),
            $("<td>").append($bttnEdit),
            $("<td>").append($bttnDel)
        );
}

function appendRow(row){
    row.appendTo("#exam-table");
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
    $("#exam-id").val(e.currentTarget.dataset["id"]);
    $(".modal-title").html("Edit an Exam");
    $("#submit-button").attr("data-operation", "update");
    $("#submit-button").html("Save changes");
    //console.log(e.currentTarget.dataset["id"]);
    //console.log(e.currentTarget.dataset["index"]);
    //console.log(allAPEdata);

    var item = _allAPEdata[e.currentTarget.dataset['index']];
    
    $.each(item, function(name, val){
        var el = $('[name="'+name+'"]')
        el.val(val);
    });
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
        {requester_id: "1",
        requester_type: "Admin"}, 
        loadTable,
        "json");
}