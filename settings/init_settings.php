<?php
/**
 * Sets values of global settings array
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require_once "../util/sql_exe.php";
    function initializeSettings(){
        $sqlResult = sqlExecute("SELECT * FROM admin_setting",
                     array(),
                     true);
        $GLOBALS["settings"] = $sqlResult;
    }
?>