<?php
/**
 * Get exam overall grade and pass/fail status of a student
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/check_id.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $requesterSessionId = $_GET["requester_session_id"];
 
    $allowedType = array("Admin", "Teacher", "Student");

    $studentId = $_GET["student_id"];

      //Sanitize the input
      $studentId = sanitize_input($studentId);
      
      //Ensure input is well-formed
      validate_numbers_letters($studentId);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    checkStudentExists($studentId);

    //A student can only get his/her own grade
    if(strcmp($requesterType,"Student") == 0)
    {
        if(strcmp($requesterId,$studentId) != 0)
        {
            http_response_code(401);
            die("Unauthorized access. A student can't request other student's grade.");
        }
    }

    //Get student exam grade
    $sqlGetExamGrade = "SELECT student_id, f_name, l_name, grade, passed
                        FROM exam_grade JOIN user ON exam_grade.student_id LIKE user.user_id
                        WHERE student_id LIKE :student_id";
    
    $sqlResult = sqlExecute($sqlGetExamGrade, array('student_id'=>$studentId), True);
    
    echo json_encode($sqlResult);


?>    