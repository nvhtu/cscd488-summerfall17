$(document).ready(loaded);

function loaded() {
    //get all current categories and send to loadTable function,
    $.post("../category/get_all_categories.php", 
        {requester_id: "1",
        requester_type: "Admin"}, 
        loadTable,
        "json");
    //hide form
    $("#form-fieldset").attr("hidden", "true");
    //set click handlers
    $("#add-bttn").click(onClickAdd);
    $("#cancel-bttn").click(hideInput);
    $("#save-bttn").click(onClickSave);
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
    var $bttnEdit = $('<input type="button" value="Edit" class="bttn"/>');
    $bttnEdit.attr("data-id", item.cat_id); //add unique ID from item as a data tag
    $bttnEdit.click(onclickEdit);

    //create delete button
    var $bttnDel = $('<input type="button" value="Delete" class="bttn"/>');
    $bttnDel.attr("data-id", item.cat_id);
    $bttnDel.click(onclickDelete);

    //wrap each piece of data in <td> tags, then wrap them all in a <tr> tag and return row
    return $("<tr>")
        .append(
            $("<td>").text(item.name),
            $("<td>").append($bttnEdit),
            $("<td>").append($bttnDel)
        );
}

//Append row to end of table
function appendRow(row){
    row.appendTo("#category-table");
}

//slides form down, disables Edit/Delete buttons, and gives focus to first input field
function showInput() {
    $("#form-fieldset").slideDown("slow");
    $(".bttn").prop("disabled", true);
    $("#add-bttn").prop("disabled", true);
    $("input[name='name']").focus();
}

//hides form, and enables Edit/Delete buttons
function hideInput() {
    $(".bttn").prop("disabled", false);
    $("#add-bttn").prop("disabled", false);
    $("#form-fieldset").slideUp("slow");
}

//Shows form and empties all inputs, including hidden id-input
function onClickAdd() {
    showInput();
    $("#form-fieldset input").val("");
}

//Shows form and sends category data to populateEdit function
function onclickEdit(e) {
    showInput();
    $.post("../category/get_all_categories.php", 
        {requester_id: "1",
        requester_type: "Admin"}, 
        function(data){
            populateEdit(data, $(e.target).data("id"));},
        "json");
}

//Finds category record with matching cat_id and populates form with
//data from that category
function populateEdit(data, id) {
    for(var i = 0; i < data.length; i++){
        //check if cat_id equals the id from the edit button
        if(data[i].cat_id == id){
            $.each(data[i], function(key, value) {
                $("[name=" + key + "]").val(value);
            });
        }
    }
}

//Prompts user to confirm delete, then deletes from database and removes
//the row containing the clicked delete button
function onclickDelete(e) {
    if(window.confirm("Are you sure you want to delete this category?")){
        $.post("../category/remove_category.php", 
            {requester_id: "1",
            requester_type: "Admin",
            id: $(e.target).data("id")}, 
            function(data) {
                $(e.target).parent().parent().remove();
            });
    }
}

//Checks if this is an update or add action by seeing if the hidden 
//id-input is empty or not, then calls appropriate function and hides form
function onClickSave() {
    if($("#id-input").val() === ""){
        //Add new category
        addCategory();
    }
    else{
        //Update existing category
        updateCategory();
    }   
    hideInput();
}

//Adds category to database and calls onSuccessfulAdd function
function addCategory(){
    $.post("../category/create_category.php", 
        {requester_id: "1",
        requester_type: "Admin",
        name: $("input[name='name']").val()}, 
        onSuccessfulAdd);
}

//Gets category data and creates and appends a row using the
//last record in data (the record just added)
function onSuccessfulAdd(){
    $.post("../category/get_all_categories.php", 
        {requester_id: "1",
        requester_type: "Admin"},
        function(data){
            var row = buildRow(data[data.length - 1]);
            appendRow(row);
        },
        "json");
}

//Updates category with form data, then calls onSuccessfulUpdate function
//with the name and data needed for row creation
function updateCategory(){
    var sendData = {requester_id: "1",
        requester_type: "Admin",
        name: $("input[name='name']").val(),
        id: $("#id-input").val()};
    $.post("../category/update_category.php", 
        sendData, 
        function(){
            onSuccessfulUpdate({name: sendData.name, cat_id: sendData.id});
        });
}

//Creates updated row using passed in category data, then replaces the existing 
//row containing the corresponding data-id with the updated version
function onSuccessfulUpdate(item) {
    var row = buildRow(item);
    $("[value = Edit][data-id =" + item.cat_id + "]").parent().parent().replaceWith(row);
}