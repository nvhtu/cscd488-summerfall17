function buildMainTable(tableId, headersArr)
{
    var tableHTML = '<table class="table table-condensed" id="' + tableId + '"> <thead> <tr>';
    for (header of headersArr)
    {
        tableHTML += '<th>' + header + '</th>';
    }
    tableHTML += '</tr></thead><tbody></tbody></table>';

    return tableHTML;
}

function buildItemRow(summaryData, targetModal)
{
    //create info button
    var $bttnInfo = $('<button type="button" class="btn btn-info" data-target="#item-' + summaryData.id + '" data-toggle="collapse"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><span class="sr-only">Info</span></button>');
    
    //create edit button
    var $bttnEdit = $('<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#' + targetModal + '"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><span class="sr-only">Edit</span></button>');
    $bttnEdit.attr("data-id", summaryData.id); //add unique ID from item as a data tag
    $bttnEdit.click(onclickEdit);

    //create delete button
    var $bttnDel = $('<button type="button" class="btn btn-danger" data-toggle="modal"  data-target="#' + targetModal + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><span class="sr-only">Delete</span></button>');
    $bttnDel.attr("data-id", summaryData.id);
    $bttnDel.click(onclickDelete);

    var rowHTML = '<tr data-toggle="collapse" data-target="#item-' + summaryData.id + '" aria-expanded="true">';

    for (var property in summaryData) 
    {
        if (summaryData.hasOwnProperty(property)) 
        {
            console.log(summaryData[property]);
            if(summaryData[property] != summaryData.id)
            {
                rowHTML += '<td>' + summaryData[property] + '</td>';
            }      
        }
    }

    rowHTML += '<div class="btn-group" role="group">';

    return $(rowHTML).append($bttnInfo, $bttnEdit, $bttnDel);

}


function buildDetailRow(detailData, namesArr)
{
    var detailRowHTML = '<tr class="collapse" id="item-' + detailData.id + '">'
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