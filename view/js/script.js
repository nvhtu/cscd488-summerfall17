/**
 * Global script
 * @author: Aaron Griffis
 * @version: 1.0
 */

$(document).ready(loaded);

function loaded() 
{
   $(".search").keyup(function(e) {onClickSearch(e, this);});
   $(".clear-search").click(function() {
      var $this = $(this),
      $search = $this.parent().find('.search');
      $search.val('').focus();
      $this.hide();
      onClickSearch(undefined, $search);
   });
}

function loadUserInfo(data)
{
    _userId = data.userId;
    _userType = data.userType;
    _userSessionId = data.userSession;

    //Check all types of the user
    //_userType variable is used for authentication only. On each operation that requires
    //different type other than the one set in _userType, programmer needs to set requester_id parameter manually on an Ajax request
    
    //"Admin" type supercedes all other type therefore _userType gets "Admin"
    //"Teacher" supercedes "Grader"
    //"Student" type never has other type in data.userType array
    if(data.userType.indexOf("Admin") != -1)
    {
        _userType = "Admin";
    }
    else 
        if(data.userType.indexOf("Teacher") != -1)
        {
            _userType = "Teacher";
        }
        else
            if(data.userType.indexOf("Grader") != -1)
            {
                _userType = "Grader";
            }
            else
                if(data.userType.indexOf("Student") != -1)
                {
                    _userType = "Student";
                }

    init();    
}

function onClickSearch(e, input) {
   console.log(e, input);

   if (typeof e !== "undefined" && e.keyCode == 27) {
      $(".clear-search").trigger('click');
      return false;
   }

   var searchTerm = $(input).val(),
   length = $.trim(searchTerm).length,
   $rows = $('.main-table>tbody>tr'),
   $data = $('.main-table>tbody>tr td').not('.btns, .details');

   $(".clear-search").toggle(length != 0);
   if (length > 0) {
      var $search = '^(?=.*\\b' + $.trim(searchTerm).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
      reg = RegExp($search, 'i'),
      text;

      $rows.show();
      var $matched = $rows.filter(function() {
         text = $('td', this).not('.btns, .details').text().replace(/\s+/g, ' ');
         return reg.test(text);
      });
      $matched.each(function(index, element) {
         $matched = $matched.add($('tr[data-id=' + $(element).data("id") + ']'));
      });
      $rows.not($matched).hide();
   }
   else {
      $rows.show();
   }
}

function sortRows() {
   $('[data-sorted]').filter(function() {
      return $(this).data('sorted') == true;
   }).data('sorted', false).trigger('click');
}

function onClickSort(th) {
   var $table, $headers;
   if ($('div.with-nav-tabs').length) {
      $table = $(".tab-pane.active table.main-table");
      $headers = $(".tab-pane.active table.main-table>thead th:not(:last-child)");
   }
   else {
      $table = $("table.main-table");
      $headers = $("table.main-table>thead th:not(:last-child)");
   }

   var $this = $(this),
   $rows = $('.item-row', $table),
   $thisIcon = $this.children(".glyphicon-triangle-top, .glyphicon-triangle-bottom"),
   $otherIcons = $headers.children(".glyphicon-triangle-top, .glyphicon-triangle-bottom").not($thisIcon),
   header = $this.text(),
   index = $headers.index($this);

   $thisIcon.show();
   $otherIcons.hide();

   if ($this.data('sorted')) {
      $this.data('asc', !$this.data('asc'));
      $thisIcon.toggleClass('glyphicon-triangle-top glyphicon-triangle-bottom');
   }
   else {
      $this.data('sorted', true);
      $headers.not($this).each(function() {
         $(this).data('sorted', false);
      });
   }
   var isAsc = $this.data('asc');

   $rows.sort(function(a, b) {
      var valA, valB,
      $colA = $(a).children().eq(index),
      $colB = $(b).children().eq(index);
      valA = $colA.text();
      valB = $colB.text();
      
      var comp;
      if ($.isNumeric(valA) && $.isNumeric(valB)) {
         comp = valA - valB;
      }
      else {
         comp = valA.localeCompare(valB);
      }
      return isAsc ? (comp) : (comp * -1);
   }).each(function(i, row) {
      $table.append(row);
      var id = $(row).data('id');
      $table.append($('.item-detail-row[data-id="' + id + '"]'));
   });
}