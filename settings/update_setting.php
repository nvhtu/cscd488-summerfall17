<?php
/**
 * Update one setting
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
    require_once "../util/input_validate.php";
    require_once "./init_settings.php";
	
	if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || empty($_POST["name"]) || empty($_POST["value"])){
		http_response_code(400);
        die("Incomplete input.");
	}

	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];$requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin");

	$name = $_POST["name"];
    $value = $_POST["value"];
	
	//Sanitize the input
	$name = sanitize_input($name);
	$value = sanitize_input($value);

    //Ensure input is well-formed
    
    //Start or end date of quarter
    if(strpos($name, "Start") !== false || strpos($name, "End") !== false){
        validate_date($value);
    }
    //contact email
    else if(strpos($name, "Email") !== false){
        validate_email($value);
    }
    //contact name
    else if(strpos($name, "Name") !== false){
        validate_name($value);
    }
    //point diff range, max graders per category
    else{
        validate_only_numbers($value);
    }

	//User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    //update setting in database
	sqlExecute("UPDATE admin_setting SET value = :value WHERE name = :name",
				array(':name' => $name, ':value' => $value),
                False);

    //if global settings array has not been initialized, do so
    if(!isset($GLOBALS["settings"]))
        initializeSettings();

    //update setting in array
    $GLOBALS["settings"][$name] = $value;
?>
