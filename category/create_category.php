<?php
	require "../pdoconfig.php";
	
	//$id = $_POST["id"];
	$name = $_POST["name"];
	
	//validate input
	
	$conn = openDB($server, $database, $user, $pass, $conn);
	$sql = $conn->prepare("INSERT INTO category (name) 
							VALUES ('$name')");
	
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