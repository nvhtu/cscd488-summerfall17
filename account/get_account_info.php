<?php
/**
 * Get account info (Teacher, Grader, and Student account)
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");

    $request = $_GET["request"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings

    switch ($request)
    {
        case ("get_own"): getOwnAccount($requesterId, $requesterType);
                         break;
        case ("get_by_id"): //Student and Grader can't request account info other than their own
                            if(strcmp($requesterType, "Student") == 0 || strcmp($requesterType, "Grader") == 0) 
                            {
                                var_dump(http_response_code(400));
                                die("Unauthorized access. Your account type can't use this function.");
                            }
                            else 
                            {
                                getAccountById();
                            }
                            break;
        default: var_dump(http_response_code(400));
                echo "Unrecognized request string.";
    }

    /**
    * Gets acount info the requester
    * @param: $requesterId requester ID
    * @param: $requesterType requester acount type
    * @return: void
    */
    function getOwnAccount($requesterId, $requesterType)
    {

        $sqlResult;

        if(strcmp($requesterType, "Student") == 0)
        {
            $sqlResult = getStudentInfo($requesterId);
        }
        else 
        {
            $sqlResult = getNonStudentInfo($requesterId);
        }
        
        echo $sqlResult;
        
    }

    /**
    * Gets acount info using an account id
    * @return: void
    */
    function getAccountById()
    {
        $id = $_GET["id"];


        $sqlCountStudent = "SELECT COUNT(student_id) as count
                                    FROM student
                                    WHERE student_id = :id";

        $sqlResult = sqlExecute($sqlCountStudent, array(':id'=>$id), True);

        if($sqlResult[0]["count"] == 0)
        {
            echo getNonStudentInfo($id);
        }
        else 
        {
            echo getStudentInfo($id);   
        }
    }

    /**
    * Gets student account info and state
    * @return: string json
    */
    function getStudentInfo($id)
    {
        $sqlGetAccount = "SELECT *
                         FROM user
                         WHERE user_id = :id";

        $sqlResult = sqlExecute($sqlGetAccount, array('id'=>$id), True);

        if(count($sqlResult) == 0)
            return "NULL";

        //get Student state
        $sqlGetState = "SELECT state
                        FROM student
                        WHERE student_id = :id";
        $sqlResultState = sqlExecute($sqlGetState, array('id'=>$id), True);
            
        $sqlResult[0]["state"] = $sqlResultState[0]["state"];
        $sqlResult[0]["type"] = array("Student");

        return json_encode($sqlResult);
    }

    /**
    * Gets admin or teacher or grader account info and type
    * @return: string json
    */
    function getNonStudentInfo($id)
    {
        $sqlGetAccount = "SELECT *
                         FROM user
                         WHERE user_id = :id";

        $sqlResult = sqlExecute($sqlGetAccount, array('id'=>$id), True);

        if(count($sqlResult) == 0)
            return "NULL";

        $sqlResult[0]["type"] = array();
           
        //get account type
        $sqlGetType = "SELECT type
                        FROM account
                        WHERE account_id = :id";
        $sqlResultType = sqlExecute($sqlGetType, array('id'=>$id), True);

        //type is stored as an array
        for ($i=0; $i<count($sqlResultType); $i++)
        {
            array_push($sqlResult[0]["type"], $sqlResultType[$i]["type"]);
        }       

        return json_encode($sqlResult);
    }

?>    