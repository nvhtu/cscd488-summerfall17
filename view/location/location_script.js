$(document).ready(loaded);

function loaded() {
    //get all current locations and send to loadTable function,
    $.post("../location/get_all_locations.php", 
        {requester_id: "1",
        requester_type: "Admin"}, 
        loadTable,
        "json");

    //Set click handlers
    $("#create-button").click(onClickCreate);

    $("#submit-button").click(onClickSubmit);
}

//Adds json data to table using buildRow and appendRow helper functions
function loadTable(data) {
    $.each(data, function(i, item) {
        var row = buildRow(item);
        appendRow(row);
    });
}

function buildRow(item) {
    //create edit button
    var $bttnEdit = $('<button type="button" name="edit" class="btn btn-info btn-sm" data-toggle="modal" data-target="#addLocationModal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
    $bttnEdit.attr("data-id", item.loc_id); //add unique ID from item as a data tag
    $bttnEdit.click(onclickEdit);

    //create delete button
    var $bttnDel = $('<button type="button" name="delete" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
    $bttnDel.attr("data-id", item.loc_id);
    $bttnDel.click(onclickDelete);


    //wrap each piece of data in <td> tags, then wrap them all in a <tr> tag and return row
    return $("<tr>")
        .append(
            $("<td>").text(item.name),
            $("<td>").text(item.seats),
            $("<td>").append($bttnEdit),
            $("<td>").append($bttnDel)
        );
}

//Append row to end of table
function appendRow(row){
    row.appendTo("#location-table");
}

//empties all inputs, including hidden id-input
function onClickCreate() {
    $("input").val("");
}

//sends location data to populateEdit function
function onclickEdit(e) {
    if(e.target.nodeName == "SPAN"){
        //if user clicks on icon, get reference to button 
        var btn = $(e.target).parent();
    }
    else{
        var btn = $(e.target);
    }
    $.post("../location/get_all_locations.php", 
        {requester_id: "1",
        requester_type: "Admin"}, 
        function(data){
            populateEdit(data, btn.data("id"));},
        "json");   
}

//Finds location record with matching loc_id and populates form with
//data from that location, then focuses on name field
function populateEdit(data, id) {
    for(var i = 0; i < data.length; i++){
        //check if loc_id equals the id from the edit button
        if(data[i].loc_id == id){
            $.each(data[i], function(key, value) {
                console.log(key + ": " + $("[name=" + key + "]"));
                $("[name=" + key + "]").val(value);
            });
        }
    }
    
    //setTimeout forces this to wait till modal has opened
    setTimeout(function(){
        console.log($("input[name='name']")[0]);
        $("input[name='name']")[0].focus();
    });    
}

//Prompts user to confirm delete, then deletes from database and removes
//the row containing the clicked delete button
function onclickDelete(e) {
    if(window.confirm("Are you sure you want to delete this location?")){
        if(e.target.nodeName == "SPAN"){
            //if user clicks on icon, get reference to button
            var btn = $(e.target).parent();
        }
        else{
            var btn = $(e.target);
        }

        $.post("../location/remove_location.php", 
            {requester_id: "1",
            requester_type: "Admin",
            id: btn.data("id")}, 
            function(data) {
                btn.parent().parent().remove();
            });
    }
}

//Checks if this is an update or add action by seeing if the hidden 
//id-input is empty or not, then calls appropriate function and hides form
function onClickSubmit() {
    if($("#id-input").val() === ""){
        //Add new location
        addLocation();
    }
    else{
        //Update existing location
        updateLocation();
    }   
}

//Adds location to database and calls onSuccessfulAdd function
function addLocation(){
    $.post("../location/create_location.php", 
        {requester_id: "1",
        requester_type: "Admin",
        name: $("input[name='name']").val(),
        seats: $("input[name='seats']").val()}, 
        onSuccessfulAdd);
}

//Gets location data and creates and appends a row using the
//last record in data (the record just added)
function onSuccessfulAdd(){
    $.post("../location/get_all_locations.php", 
        {requester_id: "1",
        requester_type: "Admin"},
        function(data){
            var row = buildRow(data[data.length - 1]);
            appendRow(row);
        },
        "json");
}

//Updates location with form data, then calls onSuccessfulUpdate function
//with the name and data needed for row creation
function updateLocation(){
    var sendData = {requester_id: "1",
        requester_type: "Admin",
        name: $("input[name='name']").val(),
        seats: $("input[name='seats']").val(),
        id: $("#id-input").val()};
    $.post("../location/update_location.php", 
        sendData, 
        function(){
            onSuccessfulUpdate({name: sendData.name, seats: sendData.seats, loc_id: sendData.id});
        });
}

//Creates updated row using passed in location data, then replaces the existing 
//row containing the corresponding data-id with the updated version
function onSuccessfulUpdate(item) {
    var row = buildRow(item);
    $("[name = edit][data-id =" + item.loc_id + "]").parent().parent().replaceWith(row);
}