<?php
$handle = fopen("http://0.0.0.0:8080/v1.0/topology/switches","rb");
$content = "";
while (!feof($handle)) {
	$content .= fread($handle, 10000);
}
fclose($handle);
echo $content;
?>
