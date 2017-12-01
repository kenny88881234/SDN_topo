var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
};
function processFormData() {
    var data = [3];
    var flag = 0;
    for (i=0;i<3;i++) {
	data[i] = [5];
    }
    $.getJSON("topo_data.json", function( json ) {
        for(i=0;i<json.host.length;i++) {
            data[Number(json.host[i].port.dpid)][Number(json.host[i].port.port_no)] = json.host[i].ipv4[0];
        }
    	var ip1_element = document.getElementsByName('ip1');
    	var ip1 = ip1_element[0].value;
    	var ip2_element = document.getElementsByName('ip2');
    	var ip2 = ip2_element[0].value;
    	var ip3_element = document.getElementsByName('ip3');
    	var ip3 = ip3_element[0].value;
    	var ip4_element = document.getElementsByName('ip4');
    	var ip4 = ip4_element[0].value;
    	var select_element = document.getElementsByName('select');
    	var select = select_element[0].value;
    	if(ip1 != "" && ip2 != "" && ip3 != "" && ip4 != "") {
	    for(i=0;i<data.length;i++) {
	    	for(j=0;j<data[i].length;j++) {
	    	    if(ip1+'.'+ip2+'.'+ip3+'.'+ip4 == data[i][j]) {
	    	    	xmlhttp.open("GET", "flowlimit.php?ip1="+ip1+"&ip2="+ip2+"&ip3="+ip3+"&ip4="+ip4+"&select="+select+"&s="+i+"&p="+j, true);
	    	    	xmlhttp.send();
		    	flag=1;
			alert("Success!");
	    	    }
	    	}
	    }
	    if(flag != 1) {
	    	alert("Not exist");
	    }
    	}
    	else {
	    alert("Input error");
    	}
    });
}
