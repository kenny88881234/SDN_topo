<?php
$ip1 = $_GET[ip1];
$ip2 = $_GET[ip2];
$ip3 = $_GET[ip3];
$ip4 = $_GET[ip4];
$select = $_GET[select];
$s = $_GET[s];
$p = $_GET[p];
$pn = (int)$p;
$p = (string)$pn-1;

$myfile = fopen("everydaylimit.json", "r") or die("Unable to open file!");
$content = '';
while (!feof($myfile)) {
    $content .= fread($myfile, filesize("everydaylimit.json"));
}

$content = json_decode($content);
fclose($myfile);

$myfile = fopen("everydaylimit.json", "w") or die("Unable to open file!");

$content->$s->$p->limitnum = $select;

if($select == '0') {
    $content->$s->$p->flag = '0';
}
else {
    $content->$s->$p->flag = '1';
}
$content = json_encode($content);

fwrite($myfile, $content);

fclose($myfile);

$service_url = 'http://192.168.2.105:8080/qos/rules/0000000000000001';
$curl = curl_init();
$header[] = "Accept: application/json";
$header[] = "Accept-Encoding: gzip";
$header[] = "Content-Type:application/json";
curl_setopt($curl, CURLOPT_URL, $service_url);
curl_setopt($curl, CURLOPT_HTTPHEADER, $header );

$curl_post_data = array(
    'priority' => '2',
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

header("Location:flowlimit.html");
?>
