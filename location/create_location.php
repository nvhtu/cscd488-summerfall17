<?php
	require "../pdoconfig.php";
	
	//$id = $_POST["id"];
	$name = $_POST["name"];
	$seats = $_POST["seats"];
	
	//validate input
	
	$conn = openDB($server, $database, $user, $pass, $conn);
	$sql = $conn->prepare("INSERT INTO location (name, seats) 
							VALUES ('$name', $seats)");
	
	try
	{
		$sql->execute();
	}
	catch (PDOException $e)
	{
		var_dump(http_response_code(400));
	}
	
	$conn = null;
?>