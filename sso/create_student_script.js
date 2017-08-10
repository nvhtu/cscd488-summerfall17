
function getCurUserInfo()
{
    $.get("../util/get_cur_user_info.php", gotCurUserInfo, "json");
}

function gotCurUserInfo(data)
{
    $("#account-id").val(data["userId"]);
    $("#account-fname").val(data["userFname"]);
    $("#account-lname").val(data["userLname"]);
    $("#account-email").val(data["userEmail"]);
}

function submitForm (id, fname, lname, email, type, state)
{
     //console.log(name, quarter, date, location, state, passingGrade, duration, startTime, cutoff);
        

    $.post("../account/create_student_first_time.php", {
                                id: id, 
                                f_name: fname, 
                                l_name: lname,
                                email: email,
                                type: type,
                                state: state
                                });
                            
}

//callback function for an ajax call
function gotData(data)
{
    console.log(data);
} 


$(document).ready(main);
//main function after the page is loaded
function main()
{
    getCurUserInfo();


$("#submit-button").click(function(){
        console.log("click");
        
        var id = $("#account-id").val();
        var fname = $("#account-fname").val();
        var lname = $("#account-lname").val();
        var email = $("#account-email").val();
        var type = "Student";
        var state = "Ready";

        submitForm(id, fname, lname, email, type, state);
        
    })
    

}