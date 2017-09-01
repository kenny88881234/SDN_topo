<?php
$dbhost = 'localhost:3306';
$dbuser = 'root';
$dbpass = 'root';
$dbname = 'total_flow';

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

mysqli_query("SET NAMES 'UTF8'");

$sql = "Select * From total_flow_data";

$result = mysqli_query($conn, $sql);

while($row = mysqli_fetch_array($result)){
  echo $row['time'], " / ", $row['dpid'], " / ", $row['port_no'], " / ", $row['tx_flow'], " / ", $row['rx_flow']."<br>";
}

mysqli_close($conn);

?>
