<?php
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Europe/London');

$conn_string = "host=pgcsip49140d port=4914 dbname=db_a1086 user=a1086_CAT_read password=a1086_CAT_read";

if (!$conn = pg_connect($conn_string)) {
  echo "A connection error occurred.\n";
  exit;
}




//$params[1] = $_GET['columns']; //Momenteel performance
//$params[1] = $_GET['charts'];

$params[1] = $_GET['line']; //Momenteel performance
$params[2] = $_GET['track'];
$params[3] = $_GET['tables']; //One atm

//$params[3] = ($_GET['kpName']+1)*1000+$_GET['kpM'];
//$params[4] = ($_GET['kpName']-1)*1000+$_GET['kpM'];
$result = pg_query($conn, "SELECT * FROM \"" . $params[3] ."\" WHERE \"Line code\"=". $params[1] ." AND \"Track code\"=". $params[2]);
// $i = pg_num_fields($result);
//  for ($j = 0; $j < $i; $j++) {
//      $fieldname = pg_field_name($result, $j);
//      echo "fieldname: $fieldname\n";
//  }



if (!$result) {
  echo "An error occurred fetching the row from the db.\n";
  exit;
}



	$resultArray = pg_fetch_all($result);
        
	$resultArray = json_encode($resultArray);
        
        
        
     
?>