var _catCount = 0;

var _locOptions;
var _catOptions;
var _graderOptions;
var _stateOptions;

$('input[name="date"]').datepicker({
    format: 'yyyy-mm-dd',
    forceParse: false,
    todayHighlight: true,
    autoclose: true,
    orientation: "top right"
}).on('changeDate', autofillQuarter);

$('input[name="date"]').keydown(function(){
    return false;
});

$('#add-cat-btn').click(onclickAddCat);

$('#cat-table').on('change', 'input, select', function(){
    _catSectionModified = true;        
});

function loadTabExam()
{
    //var btn = $('#submit-button');
    //action = btn.attr("data-action");
    
    //btn.attr("data-tab", "exam");
 
    /*if (action === "create") {
       btn.html('Create');
    }
    else if (action === "update") {
       btn.html('Save changes');
    }*/

    clearForm();
    var itemId = _origClickEvent.currentTarget.dataset["id"];
    $("#item-id").val(itemId);

    $("#submit-button").attr("data-tab", "exam");
    $("#submit-button").attr("data-action", "update");
    $("#submit-button").html("Save changes");
    $('a[href="#Report_tab"]').add('a[href="#Roster_tab"]').parent().toggleClass('hidden', false);

    $.get("../ape/get_all_apes.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    request: "get_by_id",
    exam_id: itemId}, 
    function(item){
        $("#modal-title").html(item[0].name);
        $.each(item[0], function(name, val){
            var el = $('[name="'+name+'"]');
            el.val(val);
        });
        $('input[name="date"]').triggerHandler('changeDate');
        $("#Report_tab #file-name").val(item[0].name.split(' ').join('_'));
    },
    "json");

    $.get("../ape/get_exam_cats.php", 
    {requester_id: _userId,
    requester_type: _userType,
    requester_session_id: _userSessionId,
    exam_id: itemId}, 
    populateExamCats,
    "json");

    /*_deletedExamCats = Array();
    _modifiedExamCats = Array();*/
   
}

function getAllLoc() 
{
    $.get("../location/get_all_locations.php",
       {
          requester_id: _userId,
          requester_type: _userType,
          requester_session_id: _userSessionId
       },
       setAllLoc,
       "json"
    );
 }
 
 function setAllLoc(data) {
    _locData = data;
    _locOptions = buildOptions(data, "location");
    $('select[name="location"]').empty().append(_locOptions);
 }
 
 function getAllCat() {
    $.get("../category/get_all_categories.php",
       {
          requester_id: _userId,
          requester_type: _userType,
          requester_session_id: _userSessionId
       },
       setAllCat,
       "json"
    );
 }
 
 function setAllCat(data) {
    _catData = data;
    _catOptions = buildOptions(data, "category");
    $('select[name="category"]').each(function() {
       $(this).empty().append(_catOptions);
    });
 }
 
 function getAllGraders() {
    $.get("../account/get_account_info.php", 
       {
          requester_id: _userId,
          requester_type: _userType,
          requester_session_id: _userSessionId,
          request: "get_by_type",
          type: "Grader"
       }, 
       setAllGraders,
       "json"
    );
 }
 
 function setAllGraders(data) {
    _graderData = data;
    _graderOptions = buildOptions(data, "grader");
    $('select[name="grader"]').each(function() {
       $(this).empty().append(_graderOptions);
    });
 }



 function createItem()
 {
     $.post("../ape/create_ape.php", $("#" + _formId).serialize(), function(lastInsertId){
         $.get("../ape/get_all_apes.php", 
         {requester_id: _userId,
         requester_type: _userType,
         requester_session_id: _userSessionId,
         request: "get_by_id",
         exam_id: lastInsertId}, 
         function(item){
             loadTable(item);
         },
         "json");
 
         addExamCats(lastInsertId);        
     });
 }
 
 function addExamCats(examId)
 {
     $(".cat-row").each(function(){
         var catId = $(this).find("select").val();//returns null if none selected
         var possibleGrade = $(this).find("input").val();//returns "" if none selected
         var dataId = $(this).attr("data-id");
 
         $.post("../ape/add_exam_cat.php",
         {requester_id: _userId,
         requester_type: _userType,
         requester_session_id: _userSessionId,
         exam_id: examId,
         cat_id: catId,
         possible_grade: possibleGrade},
         function(lastInsertId){
             addGraders(lastInsertId, dataId);
         });
     });
 }
 
 function addGraders(examCatId, dataId)
 {
     $(".cat-grader-row[data-id='" + dataId + "']").find("select").each(function(){
         var graderId = $(this).val();
 
         $.post("../ape/assign_grader.php",
         {requester_id: _userId,
         requester_type: _userType,
         requester_session_id: _userSessionId,
         exam_cat_id: examCatId,
         user_id: graderId});
     });
 }
 
 function updateItem()
 {
     $.post("../ape/update_ape.php", $("#" + _formId).serialize(), function(){
         var item = $("#" + _formId).serialize();
         
         if(_catSectionModified){
             $.post("../ape/remove_exam_cat.php",
             {requester_id: _userId,
             requester_type: _userType,
             requester_session_id: _userSessionId,
             exam_id: $("#item-id").val()},
             function(){
                 addExamCats($("#item-id").val());
             });
         }
 
         $.get("../ape/get_all_apes.php", 
         {requester_id: _userId,
         requester_type: _userType,
         requester_session_id: _userSessionId,
         request: "get_by_id",
         exam_id: $("#item-id").val()}, 
         function(item){
             var row = buildItemSummaryRow(item[0]);
             // var detailRow = buildItemDetailRow(item[0]);
             //$("tr[data-target='#item-" + item[0].exam_id + "']").replaceWith(row);
             // $("tr[data-id='item-" + item[0].exam_id + "']").replaceWith(detailRow);
             $("tr[data-id='item-" + item[0].exam_id + "']").replaceWith(row);
         },
         "json");
     }); 
 }

 function populateExamCats(examCatData){
    $.each(examCatData, function(index, examCat){
        onclickAddCat();
        _catSectionModified = false;
        
        var catRow = $(".cat-row:last");
        catRow.find("option[value='" + examCat.cat_id + "']").prop("selected", true);
        catRow.find("input").val(examCat.possible_grade);

        var dataId = catRow.attr("data-id");

        $.get("../grade/get_graders.php", 
        {requester_id: _userId,
        requester_type: _userType,
        requester_session_id: _userSessionId,
        request: "get_by_exam_cat_id",
        exam_cat_id: examCat.exam_cat_id}, 
        function(graderData){
            if(graderData.length > 0){
                catRow.find(".btn-info").click();
                populateGraders(graderData, dataId);
            }
        },
        "json");
    });
    calcPossibleGrade();
}

function populateGraders(graderData, dataId){
    var graderRow = $(".cat-grader-row[data-id='" + dataId + "']");
    $.each(graderData, function(index, grader){
        var fakeE = {currentTarget: graderRow.find(".btn-primary")[0]};
        onclickAddGrader(fakeE);
        _catSectionModified = false;
        
        var select = graderRow.find("select:last");
        if(select.find("option[value='" + grader.user_id + "']").length != 0){
            select.find("option[value='" + grader.user_id + "']").prop("selected", true);
        }
        else if(_selectedTab == "Archived"){
            $.get("../account/get_account_info.php", 
            {requester_id: _userId,
            requester_type: _userType,
            requester_session_id: _userSessionId,
            request: "get_by_id",
            id: grader.user_id}, 
            function(item){
                select.append('<option value="' + item[0].user_id + '">' + item[0].f_name + ' ' + item[0].l_name + '</option>');
                select.find("option[value='" + item[0].user_id + "']").prop("selected", true);
            },
            "json");
        }
    });
}


function onclickAddCat() {
    _catSectionModified = true;
 
    var $table = $('#cat-table');
    var row = buildCatRow();
    var graderRow = buildCatGraderRow();
 
    $table.append(row);
    $table.append(graderRow);
    
    var rowCount = $('#cat-table>tbody>tr.cat-row').length;
    if (rowCount >= _catData.length) {
       $('#add-cat-btn').prop("disabled",true);
    }
 
    if (rowCount > 0) {
       $('#cat-table').show();
       $('#cat-heading').toggleClass('empty-panel-fix', false);
    }

    if (_userType == "Teacher") {
        row.find(".btn-info").click();
        graderRow.find(".btn-primary").click();
        graderRow.find("select").find("option[value='" + _userId + "']").prop("selected", true);
    }
 }
 
 function onclickDeleteCat(e) {
    var catId = e.currentTarget.dataset["id"];
    _catSectionModified = true;
    
    /*if($("#submit-button").attr("data-action") == "update"){
       var cat = $('#cat-table tr.cat-row[data-id="cat-' + catId + '"]').find("select").val();
       _deletedExamCats.push(cat);
       var modIndex = _modifiedExamCats.indexOf(cat)
       if(modIndex != -1)
             _modifiedExamCats.splice(modIndex, 1);
       console.log(_deletedExamCats);
    }*/
    $('#cat-table tr.cat-row[data-id="cat-' + catId + '"]').remove();
    $('#cat-table tr.cat-grader-row[data-id="cat-' + catId + '"]').remove();
    
    var rowCount = $('#cat-table>tbody>tr.cat-row').length;
    if (rowCount < _catData.length) {
       $('#add-cat-btn').prop("disabled",false);
    }
 
    if (rowCount == 0) {
       $('#cat-table').hide();
       $('#cat-heading').toggleClass('empty-panel-fix', true);
    }
 }
 
 function onclickAddGrader(e) {
    var catId = e.currentTarget.dataset["id"],
    $curRow = $('#cat-table tr.cat-grader-row[data-id="cat-' + catId + '"]');
    _catSectionModified = true;
 
    /*if($("#submit-button").attr("data-action") == "update"){
       var cat = $('#cat-table tr.cat-row[data-id="cat-' + catId + '"]').find("select").val();
       var modIndex = _modifiedExamCats.indexOf(cat)
       if(modIndex == -1)
             _modifiedExamCats.push(cat);
       console.log(_deletedExamCats);
    }*/
 
    var $btnDel = $('<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
    $btnDel.attr("data-id", catId);
    $btnDel.click(onclickDeleteGrader);
 
    $curRow.find('td.graders').append(
       $('<div class="input-group">').append(
          $('<select class="form-control" name="grader">').append(
             _graderOptions
          ),
          $('<span class="input-group-btn">').append(
             $btnDel
          )
       )
    );
 
    var graderCount = $curRow.find('td.graders select').length;
    if (graderCount > 0) {
       $curRow.find('td.graders').show();
    }
    
    if (graderCount >= _graderData.length) {
       $curRow.find('button.btn-primary').prop("disabled",true);
    }
 }
 
 function onclickDeleteGrader(e) {
    _catSectionModified = true;
 
    var catId = e.currentTarget.dataset["id"];
    $(e.currentTarget).parent().parent().remove();
    
    $curRow = $('#cat-table tr.cat-grader-row[data-id="cat-' + catId + '"]');
    var graderCount = $curRow.find('td.graders select').length;
    if (graderCount == 0) {
       $curRow.find('td.graders').hide();
    }
    
    if (graderCount < _graderData.length) {
       $curRow.find('button').prop("disabled",false);
    }
 }
 
 function buildCatRow() {
    //create max score input
    var $maxScore = $('<input type="text" class="form-control" name="max-score">');
    $maxScore.focusout(calcPossibleGrade);
 
    //create grader button
    var $btnGraders = $('<button type="button" class="btn btn-info" data-target="#cat-' + _catCount + '" data-toggle="collapse">Graders</button>');   
    
    //create delete button
    var $btnDel = $('<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
    $btnDel.attr("data-id", _catCount);
    $btnDel.click(onclickDeleteCat);
 
    return $('<tr class="cat-row" aria-expanded="true">').attr("data-id", "cat-" + _catCount).attr("data-target", "#cat-" + _catCount).append(
          $('<td>').append(
             $('<select class="form-control" name="category">').append(
                _catOptions
             )
          ),
          $('<td>').append(
             $maxScore
          ),
          $('<td>').append(
             $('<div class="btn-group" role="group">').append(
                $btnGraders, $btnDel, ' '
             )
          )
       );
 }
 
 function buildCatGraderRow() {
    var $btnAddGrader = $('<button type="button" class="btn btn-primary btn-labeled pull-right"><span class="btn-label" aria-hidden="true"><i class="glyphicon glyphicon-plus"></i></span>Add Grader</button>');
    $btnAddGrader.attr("data-id", _catCount);
    $btnAddGrader.click(onclickAddGrader);
 
    var $graderRowHTML =
       $('<tr class="cat-grader-row">').attr("data-id", "cat-" + _catCount).append(
          $('<td colspan="100%">').append(
             $('<div class="collapse">').attr("id", "cat-" + _catCount).append(
                $('<table class="table table-condensed">').append(
                   $('<tbody>').append(
                      $('<tr class="active">').append(
                         $('<td class="grader-header clearfix">').append(
                             $('<h4 class="pull-left">').text("Graders:"),
                            $btnAddGrader
                         )
                      ),
                      $('<tr class="active">').append(
                         $('<td class="graders">').hide()
                      )
                   )
                )
             )
          )
       );
 
    _catCount++;
    return $graderRowHTML;
 }
 
 function getQuarter(date) {
    var quarter = "(Select valid date)",
    curDate = new Date(date),
    winterStart = new Date(_settings.winterStart),
    winterEnd = new Date(_settings.winterEnd),
    springStart = new Date(_settings.springStart),
    springEnd = new Date(_settings.springEnd),
    summerStart = new Date(_settings.summerStart),
    summerEnd = new Date(_settings.summerEnd),
    fallStart = new Date(_settings.fallStart),
    fallEnd = new Date(_settings.fallEnd);
 
    if (isBetweenDates(curDate, winterStart, winterEnd)) {
       quarter = "Winter";
    }
    else if (isBetweenDates(curDate, springStart, springEnd)) {
       quarter = "Spring";
    }
    else if (isBetweenDates(curDate, summerStart, summerEnd)) {
       quarter = "Summer";
    }
    else if (isBetweenDates(curDate, fallStart, fallEnd)) {
       quarter = "Fall";
    }
 
    return quarter;
 }
 
 function isBetweenDates(cur, lower, upper) {
    if (lower < upper) {
       return lower <= cur && cur <= upper;
    }
    else {
       return cur <= upper || cur >= lower;
    }
 }
 
 function autofillQuarter() {
    var quarter = getQuarter( $(this).val() );
    $("#quarter").text(quarter);
    $('input[name="quarter"]').val(quarter);
 }
 
 function calcPossibleGrade() {
    var possibleGrade = 0;
    $('#cat-table input[name="max-score"]').each(function(i, item) {
       var score = parseInt(item.value, 10)
       if (!isNaN(score)) {
          possibleGrade += parseInt(item.value, 10);
       }
    });
 
    $('#possible-grade').text(possibleGrade);
    $('input[name="possible_grade"]').val(possibleGrade);
 }

 function buildOptions(data, type) {
    var options = '<option hidden disabled selected value>Choose a ' + type + '</option>', id, name;
    $.each(data, function(i) {
       if (type === "location") {
          id = data[i]["loc_id"];
          name = data[i]["name"] + " (" + data[i]["seats"] + " seats)";
       }
       else if (type === "category") {
          id = data[i]["cat_id"];
          name = data[i]["name"];
       }
       else if (type === "grader") {
          id = data[i]["user_id"];
          name = data[i]["f_name"] + " " + data[i]["l_name"];
       }
       options += '<option value="' + id + '">' + name + '</option>';
    });
    return options;
 }
 