<?php
/**
 * This is the last line of defense of the API. 
 * It checks if a passed-in account id and type is existed AND is allowed in caller function.
 * Script execution is stopped immediately if either of mentioned conditions is false.
 * @author: Tu Nguyen
 * @version: 1.0
 */

    require_once "../pdoconfig.php";

    /**
     * Checks account is existed and type is allowed
     * @param string $requesterId requester id
     * @param string $requesterType requester type
     * @param array $allowedType type(s) that allowed to use the caller function
     * @return boolean
     */
    function user_auth($requesterId, $requesterType, $allowedType)
    {
            $conn = openDB();
            $isAuth = False;

            if(strcmp($requesterType, "Student") == 0) //Student account
            {
                $sqlCountStudent = "SELECT COUNT(student_id) as count
                                    FROM student
                                    WHERE student_id = :requester_id";

                $sqlResult = sqlExecute($sqlCountStudent, array(':requester_id'=>$requesterId), True);

                if($sqlResult[0]["count"] == 0)
                {
                    var_dump(http_response_code(400));
                    $conn = null;
                    die("Unauthorized access. Account does not exist.");
                }
            }
            else //Admin, Grader, Teacher account
            {
                $sqlSelectAccount = "SELECT type
                                    FROM account
                                    WHERE account_id = :requester_id";

                $sqlResult = sqlExecute($sqlSelectAccount, array(':requester_id'=>$requesterId), True);

                //echo json_encode($sqlResult);
                //echo count ($sqlResult);    

                //Checks if passed-in type matches type in database.
                for($i=0; $i<count($sqlResult); $i++)
                {
                    if(strcmp($requesterType, $sqlResult[$i]["type"]) == 0)
                        $isAuth = True;
                }

                if(!$isAuth)
                {
                    //echo "False";
                    var_dump(http_response_code(400));
                    $conn = null;
                    die("Unauthorized access. Account does not exist.");
                    
                }
            }

            //Check if passed-in type is allowed to use the caller function
            for($i=0; $i<count($allowedType); $i++)
            {
                if(strcmp($requesterType, $allowedType[$i]) == 0)
                {
                    $isAuth = True;
                    break;
                }
                else 
                {
                    $isAuth = False;
                }
            }

            if(!$isAuth)
            {
                //echo "False";
                var_dump(http_response_code(400));
                $conn = null;
                die("Unauthorized access. Your account type can't use this function.");
                
            }
            else
            {
                return True;
            }      
    }
?>