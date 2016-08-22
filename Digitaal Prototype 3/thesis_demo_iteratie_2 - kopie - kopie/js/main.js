

function brushed() {

    d3.selectAll(".overviewBorders").remove();

    var overViewChart = d3.select("#overviewBox");
    overViewChart.append('div').attr("class","overviewBorders").style("left",x2Scale(brush.extent()[0]));
    overViewChart.append('div').attr("class","overviewBorders").style("left",x2Scale(brush.extent()[1]));




    xScale.domain(brush.empty() ? x2Scale.domain() : brush.extent());


    var widthScale = (brush.extent()[1] - brush.extent()[0]) / (x2Scale.domain()[1] - x2Scale.domain()[0]);
    var filteredData;

    for (var k = 0; k < collection_day_data.length; k++) {
        if (collection_day_data[k].active) {

            filteredData = [];
            var dayData = collection_day_data[k].data;

            dayData = dayData.filter(function(d){

                return mappingSelectedFeatureRow[d.feature]!= undefined;
            });


            for (var i = 0; i < dayData.length; i++) {

                if (dayData[i].col < brush.extent()[1] && dayData[i].col > brush.extent()[0]) {
                    filteredData.push(dayData[i]);
                }
            }
            var tempD = collection_day_data[k].date;
            var tempG = collection_day_data[k]["ganttChart"];
            xTimeScale.domain([new Date(tempD.getTime() + brush.extent()[0] * 300000), new Date(tempD.getTime() + brush.extent()[1] * 300000)]);

            update(filteredData, d3.selectAll("#dayViz" + k).select(".viz.patch"), widthScale,k,getCellHeightMainViz()); //sleect all, call(update(this))


            tempG.timeDomain([new Date(tempD.getTime() + brush.extent()[0] * 300000), new Date(tempD.getTime() + brush.extent()[1] * 300000)]);
            tempG.redraw();
            chartX.domain([new Date(tempD.getTime() + brush.extent()[0] * 300000), new Date(tempD.getTime() + brush.extent()[1] * 300000)]);
            d3.select(".top").select(".chartAxis").call(chartXAxis.orient("top"));
            d3.select(".bottom").select(".chartAxis").call(chartXAxis.orient("bottom"));
        }
    }

}


function update(data,svg,widthScale,nrDay,cellHeightDayView) {


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





//   svg.selectAll(".line")
//        .attr("d", function(d){
//            return d.line(d.data);
//        });




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
            .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col)+ " day"+nrDay;})
            .attr("style",function(d){

                return "opacity:"+Math.max(0, (d.movement - config_features.movement.min)/(config_features.movement.max - config_features.movement.min)*0.5)
            })
            .attr("width", cellWidthDayView)
            .attr("height", cellHeightDayView)
            .style("fill", 'blue'   )
            .on("mouseover", function(d){
            //    //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName."+ d.feature).classed("text-highlight",true);
                d3.selectAll("."+d.feature+".line").style("stroke","red");
                d3.select("#selectedEpoch").remove();
                drawSelectedEpoch(pc1.svg,pc1.xscale,pc1.yscale,getEpochData(d.row, d.col,nrDay));

            //
            //    //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});
            //
            //    //Update the tooltip position and value
                function toStringMovement(nr,min,max){
                    var perc = (nr-min)/(max);
                    perc = perc/0.2;
                    perc = perc * 10;
                    
                    var rounded = Math.round(perc);
                    var stringResult;


                    switch(rounded) {
                        case 0:
                            stringResult= "Very low";
                            break;
                        case 1:
                            stringResult= "low";
                            break;
                        case 2:
                            stringResult= "Medium";
                            break;
                        case 3:
                            stringResult= "High";
                            break;
                        case 4:
                            stringResult= "Very high";
                            break;
                        case 5:
                            stringResult= "Maximum";
                            break;

                        default:
                            stringResult= "N.A."
                    }


                    if(rounded<0){
                        stringResult= "Minimal"
                    }
                    if(rounded>5){
                        stringResult= "Maximum"
                    }
                    return stringResult;
                }
               d3.select("#infoTextA").text(config_features[d.feature].name+": "+ d.value);
               d3.select("#epochInspecting").text(d.col+" at "+(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"}));
               d3.select("#infoTextB").text("Movement: "+  toStringMovement(d.movement,config_features.movement.min,config_features.movement.max));
                d3.select("#infoTextBBox");

            //        .style("left", (d3.event.pageX) + "px")
            //        .style("top", d3.event.pageY+  "px").classed("hidden",false)
            //        .select(".floatingValue");
            //    var val = d.value;
            //    if(d.feature == "mean_3D_position"){
            //        val = label3DPosition(val);
            //    }
            //
            //    valueBox.select(".floatingValueText")
            //        .text( "Value: "+ val);
            //    valueBox.select(".floatingFeatureText").text("Feature: "+ d.feature );
            //
            //    valueBox.select(".floatingTimeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
            //    valueBox.select(".floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
            //    valueBox.select(".floatingMovementText").text("Movement: "+d.movement);
            //
            //
            //
            //    //Show the tooltip
            //    d3.select("#value").classed("hidden", false);
            //    d3.select("#small_parallel_coordinates").remove();
            //    d3.select("#small_line_chart").remove();
            //    var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
            //    xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);
            //
            //
            //    //d3.select("#detailsContainer").selectAll("div").remove();
            //    //visualizeFeature(d.feature,d3.select("#detailsContainer"),3*cellHeightDayView);
            //
            //
            //    small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
            //    small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);
            //
            })
            .on("mouseout", function(){
                d3.select(this).classed("cell-hover",false);
                d3.selectAll(".rowLabel").classed("text-highlight",false);
                d3.selectAll(".colLabel").classed("text-highlight",false);
                d3.select("#value").classed("hidden", true);
                d3.select("#floatingTooltip").classed("hidden", true);
                d3.selectAll(".line").style("stroke","black");

                d3.selectAll(".infoText").text("");

            })
            .on("click", function(d){
                var r = confirm("Focus on "+ d.feature);
                if (r == true) {
                    focusFeature(d.feature);
                }

            })
        ;

    // EXIT
    // Remove old elements as needed.
    rects.exit().remove();




    var periodMaps = svg.selectAll(".lying").attr("x", function(d) {  return xScale(d.from); })
        .attr("width", function(d) {  return xScale(d.to) - xScale(d.from); } );

    var antiPeriodMaps = svg.selectAll(".standing rect").attr("x", function(d) {  return xScale(d.from); })
        .attr("width", function(d) {  return xScale(d.to) - xScale(d.from); } );

    var figures = svg.selectAll(".figure")
        .attr("x",  function(d) {  return xScale(d.from)-10 + (xScale(d.to) - xScale(d.from))/2; })
        .attr("y", (Object.keys(mappingSelectedFeatureRow).length )* cellHeightDayView);

    var figures2 = svg.selectAll(".figure2")
        .attr("x",  function(d) {  return xScale(d.from)-10 + (xScale(d.to) - xScale(d.from))/2; })
        .attr("y", 0)
        .attr("width", function(d){
            return Math.min((xScale(d.to) - xScale(d.from)),30)
        });








}




d3.json("data/myfile_flattened_update.json", function(error, json) {


    if (error) return console.warn(error);
    data = json;
    initializeConfigVariables();

    verDetail = d3.select(".detailsCell.vertical");
    horDetail = d3.select(".detailsCell.horizontal");



    add_features();
    createScalesContextData();
    generateNewMapping();
    generateSelectors();
    generateSortSelectors();









    brushX = d3.time.scale().domain([collection_day_data[0].date,new Date(collection_day_data[0].date.getTime()+24*60*60*1000)]).range([ 0, timeFeatures.brusher.width ]).clamp(true);
    brushXAxis = d3.svg.axis().scale(brushX).orient("bottom").tickFormat(d3.time.format("%H:%M")).tickSubdivide(true)
        .tickSize(8).tickPadding(8);



    svgContext = d3.select("#slider").append("svg").attr("class", "context")
        .attr("height",20)
        .attr("width",timeFeatures.brusher.width);//d3.select("#chart").append("svg").attr("class", "context").attr("height",30).attr("width",width);

    svgContext.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, -10)")
        .transition()
        .call(brushXAxis);


    svgContext.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -2)
        .attr("height", 20);

    chartX = d3.time.scale().domain([collection_day_data[0].date,new Date(collection_day_data[0].date.getTime()+24*60*60*1000)]).range([ 0, width ]).clamp(true);
    chartXAxis = d3.svg.axis().scale(chartX).tickFormat(d3.time.format("%H:%M")).tickSubdivide(true)
        .tickSize(-400).tickPadding(8);

    
    d3.selectAll("#chart").on("mousemove",function(){
        d3.select("#lineTimeIndicator")
            .style("left", (d3.event.pageX-2) + "px").classed("hidden",false);

        d3.select("#lineTimeIndicatorText")
            .style("left", (d3.event.pageX-50) + "px").style("top", (d3.event.pageY) + "px")
            .classed("hidden",false);
        var tempS =  chartX.invert(d3.event.pageX-margin.left-timeFeatures.brusher.width).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
        
        d3.select("#timeText").text(tempS);

    }).on("mouseout", function(){
        d3.select("#lineTimeIndicatorText").classed("hidden",true);
        d3.select("#lineTimeIndicator").classed("hidden",true);

    })
    ;
    //
    d3.selectAll(".controllerOverview").on("mousemove",function(){
        d3.select("#lineTimeIndicator")
            .style("left", (d3.event.pageX-2) + "px").classed("hidden",false);

        d3.select("#lineTimeIndicatorText")
            .style("left", (d3.event.pageX-50) + "px").style("top", (d3.event.pageY) + "px")
            .classed("hidden",false);

        var tempS =  brushX.invert(d3.event.pageX).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});

        d3.select("#timeText").text(tempS);

    }).on("mouseout", function(){
        d3.select("#lineTimeIndicatorText").classed("hidden",true);
        d3.select("#lineTimeIndicator").classed("hidden",true);

    });
    //;





    var container  = d3.select("#chart");
    container.append("svg").attr("class", "top axis").attr("width",width+margin.left)
        .attr("height",40)
        .append("g").attr("class", "chartAxis")
        .attr("transform", "translate("+margin.left+","+35+")")

        .call(chartXAxis.orient("top"));

visualizedDays.map(function(d){
    visualizeDay(d,getCellHeightMainViz());
});


    d3.select("#subjOverview").remove();
    generateSubjectiveOverviewAllFeatures(d3.select("#subjectiveOverviewContainer").append('div').attr("id","subjOverview"),visualizedDays);

//        visualizeDay(2);
    initButtons();
    invokeButtons();


    container.append("svg").attr("width",width+margin.left).attr("height",40).attr("class", "bottom axis").append("g").attr("class", "chartAxis")
        .attr("transform", "translate("+margin.left+","+0+")")

        .call(chartXAxis.orient("bottom"));



    // svgContext.select(".x").transition().call(xAxis);
    var scaleFactor = 3;
   

    



    var epochData = [];
    visualizedDays.map(function(d){
        epochData=epochData.concat(getDataPerEpoch(d));
    });
    
    createParcoordfilter(epochData);
    
    provideRoomForSevenDays();
});


function redrawVisualisations(){
    d3.select("#chart").selectAll(".dayViz").remove();
    d3.select("#dayDataContainer").selectAll(".dayData").remove();
    d3.select("#detailsContainer").selectAll("div").remove();
    visualizedDays.map(function(d){
        visualizeDay(d,getCellHeightMainViz());
    });




    d3.select("#subjOverview").remove();
    generateSubjectiveOverviewAllFeatures(d3.select("#subjectiveOverviewContainer").append('div').attr("id","subjOverview"),visualizedDays);


    if(!brush.empty()){
        brushed();
    }
    
    
    
    d3.select("#parcoordsContainer").selectAll("canvas").remove();
    d3.select("#parcoordsContainer").selectAll("svg").remove();
    var epochData = [];
    
    visualizedDays.map(function(d){
        epochData=epochData.concat(getDataPerEpoch(d));
    });
    

    
    createParcoordfilter(epochData);
    

    invokeButtons();
    
    provideRoomForSevenDays();
    
   

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

    addPostProcessingFeatures();

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
            result["epoch"] = dayData[i].col;
            result["day"] = day;
        }
    }
    return result;
}


function getDataPerEpoch(day){
    var result = {};
    var active_features =  d3.entries(config_features).filter(function(d){
        return config_features[d.key].active;
    });

    for (var i = 0; i<300;i++){
        result[i] = {};
    }

    var dayData = collection_day_data[day].data.filter(function(d){ // kon ook aan de hand van mappingFeaturePerRow
        return config_features[d.feature].active;
    });
    for (var i = 0 ; i<dayData.length;i++){
            result[dayData[i].col]["day"] = day;
            result[dayData[i].col]["epoch"] = dayData[i].col;
            
            result[dayData[i].col][dayData[i].feature] = dayData[i].value;
            

    }
    return d3.entries(result).map(function(d){
        return d.value;
    }).filter(function(d){
        return !(Object.keys(d).length == 0);
    });
}



//default --> row == date, col == epoch, val = featureVal
//for now: mapping val to [-10,10]
//horSort --> quantity horSortRow/Col
//verSort --> for distribution vertSortRow/Col
function visualizeDay(nrDay,cellHeightDayView){
    var dayViz = d3.select("#chart").append("div").attr("id","dayViz"+nrDay).attr("class","dayViz");
    var dayContextData =data["user1"]["smart_phone_data"][nrDay];
    
    addContextTimeInBed(d3.select("#dayDataContainer").append('div').attr("class","dayData").attr("id","dayData"+nrDay),dayContextData,nrDay);
    visualizeDayMinimized(d3.select("#detailsContainer"),nrDay);
    
    d3.select("#dayData"+nrDay).classed("hidden",true);
    dayViz.on("mouseover",function(){
        
        d3.selectAll(".dayData").classed("hidden",true);
        d3.select("#dayData"+nrDay).classed("hidden",false);
        d3.select("#dayInspecting").text(dayContextData.date_begin_sleep);
    });




    dayViz.append("div").text(dayContextData.date_begin_sleep).attr("class","dayTitle");
    var buttonDiary = dayViz.append("div").attr("class","showDiary").append("img")// Moet in svg
        .attr("src", "Icons/notebook.png")
        .attr("style","width:30;height:20");

    var contextSubj = dayViz.append("div").attr("class","subjContext");

    var contextBefore = contextSubj.append("div").attr("class","subjContext before");
    var contextAfter =contextSubj.append("div").attr("class","subjContext after");
    var mainVizContainer =dayViz
        .append("div")
        .attr("class","mainViz full-view");

    var map_height = (Object.keys(mappingSelectedFeatureRow).length) * cellHeightDayView;
    var svg = mainVizContainer
        .append("div")
        .attr("class","viz patch")
        .append("svg")
        .attr("class","heatmapViz patch timeLine")
    .attr("height",map_height+10);

    var timeLineSubjContext  = mainVizContainer
        .append("div")
        .attr("class","viz subjective timeWindow timeLine");







    collection_day_data[nrDay]["ganttChart"] = addTimeLineSubjContext(timeLineSubjContext,dayContextData,collection_day_data[nrDay].date,new Date(collection_day_data[nrDay].date.getTime()+24*60*60*1000),nrDay,width,30,90);
    collection_day_data[nrDay]["active"]=true;



    addContextBefore(contextBefore,dayContextData,nrDay);
    addContextAfter(contextAfter,dayContextData,nrDay);


    buttonDiary.on("click",function(){
        d3.select("#floatingDiary").classed("hidden",false);
        d3.select("#diaryContainer").select(".diaryContainerChild").remove();
        generateLargeDiary(d3.select("#diaryContainer").append("div").attr("class","diaryContainerChild"),dayContextData["subjective_data"]["sleep_diary"],dayContextData.date_begin_sleep)
    });

    var dataForDay = collection_day_data[nrDay].data;
    var movement = dataForDay.filter(function(d){
        return d.feature  == "movement";
    });

    var meanY = dataForDay.filter(function(d){
        return d.feature  == "mean_y_norm";
    });




    var periods = generateLyingPeriods(meanY);
    var antiPeriods = generateStandingPeriods(meanY);

    dataForDay = dataForDay.filter(function(d){ // kon ook aan de hand van mappingFeaturePerRow
        return mappingSelectedFeatureRow[d.feature] != undefined ;
    });

    if(dataForDay.length == 0){

        mappingSelectedFeatureRow["movement"]=0;
        dataForDay = movement;
    }







    var dataPerFeature = {};

    //fill dataPerFeature
    Object.keys(mappingSelectedFeatureRow).map(function(d){
        dataPerFeature[d] = {
            yScale:d3.scale.linear()
            .domain([config_features[d]["min"],config_features[d]["max"]])
            .range([cellHeightDayView, 0]),
            feature:d,
            data:dataForDay.filter(function(e){ return e.feature == d}),
            line : d3.horizon()
    .width(width)
    .height(cellHeightDayView)
    .bands(4)
    .mode("mirror")
    .interpolate("basis"),
            
            
            yAxis : d3.svg.axis()
                .scale(this.yScale)
                .tickValues([config_features[d]["min"],config_features[d]["max"]])
                .orient("left").tickFormat(d3.format("s")).ticks(4)

                .tickSize(8).tickPadding(8)

        };
        console.log(dataPerFeature[d].line);
    });

    svg.append("clipPath")       // define a clip path
        .attr("id", "clipDay"+nrDay)
        .append("rect")
        .attr("width", width)
        .attr("height", (1+Object.keys(mappingSelectedFeatureRow).length)*cellHeightDayView);







    var sparkCharts = svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","g5")

            .selectAll(".sparkChart")
        .data(d3.entries(dataPerFeature))
            .enter()
            .append("g")
            .attr("class", "sparkChart")
            .attr("transform", function(d){
                return "translate(0,"+mappingSelectedFeatureRow[d.key]*cellHeightDayView+")"
            });



//    sparkCharts.append("path")
//        .datum(function(d){
//
//            return d.value;
//        })
//        .attr("class", function(d){return d.feature +" line"})
//        .attr("d", function(d){
//            return d.line(d.data);
//        });
    
//        sparkCharts.append("g")
//        .datum(function(d){
//
//            return d.value;
//        })
//        .attr("d", function(d){
//            
//                
//            return d.line(d3.select(this));
//        });

// stop adding spark charts

    var sparkChartsAxis = svg.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
        .attr("class","g6")

        .selectAll(".sparkChartsAxis")
        .data(d3.entries(dataPerFeature))
        .enter()
        .append("g")
        .attr("class", "sparkChartsAxis")
        .attr("transform", function(d){
            return "translate(0,"+mappingSelectedFeatureRow[d.key]*cellHeightDayView+")"
        });

    var sparkAxis = sparkChartsAxis.append("g")
        .attr("class", "y axis")
        .datum(function(d){
            this.tempAxis = d.value.yAxis;

            return d.value;
        })
        .attr("class", function(d){ return d.feature +" y axis"});
    //    .datum(function(d){
    //
    //    return d.value;
    //})
    sparkAxis.each(function(d){
            var sel = d3.select(this);
            var bounds = [config_features[d.feature]["min"],config_features[d.feature]["max"]];
            var rangeB = bounds[1]-bounds[0];
            
            var step = rangeB/5;
            var values = [0,1,2,3,4].map(function(d){ return bounds[0] + d*step; })

            sel.call(d3.svg.axis()
                .scale(d.yScale)
                
        .tickValues(values)
                .orient("left").tickFormat(d3.format("s")));
        });





    dataForDay.map(function(d){
        d["movement"] = movement[d.col].value;
    });

    var periodMaps = svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
        .attr("class","g4")
        .selectAll(".lying")
        .data(periods)
        .enter()
        .append("g").attr("class","lyingMarker");
    periodMaps.append("rect").attr("x", function(d) {  return xScale(d.from); })
        .attr("y", 0)
        .attr("class", "lying")
        .attr("width", function(d) {  return xScale(d.to) - xScale(d.from); } )
        
        .style("stroke-opacity","1")
        .style("stroke","black")
        .style("stroke-width","3")
        .attr("height", Object.keys(mappingSelectedFeatureRow).length * cellHeightDayView);




    periodMaps
        .append("svg:image")
        .attr("xlink:href", "Icons/lying.png")
        .attr("class","figure")
        .attr("x",  function(d) {  return xScale(d.from)-10 + (xScale(d.to) - xScale(d.from))/2; })
        .attr("y", (Object.keys(mappingSelectedFeatureRow).length )* cellHeightDayView)
        .attr("width", "20")
        .attr("height", "10")
    .on("mouseover",function(d){
        
        function createText(d){
            var startDate = (new Date(collection_day_data[nrDay].date.getTime() + d.from * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
                var endDate= (new Date(collection_day_data[nrDay].date.getTime() + d.to * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
             return "Lying horizontally: \n"+" from "+ startDate +" until "+ endDate;
            
        }
        d3.select("#infoTextA").text(createText(d))
    }).on("mouseout",function(d){d3.select("#infoTextA").text("")});


    var heatMap = svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","g3")
            .selectAll(".cell")
            .data(dataForDay,function(d){return d.numMapFeature+":"+d.col;})
            .enter()
            .append("rect")
            .attr("x", function(d) {  return xScale(d.col); })
            .attr("y", function(d) { return (mappingSelectedFeatureRow[d.feature]) * cellHeightDayView; })
            .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col)+ " day"+nrDay;})
            .attr("style",function(d){

                return "fill:black; opacity:"+Math.max(0, (d.value - config_features[d.feature].min)/(config_features[d.feature].max - config_features[d.feature].min)*0.75)
            })
            .attr("width", cellWidthDayView)
            .attr("height", cellHeightDayView)
          
            .on("mouseover", function(d){
            //    //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName."+ d.feature).classed("text-highlight",true);
                d3.selectAll("."+d.feature+".line").style("stroke","red");
                d3.select("#selectedEpoch").remove();
                drawSelectedEpoch(pc1.svg,pc1.xscale,pc1.yscale,getEpochData(d.row, d.col,nrDay));

            //
            //    //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});
            //
            //    //Update the tooltip position and value
                function toStringMovement(nr,min,max){
                    var perc = (nr-min)/(max);
                    perc = perc/0.2;
                    perc = perc * 10;
                    
                    var rounded = Math.round(perc);
                    var stringResult;


                    switch(rounded) {
                        case 0:
                            stringResult= "Very low";
                            break;
                        case 1:
                            stringResult= "low";
                            break;
                        case 2:
                            stringResult= "Medium";
                            break;
                        case 3:
                            stringResult= "High";
                            break;
                        case 4:
                            stringResult= "Very high";
                            break;
                        case 5:
                            stringResult= "Maximum";
                            break;

                        default:
                            stringResult= "N.A."
                    }


                    if(rounded<0){
                        stringResult= "Minimal"
                    }
                    if(rounded>5){
                        stringResult= "Maximum"
                    }
                    return stringResult;
                }
               d3.select("#infoTextA").text(config_features[d.feature].name+": "+ d.value);
               d3.select("#epochInspecting").text(d.col+" at "+(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"}));
               d3.select("#infoTextB").text("Movement: "+  toStringMovement(d.movement,config_features.movement.min,config_features.movement.max));
                d3.select("#infoTextBBox");

            //        .style("left", (d3.event.pageX) + "px")
            //        .style("top", d3.event.pageY+  "px").classed("hidden",false)
            //        .select(".floatingValue");
            //    var val = d.value;
            //    if(d.feature == "mean_3D_position"){
            //        val = label3DPosition(val);
            //    }
            //
            //    valueBox.select(".floatingValueText")
            //        .text( "Value: "+ val);
            //    valueBox.select(".floatingFeatureText").text("Feature: "+ d.feature );
            //
            //    valueBox.select(".floatingTimeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
            //    valueBox.select(".floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
            //    valueBox.select(".floatingMovementText").text("Movement: "+d.movement);
            //
            //
            //
            //    //Show the tooltip
            //    d3.select("#value").classed("hidden", false);
            //    d3.select("#small_parallel_coordinates").remove();
            //    d3.select("#small_line_chart").remove();
            //    var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
            //    xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);
            //
            //
            //    //d3.select("#detailsContainer").selectAll("div").remove();
            //    //visualizeFeature(d.feature,d3.select("#detailsContainer"),3*cellHeightDayView);
            //
            //
            //    small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
            //    small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);
            //
            })
            .on("mouseout", function(){
                d3.select(this).classed("cell-hover",false);
                d3.selectAll(".rowLabel").classed("text-highlight",false);
                d3.selectAll(".colLabel").classed("text-highlight",false);
                d3.select("#value").classed("hidden", true);
                d3.select("#floatingTooltip").classed("hidden", true);
                d3.selectAll(".line").style("stroke","black");

                d3.selectAll(".infoText").text("");

            })
            .on("click", function(d){
                var r = confirm("Focus on "+ d.feature);
                if (r == true) {
                    focusFeature(d.feature);
                }

            })
        ;
    
    
    var heatMap = svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","g3")
            .selectAll(".cell")
            .data(dataForDay,function(d){return d.numMapFeature+":"+d.col;})
            .enter()
            .append("rect")
            .attr("x", function(d) {  return xScale(d.col); })
            .attr("y", function(d) { return (mappingSelectedFeatureRow[d.feature]) * cellHeightDayView; })
            .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col)+ " day"+nrDay;})
            .attr("style",function(d){

                return "fill:black; opacity:"+Math.max(0, (d.value - config_features[d.feature].min)/(config_features[d.feature].max - config_features[d.feature].min)*0.75)
            })
            .attr("width", cellWidthDayView)
            .attr("height", cellHeightDayView)
          
            .on("mouseover", function(d){
            //    //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName."+ d.feature).classed("text-highlight",true);
                d3.selectAll("."+d.feature+".line").style("stroke","red");
                d3.select("#selectedEpoch").remove();
                drawSelectedEpoch(pc1.svg,pc1.xscale,pc1.yscale,getEpochData(d.row, d.col,nrDay));

            //
            //    //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});
            //
            //    //Update the tooltip position and value
                function toStringMovement(nr,min,max){
                    var perc = (nr-min)/(max);
                    perc = perc/0.2;
                    perc = perc * 10;
                    
                    var rounded = Math.round(perc);
                    var stringResult;


                    switch(rounded) {
                        case 0:
                            stringResult= "Very low";
                            break;
                        case 1:
                            stringResult= "low";
                            break;
                        case 2:
                            stringResult= "Medium";
                            break;
                        case 3:
                            stringResult= "High";
                            break;
                        case 4:
                            stringResult= "Very high";
                            break;
                        case 5:
                            stringResult= "Maximum";
                            break;

                        default:
                            stringResult= "N.A."
                    }


                    if(rounded<0){
                        stringResult= "Minimal"
                    }
                    if(rounded>5){
                        stringResult= "Maximum"
                    }
                    return stringResult;
                }
               d3.select("#infoTextA").text(config_features[d.feature].name+": "+ d.value);
               d3.select("#epochInspecting").text(d.col+" at "+(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"}));
               d3.select("#infoTextB").text("Movement: "+  toStringMovement(d.movement,config_features.movement.min,config_features.movement.max));
                d3.select("#infoTextBBox");

            //        .style("left", (d3.event.pageX) + "px")
            //        .style("top", d3.event.pageY+  "px").classed("hidden",false)
            //        .select(".floatingValue");
            //    var val = d.value;
            //    if(d.feature == "mean_3D_position"){
            //        val = label3DPosition(val);
            //    }
            //
            //    valueBox.select(".floatingValueText")
            //        .text( "Value: "+ val);
            //    valueBox.select(".floatingFeatureText").text("Feature: "+ d.feature );
            //
            //    valueBox.select(".floatingTimeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
            //    valueBox.select(".floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
            //    valueBox.select(".floatingMovementText").text("Movement: "+d.movement);
            //
            //
            //
            //    //Show the tooltip
            //    d3.select("#value").classed("hidden", false);
            //    d3.select("#small_parallel_coordinates").remove();
            //    d3.select("#small_line_chart").remove();
            //    var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
            //    xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);
            //
            //
            //    //d3.select("#detailsContainer").selectAll("div").remove();
            //    //visualizeFeature(d.feature,d3.select("#detailsContainer"),3*cellHeightDayView);
            //
            //
            //    small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
            //    small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);
            //
            })
            .on("mouseout", function(){
                d3.select(this).classed("cell-hover",false);
                d3.selectAll(".rowLabel").classed("text-highlight",false);
                d3.selectAll(".colLabel").classed("text-highlight",false);
                d3.select("#value").classed("hidden", true);
                d3.select("#floatingTooltip").classed("hidden", true);
                d3.selectAll(".line").style("stroke","black");

                d3.selectAll(".infoText").text("");

            })
            .on("click", function(d){
                var r = confirm("Focus on "+ d.feature);
                if (r == true) {
                    focusFeature(d.feature);
                }

            })
        ;
    
    
    

   
    svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","g7")
            .selectAll(".cell")
            .data(dataForDay,function(d){return d.numMapFeature+":"+d.col;})
            .enter()
            .append("rect")
            .attr("x", function(d) {  return xScale(d.col); })
            .attr("y", function(d) { return (mappingSelectedFeatureRow[d.feature]) * cellHeightDayView; })
            .attr("class", function(d){return "cell cr"+(d.numMapFeature)+" cc"+(d.col)+ " day"+nrDay;})
            .attr("style",function(d){

                return "opacity:"+Math.max(0, (d.movement - config_features.movement.min)/(config_features.movement.max - config_features.movement.min)*0.5)
            })
            .attr("width", cellWidthDayView)
            .attr("height", cellHeightDayView)
            .style("fill", 'blue'   )
            .on("mouseover", function(d){
            //    //highlight text
                d3.select(this).classed("cell-hover",true);
                d3.selectAll(".featureName."+ d.feature).classed("text-highlight",true);
                d3.selectAll("."+d.feature+".line").style("stroke","red");
                d3.select("#selectedEpoch").remove();
                drawSelectedEpoch(pc1.svg,pc1.xscale,pc1.yscale,getEpochData(d.row, d.col,nrDay));

            //
            //    //d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col);});
            //
            //    //Update the tooltip position and value
                function toStringMovement(nr,min,max){
                    var perc = (nr-min)/(max);
                    perc = perc/0.2;
                    perc = perc * 10;
                    
                    var rounded = Math.round(perc);
                    var stringResult;


                    switch(rounded) {
                        case 0:
                            stringResult= "Very low";
                            break;
                        case 1:
                            stringResult= "low";
                            break;
                        case 2:
                            stringResult= "Medium";
                            break;
                        case 3:
                            stringResult= "High";
                            break;
                        case 4:
                            stringResult= "Very high";
                            break;
                        case 5:
                            stringResult= "Maximum";
                            break;

                        default:
                            stringResult= "N.A."
                    }


                    if(rounded<0){
                        stringResult= "Minimal"
                    }
                    if(rounded>5){
                        stringResult= "Maximum"
                    }
                    return stringResult;
                }
               d3.select("#infoTextA").text(config_features[d.feature].name+": "+ d.value);
               d3.select("#epochInspecting").text(d.col+" at "+(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"}));
               d3.select("#infoTextB").text("Movement: "+  toStringMovement(d.movement,config_features.movement.min,config_features.movement.max));
                d3.select("#infoTextBBox");

            //        .style("left", (d3.event.pageX) + "px")
            //        .style("top", d3.event.pageY+  "px").classed("hidden",false)
            //        .select(".floatingValue");
            //    var val = d.value;
            //    if(d.feature == "mean_3D_position"){
            //        val = label3DPosition(val);
            //    }
            //
            //    valueBox.select(".floatingValueText")
            //        .text( "Value: "+ val);
            //    valueBox.select(".floatingFeatureText").text("Feature: "+ d.feature );
            //
            //    valueBox.select(".floatingTimeText").text(new Date(collection_day_data[nrDay].date.getTime() + d.col * 300000));
            //    valueBox.select(".floatingMovement").style("fill", collection_metrics.movement[1](d.movement) );
            //    valueBox.select(".floatingMovementText").text("Movement: "+d.movement);
            //
            //
            //
            //    //Show the tooltip
            //    d3.select("#value").classed("hidden", false);
            //    d3.select("#small_parallel_coordinates").remove();
            //    d3.select("#small_line_chart").remove();
            //    var tempD = collection_day_data[nrDay].date; //TODO: temporary solution
            //    xTimeScale.domain([new Date(tempD.getTime() + xScale.domain()[0] * 300000), new Date(tempD.getTime() + xScale.domain()[1] * 300000)]);
            //
            //
            //    //d3.select("#detailsContainer").selectAll("div").remove();
            //    //visualizeFeature(d.feature,d3.select("#detailsContainer"),3*cellHeightDayView);
            //
            //
            //    small_line_chart(horDetail,getFeatureDataForDay(d.feature, d.row), d.feature, d.col);
            //    small_parallel_coordinates(verDetail,getEpochData(d.row, d.col), d.feature);
            //
            })
            .on("mouseout", function(){
                d3.select(this).classed("cell-hover",false);
                d3.selectAll(".rowLabel").classed("text-highlight",false);
                d3.selectAll(".colLabel").classed("text-highlight",false);
                d3.select("#value").classed("hidden", true);
                d3.select("#floatingTooltip").classed("hidden", true);
                d3.selectAll(".line").style("stroke","black");

                d3.selectAll(".infoText").text("");

            })
            .on("click", function(d){
                var r = confirm("Focus on "+ d.feature);
                if (r == true) {
                    focusFeature(d.feature);
                }

            })
        ;

//OF
    
//    var yScaleMov = d3.scale.linear()
//            .domain([config_features["movement"]["min"],config_features["movement"]["max"]])
//            .range([5*cellHeightDayView, 0]);
//    var mov_line = d3.svg.line()
//                .x(function(k) { return xScale(k.col); })
//                .y(function(k) { return  yScaleMov(k.value); });
//     svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
//            .attr("transform", "translate("+margin.left+","+margin.top+")")
//            .attr("class","g9")
//            .append("path")
//     
//            .datum(movement)
//      .attr("class", "line")
//     .style("stroke","blue")
//      .attr("d", mov_line);
//    
//    //OF


    

//    antiPeriodMaps.append("svg:image")
//        .attr("xlink:href", "Icons/standing.png")
//        .attr("class","figure2")
//        .attr("x",  function(d) {  return xScale(d.from)-10 + (xScale(d.to) - xScale(d.from))/2; })
//        .attr("y", 0)
//        .attr("width", function(d){
//            return Math.min((xScale(d.to) - xScale(d.from)),30)
//        })
//        .attr("height", (Object.keys(mappingSelectedFeatureRow).length )* cellHeightDayView-5);

    var rowLabels = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")")
        .selectAll(".rowLabel")
        .data(Object.keys(mappingSelectedFeatureRow))
        .enter();


    var xPositionLabels;
    if(isYAxisOn){
        xPositionLabels=  -50;
        rowLabels.append("rect")
            .attr("x", -10)
            .attr("y", function (d, i) { return (i) * cellHeightDayView; })
            .attr("width", width)
            .attr("height",1);

    }
    else{
        xPositionLabels= 0;
    }


    rowLabels.append("text")
        .text(function (d) { return config_features[d]["name"]; })
        .attr("x", xPositionLabels)
        .attr("y", function (d, i) { return (i) * cellHeightDayView; })
        .style("text-anchor", "end")
        .attr("transform", "translate(0," + cellHeightDayView / 1.5 + ")")
        .attr("class", function (d,i) { return "rowLabel mono featureName "+ d+" r"+i;} )
        .on("mouseover", function(d) {
                                        d3.select(this).classed("text-hover",true);
                                        d3.selectAll(".featureName."+ d).classed("text-highlight",true);
                                        d3.selectAll("."+d+".line").style("stroke","red");})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);
                                     d3.selectAll(".rowLabel").classed("text-highlight",false);

                d3.selectAll(".line").style("stroke","black");})
        .on("click", function(d){
                var r = confirm("Focus on "+ config_features[d]["name"]);
                if (r == true) {
                    focusFeature(d);
                }

            })
        ;



    
   
    
    
        
    

    d3.select("#order").on("change",function(){
        order(this.value);
    });

    d3.selectAll(".movement").remove(); //do not show axis;

    
    
    //TESTING
//    var movement_scale = d3.scale.linear()
//            .domain([config_features["movement"]["min"],config_features["movement"]["max"]])
//            .range([cellHeightDayView*Object.keys(mappingSelectedFeatureRow).length, 0]);
//    var lineChartMovement = svg.append("g")
//            .attr("transform", "translate("+margin.left+","+margin.top+")")
//            .attr("class","movement_line")
//        .append("path")
//        .datum(movement)
//        .attr("class", "line")
//        .attr("style","stroke:blue")
//        .attr("d", d3.svg.line()
//                .x(function(k) { return xScale(k.col); })
//                .y(function(k) { return  movement_scale(k.value); }));
//    d3.select("#dayViz"+nrDay).selectAll(".cell").attr("style",function(d){return "fill:black;opacity:0"});
//    d3.selectAll(".sparkChart").classed("hidden",true);
    
    
    //TESTING DONE
    
    var antiPeriodMaps = svg.append("g").style("clip-path", "url(#clipDay"+nrDay+")")
        .attr("transform", "translate("+margin.left+","+margin.top+")")
        .attr("class","g4")
        .selectAll(".standing")
        .data(antiPeriods)
        .enter()
        .append("g")

        .attr("class", "standing")
    .on("mouseover",function(d){
        
        function createText(d){
            var startDate = (new Date(collection_day_data[nrDay].date.getTime() + d.from * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
                var endDate= (new Date(collection_day_data[nrDay].date.getTime() + d.to * 300000)).toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
             return "Standing/Sitting \n vertically: \n"+" from "+ startDate +" until "+ endDate;
        }
        d3.select("#infoTextA").text(createText(d)
                                     )}
    ).on("mouseout",function(d){d3.select("#infoTextA").text("")});
        
    antiPeriodMaps.append("rect").attr("x", function(d) {  return xScale(d.from); })
        .attr("y", 0)
        .attr("width", function(d) {  return xScale(d.to) - xScale(d.from); } )
        .style("fill-opacity","1")

        .attr("height", Object.keys(mappingSelectedFeatureRow).length * cellHeightDayView);
    
    

 var heatMap = svg.append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            .attr("class","overlay");

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
        .style("fill", function(d, i) { return getColorOfBin(d.key); });

    legend.append("text")//.attr("transform","rotate(20)")
        .attr("class", "mono")
        .text(function(d) { return d.value; })
        .attr("width", legendElementWidth)
        .attr("x", function(d, i) { return (2*legendElementWidth * i); })
        .attr("y", 20);

    return legend;
}







