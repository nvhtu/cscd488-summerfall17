<?php
/**
 * Get all exam_cats and corresponding cat names with passed in exam_id
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require_once "../util/sql_exe.php";
    require_once "../auth/user_auth.php";
    require_once "../util/input_validate.php";
    
    if(empty($_GET["requester_id"]) || empty($_GET["requester_type"]) || empty($_GET["exam_id"])){
		http_response_code(400);
        die("Incomplete input.");
	}
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $requesterSessionId = $_GET["requester_session_id"];
    $allowedType = array("Admin", "Teacher");

    $examId = $_GET["exam_id"];

    //Sanitize the input
    $examId = sanitize_input($examId);

    validate_only_numbers($examId);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    //Get 
    $sql = "SELECT * 
            FROM exam_category NATURAL JOIN category
            WHERE exam_id = :exam_id";
    
    $sqlResult = sqlExecute($sql, array(':exam_id'=>$examId), True);
    
    echo json_encode($sqlResult);
?>    