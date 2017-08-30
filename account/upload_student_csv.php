<?php
/**
 * Search student accounts with a string
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";

    /*
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher", "System");
*/
    //if searchStr contains white space, split it into f_name and l_name


    //User authentication

    //Validate strings not empty

    //Validate strings


    var_dump($_FILES);


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
				var_dump($data);
				
							$sqlInsertUser = "INSERT INTO user (user_id, f_name, l_name, email) 
												VALUES (:id, :fname, :lname, :email)";  
							sqlExecute($sqlInsertUser, array(':id'=>$data[0], ':fname'=>$data[1], ':lname'=>$data[2], ':email'=>$data[3]), False);
							
							$state = "Ready";
							$sqlInsertStudent = "INSERT INTO student (student_id, state)
												VALUES (:id, :state)";
							sqlExecute($sqlInsertStudent, array(':id'=>$data[0], ':state'=>$state), False);
				
			}
			$row++;
			
		}
		fclose($handle);
	}

?>    