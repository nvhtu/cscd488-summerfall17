<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	
	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	//TODO: validate name is set/valid
	$name = $_POST["name"];
	
	//echo "before auth";
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	sqlExecute("INSERT INTO category (name) VALUES (:name)",
				array(':name' => $name),
				false);
?>
