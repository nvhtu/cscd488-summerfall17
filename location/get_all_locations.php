<?php
/**
 * Get all locations or one specified by loc_id
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_GET["requester_id"]) || empty($_GET["requester_type"])){
		http_response_code(400);
        die("Incomplete input.");
	}

	$requesterId = $_GET["requester_id"];
	$requesterType = $_GET["requester_type"];
	$requesterSessionId = $_GET["requester_session_id"];
    $allowedType = array("Admin", "Teacher", "Student", "000");

	//User authentication
	user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);
	
	//get single location by id
	if(!empty($_GET["loc_id"]))
	{
		$sqlResult = sqlExecute("SELECT * FROM location WHERE loc_id = :id",
					 array(":id" => $_GET["loc_id"]),
					 true);
	}
	//get all locations
	else 
	{
		$sqlResult = sqlExecute("SELECT * FROM location",
					 array(),
					 true);
	}
	echo json_encode($sqlResult);
?>
