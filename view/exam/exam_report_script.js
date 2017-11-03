$("#select-all-checkbox").click(function(){
    $("#report-form").find("input[type='checkbox']:visible").prop('checked', $("#select-all-checkbox").prop('checked'));
});

function loadTabReport()
{
    $('#submit-button').attr("data-tab", "report").html("Generate &amp; Download");
    $("#Report_tab .archived-only").toggle(_selectedTab == "Archived");
}

function onclickDownload(rosterData, examData){
    var csvContent = "data:text/csv;charset=utf-8,";
    console.log(rosterData);
    console.log(examData);
    var i;
    for(i = 0; _locData[i].loc_id != examData.location; i++);
    var locName = _locData[i].name;

    var csvData = [["Exam Name", examData.name],["Quarter", examData.quarter],["Date", examData.date],
        ["Time", examData.start_time],["Location", locName]];

    csvData = selectStudentData(rosterData, csvData);
    
    csvData.forEach(function(infoArray, index){
        dataString = infoArray.join(",");
        csvContent += index < csvData.length ? dataString + "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = $("#download-link");
    link.attr("href", encodedUri);
    link.attr("download", $("[name='file-name']").val() + ".csv");

    link[0].click();
}

function selectStudentData(rosterData, csvData){
    //console.log(rosterData);
    var studentHeaders = [];
    var rosterProps = [];
    //var maxScoreRow = [];

    if($("#student-name-checkbox").prop('checked')){
        rosterProps.push("f_name", "l_name");
        studentHeaders.push("First Name", "Last Name");
       // maxScoreRow.push("", "");
    }
    if($("#student-id-checkbox").prop('checked')){
        rosterProps.push("student_id");
        studentHeaders.push("EWU ID");
        //maxScoreRow.push("");
    }
    if($("#student-email-checkbox").prop('checked')){
        rosterProps.push("email");
        studentHeaders.push("Email");
        //maxScoreRow.push("");
    }
    if($("#student-seat-checkbox").prop('checked')){
        rosterProps.push("seat_num");
        studentHeaders.push("Seat Number");
        //maxScoreRow.push("");
    }
    if($("#student-exam-grade-checkbox").prop('checked')){
        rosterProps.push("grade");
        studentHeaders.push("Exam Score");
        csvData.push(["Exam Max Score", rosterData[0].possible_grade]);
        csvData.push(["Exam Passing Score", rosterData[0].passing_grade]);
    }
    if($("#student-result-checkbox").prop('checked')){
        rosterProps.push("passed");
        studentHeaders.push("Pass/Fail");
        //maxScoreRow.push("");
    }
    if($("#student-cat-grade-checkbox").prop('checked')){
        $.each(rosterData[0].cats, function(index, cat){
            var catRow = [cat.name + " Max Score", cat.possible_grade,"", "Graders"];
            $.each(cat.graders_grades, function(name, grade){
                catRow.push(name);
                /*studentHeaders.push(catName + " (" + name + ")");
                rosterProps.push("cats");
                rosterProps.push(index);
                rosterProps.push(name);*/
            });
            
            csvData.push(catRow);
        });
    }

    csvData.push([]);
    csvData.push(studentHeaders);
    /*if(_selectedTab == "Archived")
        csvData.push(maxScoreRow);*/

    $.each(rosterData, function(index, student){
        var studentData = [];
        for(var i = 0; i < rosterProps.length; i++){
            if(rosterProps[i] == "cats"){
                i++;
                studentData.push(student.cats[rosterProps[i]]);// + " out of " + student.cats[rosterProps[i] + " Max"]);
            }
            /*else if(rosterProps[i] == "grade"){
                studentData.push(student.grade + " out of " + student.possible_grade);
            }*/
            else if(rosterProps[i] == "passed"){
                studentData.push(student.passed == "1" ? "Pass" : "Fail");
            }
            else{
                studentData.push(student[rosterProps[i]]);
            }
        }
        csvData.push(studentData);
    })
    return csvData;
}
