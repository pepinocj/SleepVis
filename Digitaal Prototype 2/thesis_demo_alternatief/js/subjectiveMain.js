/**
 * Created by Josi on 20/12/2015.
 */
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


    var dataForDay = data;
    var movement = dataForDay.filter(function(d){
        return d.feature  == "movement";
    });

    var meanY = dataForDay.filter(function(d){
        return d.feature  == "mean_y_norm";
    });

    var periods = generateLyingPeriods(meanY);
    var antiPeriods = generateStandingPeriods(meanY);

    dataForDay = dataForDay.filter(function(d){ // kon ook aan de hand van mappingFeaturePerRow
        return config_features[d.feature].active;
    });





    svg.selectAll(".line")
        .attr("d", function(d){
            return d.line(d.data);
        });




    // DATA JOIN
    // Join new data with old elements, if any.
    var rects = svg.select(".g3").selectAll(".cell")//JUISTE GROEP SELECTEREN, VANDAAR .g3
        .data(data, function(d){return d.numMapFeature+":"+d.col});

    // UPDATE
    // Update old elements as needed.
    rects.attr("x", function(d) { return xScale(d.col); })
        .attr("width", function(d) { return ((cellWidthDayView) * 1/widthScale); });

    // ENTER
    // Create new elements as needed.


    rects.enter()
        .append("rect")
        .attr("x", function(d) {  return xScale(d.col); })
        .attr("y", function(d) { return (mappingSelectedFeatureRow[d.feature]) * cellHeightDayView; })
        .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col);})
        .attr("style",function(d){ return "opacity:"+Math.max(0, (d.movement - config_features.movement.min)/(config_features.movement.max - config_features.movement.min))})
        .attr("width", cellWidthDayView)
        .attr("height", cellHeightDayView)
        .style("fill", function(d){
            return collection_metrics.movement[1](d.movement);   } )
        .on("mouseover", function(d){
            //highlight text
            d3.select(this).classed("cell-hover",true);
            d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);
            d3.selectAll("."+d.feature+".line").style("stroke","red");

            //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});

            //Update the tooltip position and value
            var valueBox = d3.select("#floatingTooltip")
                .style("left", (d3.event.pageX) + "px")
                .style("top", d3.event.pageY+  "px").classed("hidden",false)
                .select("#floatingValue");
            var val = d.value;
            if(d.feature == "mean_3D_position"){
                val = label3DPosition(val);
            }

            valueBox.select("#floatingValueText")
                .text( "Value: "+ val);
            valueBox.select("#floatingFeatureText").text("Feature: "+ d.feature );

            valueBox.select("#floatingTimeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
            valueBox.select("#floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
            valueBox.select("#floatingMovementText").text("Movement: "+d.movement);



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
            d3.select("#floatingTooltip").classed("hidden", true);
            d3.selectAll(".line").style("stroke","steelblue");

        })
    ;

    // EXIT
    // Remove old elements as needed.
    rects.exit().remove();




    var periodMaps = svg.selectAll(".lying").attr("x", function(d) {  return xScale(d.from); })
        .attr("width", function(d) {  return xScale(d.to) - xScale(d.from); } );

    var antiPeriodMaps = svg.selectAll(".standing").attr("x", function(d) {  return xScale(d.from); })
        .attr("width", function(d) {  return xScale(d.to) - xScale(d.from); } );

    var figures = svg.selectAll(".figure")
        .attr("x",  function(d) {  return xScale(d.from)-10 + (xScale(d.to) - xScale(d.from))/2; })
        .attr("y", (Object.keys(mappingSelectedFeatureRow).length -1 )* cellHeightDayView);








}




d3.json("data/myfile_flattened_update.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;



    svgContext = d3.select("#slider").append("svg").style("left",margin.left).attr("class", "context")
        .attr("height",20)
        .attr("width",width);//d3.select("#chart").append("svg").attr("class", "context").attr("height",30).attr("width",width);

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
    invokeButtons();




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

    var dayData = collection_day_data[day].data.filter(function(d){ // kon ook aan de hand van mappingFeaturePerRow
        return config_features[d.feature].active;
    });
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
function visualizeSubjectiveFeature(feature){
    var dayViz = d3.select("#chart").append("div").attr("id","dayViz"+nrDay).attr("class","dayViz");
    var dayContextData =data["user1"]["smart_phone_data"][nrDay];
    dayViz.append("div").text(feature).attr("class","dayTitle");
    var contextBefore = dayViz.append("div").attr("class","subjContext before");
    var contextAfter =dayViz.append("div").attr("class","subjContext after");
    var mainVizContainer =dayViz
        .append("div")
        .attr("class","mainViz");


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




    ganttWrapperSmallMultipleFunction(timeLineSubjContext,dayContextData,collection_day_data[0].date,new Date(collection_day_data[0].date.getTime()+24*60*60*1000),nrDay);















}











