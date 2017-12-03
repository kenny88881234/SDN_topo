function myrefresh() {
    var i,j;
    var color = d3.scale.category10();
    var limitnum = "";
    $.getJSON("everydaylimit.json", function( json ) {
	for(i=1;i<2;i++) {
            for(j=1;j<4;j++) {
                if(json[String(i)].hasOwnProperty(String(j)) && json[String(i)][String(j)].hasOwnProperty('limit')) {
		    if(json[String(i)][String(j)].limitnum == '0' || json[String(i)][String(j)].limit == '0') {
			document.getElementById("port" + j).innerHTML = "<font color = " + color(j) + "> 未設定" + "</font>"
		    }
		    else {
			if(json[String(i)][String(j)].limitnum == '1') {
			    limitnum = "12Mb/s";
			}
			if(json[String(i)][String(j)].limitnum == '2') {
                            limitnum = "8Mb/s";
                        }
			if(json[String(i)][String(j)].limitnum == '3') {
                            limitnum = "斷線";
                        }
			document.getElementById("port" + j).innerHTML = "<font color = " + color(j) + ">" + json[String(i)][String(j)].limit + " G ( " + limitnum + " )</font>"
		    }
                }
            }
        }
    });
}
setInterval('myrefresh()',500);
