var brush = d3.svg.brush()
    .x(x2Scale)
    .on("brush", brushed);

function brushed() {

    xScale.domain(brush.empty() ? x2Scale.domain() : brush.extent());
    var widthScale = (brush.extent()[1] - brush.extent()[0]) / (x2Scale.domain()[1] - x2Scale.domain()[0]);
    var filteredData;

    for (var k = 0; k < collection_day_data.length; k++) {
        if (collection_day_data[k].active) {

            filteredData = [];
            var dayData = collection_day_data[k].data;

            dayData = dayData.filter(function(d){
                return config_features[d.feature].active;
            });


            for (var i = 0; i < dayData.length; i++) {

                if (dayData[i].col < brush.extent()[1] && dayData[i].col > brush.extent()[0]) {
                    filteredData.push(dayData[i]);
                }
            }
            var tempD = collection_day_data[k].date;
            var tempG = collection_day_data[k]["ganttChart"];
            xTimeScale.domain([new Date(tempD.getTime() + brush.extent()[0] * 300000), new Date(tempD.getTime() + brush.extent()[1] * 300000)]);

            update(filteredData, d3.selectAll("#dayViz" + k).select(".viz.patch"), widthScale,k); //sleect all, call(update(this))


            tempG.timeDomain([new Date(tempD.getTime() + brush.extent()[0] * 300000), new Date(tempD.getTime() + brush.extent()[1] * 300000)]);
            tempG.redraw();
        }
    }

}


function update(data,svg,widthScale,nrDay) {

    // DATA JOIN
    // Join new data with old elements, if any.
    var text = svg.select(".g3").selectAll(".cell")//JUISTE GROEP SELECTEREN, VANDAAR .g3
        .data(data, function(d){return d.numMapFeature+":"+d.col});

    // UPDATE
    // Update old elements as needed.
    text.attr("x", function(d) { return xScale(d.col); })
        .attr("width", function(d) { return ((cellWidthDayView) * 1/widthScale); });

    // ENTER
    // Create new elements as needed.


    text.enter()
        .append("rect")
        .attr("x", function(d) {  return xScale(d.col); })
        .attr("y", function(d) { return (mappingSelectedFeatureRow[d.feature]) * cellHeightDayView; })
        .attr("class", function(d){return "cell cell-border cr"+(d.numMapFeature)+" cc"+(d.col);})
        .attr("width",((cellWidthDayView) * 1/widthScale))
        .attr("height", cellHeightDayView)
        .style("fill", function(d) { return collection_metrics[d.feature][1](d.value); })
        .on("mouseover", function(d){
            //highlight text
            d3.select(this).classed("cell-hover",true);
            d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);
            //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});

            //Update the tooltip position and value
            var valueBox = d3.select("#tooltip")
                //.style("left", (d3.event.pageX+10) + "px")
                //.style("top", (d3.event.pageY-10) + "px")
                .select("#value");
            var val = d.value;
            if(d.feature == "mean_3D_position"){
                val = label3DPosition(val);
            }

            valueBox.select("#valueText")
                .text( "Value: "+ val);
            valueBox.select("#featureText").text("Feature: "+ d.feature );

            valueBox.select("#timeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
            valueBox.select("#legend").remove();
            var legendContainer = valueBox.append("div").attr("id","legend");
            if(d.feature == "mean_3D_position"){
                generate2DPositionsLegend(d.feature,legendContainer);
            }else{
                generateLegend(d.feature,legendContainer);
            }



            //Show the tooltip
            d3.select("#value").classed("hidden", false);
            d3.select("#small_parallel_coordinates").remove();
            d3.select("#small_line_chart").remove();
            var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
            xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);

            small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
            small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);
        })
        .on("mouseout", function(){
            d3.select(this).classed("cell-hover",false);
            d3.selectAll(".rowLabel").classed("text-highlight",false);
            d3.select("#value").classed("hidden", true);
        })
    ;

    // EXIT
    // Remove old elements as needed.
    text.exit().remove();

}




d3.json("data/myfile_flattened_update.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;



    svgContext = d3.select("#slider").append("svg").attr("class", "context").attr("height",20).attr("width",timeFeatures.brusher.width);//d3.select("#chart").append("svg").attr("class", "context").attr("height",30).attr("width",width);

    svgContext.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -2)
        .attr("height", 20);
    verDetail = d3.select(".detailsCell.vertical");
    horDetail = d3.select(".detailsCell.horizontal");


    initButtons();
    add_features();
    createScalesContextData();
    generateSelectors();


    generateNewMapping();
    visualizeDay(0);
    visualizeDay(1);
    visualizeDay(2);
    visualizeDay(3);
    visualizeDay(4);
    visualizeDay(5);
//        visualizeDay(2);





});


function redrawVisualisations(){
    d3.select("#chart").selectAll(".dayViz").remove();


    visualizeDay(0);
    visualizeDay(1);
    visualizeDay(2);
    visualizeDay(3);
    visualizeDay(4);
    visualizeDay(5);
    if(!brush.empty()){
        brushed();
    }

    invokeButtons();

}


function add_features(){

    var feat_keys = Object.keys(config_features);

    var days;
    for (var key in config_features){


        var temp = getVisualDataForFeature(config_features[key]['type'],key,false);
        var processedData = temp[0];
        days = temp[1];
        add_metric(key,[processedData,d3.scale.quantile()
            .domain([ config_features[key]['min'] ,  config_features[key]['max']])
            .range(config_features[key]['color'])] ) ;
    }

    add3DPosition();

    var nrDays = days.length;
    for (var j = 0 ; j < nrDays;j++){
        var dataForDay = [];

        for (var key in collection_metrics){
            for (var i = 0 ; i < collection_metrics[key][0].length;i++){
                if(collection_metrics[key][0][i].row == j){
                    dataForDay.push(collection_metrics[key][0][i]);
                }
            }
        }


        collection_day_data.push({data:dataForDay,date: days[j],nrDay:j,ganttChart:"none",active:false,smartPhoneData:"none"});

    }

    for (var j = 0 ; j < nrDays;j++){

        collection_day_data[j].smartPhoneData = preprocessSmartPhoneData(data["user1"]["smart_phone_data"][j]);
    }









}

function getFeatureDataForDay(feature,day){
    var result = [];
    var dayData =collection_day_data[day].data;
    for (var i = 0 ; i<dayData.length;i++){

        if(dayData[i].feature == feature){
            result.push( dayData[i]);
        }
    }
    return result;


}

function getEpochData(day,epoch){
    var result = {};
    var dayData =collection_day_data[day].data;
    for (var i = 0 ; i<dayData.length;i++){
        if(dayData[i].col == epoch){
            result[dayData[i].feature] = dayData[i].value;
        }
    }
    return result;
}



//default --> row == date, col == epoch, val = featureVal
//for now: mapping val to [-10,10]
//horSort --> quantity horSortRow/Col
//verSort --> for distribution vertSortRow/Col
function visualizeDay(nrDay){
    var dayViz = d3.select("#chart").append("div").attr("id","dayViz"+nrDay).attr("class","dayViz");
    var dayContextData =data["user1"]["smart_phone_data"][nrDay];
    dayViz.append("div").text(dayContextData.date_begin_sleep).attr("class","dayTitle");
    var contextBefore = dayViz.append("div").attr("class","subjContext before");
    var contextAfter =dayViz.append("div").attr("class","subjContext after");
    var mainVizContainer =dayViz
        .append("div")
        .attr("class","mainViz");

    var map_height = (Object.keys(mappingSelectedFeatureRow).length+1) * cellHeightDayView;
    var svg = mainVizContainer
        .append("div")
        .attr("class","viz patch")
        .append("svg")
        .attr("class","heatmapViz patch ")
    .attr("height",map_height);

    var timeLineSubjContext  = mainVizContainer
        .append("div")
        .attr("class","viz subjective timeWindow");


    //var timeLineObjExternContext  = mainVizContainer
    //    .append("div")
    //    .attr("class","viz objectiveExtern timeWindow")
    //    .append("svg")
    //    .attr("class","heatmapViz smartphone ");




    collection_day_data[nrDay]["ganttChart"] = addTimeLineSubjContext(timeLineSubjContext,dayContextData,collection_day_data[nrDay].date,new Date(collection_day_data[nrDay].date.getTime()+24*60*60*1000),nrDay);
    collection_day_data[nrDay]["active"]=true;



    addContextBefore(contextBefore,dayContextData,nrDay);
    addContextAfter(contextAfter,dayContextData,nrDay);




    var dataForDay = collection_day_data[nrDay].data;

    dataForDay = dataForDay.filter(function(d){
        return config_features[d.feature].active;
    });



    var brush = d3.svg.brush()
        .x(x2Scale)
        .on("brush", brushed);





    var heatMap = svg.append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","g3")
            .selectAll(".cell")
            .data(dataForDay,function(d){return d.numMapFeature+":"+d.col;})
            .enter()
            .append("rect")
            .attr("x", function(d) {  return xScale(d.col); })
            .attr("y", function(d) { return (mappingSelectedFeatureRow[d.feature]) * cellHeightDayView; })
            .attr("class", function(d){return "cell cell-border cr"+(d.numMapFeature)+" cc"+(d.col);})
            .attr("width", cellWidthDayView)
            .attr("height", cellHeightDayView)
            .style("fill", function(d) { return collection_metrics[d.feature][1](d.value); })
            .on("mouseover", function(d){
                //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);
                //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});

                //Update the tooltip position and value
                var valueBox = d3.select("#tooltip")
                    //.style("left", (d3.event.pageX+10) + "px")
                    //.style("top", (d3.event.pageY-10) + "px")
                    .select("#value");
                var val = d.value;
                if(d.feature == "mean_3D_position"){
                    val = label3DPosition(val);
                }

                valueBox.select("#valueText")
                    .text( "Value: "+ val);
                valueBox.select("#featureText").text("Feature: "+ d.feature );

                valueBox.select("#timeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
                valueBox.select("#legend").remove();
                var legendContainer = valueBox.append("div").attr("id","legend");
                if(d.feature == "mean_3D_position"){
                    generate2DPositionsLegend(d.feature,legendContainer);
                }else{
                    generateLegend(d.feature,legendContainer);
                }



                //Show the tooltip
                d3.select("#value").classed("hidden", false);
                d3.select("#small_parallel_coordinates").remove();
                d3.select("#small_line_chart").remove();
                var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
                xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);

                small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
                small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);

            })
            .on("mouseout", function(){
                d3.select(this).classed("cell-hover",false);
                d3.selectAll(".rowLabel").classed("text-highlight",false);
                d3.selectAll(".colLabel").classed("text-highlight",false);
                d3.select("#value").classed("hidden", true);

            })
        ;

    var rowLabels = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")")
        .selectAll(".rowLabel")
        .data(Object.keys(mappingSelectedFeatureRow))
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


    d3.select("#order").on("change",function(){
        order(this.value);
    });




}

function generateLegend(feature,container){

    var legendContainer = container.append("div").attr("class","legendContainer");


    var legendElementWidth = 20;


    var start = config_features[feature].min;
    var end = config_features[feature].max;
    var dif = end - start;
    var steps = config_features[feature].color.length;
    var stepSize = dif/steps;
    var legendWidth = steps * legendElementWidth;
    var tempData = [];

    for (var i = 0 ; i< steps ; i++){
        tempData.push(start + i*stepSize);
    }

    legendContainer.append("p").attr("class","boundaries legendItem").text("Min:"+start);

    var svg_legend = legendContainer.append("svg").attr("class","legendSVG legendItem").attr("width",legendWidth).attr("height", 50);
    legendContainer.append("p").attr("class","boundaries legendItem").text("Max:"+end);
    var legend = svg_legend.selectAll(".legend")
        .data(tempData)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i; })
        .attr("y", 0)
        .attr("width", legendElementWidth)
        .attr("height", cellHeightDayView)
        .style("fill", function(d, i) { return collection_metrics[feature][1](d); });

    //legend.append("text")//.attr("transform","rotate(20)")
    //    .attr("class", "mono")
    //    .text(function(d) { return Math.round(d*100)/100; })
    //    .attr("width", legendElementWidth)
    //    .attr("x", function(d, i) { return legendElementWidth * i; })
    //    .attr("y", 10);

    return legend;
}


function generate2DPositionsLegend(feature,container){

    var legendContainer = container.append("div").attr("class","legendContainer");


    var legendElementWidth = 30;



    var steps = d3.entries(posMapping).length;

    var legendWidth = steps * legendElementWidth*2;
    var tempData = d3.entries(posMapping);





    var svg_legend = legendContainer.append("svg").attr("class","legendSVG legendItem").attr("width",legendWidth).attr("height", 50);

    var legend = svg_legend.selectAll(".legend")
        .data(tempData)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
        .attr("x", function(d, i) { return 2*legendElementWidth * i; })
        .attr("y", 0)
        .attr("width", legendElementWidth)
        .attr("height", cellHeightDayView)
        .style("fill", function(d, i) { console.log(d.key);return getColorOfBin(d.key); });

    legend.append("text")//.attr("transform","rotate(20)")
        .attr("class", "mono")
        .text(function(d) { return d.value; })
        .attr("width", legendElementWidth)
        .attr("x", function(d, i) { return (2*legendElementWidth * i); })
        .attr("y", 20);

    return legend;
}







