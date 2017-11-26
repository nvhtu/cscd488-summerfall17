<?php
/**
 * Finalize all students' grades of an exam
 * Change all students' state in the exam and send them all email
 * @author: Tu Nguyen
 * @version: 1.0
 */
require_once "../util/sql_exe.php";
require_once "../auth/user_auth.php";
require_once "../util/send_mail.php";
require_once "../util/input_validate.php";

$requesterId = $_POST["requester_id"];
$requesterType = $_POST["requester_type"];
$requesterSessionId = $_POST["requester_session_id"];
$allowedType = array("Admin", "Teacher", "Student");

$examId = $_POST["exam_id"];

$examId = sanitize_input($examId);
validate_only_numbers($examId);

//User authentication
user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

changeAllStudentState($examId);
sendMailAll($examId);

function changeAllStudentState($examId)
{
    $sqlGetExamStudents = "SELECT student_id, passed, count(student_id) AS attempt
                            FROM exam_grade
                            WHERE student_id IN (SELECT student_id
                                                FROM exam_grade
                                                WHERE exam_id = :exam_id)
                            GROUP BY student_id";
    $sqlResultGetExamStudents = sqlExecute($sqlGetExamStudents, array(":exam_id"=>$examId), true);

    foreach ($sqlResultGetExamStudents as $theStudent)
    {
        $state = "";

        if($theStudent["passed"] == 1)
        {
            $state = "Passed";
        }
        else
        {
            //Check if the student has failed 3 times
            if($theStudent["attempt"] >= 3)
            {
                $state = "Blocked";
            }
            else {
                $state = "Ready";
            }
        }

        $sqlUpdateStudent = "UPDATE student
        SET state = :state
        WHERE student_id LIKE :student_id";
    
        sqlExecute($sqlUpdateStudent, array(':state'=>$state, ':student_id'=>$theStudent["student_id"]), False);
    }


    
}

function sendMailAll($examId)
{
    $sqlGetExamInfo = "SELECT exam.name, DATE_FORMAT(date, '%m/%d/%Y') AS date, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, location.name AS location_name
    FROM exam JOIN location ON (location = loc_id)
    WHERE exam.exam_id = :exam_id";
    $theExamInfo = sqlExecute($sqlGetExamInfo, array(":exam_id"=>$examId), true);
    
    $mailSubject = "Your APE grades are available";
    $mailMsg = "Grades are available now for the following APE:" .
    "<br><br>" .
    $theExamInfo[0]["name"] . " on " . $theExamInfo[0]["date"] . " at " . $theExamInfo[0]["start_time"] . " in " . $theExamInfo[0]["location_name"] .
    "<br><br>" .
    "Sign in to https://ape.compsci.ewu.edu/ to view your grades.";
    
    $sqlGetExamRoster = "SELECT f_name, l_name, email
                        FROM exam_roster JOIN user ON (student_id = user_id)
                        WHERE exam_id = :exam_id";
    $sqlResultExamRoster = sqlExecute($sqlGetExamRoster, array(":exam_id"=>$examId), true);
    
    foreach ($sqlResultExamRoster as $theStudent)
    {
        sendMail($theStudent, $mailSubject, $mailMsg);
    }
    
}


?>