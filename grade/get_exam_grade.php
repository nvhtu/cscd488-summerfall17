<?php
/**
 * Get exam overall grade and pass/fail status of a student
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    require_once "check_id.php";
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");

    $studentId = $_GET["student_id"];
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    checkStudentExists($studentId);

    //A student can only get his/her own grade
    if(strcmp($requesterType,"Student") == 0)
    {
        if(strcmp($requesterId,$studentId) != 0)
        {
            var_dump(http_response_code(400));
            die("Unauthorized access. A student can't request other student's grade.");
        }
    }

    //Get student exam grade
    $sqlGetExamGrade = "SELECT student_id, f_name, l_name, grade, passed
                        FROM exam_grade JOIN user ON exam_grade.student_id = user.user_id
                        WHERE student_id = :student_id";
    
    $sqlResult = sqlExecute($sqlGetExamGrade, array('student_id'=>$studentId), True);
    
    echo json_encode($sqlResult);


?>    