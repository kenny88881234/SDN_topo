'use strict';

var topo_view = $('#topology');
var width = topo_view.width();
var height = topo_view.height();
var allSVGElem = {};
var svg = d3.select('#topology')
                   .attr("width", width)
                   .attr("height", height);
var d3_nodes = [],
    d3_links = [],
    port_data = [];

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
	if(d.type === 'h') {
	    return "<strong>port_no:</strong> <span style='color:red'>" + d.port.port_no + "</span>" + "<strong> ip:</strong> <span style='color:red'>" + d.ipv4 + "</span>" + "<strong>tx_flow:</strong> <span style='color:red'>" + d.port_data.tx_flow + "</span>";
	} else if(d.type === 's') {
	    return "<strong>Switch</strong>";
	}
  });

var force = d3.layout.force()
              .gravity(0.4)
              .charge(-3000)
              .linkDistance(function (d) {
                  // XXX: I can't change link distance.....
                  if(d === 'c') {
                      return 100;
                  } else {
                      return 100;
                  }
              })
              .linkStrength(function (d) {
                  // XXX: no use?
                  if(d === 'c') {
                      return 1.5;
                  } else {
                      return 1.5;
                  }
              })
              .friction(0.7)
              .theta(0.3)
              .size([width, height]);

function linkExist(src, dst, links) {
    var index;
    for (index = 0; index < links.length; index++) {
        if (links[index].source === src && links[index].target === dst) {
            return true;
        }
        if (links[index].source === dst && links[index].target === src) {
            return true;
        }
    }
    return false;
}

function searchSwitchIndex(dpid, nodes) {
    var index;
    for (index = 0; index < nodes.length; index++) {
        if (nodes[index].dpid === dpid) {
            return index;
        }
    }
    return -1;
}

function forceTick(e) {
    var k = 0.1 * e.alpha;
    allSVGElem.links
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) {
                if (d.source.y + 20 > height) {
                    return height - 20;
                } else {
                    return d.source.y;
                }
                if (d.source.y - 20 < height) {
                    return height + 20;
                } else {
                    return d.source.y;
                }
        })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) {
                if (d.target.y > height) {
                    return height;
                } else {
                    return d.target.y;
                }
                if (d.target.y < height) {
                    return height;
                } else {
                    return d.target.y;
                }
        });

    allSVGElem.nodes
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) {
            // give it limit!
                if (d.y - 20 > height) {
                    return height;
                } else {
                    return d.y;
                }
                if (d.y - 20 < height) {
                    return height;
                } else {
                    return d.y;
                }
        })
	.attr('x', function (d) { return d.x; })
        .attr('y', function (d) {
            // give it limit!
                if (d.y - 20 > height) {
                    return height;
                } else {
                    return d.y;
                }
                if (d.y - 20 < height) {
                    return height;
                } else {
                    return d.y;
                }
        });
}

function loadMonitorData(err, monitordata) {

        if (err) {
                console.log(err);
                console.log('Error on loading data!');
                return;
        }

        var index;

        var p_data = monitordata;
	port_data = [];

        for (index = 0; index < monitordata.length; index++) {
            p_data[index].type = 'p';
	    port_data.push(p_data[index]);
        }
	console.log("success!");
}

function loadData(err, data) {

    	if (err) {
        	console.log(err);
        	console.log('Error on loading data!');
        	return;
    	}

    	var index;
	var j;

        var switches = data.switch,
            links = data.link,
            hosts = data.host;

	d3_nodes = [];
	d3_links = [];
        for (index = 0; index < switches.length; index++) {
            switches[index].type = 's';
            d3_nodes.push(switches[index]);
        }

        for (index = 0; index < hosts.length; index++) {
            hosts[index].type = 'h';
	    console.log(port_data.length);
	    for (j = 0; j < port_data.length; j++) {
		if(Number(port_data[j].port_no) == Number(hosts[index].port.port_no)){
		    hosts[index].port_data = port_data[j];
		}
	    }
            // get index of host before push it.
            var host_index = d3_nodes.length,
                switch_index = searchSwitchIndex(hosts[index].port.dpid, d3_nodes);
            d3_nodes.push(hosts[index]);

            // add host to switch link.
            d3_links.push({source: host_index, target: switch_index, type: 'h'});
        }
	console.log(d3_nodes);
	for (index = 0; index < links.length; index++) {
                var src_dpid = links[index].src.dpid,
		dst_dpid = links[index].dst.dpid,
                src_index = searchSwitchIndex(src_dpid, d3_nodes),
                dst_index = searchSwitchIndex(dst_dpid, d3_nodes);
            if (!linkExist(src_index, dst_index, d3_links)) {
                d3_links.push({source: src_index, target: dst_index, type: 's'});
            }
        }
	force.nodes(d3_nodes)
	     .links(d3_links)
             .start();
        force.on('tick', forceTick);

        allSVGElem.links = svg.selectAll('.link')
            .data(d3_links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .style("stroke-width", function (d) {
                if (d.type === 'c') {
                    return 5;
                } else {
                    return 3;
                }
            })
            .style("stroke", function (d) {
                if (d.type === 'h') {
                    // host to switch link
                    return '#F00';
                } else if (d.type === 's') {
                    // switch to switch link
                    return '#00F';
                }
            });

        allSVGElem.nodes = svg.selectAll('.node')
            .data(d3_nodes)
            .enter()
            .append('circle')
            .attr('fill', function (d) {
                if (d.type === 's') {
                    return '#05A';
                } else {
                    return '#090';
                }
            })
	    .attr('r', function (d) {
                if (d.type === 's') {
                    return '20';
                } else {
                    return '15';
                }
            })
            .attr('class', 'node')
            .on("dblclick", function(d) { d3.select(this).classed("fixed", d.fixed = true); })
            .on('mouseover', tip.show)
	    .on('mouseout', tip.hide)
	    .call(force.drag)
	    .call(tip);
}

function myrefresh()
{
    $(".topo").load(location.href + " .topo");
    topo_view = $('#topology');
    width = topo_view.width();
    height = topo_view.height();
    force = d3.layout.force()
              .gravity(0.4)
              .charge(-3000)
              .linkDistance(function (d) {
                  // XXX: I can't change link distance.....
                  if(d === 'c') {
                      return 100;
                  } else {
                      return 100;
                  }
              })
              .linkStrength(function (d) {
                  // XXX: no use?
                  if(d === 'c') {
                      return 1.5;
                  } else {
                      return 1.5;
                  }
              })
              .friction(0.7)
              .theta(0.3)
              .size([width, height]);
    d3.json('monitor_port_data.json', loadMonitorData);
    d3.json('topo_data.json', loadData);
}
d3.json('monitor_port_data.json', loadMonitorData);
d3.json('topo_data.json', loadData);
setInterval('myrefresh()',30000);
