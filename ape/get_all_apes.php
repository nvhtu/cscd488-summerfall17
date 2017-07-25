<?php
/**
 * Create new exam
 * @author: Aaron Griffis
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";

    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    $sqlSelectExams = "SELECT * FROM exam";
    $data = array();

    $sqlResult = sqlExecute($sqlSelectExams, $data, true);
	echo json_encode($sqlResult);
?>