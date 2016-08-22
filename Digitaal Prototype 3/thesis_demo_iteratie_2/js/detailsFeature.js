/**
 * Created by Josi on 29/01/2016.
 */


function visualizeFeature(feature,container,cellHeightDayView){
    var smallMultiples =container;

    container.on("mousemove",function(){
        d3.select("#lineTimeIndicator")
            .style("left", (d3.event.pageX-2) + "px").classed("hidden",false);

        d3.select("#lineTimeIndicatorText")
            .style("left", (d3.event.pageX-50) + "px").style("top", (d3.event.pageY) + "px")
            .text(brushX.invert(d3.event.pageX).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"}))
            .classed("hidden",false);

    }).on("mouseout", function(){
        d3.select("#lineTimeIndicatorText").classed("hidden",true);
        d3.select("#lineTimeIndicator").classed("hidden",true);

    })
    ;

    var map_height = (Object.keys(mappingSelectedFeatureRow).length) * cellHeightDayView;
    var svg = smallMultiples
        .append("div")
        .attr("class","viz patch");
    svg.append("div").text(feature).attr("class","dayTitle");
    svg = svg.append("svg")
        .attr("class","heatmapViz patch ")
        .attr("height",map_height);




    var dataForFeature = collection_metrics[feature][0];

    var dataPerFeature = {};

    //fill dataPerFeature
    [0,1,2,3,4,5].map(function(d){
        dataPerFeature[d] = {
            yScale:d3.scale.linear()
                .domain([config_features[feature]["min"],config_features[feature]["max"]])
                .range([cellHeightDayView, 0]),
            feature:feature,
            day:d,
            data:dataForFeature.filter(function(e){ return e.row == d}),
            line : d3.svg.line()
                .x(function(k) { return x2Scale(k.col); })
                .y(function(k) { return  this.yScale(k.value); })

        }
    });




    var sparkCharts = svg.append("g")
        .attr("transform", "translate("+detailsMargin.left+","+detailsMargin.top+")")
        .attr("class","g5")

        .selectAll(".sparkChart")
        .data(d3.entries(dataPerFeature))
        .enter()
        .append("g")
        .attr("class", "sparkChart")
        .attr("transform", function(d){
            return "translate(0,"+d.key*cellHeightDayView+")"
        });



    sparkCharts.append("path")
        .datum(function(d){

            return d.value;
        })
        .attr("class", function(d){return d.feature +" line day"+ d.day})
        .attr("d", function(d){
            return d.line(d.data);
        });

// stop adding spark charts



    var movement = collection_metrics["movement"][0];


    dataForFeature.map(function(d,i){
        d["movement"] = movement[i].value;
    });

    var heatMap = svg.append("g")
            .attr("transform", "translate("+detailsMargin.left+","+detailsMargin.top+")")
            .attr("class","g3")
            .selectAll(".cell")
            .data(dataForFeature)
            .enter()
            .append("rect")
            .attr("x", function(d) {  return x2Scale(d.col); })
            .attr("y", function(d) {  return d.row * cellHeightDayView; })
            .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col);})

            .attr("style",function(d){ return  "opacity:"+Math.max(0, (d.movement - config_features.movement.min)/(config_features.movement.max - config_features.movement.min)*0.5);})
            .attr("width", cellWidthDayView)
            .attr("height", cellHeightDayView)
            .style("fill",'blue' )
            .on("mouseover", function(d){
                //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);
                d3.selectAll(".day"+d.row+".line").style("stroke","red");

                //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});

                ////Update the tooltip position and value
                //var valueBox = d3.select("#floatingTooltip")
                //    .style("left", (d3.event.pageX) + "px")
                //    .style("top", d3.event.pageY+  "px").classed("hidden",false)
                //    .select("#floatingValue");
                //var val = d.value;
                //if(d.feature == "mean_3D_position"){
                //    val = label3DPosition(val);
                //}
                //
                //valueBox.select("#floatingValueText")
                //    .text( "Value: "+ val);
                //valueBox.select("#floatingFeatureText").text("Feature: "+ d.feature );
                //
                //valueBox.select("#floatingTimeText").text(new Date(collection_day_data[d.row].date.getTime() + d.col * 300000));
                //valueBox.select("#floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
                //valueBox.select("#floatingMovementText").text("Movement: "+d.movement);
                //selectedDay =d.row;
                //selectedFeature = d.feature;
                //redrawVisualisations();
                //
                //
                ////Show the tooltip
                //d3.select("#value").classed("hidden", false);


            })
            .on("mouseout", function(){
                d3.select(this).classed("cell-hover",false);
                d3.selectAll(".rowLabel").classed("text-highlight",false);
                d3.selectAll(".colLabel").classed("text-highlight",false);
                d3.select("#value").classed("hidden", true);
                d3.select("#floatingTooltip").classed("hidden", true);
                d3.selectAll(".line").style("stroke","steelblue");

            })
        ;







    var rowLabels = svg.append("g").attr("transform", "translate("+detailsMargin.left+","+detailsMargin.top+")")
        .selectAll(".rowLabel")
        .data([0,1,2,3,4,5])
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return (i) * cellHeightDayView; })
        .style("text-anchor", "end")
        .attr("transform", "translate(0," + cellHeightDayView / 1.5 + ")")
        .attr("class", function (d,i) { return "rowLabel mono featureName"+ d+" r"+i;} )
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});









}

function visualizeDayMinimized(container,nrDay){
    var dayViz = container.append("div").attr("id","dayVizMini"+nrDay).attr("class","dayViz");
    var dayContextData =data["user1"]["smart_phone_data"][nrDay];
    //dayViz.append("div").text(dayContextData.date_begin_sleep).attr("class","dayTitle");



    var mainVizContainer =dayViz
        .append("div")
        .attr("class","mainViz full-view");

    var map_height = cellHeightDayView;
    var svg = mainVizContainer
        .append("div")
        .attr("class","viz patch")
        .append("svg")
        .attr("class","heatmapViz patch timeLine")
        .attr("height",map_height);

    var timeLineSubjContext  = mainVizContainer
        .append("div")
        .attr("class","viz subjective timeWindow timeLine");







   // var tempgantt = addTimeLineSubjContext(timeLineSubjContext,dayContextData,collection_day_data[nrDay].date,new Date(collection_day_data[nrDay].date.getTime()+24*60*60*1000),nrDay,timeFeatures.brusher.width,10,0);






    var dataForDay = collection_day_data[nrDay].data;
    var movement = dataForDay.filter(function(d){
        return d.feature  == "movement";
    });

    var meanY = dataForDay.filter(function(d){
        return d.feature  == "mean_y_norm";
    });




    var periods = generateLyingPeriods(meanY);
    var antiPeriods = generateStandingPeriods(meanY);


    dataForDay = movement;







    var dataPerFeature = {};

    //fill dataPerFeature
    ["movement"].map(function(d){
        dataPerFeature[d] = {
            yScale:d3.scale.linear()
                .domain([config_features[d]["min"],config_features[d]["max"]])
                .range([cellHeightDayView, 0]),
            feature:d,
            data:dataForDay.filter(function(e){ return e.feature == d}),
            line : d3.svg.line()
                .x(function(k) { return x2Scale(k.col); })
                .y(function(k) { return  this.yScale(k.value); })

        }
    });

    svg.append("clipPath")       // define a clip path
        .attr("id", "clipDayMini"+nrDay)
        .append("rect")
        .attr("width", width)
        .attr("height", map_height);


    //var sparkCharts = svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
    //    .attr("transform", "translate("+margin.left+","+margin.top+")")
    //    .attr("class","g5")
    //
    //    .selectAll(".sparkChart")
    //    .data(d3.entries(dataPerFeature))
    //    .enter()
    //    .append("g")
    //    .attr("class", "sparkChart")
    //    .attr("transform", function(d){
    //        return "translate(0,"+mappingSelectedFeatureRow[d.key]*cellHeightDayView+")"
    //    });



    //sparkCharts.append("path")
    //    .datum(function(d){
    //
    //        return d.value;
    //    })
    //    .attr("class", function(d){return d.feature +" line"})
    //    .attr("d", function(d){
    //        return d.line(d.data);
    //    });

// stop adding spark charts






    dataForDay.map(function(d){
        d["movement"] = movement[d.col].value;
    });

    var periodMaps = svg.append("g").style("clip-path", "url(#clipDayMini"+nrDay+")")
        .attr("transform", "translate("+detailsMargin.left+","+detailsMargin.top+")")
        .attr("class","g4")
        .selectAll(".lying")
        .data(periods)
        .enter()
        .append("g").attr("class","lyingMarker");
    periodMaps.append("rect").attr("x", function(d) {  return x2Scale(d.from); })
        .attr("y", 0)
        .attr("class", "lying")
        .attr("width", function(d) {  return x2Scale(d.to) - x2Scale(d.from); } )
        .style("fill-opacity","0")
        .style("stroke-opacity","1")
        .style("stroke","black")
        .style("stroke-width","2")
        .attr("height", map_height);




    //periodMaps
    //    .append("svg:image")
    //    .attr("xlink:href", "images/lyingPosition.png")
    //    .attr("class","figure")
    //    .attr("x",  function(d) {  return xScale(d.from)-10 + (xScale(d.to) - xScale(d.from))/2; })
    //    .attr("y", (Object.keys(mappingSelectedFeatureRow).length -1 )* cellHeightDayView-2)
    //    .attr("width", "30")
    //    .attr("height", "30");


    var heatMap = svg.append("g").style("clip-path", "url(#clipDayMini"+nrDay+")")
            .attr("transform", "translate("+detailsMargin.left+","+detailsMargin.top+")")
            .attr("class","g3")
            .selectAll(".cell")
            .data(dataForDay,function(d){return d.numMapFeature+":"+d.col;})
            .enter()
            .append("rect")
            .attr("x", function(d) {  return x2Scale(d.col); })
           // .attr("y", function(d) { return (mappingSelectedFeatureRow[d.feature]) * cellHeightDayView; })
            .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col);})
            .attr("style",function(d){

                return "opacity:"+Math.max(0, (d.movement - config_features.movement.min)/(config_features.movement.max - config_features.movement.min)*0.5)+";fill:blue";
            })
            .attr("width", cellWidthDayView)
            .attr("height", map_height);
        //    .style("fill", 'red'   );
        //    .on("mouseover", function(d){
        //        //highlight text
        //        d3.select(this).classed("cell-hover",true);
        //        d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);
        //        d3.selectAll("."+d.feature+".line").style("stroke","red");
        //
        //        //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});
        //
        //        //Update the tooltip position and value
        //        var valueBox = d3.select("#floatingTooltip")
        //            .style("left", (d3.event.pageX) + "px")
        //            .style("top", d3.event.pageY+  "px").classed("hidden",false)
        //            .select(".floatingValue");
        //        var val = d.value;
        //        if(d.feature == "mean_3D_position"){
        //            val = label3DPosition(val);
        //        }
        //
        //        valueBox.select(".floatingValueText")
        //            .text( "Value: "+ val);
        //        valueBox.select(".floatingFeatureText").text("Feature: "+ d.feature );
        //
        //        valueBox.select(".floatingTimeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
        //        valueBox.select(".floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
        //        valueBox.select(".floatingMovementText").text("Movement: "+d.movement);
        //
        //
        //
        //        //Show the tooltip
        //        d3.select("#value").classed("hidden", false);
        //        d3.select("#small_parallel_coordinates").remove();
        //        d3.select("#small_line_chart").remove();
        //        var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
        //        xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);
        //
        //
        //        d3.select("#detailsContainer").selectAll("div").remove();
        //        visualizeFeature(d.feature,d3.select("#detailsContainer"),3*cellHeightDayView);
        //
        //
        //        small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
        //        small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);
        //
        //    })
        //    .on("mouseout", function(){
        //        d3.select(this).classed("cell-hover",false);
        //        d3.selectAll(".rowLabel").classed("text-highlight",false);
        //        d3.selectAll(".colLabel").classed("text-highlight",false);
        //        d3.select("#value").classed("hidden", true);
        //        d3.select("#floatingTooltip").classed("hidden", true);
        //        d3.selectAll(".line").style("stroke","steelblue");
        //
        //    })
        //;



    var antiPeriodMaps = svg.append("g").style("clip-path", "url(#clipDayMini"+nrDay+")")
        .attr("transform", "translate("+detailsMargin.left+","+detailsMargin.top+")")
        .attr("class","g4")
        .selectAll(".standing")
        .data(antiPeriods)
        .enter()
        .append("g");
    antiPeriodMaps.append("rect").attr("x", function(d) {  return x2Scale(d.from); })
        .attr("y", 0)
        .attr("class", "standing")
        .attr("width", function(d) {  return x2Scale(d.to) - x2Scale(d.from); } )
        .style("fill-opacity","1")

        .attr("height", map_height);



    //var rowLabels = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")")
    //    .selectAll(".rowLabel")
    //    .data(Object.keys(mappingSelectedFeatureRow))
    //    .enter()
    //    .append("text")
    //    .text(function (d) { return d; })
    //    .attr("x", 0)
    //    .attr("y", function (d, i) { return (i) * cellHeightDayView; })
    //    .style("text-anchor", "end")
    //    .attr("transform", "translate(0," + cellHeightDayView / 1.5 + ")")
    //    .attr("class", function (d,i) { return "rowLabel mono featureName"+ d+" r"+i;} )
    //    .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
    //    .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);});




    d3.select("#order").on("change",function(){
        order(this.value);
    });




}



