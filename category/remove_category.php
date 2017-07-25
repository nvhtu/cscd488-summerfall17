<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	
	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin");
	
	//TODO: validate name and seats are set/valid
	$id = $_POST["id"];
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	sqlExecute("DELETE FROM category WHERE cat_id = :id",
				array(':id' => $id),
				false);
?>