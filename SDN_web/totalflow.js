var xmlhttp = new XMLHttpRequest();
var x,y,txt='';
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = this.responseText;
        document.getElementById("demo").innerHTML = myObj;
    }
};
xmlhttp.open("GET", "getflowdata.php", true);
xmlhttp.send();
