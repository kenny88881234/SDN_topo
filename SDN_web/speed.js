var data = [6];
var i;

var gaugeOptions = {

    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

// The speed gauge
var chartSpeed_2 = Highcharts.chart('container-speed2', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 10,
        title: {
            text: 'Port1'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Speed',
        data: [0],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.3f}</span><br/>' +
                   '<span style="font-size:12px;color:silver">Mb/sec</span></div>'
        },
        tooltip: {
            valueSuffix: ' Mb/sec'
        }
    }]

}));

var chartSpeed_3 = Highcharts.chart('container-speed3', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 10,
        title: {
            text: 'Port2'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Speed',
        data: [0],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.3f}</span><br/>' +
                   '<span style="font-size:12px;color:silver">Mb/sec</span></div>'
        },
        tooltip: {
            valueSuffix: ' Mb/sec'
        }
    }]

}));

var chartSpeed_4 = Highcharts.chart('container-speed4', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 10,
        title: {
            text: 'Port3'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Speed',
        data: [0],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.3f}</span><br/>' +
                   '<span style="font-size:12px;color:silver">Mb/sec</span></div>'
        },
        tooltip: {
            valueSuffix: ' Mb/sec'
        }
    }]

}));

var chartSpeed_wifi = Highcharts.chart('container-speedwifi', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 10,
        title: {
            text: 'Wifi'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Speed',
        data: [0],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.3f}</span><br/>' +
                   '<span style="font-size:12px;color:silver">Mb/sec</span></div>'
        },
        tooltip: {
            valueSuffix: ' Mb/sec'
        }
    }]

}));

setInterval(function () {
    // Speed
    $.getJSON("monitor_port_data.json", function( json ) {
        for(i=0;i<json.length;i++) {
            data[i] = json[i];
        }
    });
    console.log(data[2].tx_flow);

    var point,
        newVal,
        inc;

    if (chartSpeed_2) {
        point = chartSpeed_2.series[0].points[0];
        inc = (Number(data[1].tx_flow) + Number(data[1].rx_flow))/1000000;
        newVal = inc;

        if (newVal < 0 || newVal > 20) {
            newVal = 0;
        }

        point.update(newVal);
    }

    if (chartSpeed_3) {
        point = chartSpeed_3.series[0].points[0];
        inc = (Number(data[2].tx_flow) + Number(data[2].rx_flow))/1000000;
        newVal = inc;

        if (newVal < 0 || newVal > 20) {
            newVal = 0;
        }

        point.update(newVal);
    }

    if (chartSpeed_4) {
        point = chartSpeed_4.series[0].points[0];
        inc = (Number(data[3].tx_flow) + Number(data[3].rx_flow))/1000000;
        newVal = inc;

        if (newVal < 0 || newVal > 20) {
            newVal = 0;
        }

        point.update(newVal);
    }

    if (chartSpeed_wifi) {
        point = chartSpeed_wifi.series[0].points[0];
        inc = (Number(data[4].tx_flow) + Number(data[4].rx_flow))/1000000;
        newVal = inc;

        if (newVal < 0 || newVal > 20) {
            newVal = 0;
        }

        point.update(newVal);
    }

}, 2000);
