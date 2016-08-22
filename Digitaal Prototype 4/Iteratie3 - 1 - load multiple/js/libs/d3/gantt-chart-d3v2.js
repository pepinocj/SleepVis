/**
 * @author Dimitry Kudrayvtsev
 * @version 2.0
 */

d3.gantt = function () {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";
    var containerSVG;
    var margin = {
        top: 2,
        right: 40,
        bottom: 0,
        left: 90
    };
    var tasks = [];
    var timeDomainStart = d3.time.day.offset(new Date(), -3);
    var timeDomainEnd = d3.time.hour.offset(new Date(), +3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE; // fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = document.body.clientHeight - margin.top - margin.bottom - 5;
    var width = document.body.clientWidth - margin.right - margin.left - 5;
    var extraVert = document.body.clientHeight - margin.top - margin.bottom - 5;
    var day;
    var tickFormat = "%H:%M";

    var arc = d3.svg.symbol().type('triangle-up')
        .size(50);


    var keyFunction = function (d) {
        return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function (d) {
        return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    var triTransform = function (d) {
        return "translate(" + (x(d.startDate)-5) + "," + (y(d.taskName) + 5) + ")";
    };

    var x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);

    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .1);



    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function () {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (tasks === undefined || tasks.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            tasks.sort(function (a, b) {
                return a.endDate - b.endDate;
            });
            timeDomainEnd = tasks[tasks.length - 1].endDate;
            tasks.sort(function (a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = tasks[0].startDate;
        }
    };

    var initAxis = function () {
        x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
        y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .1);
        //xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        //   .tickSize(8).tickPadding(8);

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function generateSubjectiveSingleDetail(obj, container, container2) {
        var container = container;



        container.text(function (d) {
            var duration = new Date(d.endDate).getTime() - new Date(d.startDate).getTime();
            if (duration == 0) {
                return translator[d.status] + ": " + " om " + dateFormat((d.startDate), "HH:MM");
            } else {
                return translator[d.status] + ": duur " +  dateFormat((duration-60*60*1000), "HH:MM") + " van " + dateFormat((d.startDate), "HH:MM") + " tot " + dateFormat((d.endDate), "HH:MM");
            }

        }(obj));
        
        container2.text(function (d) {
            if(d.notes == ""){
                return "";
            }else{
                return "Notes: "+ d.notes;
            }
            

        }(obj));



    }

    function clickOnWakePeriod(d) {
        $(function () {
            $("#dialogBox").text(translator[taskStatus[d.status]] + ' or Total Wake Time');
            $('#dialogBox').dialog({
                'title': "specify which wake periods",

                'modal': true,
                'buttons': [
                    {
                        text: translator[taskStatus[d.status]],
                        click: function () {

                            $('#dialogBox').dialog("close");

                            d3.select("#small_line_chart").append("svg:image").attr("xlink:href", contextMapping[d.status])
                                .attr("height", 30).attr("width", 30).attr("y", 20);


                            d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", true);
                            d3.selectAll(".bar").classed("notSelected", true);
                            d3.selectAll("." + taskStatus[d.status]).classed("notSelected", false);
                            small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), taskStatus[d.status]);
                        }
              },
                    {
                        text: "Total wake time",
                        click: function () {

                            $('#dialogBox').dialog("close");

                            d3.select("#small_line_chart").append("svg:image").attr("xlink:href", contextMapping["wake"])
                                .attr("height", 30).attr("width", 30).attr("y", 20);


                            d3.selectAll(".day" + day + "." + "TWT").classed("subjectiveFeatureSelected", true);
                            d3.selectAll(".bar").classed("notSelected", true);
                            d3.selectAll("." + "TWT").classed("notSelected", false);
                            d3.select("#chart").selectAll("." + "SOL").classed("notSelected", false);
                            d3.select("#chart").selectAll("." + "WASO").classed("notSelected", false);
                            d3.select("#chart").selectAll("." + "EMA").classed("notSelected", false);
                            small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), "TWT");
                        }
              }
            ]
            });
        });

    }

    function gantt(tasks, container) {
        initTimeDomain();
        initAxis();
        containerSVG = container;

        var rects = tasks.filter(function (d) {
            return (d.startDate - d.endDate) != 0;
        });
        var triangles = tasks.filter(function (d) {
            return (d.startDate - d.endDate) == 0;
        });




        var svgCont = container
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);






        var svg = svgCont.append("g")
            .attr("class", "gantt-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + (margin.top - (height - extraVert - margin.bottom)) + ")");

        function onClick(d, sel) {
            d3.select("#small_line_chart").remove();

            var isNotSelected = d3.select(sel).classed("notSelected");
            var isEverythingSelected = d3.selectAll(".notSelected").empty();

            if (isNotSelected || isEverythingSelected) {

                if (taskStatus[d.status] == "WASO" || taskStatus[d.status] == "SOL" || taskStatus[d.status] == "EMA") {

                    clickOnWakePeriod(d);

                } else {







                    //d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", true);
                    d3.selectAll(".bar").classed("notSelected", true);
                    d3.selectAll("." + taskStatus[d.status]).classed("notSelected", false);
                    d3.selectAll(".activitySelector").classed("notSelected", true).select('input').property('checked', false);
                    d3.selectAll("." + taskStatus[d.status]).classed("notSelected", false);
                    d3.selectAll("." + taskStatus[d.status]).select('input').property('checked', true);

                    small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), taskStatus[d.status]);
                    d3.select("#small_line_chart").append("svg:image").attr("xlink:href", contextMapping[d.status])
                        .attr("height", 30).attr("width", 30).attr("y", 20);
                }

            } else {
                d3.selectAll(".bar").classed("notSelected", false);
                d3.selectAll(".activitySelector").classed("notSelected", false).select('input').property('checked', false);
                small_bar_chart_context_default(d3.select("#subjectiveSelectedOverviewContainer"));
            }
        }

        svg.selectAll(".chart")
            .data(rects, keyFunction).enter()
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function (d) {
                if (taskStatus[d.status] == null) {
                    return "bar";
                }
                return "bar " + taskStatus[d.status] + " day" + day + " " + d.ganttID;;
            })
            .attr("y", 0)

        .attr("transform", rectTransform)
            .attr("height", function (d) {
                return y.rangeBand();
            })
            .attr("width", function (d) {
                return (x(d.endDate) - x(d.startDate));
            })

        .on("click", function (d) {

            onClick(d, this);



        });

        svg.selectAll(".chart")
            .data(rects.filter(function (d) {
                return d.taskName == "Activities";
            }), keyFunction).enter()
            .append("svg:image")
            .attr("xlink:href", function (d) {
                return contextMapping[d.status]
            })


        .attr("width", y.rangeBand())
            .attr("height", y.rangeBand())
            .attr("class", function (d) {
                if (taskStatus[d.status] == null) {
                    return "bar";
                }
                return "activityDuration  bar " + taskStatus[d.status] + " day" + day + " " + d.ganttID;
            })
            .attr("y", -5)
            .attr("x", function (d) {
                return (x(d.endDate) - x(d.startDate)) / 2
            })
            .attr("transform", triTransform)

        .on("click", function (d) {




            //d3.select("#floatingSubjectiveTooltip").classed("hidden",false);
            //d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
            //d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
            //    .style("top", d3.event.pageY+  "px").classed("hidden",false);






            //d3.select("#subjOverview").remove();
            //generateSubjectiveOverview(d3.select("#subjectiveOverviewContainer").append('div').attr("id","subjOverview"),[0,1,2,3,4,5],d.status)
            //

            onClick(d, this);

        });






        //svg.selectAll(".chart")
        //    .data(triangles, keyFunction).enter()
        //    .append("path")
        //    .attr("class", function(d){
        //        if(taskStatus[d.status] == null){ return "bar";}
        //        return "bar "+ taskStatus[d.status]+" day"+day;
        //    })
        //
        //    .attr("transform", triTransform)
        //    .attr("d",arc)
        //    .on("mouseover",function(d){
        //        generateSubjectiveSingleDetail(d,d3.select("#infoTextA"));
        //    })
        //    .on("click", function(d){
        //
        //
        //
        //        d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",true);
        //
        //        //d3.select("#floatingSubjectiveTooltip").classed("hidden",false);
        //        //d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
        //        //d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
        //        //    .style("top", d3.event.pageY+  "px").classed("hidden",false);
        //
        //        d3.select("#controller").selectAll(".bar").classed("notSelected",true);
        //        d3.select("#controller").selectAll("."+taskStatus[ d.status]).classed("notSelected",false);
        //
        //
        //
        //
        //        //d3.select("#subjOverview").remove();
        //        //generateSubjectiveOverview(d3.select("#subjectiveOverviewContainer").append('div').attr("id","subjOverview"),[0,1,2,3,4,5],d.status)
        //        //
        //
        //        d3.select("#small_line_chart").remove();
        //        small_bar_chart_context(d3.select("#subjectiveOverviewContainer"), taskStatus[ d.status]);
        //
        //    }).on("mouseout",function(d){
        //        d3.select("#floatingSubjectiveTooltip").classed("hidden",true);
        //        d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",false);
        //    });

        svg.selectAll(".chart")
            .data(triangles, keyFunction).enter()
            .append("svg:image")
            .attr("xlink:href", function (d) {
                return contextMapping[d.status]
            })


        .attr("width", y.rangeBand())
            .attr("height", y.rangeBand())
            .attr("class", function (d) {
                if (taskStatus[d.status] == null) {
                    return "bar";
                }
                return "activityNoDuration bar " + taskStatus[d.status] + " day" + day + " " + d.ganttID
            })
            .attr("y", -5)
            .attr("transform", triTransform)
            // .attr("d",arc)

        .on("click", function (d) {



            onClick(d, this);

        });



        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition();
        //.call(xAxis);

        svg.append("g").attr("class", "y axis").transition().call(yAxis);

        console.log(svg.selectAll("bar"));
        svg.selectAll(".bar")

        .on("mouseover", function (d) {

            d3.select("#dayViz" + day).select(".overlay").append("rect").attr("id", "overlappingGantt").attr("style", "fill-opacity:0;  width:" + Math.max(x(d.endDate) - x(d.startDate), 2) + "; height:100%;z-index:1000; opacity:0.75;stroke-width:4; x:" + x(d.startDate)).attr("class", "otherFeature " + taskStatus[d.status]);

            generateSubjectiveSingleDetail(d, d3.select("#infoTextA"),d3.select("#infoTextC"));
            d3.selectAll(".day" + day + "." + taskStatus[d.status] + "." + d.ganttID).classed("subjectiveFeatureSelected", true);
            d3.selectAll(".dayData .day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", true);
            d3.selectAll("#small_line_chart .day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", true);
            d3.select("#zoomImage").append("img")

            .attr("src", contextMapping[d.status])
                .attr("style", "width:40");


        }).on("mouseout", function (d) {
            d3.select("#floatingSubjectiveTooltip").classed("hidden", true);
            d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", false);
            d3.selectAll(".infoText").text("");
            d3.select("#overlappingGantt").remove();
            d3.select("#zoomImage img").remove();

        })

        return gantt;

    };





    //function ganttInContainer(tasks,container) {
    //
    //    initTimeDomain();
    //    initAxis();
    //
    //    var svg = container
    //        .append("svg")
    //        .attr("class", "chart")
    //        .attr("width", width + margin.left + margin.right)
    //        .attr("height", height + margin.top + margin.bottom)
    //        .append("g")
    //        .attr("class", "gantt-chart")
    //        .attr("width", width + margin.left + margin.right)
    //        .attr("height", height + margin.top + margin.bottom)
    //        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
    //
    //    svg.selectAll(".chart")
    //        .data(tasks, keyFunction).enter()
    //        .append("rect")
    //        .attr("rx", 5)
    //        .attr("ry", 5)
    //        .attr("class", function(d){
    //            if(taskStatus[d.status] == null){ return "bar";}
    //            return taskStatus[d.status];
    //        })
    //        .attr("y", 0)
    //        .attr("transform", rectTransform)
    //        .attr("height", function(d) { return y.rangeBand(); })
    //        .attr("width", function(d) {
    //            return (x(d.endDate) - x(d.startDate));
    //        });
    //
    //
    //    svg.append("g")
    //        .attr("class", "x axis")
    //        .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
    //        .transition()
    //        .call(xAxis);
    //
    //    svg.append("g").attr("class", "y axis").transition().call(yAxis);
    //
    //    return gantt;
    //
    //};

    gantt.redraw = function () {

        initTimeDomain();
        initAxis();

        var svg = containerSVG.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rectTasks = tasks.filter(function (d) {
            return (d.startDate - d.endDate) != 0;
        });
        var triangleTasks = tasks.filter(function (d) {
            return (d.startDate - d.endDate) == 0;
        });
        var rect = ganttChartGroup.selectAll("rect").data(rectTasks, keyFunction);
        var tri = ganttChartGroup.selectAll("image.activityNoDuration").data(triangleTasks, keyFunction);
        var tri2 = ganttChartGroup.selectAll("image.activityDuration").data(rectTasks.filter(function (d) {
            return d.taskName == "Activities";
        }), keyFunction);

        rect.enter()
            .insert("rect", ":first-child")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function (d) {
                if (taskStatus[d.status] == null) {
                    return "bar";
                }
                return taskStatus[d.status] + " day" + day;;
            }).on("click", function (d) {





                d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", true);




                d3.select("#floatingSubjectiveTooltip").classed("hidden", false);
                d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
                d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
                    .style("top", d3.event.pageY + "px").classed("hidden", false);

                generateSubjectiveSingleDetail(d, d3.select("#floatingSubjectiveTooltip").append("div").attr("class", "subjectiveContainer"));






            }).on("mouseout", function (d) {
                d3.select("#floatingSubjectiveTooltip").classed("hidden", true);
                d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", false);
            })
            .transition()
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function (d) {
                return y.rangeBand();
            })
            .attr("width", function (d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.transition()
            .attr("transform", rectTransform)
            .attr("height", function (d) {
                return y.rangeBand();
            })
            .attr("width", function (d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.exit().remove();

        tri.enter()
            .insert("svg:image", ":first-child")

        .attr("xlink:href", function (d) {
                return contextMapping[d.status]
            })
            .attr("class", function (d) {
                if (taskStatus[d.status] == null) {
                    return "bar";
                }
                return taskStatus[d.status] + " day" + day;
            }).on("click", function (d) {






                d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", true);




                d3.select("#floatingSubjectiveTooltip").classed("hidden", false);
                d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
                d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
                    .style("top", d3.event.pageY + "px").classed("hidden", false);

                generateSubjectiveSingleDetail(d, d3.select("#floatingSubjectiveTooltip").append("div").attr("class", "subjectiveContainer"));





            }).on("mouseout", function (d) {
                d3.select("#floatingSubjectiveTooltip").classed("hidden", true);
                d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", false);
            })

        .transition()
            .attr("y", 0)
            .attr("transform", triTransform);;

        tri.transition()
            .attr("transform", triTransform);

        tri.exit().remove();

        tri2.enter()
            .insert("svg:image", ":first-child")

        .attr("xlink:href", function (d) {
                return contextMapping[d.status]
            })
            .attr("class", function (d) {
                if (taskStatus[d.status] == null) {
                    return "bar";
                }
                return taskStatus[d.status] + " day" + day;
            }).on("click", function (d) {






                d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", true);




                d3.select("#floatingSubjectiveTooltip").classed("hidden", false);
                d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
                d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
                    .style("top", d3.event.pageY + "px").classed("hidden", false);

                generateSubjectiveSingleDetail(d, d3.select("#floatingSubjectiveTooltip").append("div").attr("class", "subjectiveContainer"));





            }).on("mouseout", function (d) {
                d3.select("#floatingSubjectiveTooltip").classed("hidden", true);
                d3.selectAll(".day" + day + "." + taskStatus[d.status]).classed("subjectiveFeatureSelected", false);
            })

        .transition()
            .attr("y", 0)
            .attr("transform", triTransform);;

        tri2.transition()
            .attr("transform", triTransform);

        tri2.exit().remove();


        //svg.select(".x").transition().call(xAxis);
        svg.select(".y").transition().call(yAxis);



        return gantt;
    };

    gantt.toggleShowData = function () {

    };

    gantt.margin = function (value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return gantt;
    };

    gantt.day = function (value) {
        if (!arguments.length)
            return day;
        day = value;
        return gantt;
    };

    gantt.tasks = function (value) {
        if (!arguments.length)
            return margin;
        tasks = value;
        return gantt;
    };

    gantt.timeDomain = function (value) {
        if (!arguments.length)
            return [timeDomainStart, timeDomainEnd];
        timeDomainStart = +value[0], timeDomainEnd = +value[1];
        return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function (value) {
        if (!arguments.length)
            return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function (value) {
        if (!arguments.length)
            return taskTypes;
        taskTypes = value;
        return gantt;
    };

    gantt.taskStatus = function (value) {
        if (!arguments.length)
            return taskStatus;
        taskStatus = value;
        return gantt;
    };

    gantt.width = function (value) {
        if (!arguments.length)
            return width;
        width = +value;
        return gantt;
    };

    gantt.height = function (value) {
        if (!arguments.length)
            return height;
        height = +value - margin.top - margin.bottom;
        extraVert = height - margin.bottom;

        return gantt;
    };

    gantt.tickFormat = function (value) {
        if (!arguments.length)
            return tickFormat;
        tickFormat = value;
        return gantt;
    };



    return gantt;
};
