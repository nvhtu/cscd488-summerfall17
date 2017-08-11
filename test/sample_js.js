function submitForm (sessionId, accountId, accountType)
{
    $.post("create_account.php", {
                                session_id: sessionId, 
                                account_id: accountId, 
                                account_type: accountType
                                }, gotData, "json");
}

//callback function for an ajax call
function gotData(data)
{
    //do stuff here with the data
} 

$(document).ready(main);
//main function after the page is loaded
function main()
{

$("#submit-button").click(function(){
		submitForm(sessionId, accountId, accountType);
    })
    

}