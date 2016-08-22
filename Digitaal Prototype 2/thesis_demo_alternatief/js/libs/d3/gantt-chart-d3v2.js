/**
 * @author Dimitry Kudrayvtsev
 * @version 2.0
 */

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";
    var containerSVG;
    var margin = {
        top : 2,
        right : 40,
        bottom : 12,
        left : 90
    };
    var tasks = [];
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = document.body.clientHeight - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;
    var extraVert = document.body.clientHeight - margin.top - margin.bottom-5;
    var day ;

    var tickFormat = "%H:%M";
    var arc = d3.svg.symbol().type('triangle-up')
        .size(50);


    var keyFunction = function(d) {
        return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
        return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    var triTransform = function(d) {
        return "translate(" + x(d.startDate) + "," + (y(d.taskName)+5) + ")";
    };

    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(8).tickPadding(8);

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function() {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (tasks === undefined || tasks.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            tasks.sort(function(a, b) {
                return a.endDate - b.endDate;
            });
            timeDomainEnd = tasks[tasks.length - 1].endDate;
            tasks.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = tasks[0].startDate;
        }
    };

    var initAxis = function() {
        x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
        y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(8).tickPadding(8);

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function generateSubjectiveSingleDetail(obj, container){
        var container = container;



        container.append("div").append("p").text(function(d){
            if (d.endDate == d.startDate){
                return  taskStatus[ d.status]+": "+" om "+ d.startDate ;
            }else{
                return taskStatus[ d.status]+": "+" van "+ d.startDate +" tot "+ d.endDate ;
            }

        }(obj));



    }

    function gantt(tasks,container) {
        initTimeDomain();
        initAxis();
        containerSVG = container;

        var rects = tasks.filter(function(d){return (d.startDate - d.endDate) != 0;});
        var triangles = tasks.filter(function(d){return (d.startDate - d.endDate) == 0;});



        var svg = container
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "gantt-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + (margin.top - ( height - extraVert -margin.bottom)) + ")");

        svg.selectAll(".chart")
            .data(rects, keyFunction).enter()
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status]+" day"+day;
            })
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            })
            .on("mouseover", function(d){


                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",true);

                d3.select("#floatingSubjectiveTooltip").classed("hidden",false);
                d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
                d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
                    .style("top", d3.event.pageY+  "px").classed("hidden",false);

                generateSubjectiveSingleDetail(d,d3.select("#floatingSubjectiveTooltip").append("div").attr("class","subjectiveContainer"));





            }).on("mouseout",function(d){
                d3.select("#floatingSubjectiveTooltip").classed("hidden",true);
                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",false);
            });






        svg.selectAll(".chart")
            .data(triangles, keyFunction).enter()
            .append("path")
            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status]+" day"+day;
            })
            .attr("y",0 )
            .attr("transform", triTransform)
            .attr("d",arc).on("mouseover", function(d){





                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",true);




                d3.select("#floatingSubjectiveTooltip").classed("hidden",false);
                d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
                d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
                    .style("top", d3.event.pageY+  "px").classed("hidden",false);

                generateSubjectiveSingleDetail(d,d3.select("#floatingSubjectiveTooltip").append("div").attr("class","subjectiveContainer"));





            }).on("mouseout",function(d){
                d3.select("#floatingSubjectiveTooltip").classed("hidden",true);
                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",false);
            });



        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        svg.append("g").attr("class", "y axis").transition().call(yAxis);

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

    gantt.redraw = function() {

        initTimeDomain();
        initAxis();

        var svg = containerSVG.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rectTasks  = tasks.filter(function(d){return (d.startDate - d.endDate) != 0;});
        var triangleTasks  = tasks.filter(function(d){return (d.startDate - d.endDate) == 0;});
        var rect = ganttChartGroup.selectAll("rect").data(rectTasks, keyFunction);
        var tri = ganttChartGroup.selectAll("path").data(triangleTasks, keyFunction);

        rect.enter()
            .insert("rect",":first-child")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status]+" day"+day;;
            }).on("mouseover", function(d){





                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",true);




                d3.select("#floatingSubjectiveTooltip").classed("hidden",false);
                d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
                d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
                    .style("top", d3.event.pageY+  "px").classed("hidden",false);

                generateSubjectiveSingleDetail(d,d3.select("#floatingSubjectiveTooltip").append("div").attr("class","subjectiveContainer"));





            }).on("mouseout",function(d){
                d3.select("#floatingSubjectiveTooltip").classed("hidden",true);
                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",false);
            })
            .transition()
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.exit().remove();

        tri.enter()
            .insert("path",":first-child")

            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status]+" day"+day;
            }).on("mouseover", function(d){






                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",true);




                d3.select("#floatingSubjectiveTooltip").classed("hidden",false);
                d3.select("#floatingSubjectiveTooltip").select(".subjectiveContainer").remove();
                d3.select("#floatingSubjectiveTooltip").style("left", (d3.event.pageX) + "px")
                    .style("top", d3.event.pageY+  "px").classed("hidden",false);

                generateSubjectiveSingleDetail(d,d3.select("#floatingSubjectiveTooltip").append("div").attr("class","subjectiveContainer"));





            }).on("mouseout",function(d){
                d3.select("#floatingSubjectiveTooltip").classed("hidden",true);
                d3.selectAll(".day"+day+"."+ taskStatus[ d.status]).classed("subjectiveFeatureSelected",false);
            })

            .transition()
            .attr("y", 0)
            .attr("transform", triTransform)
            .attr("d",arc);

        tri.transition()
            .attr("transform", triTransform);

        tri.exit().remove();


        svg.select(".x").transition().call(xAxis);
        svg.select(".y").transition().call(yAxis);



        return gantt;
    };

    gantt.toggleShowData = function(){

    };

    gantt.margin = function(value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return gantt;
    };

    gantt.day =  function(value) {
        if (!arguments.length)
            return day;
        day = value;
        return gantt;
    };

    gantt.tasks = function(value) {
        if (!arguments.length)
            return margin;
        tasks = value;
        return gantt;
    };

    gantt.timeDomain = function(value) {
        if (!arguments.length)
            return [ timeDomainStart, timeDomainEnd ];
        timeDomainStart = +value[0], timeDomainEnd = +value[1];
        return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
        if (!arguments.length)
            return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function(value) {
        if (!arguments.length)
            return taskTypes;
        taskTypes = value;
        return gantt;
    };

    gantt.taskStatus = function(value) {
        if (!arguments.length)
            return taskStatus;
        taskStatus = value;
        return gantt;
    };

    gantt.width = function(value) {
        if (!arguments.length)
            return width;
        width = +value;
        return gantt;
    };

    gantt.height = function(value) {
        if (!arguments.length)
            return height;
        height = +value- margin.top - margin.bottom;
        extraVert = height - margin.bottom;

        return gantt;
    };

    gantt.tickFormat = function(value) {
        if (!arguments.length)
            return tickFormat;
        tickFormat = value;
        return gantt;
    };



    return gantt;
};
