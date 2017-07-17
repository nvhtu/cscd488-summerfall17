<?php
    //require "../pdoconfig.php";

    function admin_auth($auth_id, $auth_type, $server, $database, $user, $pass, $conn)
    {
        $conn = openDB($server, $database, $user, $pass, $conn);

        if(strcmp($auth_type, 'Student') == 0)
        {
            $sql = $conn->prepare("SELECT COUNT(id) as count
                                FROM student
                                WHERE id = '$auth_id'");

            $sql->execute();
            $sqlResult = $sql->fetchAll(PDO::FETCH_ASSOC);

            if($sqlResult[0]["count"] == 0)
            {
                var_dump(http_response_code(400));
                $conn = null;
                die("Unauthorized access");
            }
        }
        else 
        {
            $sql = $conn->prepare("SELECT type
                                FROM account
                                WHERE id = '$auth_id'");

            $sql->execute();
            $sqlResult = $sql->fetchAll(PDO::FETCH_ASSOC);

            //echo json_encode($sqlResult);
            //echo count ($sqlResult);

            $isAuth = False;

            for($i=0; $i<count($sqlResult); $i++)
            {
                if(strcmp($auth_type, $sqlResult[$i]["type"]) == 0)
                    $isAuth = True;
            }

            if(!$isAuth)
            {
                echo "False";
                var_dump(http_response_code(400));
                $conn = null;
                die("Unauthorized access");
                
            }
        }   
    }
?>