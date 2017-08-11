<?php
/**
 * Util that combines 3 steps of executing a SQL query.
 * @author: Tu Nguyen
 * @version: 1.0
 */
    require_once "../pdoconfig.php";

    /**
     * Executes a SQL query
     * @param boolean $isDataReturned indicates whether the query is expected to return data (e.g. SELECT statement or GET request).
     * @param string $query query to execute
     * @param array $valueArr array of values to fill in placeholders in the query
     * @return array or boolean
     */
    function sqlExecute ($query, $valueArr, $isDataReturned)
    {
        $conn = openDB();
        $sql = $conn->prepare($query);

        try
        {
            $sqlResult = $sql->execute($valueArr);
        }
        catch (PDOException $e)
        {
            echo $e->getMessage();
            var_dump(http_response_code(400));
            $conn = null;
            die();
        }
        
        if($isDataReturned)
        {
            $sqlResult = $sql->fetchall(PDO::FETCH_ASSOC);
            $conn = null;
            return $sqlResult;
        }
        else 
        {
            if(strcmp(explode(" ", $query, 1)[0], "INSERT"))
            {
                $sqlResult = $conn->lastInsertId();
                $conn = null;
                return $sqlResult;
            }
            else 
            {
                $conn = null;
                return $sqlResult;
            }
            
        }
        
    }
?>