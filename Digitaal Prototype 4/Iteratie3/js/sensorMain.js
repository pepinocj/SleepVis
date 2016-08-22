

margin = {top: 0, right: 10, bottom: 10, left: 90},
    width = document.body.clientWidth*0.5 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
 xScale = d3.scale.linear().range([0, width]).domain([0,300]);


cellHeightDayView = 10;

var selectedDay = 0;
var selectedFeature;
d3.json("data/myfile_flattened_update.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;






    initButtons();
    add_features();
    createScalesContextData();
    generateSelectors();


    generateNewMapping();

    //visualizeDay(0);
    draw_cubism(d3.select("#cubchart").append("div").attr("id","cubContainer"),0);
    for (var key in mappingSelectedFeatureRow){

        visualizeFeature(key, d3.select("#smallMultiples"),cellHeightDayView)  ;

    }
    selectedFeature =Object.keys(mappingSelectedFeatureRow)[0];
    visualizeFeature(selectedFeature, d3.select("#focusedFeature").append("div").attr("id","featureContainer"),3*cellHeightDayView)  ;


    invokeButtons();




});


function redrawVisualisations(){
    d3.select("#cubchart").select("#cubContainer").remove();
    d3.select("#focusedFeature").select("#featureContainer").remove();

    draw_cubism(d3.select("#cubchart").append("div").attr("id","cubContainer"),selectedDay);
    visualizeFeature(selectedFeature, d3.select("#focusedFeature").append("div").attr("id","featureContainer"),3*cellHeightDayView)  ;

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


function draw_cubism(container,day){
    var context = cubism.context().step(300000) // Distance between data points in milliseconds
        .size(300) // Number of data points
        .stop();   // Fetching from a static data source; don't update values;


    //container.style("margin-left",margin.left);


    container.selectAll(".axis")
        .data(["top", "bottom"])
        .enter().append("div")
        .attr("class", function(d) { return d + " axis"; })
        .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });


    container.append("div")
        .attr("class", "rule")
        .call(context.rule());



    container.selectAll(".horizon")
        .data(Object.keys(mappingSelectedFeatureRow).map(getValue))
        .enter().insert("div", ".bottom")
        .attr("class", "horizon")
        .call(function(d){
            return (context.horizon())(d);
        });



    context.on("focus", function(i) {
        d3.selectAll(".value").style("left", i == null ? null :  i + "px");
    });





    // Replace this with context.graphite and graphite.metric!
    function getValue(name) {

        var middle = (config_features[name].max + config_features[name].min)/2;


        var fx = context.metric(function (start, stop, step, callback) {
            var values = collection_metrics[name][0].filter(function(d){return d.row == day;});
            values = values.map(function(d){return d.value - 0});
            callback(null, values);

        }, name) ;

        fx.extent = function(){return [config_features[name].min,config_features[name].max]};
        return fx;

    }
}


function visualizeFeature(feature,container,cellHeightDayView){
    var smallMultiples =container;

    var map_height = (Object.keys(mappingSelectedFeatureRow).length+1) * cellHeightDayView;
    var svg = smallMultiples
        .append("div")
        .attr("class","viz patch");
    svg.append("div").text(feature).attr("class","dayTitle");
    svg = svg.append("svg")
        .attr("class","heatmapViz patch ")
        .attr("height",map_height);


    //var timeLineObjExternContext  = mainVizContainer
    //    .append("div")
    //    .attr("class","viz objectiveExtern timeWindow")
    //    .append("svg")
    //    .attr("class","heatmapViz smartphone ");






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
                .x(function(k) { return xScale(k.col); })
                .y(function(k) { return  this.yScale(k.value); })

        }
    });




    var sparkCharts = svg.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
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
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","g3")
            .selectAll(".cell")
            .data(dataForFeature)
            .enter()
            .append("rect")
            .attr("x", function(d) {  return xScale(d.col); })
            .attr("y", function(d) {  return d.row * cellHeightDayView; })
            .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col);})
            .attr("style",function(d){ return "opacity:0.3"})
            .attr("width", cellWidthDayView)
            .attr("height", cellHeightDayView)
            .style("fill", function(d){
                return collection_metrics.movement[1](d.movement);   } )
            .on("mouseover", function(d){
                //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName"+ d.feature).classed("text-highlight",true);
                d3.selectAll(".day"+d.row+".line").style("stroke","red");

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

                valueBox.select("#floatingTimeText").text(new Date(collection_day_data[d.row].date.getTime() + d.col * 300000));
                valueBox.select("#floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
                valueBox.select("#floatingMovementText").text("Movement: "+d.movement);
                selectedDay =d.row;
                selectedFeature = d.feature;
                redrawVisualisations();


                //Show the tooltip
                d3.select("#value").classed("hidden", false);


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







    var rowLabels = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")")
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







