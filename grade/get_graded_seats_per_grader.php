<?php
/**
 * Get the total graded seats of an assigned grader per exam
 * @author: Tu Nguyen
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";

    if(empty($_GET["requester_id"]) || empty($_GET["requester_type"])){
		http_response_code(400);
        die("Incomplete input.");
	}
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $requesterSessionId = $_GET["requester_session_id"];
    $allowedType = array("Grader", "Admin", "Teacher");

    $graderExamCatIdsArr = $_GET["grader_exam_cat_ids"];
    
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    $whereArgs = array();
    $sqlDataArr = array();

    for($i=0; $i<count($graderExamCatIdsArr); $i++)
    {
        $whereArgs[$i] = "grader_exam_cat_id = " . ":id" . $i;
        $sqlDataArr[":id" . $i] = $graderExamCatIdsArr[$i];
    }

    $whereClause = implode(' OR ', $whereArgs);

    $sqlSelectGradedSeats = "SELECT *
    FROM category_grade 
    WHERE " . $whereClause;

    $sqlResult = sqlExecute($sqlSelectGradedSeats, $sqlDataArr, true);

    echo json_encode($sqlResult);
    

    
?>    