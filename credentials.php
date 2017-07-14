<?php
	$serverName="localhost";
	$user="root";
	$pass="";
	$database="ape_database";
	
	$connection = new PDO("mysql:host=$serverName;dbname=$database", $user, $pass);
	$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>