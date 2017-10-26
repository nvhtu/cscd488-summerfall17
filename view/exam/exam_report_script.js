function loadTabReport()
{
    $('#submit-button').attr("data-tab", "report").html("Generate &amp; Download");
}

function onclickDownload(rosterData, examData){
    var csvContent = "data:text/csv;charset=utf-8,";
    
    var i;
    for(i = 0; _locData[i].loc_id != examData.location; i++);
    var locName = _locData[i].name;

    var csvHeader = [examData.name + ": " + examData.quarter + " Quarter " + examData.date + " " +
        examData.start_time + " " + locName];
    var csvData = [];
    csvData.push(csvHeader);
    csvData.push([]);
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

    if($("#student-name-checkbox").prop('checked')){
        rosterProps.push("f_name", "l_name");
        studentHeaders.push("First Name", "Last Name");
    }
    if($("#student-id-checkbox").prop('checked')){
        rosterProps.push("student_id");
        studentHeaders.push("EWU ID");
    }
    if($("#student-email-checkbox").prop('checked')){
        rosterProps.push("email");
        studentHeaders.push("Email");
    }
    if($("#student-cat-grade-checkbox").prop('checked')){
        $.each(_catData, function(index, cat){
            var catName = cat.name;
            if(typeof rosterData[0].cats[catName] != "undefined"){
                rosterProps.push("cats");
                rosterProps.push(catName);
                studentHeaders.push(catName);
            }
        });
    }
    if($("#student-exam-grade-checkbox").prop('checked')){
        rosterProps.push("grade");
        studentHeaders.push("Final Score");
    }
    if($("#student-result-checkbox").prop('checked')){
        rosterProps.push("passed");
        studentHeaders.push("Pass/Fail");
    }
    if($("#student-seat-checkbox").prop('checked')){
        rosterProps.push("seat_num");
        studentHeaders.push("Seat Number");
    }

    csvData.push(studentHeaders);
    $.each(rosterData, function(index, student){
        var studentData = [];
        for(var i = 0; i < rosterProps.length; i++){
            if(rosterProps[i] == "cats"){
                i++;
                studentData.push(student.cats[rosterProps[i]] + " out of " + student.cats[rosterProps[i] + " Max"]);
            }
            else if(rosterProps[i] == "grade"){
                studentData.push(student.grade + " out of " + student.possible_grade);
            }
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
