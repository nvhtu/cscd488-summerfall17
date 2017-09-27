$(document).ready(loaded);

function loaded() 
{
   $("#search").keyup(onClickSearch);
   $("#clear-search").click(function() {
      $("#search").val('').focus();
      $(this).hide();
      onClickSearch();
   });
}

function onClickSearch(e) {
   if (typeof e !== "undefined" && e.keyCode == 27) {
      $("#clear-search").trigger('click');
      return false;
   }

   var searchTerm = $("#search").val(),
   length = $.trim(searchTerm).length,
   $rows = $('.main-table>tbody>tr'),
   $data = $('.main-table>tbody>tr td').not('.btns, .details');

   $("#clear-search").toggle(length != 0);
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
      var movie_id = $(row).data('movie_id');
      $table.append($('.detail-row[data-movie_id="' + movie_id + '"]'));
   });
}