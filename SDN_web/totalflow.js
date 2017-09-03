var margin = {top: 60, right: 40, bottom: 50, left: 60};
var w = 580 ; // 寬
var h = 300 ; // 高
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        //document.getElementById("demo").innerHTML = data[1].time;
	d3.select('#demo').select('svg').remove()
	var svg = d3.select('#demo').append('svg')
                .attr('width', w + margin.left + margin.right) //將左右補滿
                .attr('height', h + margin.top + margin.bottom) //上下補滿
                .append('g') //增加一個群組g
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	var dataset = []; //建立空的資料陣列
	var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
	    for(var i=0;i<data.length;i++) {
	        if(data[i].dpid==1 && data[i].port_no==3) {
		    dataset.push({"time" : Number(parseDate(data[i].time)), "num" : (Number(data[i].tx_flow) + Number(data[i].rx_flow))/1000000000});
	        }
	    }
	console.log(dataset)
	var xScale = d3.time.scale().domain(d3.extent(dataset, function (d) { return d.time; })).range([0, w]);
	var yScale = d3.scale.linear().domain(d3.extent(dataset, function (d) { return d.num; })).range([h, 0]);
	// 增加一個line function，用來把資料轉為x, y
	var line = d3.svg.line()
		.x(function (d) { return xScale(d.time); })
		.y(function (d) { return yScale(d.num); });
	// 增加x軸線，tickSize是軸線的垂直高度，-h會往上拉高
	// tickSubdivide不清楚是什麼用處
	var xAxis = d3.svg.axis().scale(xScale).ticks(7).orient('bottom').tickSize(-h).tickFormat(d3 .time.format("%H:%M"));
	// SVG加入x軸線
	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + h + ')')
		.call(xAxis);
	// 建立y軸線，4個刻度，數字在左
	var yAxisLeft = d3.svg.axis().scale(yScale).ticks(7).orient('left').tickSize(-w);
	// SVG加入y軸線
	svg.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(0, 0)')
		.call(yAxisLeft);
	svg.append('path').datum(dataset).attr( "class", "line" )
                .attr( "d" , line)
                .attr( "opacity", 0 )
                .transition()
                .duration(500)
                .attr( "opacity", 1);; //將資料套用d3.svg.line()
    }
};
function myrefresh() {
xmlhttp.open("GET", "getflowdata.php", true);
xmlhttp.send();
}
xmlhttp.open("GET", "getflowdata.php", true);
xmlhttp.send();
setInterval('myrefresh()',3000);
