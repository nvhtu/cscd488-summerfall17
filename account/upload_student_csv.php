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



	$requesterId = $_POST["requester_id"];
	$teacherId = $requesterId;
	$requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher", "System");

    //if searchStr contains white space, split it into f_name and l_name


    //User authentication
	user_auth($requesterId, $requesterType, $allowedType);

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
			$num = count($data);
			if ($row>1)
			{
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

	function createInClassStudent($studentId, $teacherId)
	{
		$sqlInsertInClassStudent = "INSERT INTO in_class_student (student_id, teacher_id, start_date, end_date) 
									VALUES (:student_id, :teacher_id, :start_date, :end_date)";  
		sqlExecute($sqlInsertInClassStudent, array(':student_id'=>$studentId, ':teacher_id'=>$teacherId, ':start_date'=>$GLOBALS["settings"]["curQuarterStart"], ':end_date'=>$GLOBALS["settings"]["curQuarterEnd"]), False);
	}


?>    