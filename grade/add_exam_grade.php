<?php
/**
 * Add exam overall grade for a student
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/check_id.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher", "System");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    if(strcmp($requesterType,"System") != 0)
    {
        $examId = $_POST["exam_id"];
        $studentId = $_POST["student_id"];
        $grade = $_POST["grade"];
        $passed = $_POST["passed"];

        //Sanitize the input
        $examId = sanitize_input($examId);
        $studentId = sanitize_input($studentId);
        $grade = sanitize_input($grade);
        $passed = sanitize_input($passed);

        //Ensure input is well-formed
        validate_numbers_letters($studentId);
        validate_only_numbers($examId);
        validate_only_numbers($grade);

        checkExamExists($examId);
        checkStudentExists($studentId);

        addExamGrade($examId, $studentId, $grade, $passed);

    }


    function addExamGrade($examId, $studentId, $grade, $passed)
    {
    //Add student exam grade
    $sqlAddExamGrade = "INSERT INTO exam_grade(exam_id, student_id, grade, passed)
                        VALUES (:exam_id, :student_id, :grade, :passed)
                        ON DUPLICATE KEY UPDATE grade = :grade, passed = :passed";
    
    sqlExecute($sqlAddExamGrade, array(':exam_id'=>$examId, ':student_id'=>$studentId, ':grade'=>$grade, ':passed'=>$passed), False);

    }

    //adds all final category scores for this student and returns sum
    function calculateExamTotalGrade($examId, $studentId)
    {
        $sqlGetFinalCatGrades = "SELECT SUM(final_grade) as total_grade
                                FROM student_cat_grade
                                WHERE student_id LIKE :student_id AND exam_cat_id IN (SELECT exam_cat_id
                                                                                    FROM exam_category ec
                                                                                    WHERE ec.exam_id = :exam_id)";

        $sqlResultFinalCatGrades = sqlExecute($sqlGetFinalCatGrades, array(':exam_id'=>$examId, ':student_id'=>$studentId), True);
        if(count($sqlResultFinalCatGrades) != 0 && $sqlResultFinalCatGrades[0]["total_grade"] != null)
        {
            return $sqlResultFinalCatGrades[0]["total_grade"];
        }
        else {
            return -1;
        }
    }

    //checks if the passed in grade is greater than or equal to the passing grade for the exam
    function isExamGradePassed($examId, $totalGrade)
    {
        if($totalGrade >= 0)
        {
            $sqlGetExamPassGrade = "SELECT passing_grade
                                    FROM exam
                                    WHERE exam_id = :exam_id";
            $sqlResultExamPassGrade = sqlExecute($sqlGetExamPassGrade, array("exam_id"=>$examId), true);
            if ($totalGrade < $sqlResultExamPassGrade[0]["passing_grade"])
            {
                return 0;
            }
            else
            {
                return 1;
            }
        }
    }

?>    