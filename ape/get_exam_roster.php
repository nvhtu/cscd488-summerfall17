<?php
/**
 * Get an exam roster
 * @author: Tu Nguyen
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";

    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $examId = $_GET["exam_id"];
    $allowedType = array("Admin", "Teacher");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    $sqlGetRoster = "SELECT student_id, f_name, l_name, seat_num
    FROM exam_roster JOIN user ON exam_roster.student_id = user.user_id
    WHERE exam_id = :exam_id";

    $sqlResult = sqlExecute($sqlGetRoster, array(":exam_id"=>$examId), true);
    echo json_encode($sqlResult);

?>