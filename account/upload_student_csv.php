<?php
/**
 * Search student accounts with a string
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require_once "../auth/user_auth.php";
	require_once "../util/sql_exe.php";
	require_once "../util/check_id.php";
	require_once "../settings/init_settings.php";
	require_once "../util/input_validate.php";


	$requesterId = $_POST["requester_id"];
	$teacherId = $requesterId;
	$requesterType = $_POST["requester_type"];
	$requesterSessionId = $_POST["requester_session_id"];
	$allowedType = array("Admin", "Teacher", "System");
	
	//Sanitize the input
	$teacherId = sanitize_input($teacherId);
    
	//Ensure input is well-formed
	validate_numbers_letters($teacherId);

    //User authentication
	user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    //Validate strings not empty

    //Validate strings

	if(!isset($GLOBALS["settings"]))
	initializeSettings();

    $target_dir = "../../upload/";
	$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
	$uploadOk = 1;
	$fileType = pathinfo($target_file,PATHINFO_EXTENSION);

    // Check if file already exists
    /*
	if (file_exists($target_file)) {
		echo "Sorry, file already exists.";
		$uploadOk = 0;
    }
    */

	// Check file size
	if ($_FILES["fileToUpload"]["size"] > 500000) {
		echo "Sorry, your file is too large.";
		$uploadOk = 0;
	}
	// Allow certain file formats
	if($fileType != "csv") {
		echo "Sorry, only .csv files are allowed.";
		$uploadOk = 0;
	}
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		echo " Your file was not uploaded.";
	// if everything is ok, try to upload file
	} else {
		/*
		if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
			echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
		} else {
			echo "Sorry, there was an error uploading your file.";
		}
		*/
	}

	$_POST["requester_id"] = "999999";
	$_POST["requester_type"] = "System";
	require_once "../account/create_account.php";

	//Reading csv file
	$theFile = fopen($_FILES["fileToUpload"]["tmp_name"], "r");
	$row = 1;
	if (($handle = $theFile) !== FALSE) 
	{
		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) 
		{
			for($i=0; $i<count($data); $i++)
			{
				$data[$i] = sanitize_input($data[$i]);
			}

			checkCSVFormat($data, $row);
			$num = count($data);
			if ($row>1)
			{
				validate_numbers_letters($data[0]);
				validate_name($data[1]);
				validate_name($data[2]);
		
				if(!isset($data[3]))
				{
					$data[3] = NULL;
				}
				else
				{
					validate_email($data[3]);
				}

				if(checkUserExists($data[0]))
				{
					if(checkStudentExists($data[0]))
					{
						if(checkInClassStudentExists($data[0], $teacherId, $GLOBALS["settings"]["curQuarterStart"], $GLOBALS["settings"]["curQuarterEnd"]))
						{
							echo "\nStudent ID " . $data[0] . ", " . $data[1] . " " . $data[2] . ", is already in your class.\n";
						}
						else
						{
							//Insert to in_class_student table
							createInClassStudent($data[0], $teacherId);
							
							echo "\nStudent ID " . $data[0] . ", " . $data[1] . " " . $data[2] . ", account already exists and has been added to your class.\n";
						}
					}
					else
					{
						//Insert to student table
						createStudentAccount($data[0], "Ready");
						//Insert to in_class_student table
						createInClassStudent($data[0], $teacherId);

						echo "\nStudent ID " . $data[0] . ", " . $data[1] . " " . $data[2] . ", account already exists and has been added to your class.\n";
					}
				}
				else 
				{
					//Insert new user
					createAccount($data[0],$data[1],$data[2],$data[3]);
					//Insert to student table
					createStudentAccount($data[0], "Ready");
					//Insert to in_class_student table
					createInClassStudent($data[0], $teacherId);

					echo "\nStudent ID " . $data[0] . ", " . $data[1] . " " . $data[2] . ", account is succesfully created and added to your class.\n";
				}
			}
			$row++;
			
		}
		fclose($handle);
	}

	function checkCSVFormat($data, $row)
	{

		if($row==1)
		{
			if(count($data) != 4)
			{
				echo "Your CSV file is not in the correct format.";
				http_response_code(400);
				die();
			}

			$error = false;

			if ($data[0] != "EWU ID")
				$error = true;
			
			if ($data[1] != "First Name")
				$error = true;
			
			if ($data[2] != "Last Name")
				$error = true;
			
			if ($data[3] != "Email")
				$error = true;

			if ($error == true)
			{
				echo "Your CSV file header is not in the correct format.";
				http_response_code(400);
				die();
			}

		}

	
	}


?>    