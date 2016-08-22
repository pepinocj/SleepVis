/**
 * Created by Josi on 13/11/2015.
 */
function addTimeLine(container, dayData){

}

var subjContextSmallMultiples = {

    defaultSmallMultipleValues:{width:150,height:100,rangeMin:0, rangeMax:100,yMin:0,yMax:80}

};

var categoriesInBedMetrics = ["SOL", "WASO", "EMA", "TWT","TST"];

function createScalesContextData() {



//TODO: in object wrapper steken
    var xScaleScore = d3.scale.linear()
        .domain([0, 5])
        .range([subjContextSmallMultiples.defaultSmallMultipleValues.rangeMin, subjContextSmallMultiples.defaultSmallMultipleValues.rangeMax]);




    var categoriesScores = [];
    for (var i = 0 ; i< collection_day_data.length;i++){
        var tempData = collection_day_data[i].smartPhoneData.daySimpleActivities;

        d3.entries(tempData).map(function(d){if(!(categoriesScores.indexOf(d.key)>-1)){categoriesScores.push(d.key)}})
    }


    var yScaleScore = d3.scale.ordinal()
        .domain(categoriesScores)
        .rangeRoundBands([0, subjContextSmallMultiples.defaultSmallMultipleValues.yMax]);

    var categoriesColors = ['#0000b4', '#0082ca', '#0094ff', '#0d4bcf', '#0066AE'];
    var colorScale = d3.scale.quantize()
        .domain([0, categoriesScores.length])
        .range(categoriesColors);


    var xAxisScore = d3.svg.axis();
    xAxisScore
        .orient('bottom')
        .scale(xScaleScore)
        .tickFormat(d3.format("s"))
        .tickValues(d3.range(6));


    var yAxisScore = d3.svg.axis();
    yAxisScore
        .orient('left')
        .scale(yScaleScore);


    var xScaleInBedMetrics = d3.scale.linear()
        .domain([0, 800])
        .range([subjContextSmallMultiples.defaultSmallMultipleValues.rangeMin, subjContextSmallMultiples.defaultSmallMultipleValues.rangeMax]);

    var xScaleActivities = d3.scale.linear()
        .domain([0, 5])
        .range([subjContextSmallMultiples.defaultSmallMultipleValues.rangeMin, subjContextSmallMultiples.defaultSmallMultipleValues.rangeMax]);


    var yScaleInBedMetrics = d3.scale.ordinal()
        .domain(categoriesInBedMetrics)
        .rangeRoundBands([subjContextSmallMultiples.defaultSmallMultipleValues.yMin, subjContextSmallMultiples.defaultSmallMultipleValues.yMax]);

    var activities = ["nightmare", "toilet", "light_off"];
    var yScaleActivities = d3.scale.ordinal()
        .domain(activities)
        .rangeRoundBands([subjContextSmallMultiples.defaultSmallMultipleValues.yMin, subjContextSmallMultiples.defaultSmallMultipleValues.yMax]);

    var xAxisInBedMetrics = d3.svg.axis();
    xAxisInBedMetrics
        .orient('bottom')
        .scale(xScaleInBedMetrics)
        .ticks(5);


    var xAxisActivities = d3.svg.axis();
    xAxisActivities
        .orient('bottom')
        .scale(xScaleActivities)
        .ticks(5);

    var yAxisInBedMetrics = d3.svg.axis();
    yAxisInBedMetrics
        .orient('left')
        .scale(yScaleInBedMetrics);

    var yAxisActivities = d3.svg.axis();
    yAxisActivities
        .orient('left')
        .scale(yScaleActivities);

//
    subjContextSmallMultiples.daySimpleActivities = {
        scaleX: xScaleScore,
        scaleY: yScaleScore,
        xAxis: xAxisScore,
        yAxis: yAxisScore
    };
////subjContextSmallMultiples.dayDurableActivities={scaleX: ,scaleY: ,scaleColor: ,xAxis: ,yAxis};
////subjContextSmallMultiples.dayEmotions={scaleX: ,scaleY: ,scaleColor: ,xAxis: ,yAxis};
////subjContextSmallMultiples.nightDurableActivities={scaleX: ,scaleY: ,scaleColor: ,xAxis: ,yAxis};
    subjContextSmallMultiples.nightBedTimes = {
        scaleX: xScaleInBedMetrics,
        scaleY: yScaleInBedMetrics,
        xAxis: xAxisInBedMetrics,
        yAxis: yAxisInBedMetrics
    };
    subjContextSmallMultiples.nightSimpleActivities = {
        scaleX: xScaleActivities,
        scaleY: yScaleActivities,
        xAxis: xAxisActivities,
        yAxis: yAxisActivities
    };
}

function generateSubjectiveDetails(feature, container, nrDay){
    var container = container;
    var activities = collection_day_data[nrDay].smartPhoneData.allActivities.filter(function(d){
        return d.label == feature;
    });

    container.append("div").selectAll("p").data(activities).enter().append("p").text(function(d){
        if (d.end == "none"){
           return  d.label+": "+" om "+ d.start ;
        }else{
            return d.label+": "+" van "+ d.start +" tot "+ d.end ;
        }

    });



}




function generateDiary(container,data,nrDay){
    var diary =data["sleep_diary"];

    function addDiaryEntry(label,content,container){
        var entry = container.append("div").attr("class","diary_entry");
        entry.append("div").attr("class","diary_entry label").text(label);
        entry.append("div").attr("class","diary_entry content").text(content);

    }
    var diaryContainer = d3.select("#diaryContainer");

    container.on("mouseover", function(){
        var diaryDay =  diaryContainer.append("div").attr("class","diary day");
        var diaryEvening =  diaryContainer.append("div").attr("class","diary evening");

        addDiaryEntry("Voormiddag",diary["VOORMIDDAG"],diaryDay);
        addDiaryEntry("Middag",diary["MIDDAG"],diaryDay);
        addDiaryEntry("Namiddag",diary["NAMIDDAG"],diaryDay);
        addDiaryEntry("Avond",diary["VOORMIDDAG"],diaryEvening);
        addDiaryEntry("Laatste uur",diary["LAATSTE_UUR"],diaryEvening);
        addDiaryEntry("Net voor het slapengaan",diary["NET_VOOR_HET_SLAPENGAAN"],diaryEvening);

    })
        .on("mouseout", function(){
            diaryContainer.selectAll(".diary").remove();

        })
    ;
}

function generateLargeDiary(container,data,day){
    var diary =data;

    function addDiaryEntry(label,content,container){
        var entry = container.append("div").attr("class","diary_entry");
        entry.append("div").attr("class","diary_entry label").text(label);
        entry.append("div").attr("class","diary_entry content").text(content);

    }
    var diaryContainer = container;


        var diaryDay =  diaryContainer.append("div").attr("class","diary day");
        //var diaryEvening =  diaryContainer.append("div").attr("class","diary evening");
        diaryDay.append("h2").attr("class","diary_entry").text(day);
        addDiaryEntry("Voormiddag",diary["VOORMIDDAG"],diaryDay);
        addDiaryEntry("Middag",diary["MIDDAG"],diaryDay);
        addDiaryEntry("Namiddag",diary["NAMIDDAG"],diaryDay);
        addDiaryEntry("Avond",diary["AVOND"],diaryDay);
        addDiaryEntry("Laatste uur",diary["LAATSTE_UUR"],diaryDay);
        addDiaryEntry("Net voor het slapengaan",diary["NET_VOOR_HET_SLAPENGAAN"],diaryDay);


}


function addContextBefore(container, dayData,nrDay){



    generateDiary(container,dayData,nrDay);



    addSMContext(subjContextSmallMultiples.daySimpleActivities,"activitiesDay", d3.entries(collection_day_data[nrDay].smartPhoneData.daySimpleActivities),container,nrDay);
    //addSMContext(subjContextSmallMultiples.daySimpleActivities,"activitiesEvening",d3.entries(collection_day_data[nrDay].smartPhoneData.daySimpleActivities),container);

}
function addSMContext(scales,label,content,container,nrDay){
    
    var scoreSVG = container.append("div")
        .attr("class","subjContextViz "+label)
        .append("svg")
        .attr("width",subjContextSmallMultiples.defaultSmallMultipleValues.width)
        .attr("height",subjContextSmallMultiples.defaultSmallMultipleValues.height);
    var offset = subjContextSmallMultiples.defaultSmallMultipleValues.width-subjContextSmallMultiples.defaultSmallMultipleValues.rangeMax-10;
    var y_xis = scoreSVG.append('g')
        .attr("class","axis")
        .attr("transform", "translate("+offset+",0)")
        .call(scales.yAxis);

    var x_xis = scoreSVG.append('g')
        .attr("class","axis")
        .attr("transform", "translate("+offset+","+subjContextSmallMultiples.defaultSmallMultipleValues.yMax+")")
        .attr('id','xaxis')
        .call(scales.xAxis);

    var chart = scoreSVG.append('g')
        .attr("transform", "translate("+offset+",0)")
        .attr('id','barsScore')
        .selectAll('rect')
        .data(content)
        .enter()
        .append("g")
        .attr("class", function(d){return d.key+" day"+nrDay ;});


    chart.append('rect')
        .attr('height',subjContextSmallMultiples.defaultSmallMultipleValues.yMax/content.length)
        .attr({'x':0,'y':function(d,i){ return scales.scaleY(d.key); }})
        .attr('width',function(d){ return scales.scaleX(d.value); })
            .on("mouseover", function(d){



                //d3.select("#small_parallel_coordinates").remove();
                //d3.select("#small_line_chart").remove();


            d3.selectAll(".day"+nrDay+"."+ d.key).classed("subjectiveFeatureSelected",true);



            }).on("mouseout",function(d){
            d3.selectAll(".day"+nrDay+"."+ d.key).classed("subjectiveFeatureSelected",false);

        });

    chart.append("text")
        .attr("class", "subjectiveFeatureValue" )
        .text(function(d){return d.value})
        .attr({'x':function(d){ return scales.scaleX(d.value)-17; },'y':function(d,i){ return scales.scaleY(d.key)+5+(scales.scaleY.range()[1]-scales.scaleY.range()[0])/2; }});

    scoreSVG.selectAll(".tick").attr("font-size","6pt");

}

function addSleepContext(scales,label,content,container,nrDay){
    var width = container.node().getBoundingClientRect().width*0.9;
    var height = container.node().getBoundingClientRect().height;
    var hrange  = width - 50;
    
    //var content = content.filter(function(d){return d.key == "TST"}).concat(content.filter(function(d){return d.key != "TST"}));
    
     var seContent = content.filter(function(d){return (d.key != "TWT" && d.key != "TIB")});

    var tib =0;
    seContent.map(function(k){tib = tib + k.value});
    
   
    height = 0.60*height;

    var contDiv = container.append("div")
        .attr("class","subjContextViz "+label);
    
    var scoreSVG=    contDiv.append("svg")
        .attr("width",width)
        .attr("height",height);
    var offset = width-hrange-10;
    var yScale = d3.scale.ordinal()
        .domain(categoriesInBedMetrics)
        .rangeRoundBands([0, height]);
//    var yAxisActivities = d3.svg.axis();
//    yAxisActivities
//        .orient('left')
//        .scale(yScale);
//    
//    var y_xis = scoreSVG.append('g')
//        .attr("class","axis")
//        .attr("transform", "translate("+offset+",0)")
//        .call(yAxisActivities);
//
//    
//    var x_xis = scoreSVG.append('g')
//        .attr("class","axis")
//        .attr("transform", "translate("+offset+","+height+")")
//        .attr('id','xaxis')
//        .call(scales.xAxis.scale(scales.xAxis.scale().range([0,hrange])));
    
    var seScale =d3.scale.linear().domain([0,100]).range([0,hrange]);
    var x_xis2 = scoreSVG.append('g')
        .attr("class","axis")
        .attr("transform", "translate("+offset+","+(7)+")")
        .attr('id','xaxis2')
        .call(d3.svg.axis().orient('bottom').ticks(4).scale(seScale));
    
//    
//   var tib_g =  scoreSVG.append('g').attr("class","TIB")
//    .attr("transform", "translate("+offset+",0)");
//    tib_g.append("rect").attr("class","bar TIB")
//    .attr({'x':0,'y':0})
//    .attr("height",height)
//    .attr('width',function(d){ return scales.scaleX(tib); });
//    
//    var tib_text = tib_g.append("text").attr({'x':scales.scaleX(tib),'y':height/2});
//       tib_text.append("tspan").text("Time in bed:"); // \n\r"+ tib+ " min")
//         tib_text.append("tspan").attr({'x':scales.scaleX(tib),'dy':15}).text(tib+" min")
//
//    var collection = scoreSVG.append('g')
//        .attr("transform", "translate("+offset+",0)")
//        .attr('id','barsScore')
//        .selectAll('rect')
//        .data(content)
//        .enter();
//
//    var chart = collection.append("g")
//        .attr("class", function(d){return d.key+" day"+nrDay+" bar" ;});
//
//
//    chart.append('rect')
//        .attr('height',height/content.length)
//        .attr({'x':0,'y':function(d,i){ return yScale(d.key); }})
//        .attr('width',function(d){ return scales.scaleX(d.value); })
//        .on("mouseover", function(d){
//
//
//
//            //d3.select("#small_parallel_coordinates").remove();
//            //d3.select("#small_line_chart").remove();
//
//            d3.selectAll(".day"+nrDay+"."+ d.key).classed("subjectiveFeatureSelected",true);
//
//
//
//        }).on("mouseout",function(d){
//            d3.selectAll(".day"+nrDay+"."+ d.key).classed("subjectiveFeatureSelected",false);
//
//        }).on("click", function(d){
//
////
////
////                d3.select("#small_line_chart").remove();
////                
////                var isNotSelected = d3.select(this).classed("notSelected");
////                var isEverythingSelected = d3.selectAll(".notSelected").empty();
////                
////                if(isNotSelected || isEverythingSelected){
////                    small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), d.key);
////                
////                d3.select("#small_line_chart").append("svg:image").attr("xlink:href",  contextMapping[d.key])
////                .attr("height",30).attr("width", 30).attr("y",20);
////            
////            
////                d3.selectAll(".day"+day+"."+ d.key).classed("subjectiveFeatureSelected",true);
////                d3.selectAll(".bar").classed("notSelected",true);
////                d3.selectAll("."+d.key).classed("notSelected",false);
////                }
////            else{
////                d3.selectAll(".bar").classed("notSelected",false);
////            }
//
//
//        
//        
//
//
//
//
//            });
//
//    
//
//    chart.append("text")
//        .attr("class", "subjectiveFeatureValue" )
//        .text(function(d){return d.value+ " min"})
//        .attr({'x':function(d){ return scales.scaleX(d.value); },'y':function(d,i){ return yScale(d.key)+5+(yScale.range()[1]-scales.scaleY.range()[0])/2; }});
//
//    scoreSVG.selectAll(".tick").attr("font-size","6pt");
//
//    var stackCol = content.filter(function(d){
//        return ["EMA","WASO","SOL"].indexOf(d.key)> -1;
//    });
//
//
//    var stacked = scoreSVG.append('g')
//        .attr("transform", "translate("+offset+",0)")
//        .attr('class','stackedBars').on("mouseover",function(){
//            d3.selectAll(".day"+nrDay+".TWT").classed("subjectiveFeatureSelected",true);
//
//            d3.select(this).classed("subjectiveFeatureSelected",true);
//
//        }).on("mouseout",function(){
//            d3.selectAll(".day"+nrDay+".TWT").classed("subjectiveFeatureSelected",false);
//           d3.select(this).classed("subjectiveFeatureSelected",false);
//
//        });
//    
//    
//        stacked.selectAll('rect')
//        .data(stackCol)
//        .enter().append("g")
//        .attr("class", function(d){return d.key+" day"+nrDay +" bar";})
//        .append('rect')
//        .attr('height',height/content.length)
//        .attr({
//            'x':function(d,i){
//            var temp = stackCol;
//
//                var buf = stackCol.filter(function(k,j){return j<i});
//
//                var sum = 0;
//                buf.map(function(k){sum = sum + scales.scaleX(k.value)});
//            return sum;},
//
//            'y':function(d,i){ return yScale("TWT"); }})
//        .attr('width',function(d){ return scales.scaleX(d.value); });
//    
    
    
//    //--TIB
//     var stackCol2 = content.filter(function(d){
//        return ["EMA","WASO","SOL","TST"].indexOf(d.key)> -1;
//    });
//    
//     stackCol2 = stackCol2.filter(function(d){return d.key == "TST"}).concat(stackCol2.filter(function(d){return d.key != "TST"}));
//
//
//    var stacked2 = scoreSVG.append('g')
//        .attr("transform", "translate("+offset+",0)")
//        .attr('class','stackedBars').on("mouseover",function(){
//            d3.selectAll(".day"+nrDay+".TIB").classed("subjectiveFeatureSelected",true);
//
//            d3.select(this).classed("subjectiveFeatureSelected",true);
//
//        }).on("mouseout",function(){
//            d3.selectAll(".day"+nrDay+".TIB").classed("subjectiveFeatureSelected",false);
//           d3.select(this).classed("subjectiveFeatureSelected",false);
//
//        });
//    
//    
//        stacked2.selectAll('rect')
//        .data(stackCol2)
//        .enter().append("g")
//        .attr("class", function(d){return d.key+" day"+nrDay +" bar";})
//        .append('rect')
//        .attr('height',height/content.length)
//        .attr({
//            'x':function(d,i){
//            var temp = stackCol2;
//
//                var buf = stackCol2.filter(function(k,j){return j<i});
//
//                var sum = 0;
//                buf.map(function(k){sum = sum + scales.scaleX(k.value)});
//            return sum;},
//
//            'y':function(d,i){ return yScale("TIB"); }})
//        .attr('width',function(d){ return scales.scaleX(d.value); });
//    //TIB
    
    
    var seContent = content.filter(function(d){return (d.key != "TWT" && d.key != "TIB")});
    
    var tib =0;
    seContent.map(function(k){tib = tib + k.value});
    
    
    //put "TST" at front
    seContent = seContent.filter(function(d){return d.key == "TST"}).concat(seContent.filter(function(d){return d.key != "TST"}));
    
    scoreSVG.append('g')
        .attr("class","axis")
        .attr("transform", "translate("+0+","+(height-12)+")").append("text").text("SE (%)");
    
    var se = scoreSVG.append('g')
        .attr("transform", "translate("+offset+",0)")
        .attr('class','stackedBars')
        .selectAll('rect')
        .data(seContent)
        .enter().append("g")
        .attr("class", function(d){return d.key+" day"+nrDay +" bar";})
        .on("mouseover", function(d){



            //d3.select("#small_parallel_coordinates").remove();
            //d3.select("#small_line_chart").remove();

            d3.selectAll(".day"+nrDay+"."+ d.key).classed("subjectiveFeatureSelected",true);



        }).on("mouseout",function(d){
            d3.selectAll(".day"+nrDay+"."+ d.key).classed("subjectiveFeatureSelected",false);

        })
    
        se.append('rect')
        .attr('height',height*0.5)
        .attr({
            'x':function(d,i){
            var temp = seContent;

                var buf = seContent.filter(function(k,j){return j<i});

                var sum = 0;
                buf.map(function(k){sum = sum + seScale(k.value*100/tib)});
            return sum;},

            'y':function(d,i){ return 0; }})
        .attr('width',function(d){ return seScale(d.value*100/tib); });
    
    se.append('text').attr("class", "subjectiveFeatureValue" )
        .attr({'style':function(d){if(d.key == "TST"){return "opacity:1";}else{return "";}},
            'x':function(d,i){
            var temp = seContent;

                var buf = seContent.filter(function(k,j){return j<i});

                var sum = 0;
                buf.map(function(k){sum = sum + seScale(k.value*100/tib)});
            return sum+seScale(d.value*50/tib);},

            'y':height-15//function(d,i){ return height+25+(height*0.5/content.length); }
              
              })
    .text(function(d){return Math.round(d.value*100/tib)+"%" });
    
    
    
//    scoreSVG.selectAll("rect").on("click",function(d){
//        d3.select("#small_line_chart").remove();
//                
//                var isNotSelected = d3.select(this).classed("notSelected");
//                var isEverythingSelected = d3.selectAll(".notSelected").empty();
//                
//                if(isNotSelected || isEverythingSelected){
//                    small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), d.key);
//                
//                d3.select("#small_line_chart").append("svg:image").attr("xlink:href",  contextMapping[d.key])
//                .attr("height",30).attr("width", 30).attr("y",20);
//            
//            
//                d3.selectAll(".day"+nrDay+"."+ d.key).classed("subjectiveFeatureSelected",true);
//                d3.selectAll(".bar").classed("notSelected",true);
//                d3.selectAll("."+d.key).classed("notSelected",false);
//                }
//            else{
//                d3.selectAll(".bar").classed("notSelected",false);
//            }
//    })

}

function addContextTimeInBed(container, nightData,nrDay){
    var containerTimeInBedMetrics =  container.append("div").attr("class","TimeInBedMetricsViz subjContextViz");
    var timeInBedMetrics = calculateTimeInBedMetrics(nightData.bed_times_after_sleep);
    timeInBedMetrics =d3.entries(timeInBedMetrics);
    timeInBedMetrics = timeInBedMetrics.filter(function(d){return  categoriesInBedMetrics.indexOf(d.key) > -1;});
    addSleepContext(subjContextSmallMultiples.nightBedTimes,"scores",timeInBedMetrics,containerTimeInBedMetrics,nrDay);
}


function addContextAfter(container, nightData,nrDay){
    generateDiary(container,nightData,nrDay);
    addContextTimeInBed(container, nightData,nrDay);
    var containerActivities =  container.append("div").attr("class","ActivitiesViz subjContextViz");


    var activities = calculateNightActivities(nightData.nightActivities);
    addSMContext(subjContextSmallMultiples.nightSimpleActivities,"inBedMetrics",d3.entries(activities),containerActivities,nrDay);



}

function calculateTimeInBedMetrics( nightData){
    var result = {SOL:0,FNA: 0,EMA:0,TWT:0,TIB:0,TST:0,SE:0, WASO:0 };
    var type;
    var duration;
    for (var i = 0; i< nightData.length;i++){
        type = nightData[i].label;

        duration = getDuration(nightData[i]["end"],nightData[i]["start"]);

        if(type == "sleep"){

            result.FNA = result.FNA + 1;

        }else if(type == "wake_before_sleep"){
            result.SOL = result.SOL + duration;
        }else if(type == "wake_in_bed"){
            result.WASO = result.WASO + duration;
        }else if(type =="wake_after_sleep" ){
            result.EMA = result.EMA + duration;
        }
        result.TIB = result.TIB+duration;
    }
    result.TWT = result.SOL+result.WASO+result.EMA;

    result["TST"] =result["TIB"] - result["TWT"];
    result.SE =result.TST/result.TIB;

    return result;
}

function calculateNightActivities( nightData){//eerder bollen dan bar chart --> tooltip per bol
    var result = {};
    var type;
    var duration;
    for (var i = 0; i< nightData.length;i++){
        type = nightData[i].label;
        if(type in result){
            result[type] = result[type] + 1;
        }else{
            result[type] = 1;
        }


    }


    return result;
}




function addTimeLineSubjContext(timeLineSubjContext,dayData,startDate,endDate,nrDay,width,height,left_margin){

    //generateDiary(timeLineSubjContext,dayData,nrDay);
    return ganttWrapperFunction({Bed:dayData.bed_times_after_sleep,Activities:dayData.nightActivities},timeLineSubjContext,startDate,endDate,nrDay,width,height,left_margin);
}

function  addTimeLineObjExternContext(timeLineObjExternContext,dayData){

}