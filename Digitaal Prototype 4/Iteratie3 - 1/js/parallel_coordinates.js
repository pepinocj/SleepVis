function small_parallel_coordinates(container, dataPoint, selectedFeature) {


    delete dataPoint["mean_3D_position"];

    var margin = {
            top: 30,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = 200 - margin.left - margin.right,
        height = 75 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        foreground;

    var svg = container.append("svg").attr("id", "small_parallel_coordinates")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(dataPoint).filter(function (d) {
        return (y[d] = d3.scale.linear()
            .domain([config_features[d]["min"], config_features[d]["max"]])
            .range([height, 0]));
    }));

    //// Add grey background lines for context.
    //background = svg.append("g")
    //    .attr("class", "background")
    //    .selectAll("path")
    //    .data(cars)
    //    .enter().append("path")
    //    .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data([dataPoint])
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + x(d) + ")";
        });


    // Add an axis and title.
    var allAxes = g.append("g")
        .attr("class", "axis")
        .each(function (d) {
            d3.select(this).call(axis.tickValues([config_features[d]["min"], config_features[d]["max"]]).scale(y[d]));
        });
    allAxes.selectAll(".tick").attr("font-size", "4pt");


    allAxes.append("text")
        .attr("class", function (d) {
            return "rowLabel mono featureName" + d;
        })
        .classed("text-highlight", function (d) {
            return d == selectedFeature;
        })
        .style("text-anchor", "middle")
        .attr("y", -9)

    .attr("transform", "rotate(-60)")
        .text(function (d) {
            return d;
        });



    function position(d) {
        return x(d);
    }



    // Returns the path for a given data point.
    function path(d) {

        return line(dimensions.map(function (p) {
            return [position(p), y[p](d[p])];
        }));
    }


}

function drawSelectedEpoch(container, xScale, yScale, dataPoint) {

    var x = xScale,
        y = yScale,
        dragging = {};

    var line = d3.svg.line(),
        foreground;

    var svg = container;



    // Extract the list of dimensions and create a scale for each.
    //x.domain(dimensions = d3.keys(dataPoint).filter(function(d) {
    //    return  (y[d] = d3.scale.linear()
    //        .domain([config_features[d]["min"],config_features[d]["max"]])
    //        .range([height, 0]));
    //}));

    //// Add grey background lines for context.
    //background = svg.append("g")
    //    .attr("class", "background")
    //    .selectAll("path")
    //    .data(cars)
    //    .enter().append("path")
    //    .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g").attr("id", "selectedEpoch")
        .attr("class", "foreground")
        .selectAll("path")
        .data([dataPoint])
        .enter().append("path")
        .attr("stroke", 'black')
        .attr("d", path);

    //// Add a group element for each dimension.
    //var g = svg.selectAll(".dimension")
    //    .data(dimensions)
    //    .enter().append("g")
    //    .attr("class", "dimension")
    //    .attr("transform", function(d) { return "translate(" + x(d) + ")"; });


    //// Add an axis and title.
    //var allAxes = g.append("g")
    //    .attr("class", "axis")
    //    .each(function(d) { d3.select(this).call(axis.tickValues([config_features[d]["min"],config_features[d]["max"]]).scale(y[d])); });
    //allAxes.selectAll(".tick").attr("font-size","4pt");
    //
    //
    //allAxes.append("text")
    //    .attr("class",function(d){return "rowLabel mono featureName"+d;})
    //    .classed("text-highlight",function(d){return d==selectedFeature;})
    //    .style("text-anchor", "middle")
    //    .attr("y", -9)
    //
    //    .attr("transform", "rotate(-60)")
    //    .text(function(d) { return d; });



    function position(d) {
        return x(d);
    }



    // Returns the path for a given data point.
    function path(d) {
        return line((Object.keys(y)).map(function (p) {
            return [position(p), y[p](d[p])];
        }));
    }


}

function small_line_chart(container, dataPoints, feature, epoch) {
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 400 - margin.left - margin.right,
        height = 75 - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.scale.linear()
        .domain(xScale.domain())
        .range([0, width]);

    xTimeScale.range([0, width]).clamp(true);

    var y = d3.scale.linear()
        .domain([config_features[feature]["min"], config_features[feature]["max"]])
        .range([height, 0]);

    var xAxis = d3.svg.axis().tickFormat(d3.time.format("%H:%M"))
        .scale(xTimeScale).ticks(10)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues([config_features[feature]["min"], config_features[feature]["max"]])
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.col);
        })
        .y(function (d) {
            return y(d.value);
        });



    var svg = container.append("svg").attr("id", "small_line_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(feature);

    svg.append("path")
        .datum(dataPoints)
        .attr("class", "line")
        .attr("d", line);

    svg.append("path")
        .datum([{
            col: epoch,
            value: config_features[feature]["min"]
        }, {
            col: epoch,
            value: config_features[feature]["max"]
        }])
        .attr("class", "line marker")

    .attr("d", line);

}

function small_line_chart_context(container, feature) {
    var dataPoints = collection_day_data.map(function (d, i) {
        console.log(d);
        return {
            col: i,
            value: d.smartPhoneData.flattened[feature]
        };
    });

    console.log(dataPoints);

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 500 - margin.left - margin.right,
        height = 75 - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.scale.linear()
        .domain([0, collection_day_data.length])
        .range([0, width]);

    xTimeYearScale.range([0, width]).domain([new Date(collection_day_data[0].smartPhoneData.date), new Date(collection_day_data[collection_day_data.length - 1].smartPhoneData.date)]).clamp(true);

    var y = d3.scale.linear()
        .domain([mapping_to_type_subjective_data[feature]["min"], mapping_to_type_subjective_data[feature]["max"]])
        .range([height, 0]);

    var xAxis = d3.svg.axis().tickFormat(d3.time.format("%d %b"))
        .scale(xTimeYearScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues([mapping_to_type_subjective_data[feature]["min"], mapping_to_type_subjective_data[feature]["max"]])
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.col);
        })
        .y(function (d) {
            return y(d.value);
        });



    var svg = container.append("svg").attr("id", "small_line_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(feature);

    svg.append("path")
        .datum(dataPoints)
        .attr("class", "line")
        .attr("d", line);

    //svg.append("path")
    //    .datum([{col:epoch,value:config_features[feature]["min"]},{col:epoch,value:config_features[feature]["max"]}])
    //    .attr("class", "line marker")
    //
    //    .attr("d", line);

}

function sleep_time_context(container) {
    var dataPoints = collection_day_data.map(function (d, i) {




        return {
            col: i,
            value: d.smartPhoneData.flattened["TST"]
        };
    });

    var dataPoints2 = collection_day_data.map(function (d, i) {




        return {
            col: i,
            value: d.smartPhoneData.flattened["TWT"] + d.smartPhoneData.flattened["TST"]
        };
    });





    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 400 - margin.left - margin.right,
        height = 3 * 75 - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.scale.linear()
        .domain([0, collection_day_data.length - 1])
        .range([0, width]);

    xTimeYearScale.range([0, width]).domain([new Date(collection_day_data[0].smartPhoneData.shown_date), new Date(collection_day_data[collection_day_data.length - 1].smartPhoneData.shown_date)]);

    var y = d3.scale.linear()
        .domain([mapping_to_type_subjective_data["TST"]["min"], mapping_to_type_subjective_data["TST"]["max"]])
        .range([height, 0]);

    var xAxis = d3.svg.axis().tickFormat(d3.time.format("%d %b"))
        //.ticks(collection_day_data.length)
        .scale(xTimeYearScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues([mapping_to_type_subjective_data["TST"]["min"], mapping_to_type_subjective_data["TST"]["max"]])
        .orient("left");





    var svg = container.append("svg").attr("id", "small_line_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + width / (dataPoints.length * 4) + "," + height + ")")
        .call(xAxis);

    var amountString;
    if (mapping_to_type_subjective_data["TST"]["max"] < 30) {
        amountString = " (amount of times)"
    } else {
        amountString = " (in minutes)"
    }
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "translate(0,-12)")
        .attr("dy", ".71em")
        .text("TST" + amountString);

    var line = d3.svg.line()
        .x(function (d) {
            return width / (dataPoints.length * 4) + x(d.col);
        })
        .y(function (d) {
            return y(d.value);
        });

    function createLine(name, points) {
        svg.append("g").datum(points).append("path")
            .attr("class", name + " bar line")
            .attr("style", "fill:none")
            .attr("d", line);


        var bars = svg.append("g").attr("id", "bars_history_" + name)
            .selectAll('rect')
            .data(points)
            .enter()
            .append('g').attr("class", function (d, i) {
                return "bar day" + i + " " + name;
            })
            .on("mouseover", function (d, i) {
                d3.selectAll(".day" + i + "." + name).classed("subjectiveFeatureSelected", true);

            })
            .on("mouseout", function (d, i) {
                d3.selectAll(".day" + i + "." + name).classed("subjectiveFeatureSelected", false);

            });

        //        bars.append('rect')
        //                .attr('height',function(d){return height-y(d.value)})
        //        .attr({'x':function(d){ return x(d.col); },'y':function(d,i){ return y(d.value) }})
        //        .attr('width',function(d){ return width/(dataPoints.length*2) });


        bars.append('circle')
            // .attr('height',function(d){return 6})
            .attr({
                'cx': function (d) {
                    return width / (dataPoints.length * 4) + x(d.col);
                },
                'cy': function (d, i) {
                    return y(d.value)
                }
            })
            .attr('r', function (d) {
                return 3
            });

        bars.append("text")
            .attr("class", "subjectiveFeatureValue")
            .text(function (d) {
                return d.value
            })
            .attr({
                'x': function (d) {
                    return x(d.col);
                },
                'y': function (d, i) {
                    return y(d.value)
                }
            })
    }

    createLine("TST", dataPoints);
    createLine("TIB", dataPoints2);




}


function small_bar_chart_context_default(container) {

    var feature = "TST";



    var dataPoints = visualizedDays.map(function (d, i) {
        var temp = 0;
        if (collection_day_data[d.nrDay].smartPhoneData.flattened[feature] != undefined) {
            temp = collection_day_data[d.nrDay].smartPhoneData.flattened[feature];
        }
        console.log(d.nrDay);
        return {
            col: i,
            value: temp,
            day: d.nrDay
        };
    });






    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = container.node().getBoundingClientRect().width * 0.9 - margin.left - margin.right,
        height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.scale.linear()
        .domain([0, visualizedDays.length - 1])
        .range([0, width]);

    xTimeYearScale.range([0, width]).domain([new Date(collection_day_data[visualizedDays[0].nrDay].smartPhoneData.shown_date), new Date(collection_day_data[visualizedDays[visualizedDays.length - 1].nrDay].smartPhoneData.shown_date)]);

    //    xTimeYearScale.range([ 0, width ]).domain([new Date(collection_day_data[0].smartPhoneData.shown_date),new Date(collection_day_data[collection_day_data.length-1].smartPhoneData.shown_date)]);

    var y = d3.scale.linear()
        .domain([mapping_to_type_subjective_data[feature]["min"], mapping_to_type_subjective_data[feature]["max"]])
        .range([height, 0]);

    var xAxis = d3.svg.axis().tickFormat(d3.time.format("%d %b"))
        //.ticks(collection_day_data.length)
        .scale(xTimeYearScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        //.tickValues([mapping_to_type_subjective_data[feature]["min"],mapping_to_type_subjective_data[feature]["max"]])
        .orient("left");





    var svg = container.append("svg").attr("id", "small_line_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + width / (dataPoints.length * 4) + "," + height + ")")
        .call(xAxis);

    var amountString;
    if (mapping_to_type_subjective_data[feature]["max"] < 30) {
        amountString = " (amount of times)"
    } else {
        amountString = " (in minutes)"
    }
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "translate(0,-12)")
        .attr("dy", ".71em")
        .text("Sleep window (Sleep vs Time in bed) " + amountString);






    if (feature == "TST") {

        var dataPoints2 = visualizedDays.map(function (d, i) {
            var temp = 0;

            temp = collection_day_data[d.nrDay].smartPhoneData.flattened["TWT"] + collection_day_data[d.nrDay].smartPhoneData.flattened["TST"];


            return {
                col: i,
                value: temp,
                day: d.nrDay
            };
        });

        var dataPointsArea = [];
        dataPoints.map(function (d, i) {
            dataPointsArea.push({
                col: d.col,
                value1: d.value,
                value2: dataPoints2[i].value
            });
        })

        var area = d3.svg.area()
            .x(function (d) {
                return width / (dataPoints.length * 4) + x(d.col);
            })
            .y0(function (d) {
                return y(d.value2);
            })
            .y1(function (d) {
                return y(d.value1);
            });

        svg.append("path")
            .datum(dataPointsArea)
            .attr("class", "area")
            .attr("style", "fill:red;opacity:0.5")
            .attr("d", area);



        var tbt = "TIB"

        svg.append("path")
            .datum(dataPoints2)
            .attr("class", tbt + " line")
            .attr("style", "fill:none;stroke:burlywood")
            .attr("d", line);


        var bars2 = svg.append("g").attr("id", "bars_history")
            .selectAll('rect')
            .data(dataPoints2)
            .enter()
            .append('g').attr("class", function (d, i) {
                return "bar day" + d.day + " " + tbt;
            })

        .on("mouseover", function (d, i) {

                d3.select("#small_line_chart").selectAll(".bar.day" + d.day).classed("subjectiveFeatureSelected", true);
                d3.selectAll(".day" + d.day + "." + tbt).classed("subjectiveFeatureSelected", true);
                d3.selectAll(".dayData").classed("hidden", true);
                d3.select("#dayData" + d.day).classed("hidden", false);
            d3.select("#dayInspecting").text(dateFormat(new Date(collection_day_data[d.day].smartPhoneData.shown_date), "ddd, d/m"));
                focusOnDay(d.day);

            })
            .on("mouseout", function (d, i) {
                d3.selectAll(".day" + d.day + ".bar").classed("subjectiveFeatureSelected", false);

            }).on("click", function (d, i) {
                $("#dayViz" + d.day).scrollView();

            })

        //        bars.append('rect')
        //                .attr('height',function(d){return height-y(d.value)})
        //        .attr({'x':function(d){ return x(d.col); },'y':function(d,i){ return y(d.value) }})
        //        .attr('width',function(d){ return width/(dataPoints.length*2) });


        bars2.append('circle').attr("style", "fill:burlywood;stroke:burlywood")
            // .attr('height',function(d){return 6})
            .attr({
                'cx': function (d) {
                    return width / (dataPoints.length * 4) + x(d.col);
                },
                'cy': function (d, i) {
                    return y(d.value)
                }
            })
            .attr('r', function (d) {
                return 3
            });

        bars2.append("text")
            .attr("class", "subjectiveFeatureValue")
            .text(function (d) {
                return d.value
            })
            .attr({
                'x': function (d) {
                    return x(d.col);
                },
                'y': function (d, i) {
                    return y(d.value) - 10
                }
            })




    }







    var line = d3.svg.line()
        .x(function (d) {
            return width / (dataPoints.length * 4) + x(d.col);
        })
        .y(function (d) {
            return y(d.value);
        });









    svg.append("path")
        .datum(dataPoints)
        .attr("class", feature + " line")
        .attr("style", "fill:none")
        .attr("d", line);

    var bars = svg.append("g").attr("id", "bars_history")
        .selectAll('rect')
        .data(dataPoints)
        .enter()
        .append('g').attr("class", function (d, i) {
            return "bar day" + d.day + " " + feature;
        })
        .on("mouseover", function (d, i) {

            d3.select("#small_line_chart").selectAll(".bar.day" + d.day).classed("subjectiveFeatureSelected", true);
            d3.selectAll(".day" + d.day + "." + feature).classed("subjectiveFeatureSelected", true);
            d3.selectAll(".dayData").classed("hidden", true);
            d3.select("#dayData" + d.day).classed("hidden", false);
            d3.select("#dayInspecting").text(dateFormat(new Date(collection_day_data[d.day].smartPhoneData.shown_date), "ddd, d/m"));
            focusOnDay(d.day);

        })
        .on("mouseout", function (d, i) {
            d3.selectAll(".day" + d.day + ".bar").classed("subjectiveFeatureSelected", false);

        }).on("click", function (d, i) {
            $("#dayViz" + d.day).scrollView();

        })

    //        bars.append('rect')
    //                .attr('height',function(d){return height-y(d.value)})
    //        .attr({'x':function(d){ return x(d.col); },'y':function(d,i){ return y(d.value) }})
    //        .attr('width',function(d){ return width/(dataPoints.length*2) });


    bars.append('circle')
        // .attr('height',function(d){return 6})
        .attr({
            'cx': function (d) {
                return width / (dataPoints.length * 4) + x(d.col);
            },
            'cy': function (d, i) {
                return y(d.value)
            }
        })
        .attr('r', function (d) {
            return 3
        });

    bars.append("text")
        .attr("class", "subjectiveFeatureValue")
        .text(function (d) {
            return d.value
        })
        .attr({
            'x': function (d) {
                return x(d.col);
            },
            'y': function (d, i) {
                return y(d.value) + 10
            }
        })









}


function small_bar_chart_context(container, feature) {




    var dataPoints = visualizedDays.map(function (d, i) {
        var temp = 0;
        if (collection_day_data[d.nrDay].smartPhoneData.flattened[feature] != undefined) {
            temp = collection_day_data[d.nrDay].smartPhoneData.flattened[feature];
        }
        console.log(d.nrDay);
        return {
            col: i,
            value: temp,
            day: d.nrDay
        };
    });

    if (feature == "TBT") {
        dataPoints = visualizedDays.map(function (d, i) {
            var temp = 0;
         
               temp= collection_day_data[d.nrDay].smartPhoneData.flattened["TWT"] + collection_day_data[d.nrDay].smartPhoneData.flattened["TST"]
            
            console.log(d.nrDay);
            return {
                col: i,
                value: temp,
                day: d.nrDay
            };
        });
    }





    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = container.node().getBoundingClientRect().width * 0.9 - margin.left - margin.right,
        height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;

    //var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.scale.linear()
        .domain([0, visualizedDays.length - 1])
        .range([0, width]);

    xTimeYearScale.range([0, width]).domain([new Date(collection_day_data[visualizedDays[0].nrDay].smartPhoneData.shown_date), new Date(collection_day_data[visualizedDays[visualizedDays.length - 1].nrDay].smartPhoneData.shown_date)]);

    //    xTimeYearScale.range([ 0, width ]).domain([new Date(collection_day_data[0].smartPhoneData.shown_date),new Date(collection_day_data[collection_day_data.length-1].smartPhoneData.shown_date)]);

    var y = d3.scale.linear()
        .domain([mapping_to_type_subjective_data[feature]["min"], mapping_to_type_subjective_data[feature]["max"]])
        .range([height, 0]);

    var xAxis = d3.svg.axis().tickFormat(d3.time.format("%d %b"))
        //.ticks(collection_day_data.length)
        .scale(xTimeYearScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        //.tickValues([mapping_to_type_subjective_data[feature]["min"],mapping_to_type_subjective_data[feature]["max"]])
        .orient("left");





    var svg = container.append("svg").attr("id", "small_line_chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + width / (dataPoints.length * 4) + "," + height + ")")
        .call(xAxis);

    var amountString;
    if (mapping_to_type_subjective_data[feature]["max"] < 30) {
        amountString = " (amount of times)"
    } else {
        amountString = " (in minutes)"
    }
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "translate(0,-12)")
        .attr("dy", ".71em")
        .text(translator[feature] + amountString);









    var line = d3.svg.line()
        .x(function (d) {
            return width / (dataPoints.length * 4) + x(d.col);
        })
        .y(function (d) {
            return y(d.value);
        });









    svg.append("path")
        .datum(dataPoints)
        .attr("class", feature + " line")
        .attr("style", "fill:none")
        .attr("d", line);

    var bars = svg.append("g").attr("id", "bars_history")
        .selectAll('rect')
        .data(dataPoints)
        .enter()
        .append('g').attr("class", function (d, i) {
            return "bar day" + d.day + " " + feature;
        })
        .on("mouseover", function (d, i) {

            d3.select("#small_line_chart").selectAll(".bar.day" + d.day).classed("subjectiveFeatureSelected", true);
            d3.selectAll(".day" + d.day + "." + feature).classed("subjectiveFeatureSelected", true);
            d3.selectAll(".dayData").classed("hidden", true);
            d3.select("#dayData" + d.day).classed("hidden", false);
            d3.select("#dayInspecting").text(dateFormat(new Date(collection_day_data[d.day].smartPhoneData.shown_date), "ddd, d/m"));
            focusOnDay(d.day);

        })
        .on("mouseout", function (d, i) {
            d3.selectAll(".day" + d.day + ".bar").classed("subjectiveFeatureSelected", false);

        }).on("click", function (d, i) {
            $("#dayViz" + d.day).scrollView();

        })

    //        bars.append('rect')
    //                .attr('height',function(d){return height-y(d.value)})
    //        .attr({'x':function(d){ return x(d.col); },'y':function(d,i){ return y(d.value) }})
    //        .attr('width',function(d){ return width/(dataPoints.length*2) });


    bars.append('circle')
        // .attr('height',function(d){return 6})
        .attr({
            'cx': function (d) {
                return width / (dataPoints.length * 4) + x(d.col);
            },
            'cy': function (d, i) {
                return y(d.value)
            }
        })
        .attr('r', function (d) {
            return 3
        });

    bars.append("text")
        .attr("class", "subjectiveFeatureValue")
        .text(function (d) {
            return d.value
        })
        .attr({
            'x': function (d) {
                return x(d.col);
            },
            'y': function (d, i) {
                return y(d.value) - 10
            }
        })









}

function small_subjective_context(container, feature) {
    var dataPoints = collection_day_data.map(function (d, i) {
        console.log(d);
        return {
            col: i,
            value: d.smartPhoneData.flattened[feature]
        };
    });



    //svg.append("path")
    //    .datum([{col:epoch,value:config_features[feature]["min"]},{col:epoch,value:config_features[feature]["max"]}])
    //    .attr("class", "line marker")
    //
    //    .attr("d", line);

}
