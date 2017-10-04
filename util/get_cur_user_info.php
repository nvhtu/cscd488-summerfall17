<?php
    if(isset($_GET["is_client"]))
    {
        $isClient = $_GET["is_client"];
        getCurUserInfo($isClient);
    }
    
    

    function getCurUserInfo($isClient)
    {

        $isDev = True;
        $userInfo = array();

        if($isDev)
        {
            $userInfo = array('userId' => '3333', 
            'userType' => 'Student', 
            'userSession' => '111111',
            'userFname' => 'Tu',
            'userLname' => 'Nguyen',
            'userEmail' => 'abc@xyz.com');
        }
        else 
        {
            session_start();
            $userInfo = array('userId' => $_SESSION['ewuid'], 
                              'userType' => $_SESSION["phpCAS"]["attributes"]["UserType"], 
                              'userSession' => session_id(),
                              'userFname' => $_SESSION["phpCAS"]["attributes"]["FirstName"],
                              'userLname' => $_SESSION["phpCAS"]["attributes"]["LastName"],
                              'userEmail' => $_SESSION["phpCAS"]["attributes"]["Email"] );
        }

        //user_auth($userInfo['userId'], $userInfo['userType'], array("Admin", "Teacher", "Student", "System"));
    
        
        if($isClient)
        {
            echo json_encode($userInfo);
        }
        else {
            return $userInfo;
        }
        
    }


?>