<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_GET["requester_id"]) || empty($_GET["requester_type"])){
		var_dump(http_response_code(400));
        die("Incomplete input.");
	}

	$requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	//Sanitize the input
	$requesterId = sanitize_input($requesterId);
	$requesterType = sanitize_input($requesterType);

	//Ensure input is well-formed
	validate_only_numbers($requesterId);

	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	if(!empty($_GET["loc_id"]))
	{
		$sqlResult = sqlExecute("SELECT * FROM location WHERE loc_id = :id",
					 array(":id" => $_GET["loc_id"]),
					 true);
	}
	else 
	{
		$sqlResult = sqlExecute("SELECT * FROM location",
					 array(),
					 true);
	}
	echo json_encode($sqlResult);
?>
