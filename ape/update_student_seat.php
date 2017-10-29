<?php
/**
 * Update the seat number of a student in an exam
 * @author: Tu Nguyen
 * @version: 1.0
 */

require "../auth/user_auth.php";
require "../util/sql_exe.php";

$requesterId = $_POST["requester_id"];
$requesterType = $_POST["requester_type"];

$examId = $_POST["exam_id"];
$studentId = $_POST["student_id"];
$seatNum = $_POST["seat_num"];

$allowedType = array("Admin", "Teacher");


//User authentication
user_auth($requesterId, $requesterType, $allowedType);

$sqlUpdateSeat = "UPDATE exam_roster
                SET seat_num = :seat_num
                WHERE exam_id = :exam_id AND student_id LIKE :student_id";
sqlExecute($sqlUpdateSeat, array(":seat_num"=>$seatNum, ":exam_id"=>$examId, ":student_id"=>$studentId), false);

?>