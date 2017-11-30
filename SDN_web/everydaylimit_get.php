<?php
$limit1 = $_GET[limit1];
$limit2 = $_GET[limit2];
$limit3 = $_GET[limit3];
$limitnum1 = $_GET[limitnum1];
$limitnum2 = $_GET[limitnum2];
$limitnum3 = $_GET[limitnum3];

$file = fopen("everydaylimit.json","r:w
")  or die("Unable to open file!");
$limit = '';
while (!feof($file)) {
    $limit .= fread($file, filesize("everydaylimit.json"));
}
fclose($file);

$limit = json_decode($limit);

if($limit1 == null and $limitnum1 == '0') {
    $data_array[1][1] = array(
        "limit" => $limit->{'1'}->{'1'}->limit,
        "limitnum" => $limit->{'1'}->{'1'}->limitnum,
	"flag" => $limit->{'1'}->{'1'}->flag
    );
}
else if($limit1 != null and $limitnum1 == '0') {
    $data_array[1][1] = array(
        "limit" => $limit1,
        "limitnum" => $limit->{'1'}->{'1'}->limitnum,
	"flag" => $limit->{'1'}->{'1'}->flag
    );
}
else if($limit1 == null and $limitnum1 != '0') {
    $data_array[1][1] = array(
        "limit" => $limit->{'1'}->{'1'}->limit,
        "limitnum" => $limitnum1,
        "flag" => $limit->{'1'}->{'1'}->flag
    );
}
else if($limit1 != null and $limitnum1 != '0') {
    $data_array[1][1] = array(
        "limit" => $limit1,
        "limitnum" => $limitnum1,
        "flag" => $limit->{'1'}->{'1'}->flag
    );
}

if($limit2 == null and $limitnum2 == '0') {
    $data_array[1][2] = array(
        "limit" => $limit->{'1'}->{'2'}->limit,
        "limitnum" => $limit->{'1'}->{'2'}->limitnum,
	"flag" => $limit->{'1'}->{'2'}->flag
    );
}
else if($limit2 != null and $limitnum2 == '0') {
    $data_array[1][2] = array(
        "limit" => $limit2,
        "limitnum" => $limit->{'1'}->{'2'}->limitnum,
        "flag" => $limit->{'1'}->{'2'}->flag
    );
}
else if($limit2 == null and $limitnum2 != '0') {
    $data_array[1][2] = array(
        "limit" => $limit->{'1'}->{'2'}->limit,
        "limitnum" => $limitnum2,
        "flag" => $limit->{'1'}->{'2'}->flag
    );
}
else if($limit2 != null and $limitnum2 != '0') {
    $data_array[1][2] = array(
        "limit" => $limit2,
        "limitnum" => $limitnum2,
	"flag" => $limit->{'1'}->{'2'}->flag
    );
}

if($limit3 == null and $limitnum3 == '0') {
    $data_array[1][3] = array(
        "limit" => $limit->{'1'}->{'3'}->limit,
        "limitnum" => $limit->{'1'}->{'3'}->limitnum,
	"flag" => $limit->{'1'}->{'3'}->flag
    );
}
else if($limit3 != null and $limitnum3 == '0') {
    $data_array[1][3] = array(
        "limit" => $limit3,
        "limitnum" => $limit->{'1'}->{'3'}->limitnum,
        "flag" => $limit->{'1'}->{'3'}->flag
    );
}
else if($limit3 == null and $limitnum3 != '0') {
    $data_array[1][3] = array(
        "limit" => $limit->{'1'}->{'3'}->limit,
        "limitnum" => $limitnum3,
        "flag" => $limit->{'1'}->{'3'}->flag
    );
}
else if($limit3 != null and $limitnum3 != '0') {
    $data_array[1][3] = array(
        "limit" => $limit3,
        "limitnum" => $limitnum3,
	"flag" => $limit->{'1'}->{'3'}->flag
    );
}

$data_array = json_encode($data_array);

$file = fopen("everydaylimit.json","w")  or die("Unable to open file!"); //開啟檔案
fwrite($file,$data_array);
fclose($file);

header("Location:everydaylimit.html");
?>
