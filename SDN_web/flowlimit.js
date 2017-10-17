var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	alert("success!");
    }
};
function processFormData() {
    var ip1_element = document.getElementsByName('ip1');
    var ip1 = ip1_element[0].value;
    var ip2_element = document.getElementsByName('ip2');
    var ip2 = ip2_element[0].value;
    var ip3_element = document.getElementsByName('ip3');
    var ip3 = ip3_element[0].value;
    var ip4_element = document.getElementsByName('ip4');
    var ip4 = ip4_element[0].value;
    console.log('ip : ' + ip1 + '.' + ip2 + '.' + ip3 + '.' + ip4 + ' -> ' + select);
    if(ip1 != "" && ip2 != "" && ip3 != "" && ip4 != "") {
	xmlhttp.open("GET", "flowlimit.php", true);
	xmlhttp.send();
    }
    else {
	alert("input error");
    }
}
