<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	
	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	//TODO: validate name, id, and seats are set/valid
	$id = $_POST["id"];
	$name = $_POST["name"];
	$seats = $_POST["seats"];
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	sqlExecute("UPDATE location SET name = :name, seats = :seats WHERE loc_id = :id",
				array(':name' => $name, ':seats' => $seats, ':id' => $id),
				false);
?>
