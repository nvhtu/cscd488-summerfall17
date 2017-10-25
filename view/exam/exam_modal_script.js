/**
 * Exam page script
 * @author: Aaron Griffis
 * @version: 1.0
 */

var _catCount = 0;

var _locOptions;
var _catOptions;
var _graderOptions;
var _stateOptions;

function getAllLoc() {
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

function buildRosterTab() {
    $('#btn-lookup').click(onclickLookup);

    headersArr = ["ID", "First Name", "Last Name", "Email", "State", "Action"];
    table = buildMainTable(headersArr);
    $("#lookup-results").html(table);
}

function onclickAddCat() {
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
}

function onclickDeleteCat(e) {
   var catId = e.currentTarget.dataset["id"];
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