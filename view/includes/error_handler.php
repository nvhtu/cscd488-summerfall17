<?php
    function loadErrorPage ($errorCode)
    {
        $isError = true;
        $errorMsg = "";
        $page = "home";

        switch($errorCode)
        {
            case "401": $errorMsg = "Unauthorized Access";
                        break;
        }

        require_once "../index.php";
        die();
    }
?>