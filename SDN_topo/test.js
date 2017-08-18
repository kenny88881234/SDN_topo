/*jslint plusplus: true */
'use strict';

var topo_view = $('#topology');
var width = topo_view.width();
var height = topo_view.height() -60 ;
var allSVGElem = {};
var svg = d3.select('#topology').append("svg")
                   .attr("width", width)
                   .attr("height", height);
var d3_nodes = [],
    d3_links = [];

var forceCenter = [
    {'x': width * 0.5, 'y': height * 0},
    {'x': width * 0.5, 'y': height * 1},
    {'x': width * 0.5, 'y': height * 2}
];

var layerCenter = [
    {'x': width * 0.5, 'y': height * 0.4},
    {'x': width * 0.5, 'y': height * 0.6},
    {'x': width * 0.5, 'y': height * 0.8}
];

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
                      return 1;
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

function searchSwitchIndex(dpid, domain, nodes) {
    var index;
    for (index = 0; index < nodes.length; index++) {
        if (nodes[index].dpid === dpid && nodes[index].domain === domain) {
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
            if (d.source.domain === 0) {
                if (d.source.y + 20 > height / 2) {
                    return height / 2 - 20;
                } else {
                    return d.source.y;
                }
            } else {
                if (d.source.y - 20 < height / 2) {
                    return height / 2 + 20;
                } else {
                    return d.source.y;
                }
            }
        })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) {
            if (d.target.domain === 0) {
                if (d.target.y > height / 2) {
                    return height / 2;
                } else {
                    return d.target.y;
                }
            } else {
                if (d.target.y < height / 2) {
                    return height / 2;
                } else {
                    return d.target.y;
                }
            }
        });

    // for multi force
    d3_nodes.forEach(function (o, i) {
        o.x += (forceCenter[o.domain].x - o.x) * k;
        o.y += (forceCenter[o.domain].y - o.y) * k;
    });

    allSVGElem.nodes
        .attr('x', function (d) { return d.x - 20; })
        .attr('y', function (d) {
            // give it limit!
            if (d.domain === 0) {
                if (d.y - 20 > height / 2) {
                    return height / 2;
                } else {
                    return d.y - 20;
                }
            } else {
                if (d.y - 20 < height / 2) {
                    return height / 2;
                } else {
                    return d.y - 20;
                }
            }

        });

}

function loadData(err, data) {

    if (err) {
        console.log(err);
        console.log('Error on loading data!');
        return;
    }

    var topos = [data.domain0, data.domain1, data.domain2],
        index,
        domain;

    for (domain = 0; domain < topos.length; domain++) {

        var switches = topos[domain].switches,
            links = topos[domain].links,
            hosts = topos[domain].hosts;

        for (index = 0; index < switches.length; index++) {
            switches[index].type = 's';
            switches[index].domain = domain;
            d3_nodes.push(switches[index]);
        }

        for (index = 0; index < hosts.length; index++) {
            hosts[index].type = 'h';
            hosts[index].domain = domain;

            // get index of host before push it.
            var host_index = d3_nodes.length,
                switch_index = searchSwitchIndex(hosts[index].dpid, domain, d3_nodes);
            d3_nodes.push(hosts[index]);

            // add host to switch link.
            d3_links.push({source: host_index, target: switch_index, type: 'h'});
        }

        for (index = 0; index < links.length; index++) {
            var src_dpid = links[index].src.dpid,
                dst_dpid = links[index].dst.dpid,
                src_index = searchSwitchIndex(src_dpid, domain, d3_nodes),
                dst_index = searchSwitchIndex(dst_dpid, domain, d3_nodes);
            if (!linkExist(src_index, dst_index, d3_links)) {
                d3_links.push({source: src_index, target: dst_index, type: 's'});
            }
        }
    }

    var crossDoaminLinks = data.crossDomainLinks;
    for (index = 0; index < crossDoaminLinks.length; index++) {
        var link = crossDoaminLinks[index],
            src_index = searchSwitchIndex(link.src.dpid, link.src.domain, d3_nodes),
            dst_index = searchSwitchIndex(link.dst.dpid, link.dst.domain, d3_nodes);

        d3_links.push({source: src_index, target: dst_index, type: 'c'});
    }

    for (domain = 0; domain < topos.length; domain++) {

        var layer = svg.append('image')
        .attr('xlink:href', 'floor.png')
        .attr('x', layerCenter[domain]['x'] - 750)
        .attr('y', layerCenter[domain]['y'] - 110)
        .attr('width', 1500)
        .attr('height', 220)
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
            } else {
                // cross domain link
                return '#0F0';
            }
        });

    allSVGElem.nodes = svg.selectAll('.node')
        .data(d3_nodes)
        .enter()
        .append('image')
        .attr('xlink:href', function (d) {
            if (d.type === 's') {
                return 'switch.png';
            } else {
                return 'host.png';
            }
        })
        .attr('x', -20)
        .attr('y', -20)
        .attr('width', 40)
        .attr('height', 40)
        .attr('px', function (d) { return d.x; })
        .attr('py', function (d) { return d.y; })
        .attr('class', 'node')
        .on("dblclick", function(d) { d3.select(this).classed("fixed", d.fixed = true); })
        .call(force.drag);


}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var switches = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "get_switch.php", true);
xmlhttp.send();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var links = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "get_link.php", true);
xmlhttp.send();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var hosts = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", "get_host.php", true);
xmlhttp.send();

