function myrefresh()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
	    alert("success!");
    	}
    };
    xmlhttp.open("GET", "everydaylimit.php", true);
    xmlhttp.send();
}
setInterval('myrefresh()',30000);
