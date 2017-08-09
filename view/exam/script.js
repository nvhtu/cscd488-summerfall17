function submitForm (userId, userType, userSessionId, name, quarter, date, location, state, passingGrade, duration, startTime, cutoff)
{
     console.log(name, quarter, date, location, state, passingGrade, duration, startTime, cutoff);
        

    $.post("../ape/create_ape.php", {
                                requester_id: userId,
                                requester_type: userType,
                                quarter: quarter, 
                                date: date, 
                                location: location,
                                state: state,
                                passing_grade: passingGrade,
                                duration: duration,
                                start_time: startTime,
                                cutoff: cutoff
                                });
                            
}

function getAllLoc(userId, userType, userSessionId)
{
    $.post("../location/get_all_locations.php",{
                                requester_id: userId,
                                requester_type: userType,
                                requester_session_id: userSessionId
                                }, populateLocation, "json");
}

//callback function for an ajax call
function gotData(data)
{
    console.log(data);
} 

function populateLocation(data)
{
    $.each(data, function(i){
        $("#ape-loc").append($("<option></option")
                    .attr("value", data[i]["loc_id"])
                    .text(data[i]["name"]));
    });
}

$(document).ready(main);
//main function after the page is loaded
function main()
{
    var userId = "111";
    var userType = "Admin";
    var userSessionId = "abc";

    getAllLoc(userId, userType, userSessionId);

$("#submit-button").click(function(){
        console.log("click");
        
        var name = $("#ape-name").val();
        var quarter = $("#ape-quarter").val();
        var date = $("#ape-date").val();
        var location = $("#ape-loc").val();
        var state = $("#ape-state").val();
        var passingGrade = $("#ape-passing-grade").val();
        var duration = $("#ape-duration").val();
        var startTime = $("#ape-start-time").val();
        var cutoff = $("#ape-cutoff").val();

        submitForm(userId, userType, userSessionId, name, quarter, date, location, state, passingGrade, duration, startTime, cutoff);
        
    })
    

}