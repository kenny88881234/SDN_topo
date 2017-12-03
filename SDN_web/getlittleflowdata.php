<?php
$dbhost = 'localhost:3306';
$dbuser = 'root';
$dbpass = 'root';
$dbname = 'total_flow';

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

mysqli_query("SET NAMES 'UTF8'");

$sql = "Select * From total_flow_data order by time desc limit 10";

$result = mysqli_query($conn, $sql);

while($row = mysqli_fetch_array($result)){
    $data_array[] = array (
	"time" => $row['time'],
	"dpid" => $row['dpid'],
	"port_no" => $row['port_no'],
	"tx_flow" => $row['tx_flow'],
	"rx_flow" => $row['rx_flow'],
	"speed_flow" => $row['speed_flow']
    );
}

echo $data_array = json_encode($data_array);

mysqli_close($conn);

?>
