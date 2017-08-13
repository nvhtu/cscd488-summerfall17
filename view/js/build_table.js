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
    var tableHTML = '<table class="table table-condensed" id="main-table"> <thead> <tr>';
    for (header of headersArr)
    {
        tableHTML += '<th>' + header + '</th>';
    }
    tableHTML += '</tr></thead><tbody></tbody></table>';

    return tableHTML;
}

/**
 * Build an item row with action buttons
 * @param {object} summaryData - An javascript object contains data for the row. The number of properties much match the number of the table header
 * @return {object} jQuery object of the row
 */
function buildItemRow(summaryData)
{
    //create info button
    var $bttnInfo = $('<button type="button" class="btn btn-info" data-target="#item-' + summaryData.id + '" data-toggle="collapse"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><span class="sr-only">Info</span></button>');
    
    //create edit button
    var $bttnEdit = $('<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#detail-modal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
    $bttnEdit.attr("data-id", summaryData.id); //add unique ID from item as a data tag
    $bttnEdit.click(onclickEdit);

    //create delete button
    var $bttnDel = $('<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
    $bttnDel.attr("data-id", summaryData.id);
    $bttnDel.click(onclickDelete);

    var rowHTML = '<tr data-target="#item-' + summaryData.id + '" aria-expanded="true" name = "item-row">';

    for (var property in summaryData) 
    {
        if (summaryData.hasOwnProperty(property)) 
        {
            //console.log(summaryData[property]);
            if(summaryData[property] != summaryData.id)
            {
                rowHTML += '<td>' + summaryData[property] + '</td>';
            }      
        }
    }

    rowHTML += '<div class="btn-group" role="group">';

    return $(rowHTML).append($bttnInfo, $bttnEdit, $bttnDel);

}

/**
 * Build an item detail row that will appear when click the info button
 * @param {object} detailData - An javascript object contains data for the detail row
 * @param {string} namesArr - An array of corresponding strings for detailData properties. E.g. "Passing Grade". This array size must match the number of properties in detailData object.
 * @return {string} HTML string of the detail row
 */
function buildDetailRow(detailData, namesArr)
{
    var detailRowHTML = '<tr class="collapse" id="item-' + detailData.id + '" name = "item-detail-row">'
    + '<td colspan="6" class="well">'
    + '<div class="panel panel-default">'
    + '<table class="table table-condensed">'
    + '<tbody>';

    var count = 0;

    for (var property in detailData) 
    {
        if (detailData.hasOwnProperty(property)) 
        {
            if(detailData[property] != detailData.id)
            {
                detailRowHTML += '<tr>'
                                + '<th>' + namesArr[count] + '</th>'
                                + '<td>' + detailData[property] + '</td'
                                + '</tr>';
                
                count++;
            }
            
            
        }
    }

    detailRowHTML += '</tbody></table></div></td></tr>';
    //console.log(detailRowHTML);
    return detailRowHTML;
}