$("#select-all-checkbox").click(function(){
    $("#report-form").find("input[type='checkbox']:visible").prop('checked', $("#select-all-checkbox").prop('checked'));
    _reportValidator.element("[name='checkboxes']");
});

$("[type='checkbox']:not(#select-all-checkbox)").click(function(){
    $("#select-all-checkbox").prop('checked', false);
    _reportValidator.element("[name='checkboxes']");
});

function loadTabReport()
{
    toggleSubmitEdit(false, true);
    $('#submit-button').attr("data-tab", "report").html("Generate &amp; Download");
    $("#Report_tab .archived-only").toggle(_selectedTab == "Archived");
}

function onclickDownload(rosterData, examData){
    if($("#report-form").valid()){
        var csvContent = "data:text/csv;charset=utf-8,";
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
        $("#detail-modal").modal("hide");
    }
}

function selectStudentData(rosterData, csvData){
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
    if($("#student-seat-checkbox").prop('checked')){
        rosterProps.push("seat_num");
        studentHeaders.push("Seat Number");
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
    }
    var graderChecked = $("#student-grader-grade-checkbox").prop('checked');
    var catChecked = $("#student-cat-grade-checkbox").prop('checked');

    if(catChecked || graderChecked){
        $.each(rosterData[0].cats, function(index, cat){
            var catRow = [cat.name + " Max Score", cat.possible_grade,"", "Graders"];
            if(catChecked){
                studentHeaders.push(cat.name + " (Final)");
                rosterProps.push("cats");
                rosterProps.push(index);
                rosterProps.push("final_grade");
            }
            $.each(cat.graders_grades, function(name, grade){
                catRow.push(name);
                if(graderChecked){
                    studentHeaders.push(cat.name + " (" + name + ")");
                    rosterProps.push("cats");
                    rosterProps.push(index);
                    rosterProps.push(name);
                }
            });
            csvData.push(catRow);
        });
    }

    csvData.push([]);
    csvData.push(studentHeaders);

    $.each(rosterData, function(index, student){
        var studentData = [];
        for(var i = 0; i < rosterProps.length; i++){
            if(rosterProps[i] == "cats"){
                i++;
                var catIndex = rosterProps[i];
                i++;
                if(rosterProps[i] != "final_grade")
                    studentData.push(student.cats[catIndex].graders_grades[rosterProps[i]]);
                else
                    studentData.push(student.cats[catIndex]["final_grade"]);
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
