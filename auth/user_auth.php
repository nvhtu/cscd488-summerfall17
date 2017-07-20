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

            $sql = $conn->prepare("SELECT type
                                FROM account
                                WHERE account_id = :auth_id");

            $sql->execute(array(':auth_id'=>$requesterId));
            $sqlResult = $sql->fetchAll(PDO::FETCH_ASSOC);

            //echo json_encode($sqlResult);
            //echo count ($sqlResult);

            $isAuth = False;

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