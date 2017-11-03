<?php
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/check_id.php";

    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
   
    $allowedType = array("Admin", "Teacher", "System");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    if(strcmp($requesterType,"System") != 0)
    {
        $studentId = $_GET["student_id"];
        $examCatId = $_GET["exam_cat_id"];

        echo json_encode(getStudentFinalCatGrade($studentId, $examCatId));

    }

    function getStudentFinalCatGrade($studentId, $examCatId)
    {
        $sqlSelectGrade = "SELECT final_grade, comment
                            FROM student_cat_grade
                            WHERE student_id LIKE :student_id AND exam_cat_id = :exam_cat_id";

        $data = array(':student_id' => $studentId, ':exam_cat_id' => $examCatId);
        return sqlExecute($sqlSelectGrade, $data, true);
    }
?>