<?php
/**
 * Finalize all student's grades of an exam
 * Right now, it just sends out email to all students because grades
 * have been added to student_cat
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

?>