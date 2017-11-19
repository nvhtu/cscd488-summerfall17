<?php
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/check_id.php";
    require_once "../util/input_validate.php";

    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $requesterSessionId = $_GET["requester_session_id"];
   
    $allowedType = array("Admin", "Teacher", "System");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    if(strcmp($requesterType,"System") != 0)
    {
        $studentId = $_GET["student_id"];
        $examCatId = $_GET["exam_cat_id"];

          //Sanitize the input
          $studentId = sanitize_input($studentId);
          $examCatId = sanitize_input($examCatId);
  
          //Ensure input is well-formed
          validate_numbers_letters($studentId);

        echo json_encode(getStudentFinalCatGrade($studentId, $examCatId));

    }

    function getStudentFinalCatGrade($studentId, $examCatId)
    {
        $sqlSelectGrade = "SELECT final_grade, comment, CONCAT(u.f_name,' ',u.l_name) AS edited_by
                            FROM student_cat_grade scg
                            JOIN user u ON (scg.edited_by = u.user_id)
                            WHERE student_id LIKE :student_id AND exam_cat_id = :exam_cat_id";

        $data = array(':student_id' => $studentId, ':exam_cat_id' => $examCatId);
        return sqlExecute($sqlSelectGrade, $data, true);
    }
?>