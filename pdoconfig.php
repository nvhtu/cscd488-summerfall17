<?php
	$server="localhost";
	$user="root";
	$pass="";
	$database="ape_database";
	$conn = null;
	
	function openDB($servername, $dbname,$username, $password, $conn)
	{
		try
		{
			$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			$conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $conn;
		}
		catch (PDOExcetpion $e)
		{
			echo "Connection failed: " . $e->getMessage();
		}
	}
	
?>