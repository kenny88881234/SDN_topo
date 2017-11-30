<?php

ignore_user_abort(true);
set_time_limit(0);

header("Location:everydaylimit.html");

while(1) {
$dbhost = 'localhost:3306';
$dbuser = 'root';
$dbpass = 'root';
$dbname = 'total_flow';

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

mysqli_query("SET NAMES 'UTF8'");

$sql = "Select * From total_flow_data";

$result = mysqli_query($conn, $sql);

while($row = mysqli_fetch_array($result)){
    
    $data_array[$row['dpid']][$row['port_no']][] = array (
        "time" => $row['time'],
        "dpid" => $row['dpid'],
        "port_no" => $row['port_no'],
        "tx_flow" => $row['tx_flow'],
        "rx_flow" => $row['rx_flow'],
	"total_flow" => $row['tx_flow']+$row['rx_flow']
    );
}

mysqli_close($conn);

$myfile = fopen("topo_data.json", "r") or die("Unable to open file!");
$content = '';
while (!feof($myfile)) {
    $content .= fread($myfile, filesize("topo_data.json"));
}
fclose($myfile);

$content = json_decode($content);

$file = fopen("everydaylimit.json", "r") or die("Unable to open file!");
$limit = '';
while (!feof($file)) {
    $limit .= fread($file, filesize("everydaylimit.json"));
}
fclose($file);

$limit = json_decode($limit);

$service_url = 'http://192.168.2.105:8080/qos/rules/0000000000000001';
 
$curl = curl_init();
$header[] = "Accept: application/json";
$header[] = "Accept-Encoding: gzip";
$header[] = "Content-Type:application/json";
curl_setopt($curl, CURLOPT_URL, $service_url);
curl_setopt($curl, CURLOPT_HTTPHEADER, $header );

foreach($content->host as $value) {
    if($value->port->port_no == '00000002') {
        $ip[1][1] = $value->ipv4[0];
    }
    if($value->port->port_no == '00000003') {
        $ip[1][2] = $value->ipv4[0];
    }
    if($value->port->port_no == '00000004') {
        $ip[1][3] = $value->ipv4[0];
    }
}

for($i=1;$i<=3;$i++) {
    if($limit->{'1'}->{$i}->limit == 0 or $limit->{'1'}->{$i}->limit == null) {
	continue;
    }
    if($ip[1][$i] == '') {
	continue;
    }
    if($limit->{'1'}->{$i}->limit*1000000000 <= $data_array[1][$i+1][count($data_array[1][$i+1])-1]['total_flow']) {
        $curl_post_data = array(
            'priority' => '1',
            'match' => array('nw_dst' => $ip[1][$i]),
            'actions' => array('queue' => $limit->{'1'}->{$i}->limitnum)
        );
        $curl_post_data = json_encode($curl_post_data);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
        $curl_response = curl_exec($curl);

        if ($curl_response === false) {
            $info = curl_getinfo($curl);
            curl_close($curl);
            die('error occured during curl exec. Additioanl info: ' . var_export($info));
        }

        curl_close($curl);
    }
    echo '123';
}
}
/*
if($ip1 != '') {
    if($limit[1][1]->limit*1000000000 <= $data_array[1][2][count($data_array[1][2])-1]['total_flow']) {
	$curl_post_data = array(
            'priority' => '1',
            'match' => array('nw_dst' => $ip1),
            'actions' => array('queue' => '3')
        );

        $curl_post_data = json_encode($curl_post_data);
 
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
        $curl_response = curl_exec($curl);
 
        if ($curl_response === false) {
            $info = curl_getinfo($curl);
            curl_close($curl);
            die('error occured during curl exec. Additioanl info: ' . var_export($info));
        }
 
        curl_close($curl);
    }
}

if($limit2 != 0 and $limit2 != null) { 
    foreach($content->host as $value) {
        if($value->port->port_no == '00000003') {
            $ip2 = $value->ipv4[0];
        }
    }
    if($ip2 != '') {
        echo 'port2 set success';
        if($limit2*1000000000 <= $data_array[1][3][count($data_array[1][3])-1]['total_flow']) {
            $curl_post_data = array(
            'priority' => '1',
            'match' => array('nw_dst' => $ip2,
            'actions' => array('queue' => '3')
            );

            $curl_post_data = json_encode($curl_post_data);
 
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
            $curl_response = curl_exec($curl);
 
            if ($curl_response === false) {
                $info = curl_getinfo($curl);
                curl_close($curl);
                die('error occured during curl exec. Additioanl info: ' . var_export($info));
            }
 
            curl_close($curl);
        }
    }
}

if($limit3 != 0 and $limit3 != null) {
    foreach($content->host as $value) {
        if($value->port->port_no == '00000004') {
            $ip3 = $value->ipv4[0];
        }
    }
    if($ip3 != '') {
        echo 'port3 set success';
        if($limit3*1000000000 <= $data_array[1][4][count($data_array[1][4])-1]['total_flow']) { 
            $curl_post_data = array(
            'priority' => '1',
            'match' => array('nw_dst' => $ip3,
            'actions' => array('queue' => '3')
            );

            $curl_post_data = json_encode($curl_post_data);
 
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
            $curl_response = curl_exec($curl);
 
            if ($curl_response === false) {
                $info = curl_getinfo($curl);
                curl_close($curl);
                die('error occured during curl exec. Additioanl info: ' . var_export($info));
            }
 
            curl_close($curl);
        }
    }
}

//echo $data_array[1][4][count($data_array[1][4])-1]['total_flow'];

$data_array = json_encode($data_array);

mysqli_close($conn);

header("Location:everydaylimit.html");


$service_url = 'http://192.168.2.105:8080/qos/rules/0000000000000001';
 
$curl = curl_init();
$header[] = "Accept: application/json";
$header[] = "Accept-Encoding: gzip";
$header[] = "Content-Type:application/json";
curl_setopt($curl, CURLOPT_URL, $service_url);
curl_setopt($curl, CURLOPT_HTTPHEADER, $header );
 
$curl_post_data = array(
    'priority' => '1',
    'match' => array('nw_dst' => $ip1 . '.' . $ip2 . '.' . $ip3 . '.' . $ip4),
    'actions' => array('queue' => $select)
);


$curl_post_data = json_encode($curl_post_data);
 
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
$curl_response = curl_exec($curl);
 
if ($curl_response === false) {
    $info = curl_getinfo($curl);
    curl_close($curl);
    die('error occured during curl exec. Additioanl info: ' . var_export($info));
}
 
curl_close($curl);
 
$decoded = json_decode($curl_response);
 
if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
    die('error occured: ' . $decoded->response->errormessage);
}
header("Location:everydaylimit.html");*/
?>
