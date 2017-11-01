<?php
/**
 * Sets values of global settings array
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require_once "../util/sql_exe.php";
    function initializeSettings()
    {
        $sqlResult = sqlExecute("SELECT * FROM admin_setting",
                     array(),
                     true);


        $GLOBALS["settings"] = array_reduce($sqlResult, "sqlArrReduce");
        getCurQuarterDates();
    }

    function sqlArrReduce($obj, $item)
    {
        $obj[$item["name"]] = $item["value"];
        return $obj;
    }

    function getCurQuarterDates()
    {
        //---Get current quarter start and end dates
        $today = date("Y-m-d");
        $curQuarterStart = "";
        $curQuarterEnd = "";
        $quarterStartName = "";
        $quarterStartCount = 0;

        $sortedQuarterDatesArr = array(0=>$GLOBALS["settings"]["fallStart"],
                                       1=>$GLOBALS["settings"]["fallEnd"],
                                       2=>$GLOBALS["settings"]["winterStart"],
                                       3=>$GLOBALS["settings"]["winterEnd"],
                                       4=>$GLOBALS["settings"]["springStart"],
                                       5=>$GLOBALS["settings"]["springEnd"],
                                       6=>$GLOBALS["settings"]["summerStart"],
                                       7=>$GLOBALS["settings"]["summerEnd"],);

        for($i=0; $i < count($sortedQuarterDatesArr); $i++)
        {
            if($today >= $sortedQuarterDatesArr[$i] && $i%2 == 0)
            {
                $curQuarterStart = $sortedQuarterDatesArr[$i];
                $quarterStartName = key($sortedQuarterDatesArr);
                $quarterStartCount = $i;
            }
            else
            if(strcmp($curQuarterStart,"") != 0)
            {
                $curQuarterEnd = $sortedQuarterDatesArr[$quarterStartCount+1];
            }
            
        }

        //check if today doesn't fall into any quarter range (meaning we're on the break ;) )
        if($today > $curQuarterEnd || strcmp($curQuarterStart,"") == 0)
        {
            $GLOBALS["settings"]["curQuarterStart"] = "";
            $GLOBALS["settings"]["curQuarterEnd"] = "";
        }
        else 
        {
            $GLOBALS["settings"]["curQuarterStart"] = $curQuarterStart;
            $GLOBALS["settings"]["curQuarterEnd"] = $curQuarterEnd;
        }

       
    }
?>