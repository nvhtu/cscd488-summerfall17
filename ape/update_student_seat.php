<?php
/**
 * Update the seat number of a student in an exam
 * @author: Tu Nguyen
 * @version: 1.0
 */

require_once "../auth/user_auth.php";
require_once "../util/sql_exe.php";
require_once "../util/input_validate.php";

$requesterId = $_POST["requester_id"];
$requesterType = $_POST["requester_type"];
$requesterSessionId = $_POST["requester_session_id"];

$examId = $_POST["exam_id"];
$studentId = $_POST["student_id"];
$seatNum = $_POST["seat_num"];

$allowedType = array("Admin", "Teacher");

//Sanitize the input
$examId = sanitize_input($examId);
$studentId = sanitize_input($studentId);
$seatNum = sanitize_input($seatNum);

//Ensure input is well-formed
validate_numbers_letters($studentId);
validate_only_numbers($examId);
validate_only_numbers($seatNum);

//User authentication
user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

$sqlUpdateSeat = "UPDATE exam_roster
                SET seat_num = :seat_num
                WHERE exam_id = :exam_id AND student_id LIKE :student_id";
sqlExecute($sqlUpdateSeat, array(":seat_num"=>$seatNum, ":exam_id"=>$examId, ":student_id"=>$studentId), false);

?>