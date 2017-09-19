/**
 * Settings page script
 * @author: Andrew Robinson
 * @version: 1.0
 */
$(document).ready(loaded);

function loaded() 
{
    //Automatic GLOBAL variables
    _userId = "111";
    _userType = "Admin";
    _userSessionId = "0";    
    _formId = "main-form";

    $("#requester-id").val(_userId);
    $("#requester-type").val(_userType);
    $("#requester-session").val(_userSessionId);

    $("div .table-toolbar").remove();

    buildForm();
    populateForm();
    $("input").on("input", function(){
        $("#submit-button").prop("disabled", false);
    })
    $("#submit-button").click(submitForm);
}

function buildForm(){
    $("div .table-responsive").html(
        '<form id="main-form">' +
            '<div class="form-group">' +
                '<label for="catGraderLimit" class="col-sm-3 control-label">Grader Limit per Category:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="catGraderLimit"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="pointDiffRange" class="col-sm-3 control-label">Allowable Score Discrepancy:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="pointDiffRange"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="examMaxPoint" class="col-sm-3 control-label">Maximum Points for Exams:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="examMaxPoint"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="fallStart" class="col-sm-3 control-label">Fall Quarter Start Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="fallStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="fallEnd" class="col-sm-3 control-label">Fall Quarter End Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="fallEnd"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="winterStart" class="col-sm-3 control-label">Winter Quarter Start Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="winterStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="winterEnd" class="col-sm-3 control-label">Winter Quarter End Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="winterEnd"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="springStart" class="col-sm-3 control-label">Spring Quarter Start Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="springStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="springEnd" class="col-sm-3 control-label">Spring Quarter End Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="springEnd"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="summerStart" class="col-sm-3 control-label">Summer Quarter Start Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="summerStart"/>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="summerEnd" class="col-sm-3 control-label">Summer Quarter End Date*:</label>' +
                '<div class="col-sm-9">' +
                    '<input type="text" class="form-control" id="summerEnd"/>' +
                '</div>' +
            '</div>' +
            '<label class="col-sm-12 control-label" style="text-align: right">*Dates must be in YYYY-MM-DD format</label>' +
        '</form>' +
        '<form>' +
            '<button type="button" class="btn btn-primary pull-right" disabled="true" id="submit-button" style="margin: 10px 10px 10px 10px">Save Changes</button>' +
        '</form>'
    )
}

function populateForm(){
    $.get("../settings/get_settings.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId}, 
    function(data){
        _settings = data;
        $.each(_settings, function(index, val){
            $('#' + val["name"]).val(val["value"]);
        });
    },
    "json");
}

function submitForm(){
    $.each(_settings, function(index, val){
        var input = $('#' + val["name"]).val();
        if(input !== val["value"]){
            _settings[index]["value"] = input;
            $.post("../settings/update_setting.php", 
                {requester_id: _userId,
                requester_type: _userType,
                requester_session_id: _userSessionId,
                name: val["name"],
                value: input}
            );
        }
    });
    $("#submit-button").prop("disabled", true);
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