var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        //document.getElementById("demo").innerHTML = data[1].time;
	var margin = {top: 60, right: 40, bottom: 50, left: 60};
var w = 580 ; // 寬
var h = 300 ; // 高
var dataset = []; //建立空的資料陣列
	for(var i=0;i<data.length;i++) {
	    if(data[i].dpid==1 && data[i].port_no==3) {
		dataset.push(Number(data[i].tx_flow) + Number(data[i].rx_flow));
	    }
	}
console.log(dataset)
var Ymax = d3.max(dataset),
	Ymin = d3.min(dataset);
var xScale = d3.scale.linear().domain([0, dataset.length-1]).range([0, w]);
var yScale = d3.scale.linear().domain([Ymin, Ymax]).range([h, 0]);
// 增加一個line function，用來把資料轉為x, y
var line = d3.svg.line()
	.x(function(d,i) {
		return xScale(i); //利用尺度運算資料索引，傳回x的位置
	})
	.y(function(d) {
		return yScale(d); //利用尺度運算資料的值，傳回y的位置
	});
//增加一個SVG元素
var svg = d3.select('#demo').append('svg')
	.attr('width', w + margin.left + margin.right) //將左右補滿
	.attr('height', h + margin.top + margin.bottom) //上下補滿
	.append('g') //增加一個群組g
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
// 增加x軸線，tickSize是軸線的垂直高度，-h會往上拉高
// tickSubdivide不清楚是什麼用處
var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(-h).tickSubdivide(true);
// SVG加入x軸線
svg.append('g')
	.attr('class', 'x axis')
	.attr('transform', 'translate(0,' + h + ')')
	.call(xAxis);
// 建立y軸線，4個刻度，數字在左
var yAxisLeft = d3.svg.axis().scale(yScale).ticks(4).orient('left');
// SVG加入y軸線
svg.append('g')
	.attr('class', 'y axis')
	.attr('transform', 'translate(0,0)')
	.call(yAxisLeft);
svg.append('path').attr('d', line(dataset)); //將資料套用d3.svg.line()
    }
};
xmlhttp.open("GET", "getflowdata.php", true);
xmlhttp.send();
