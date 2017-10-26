/**
 * Util that build table, summary row, and detail row
 * @author: Tu Nguyen
 * @version: 1.0
 */

/**
 * Build the main table of a page
 * @param {string} headersArr - Array of the table header strings
 * @return {string} HTML string of the table
 */
function buildMainTable(headersArr)
{
    var tableHTML = '<table class="table table-condensed main-table"> <thead> <tr>';
    for (header of headersArr)
    {
      if (header === "Action") {
         tableHTML += '<th>' + header + '</th>';
      } else {
         tableHTML += '<th data-asc="true" data-sorted="false">' + header + '<span class="glyphicon glyphicon-triangle-top"></span></th>';
      }
   }
    tableHTML += '</tr></thead><tbody></tbody></table>';

    return tableHTML;
}

/**
 * Build an item row with action buttons
 * @param {object} summaryData - An javascript object contains data for the row. The number of properties much match the number of the table header
 * @return {object} jQuery object of the row
 */
function buildItemRow(summaryData, isBasicBtns)
{
    var rowHTML = '<tr class="item-row" data-id="item-' + summaryData.id + '" aria-expanded="true">';

    for (var property in summaryData) 
    {
        if (summaryData.hasOwnProperty(property)) 
        {
            if(property != "id")
            {
                rowHTML += '<td>' + summaryData[property] + ' </td>';
            }      
        }
    }

    if(isBasicBtns)
    {
      //   //create info button
      //   var $btnInfo = $('<button type="button" class="btn btn-info" data-target="#item-' + summaryData.id + '" data-toggle="collapse"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><span class="sr-only">Info</span></button>');
        
      //   //create edit button
      //   var $btnEdit = $('<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#detail-modal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
      //   $btnEdit.attr("data-id", summaryData.id); //add unique ID from item as a data tag
      //   $btnEdit.click(onclickEdit);

        //create detail button
        var $btnDetails = $('<button type="button" class="btn btn-info btn-labeled" data-toggle="modal" data-target="#detail-modal"><span class="btn-label" aria-hidden="true"><i class="glyphicon glyphicon-list-alt"></i></span>Details</button>');
        $btnDetails.attr("data-id", summaryData.id); //add unique ID from item as a data tag
        $btnDetails.click(onclickEdit);

        //create delete button
        var $btnDel = $('<button type="button" class="btn btn-danger btn-labeled"><span class="btn-label" aria-hidden="true"><i class="glyphicon glyphicon-trash"></i></span>Delete</button>');
        $btnDel.attr("data-id", summaryData.id);
        $btnDel.click(onclickDelete);

        return $(rowHTML).append(
           $('<td class="btns">').append(
              $('<div class="btn-group" role="group">').append(
                 $btnDetails, $btnDel, ' '
               )
            )
         );
    }
    else
    {
        return $(rowHTML);
    }
}

/**
 * Build an item detail row that will appear when click the info button
 * @param {object} detailData - An javascript object contains data for the detail row
 * @param {string} namesArr - An array of corresponding strings for detailData properties. E.g. "Passing Grade". This array size must match the number of properties in detailData object.
 * @return {string} HTML string of the detail row
 */
function buildDetailRow(detailData, namesArr)
{
    var detailRowHTML = '<tr class="item-detail-row" data-id="item-' + detailData.id + '">'
    + '<td class="details" colspan="100%">'
    + '<div class="collapse" id="item-' + detailData.id + '">'
    + '<table class="table table-condensed">'
    + '<tbody>';

    var count = 0;

    for (var property in detailData) 
    {
        if (detailData.hasOwnProperty(property)) 
        {
            if(detailData[property] != detailData.id)
            {
                detailRowHTML += '<tr class="active">'
                                + '<th>' + namesArr[count] + ': </th>'
                                + '<td>' + detailData[property] + ' </td>'
                                + '</tr>';
                
                count++;
            }
            
            
        }
    }

    detailRowHTML += '</tbody></table></div></td></tr>';
    //console.log(detailRowHTML);
    return detailRowHTML;
}