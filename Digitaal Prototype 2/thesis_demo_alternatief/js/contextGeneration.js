/**
 * Created by Josi on 13/11/2015.
 */
function addTimeLine(container, dayData){

}

var subjContextSmallMultiples = {

    defaultSmallMultipleValues:{width:150,height:100,rangeMin:0, rangeMax:100,yMin:0,yMax:80}

};

var categoriesInBedMetrics = ["SOL", "WASO", "EMA", "TWT", "TST"];

function createScalesContextData() {



//TODO: in object wrapper steken
    var xScaleScore = d3.scale.linear()
        .domain([0, 5])
        .range([subjContextSmallMultiples.defaultSmallMultipleValues.rangeMin, subjContextSmallMultiples.defaultSmallMultipleValues.rangeMax]);




    var categoriesScores = [];
    for (var i = 0 ; i< collection_day_data.length;i++){
        var tempData = collection_day_data[i].smartPhoneData.daySimpleActivities;

        d3.entries(tempData).map(function(d){console.log(d);if(!(categoriesScores.indexOf(d.key)>-1)){categoriesScores.push(d.key)}})
    }

    console.log(categoriesScores);

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
        .domain([0, 700])
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
    var diary =data["subjective_data"]["sleep_diary"];

    function addDiaryEntry(label,content,container){
        var entry = container.append("div").attr("class","diary_entry");
        entry.append("div").attr("class","diary_entry label").text(label);
        entry.append("div").attr("class","diary_entry content").text(content);

    }
    var diaryContainer = d3.select("#diaryContainer");

    container.on("mouseover", function(){
        var diaryDay =  diaryContainer.append("div").attr("class","diary day");
        var diaryEvening =  diaryContainer.append("div").attr("class","diary evening");

        addDiaryEntry("Voormiddag",diary["Voormiddag"],diaryDay);
        addDiaryEntry("Middag",diary["Middag"],diaryDay);
        addDiaryEntry("Namiddag",diary["Namiddag"],diaryDay);
        addDiaryEntry("Avond",diary["Voormiddag"],diaryEvening);
        addDiaryEntry("Laatste uur",diary["Laatste_uur"],diaryEvening);
        addDiaryEntry("Net voor het slapengaan",diary["Net_voor_het_slapengaan"],diaryEvening);

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
        addDiaryEntry("Voormiddag",diary["Voormiddag"],diaryDay);
        addDiaryEntry("Middag",diary["Middag"],diaryDay);
        addDiaryEntry("Namiddag",diary["Namiddag"],diaryDay);
        addDiaryEntry("Avond",diary["Voormiddag"],diaryDay);
        addDiaryEntry("Laatste uur",diary["Laatste_uur"],diaryDay);
        addDiaryEntry("Net voor het slapengaan",diary["Net_voor_het_slapengaan"],diaryDay);


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


function addContextAfter(container, nightData,nrDay){
    generateDiary(container,nightData,nrDay);
    var containerTimeInBedMetrics =  container.append("div").attr("class","TimeInBedMetricsViz subjContextViz");
    var containerActivities =  container.append("div").attr("class","ActivitiesViz subjContextViz");

    var timeInBedMetrics = calculateTimeInBedMetrics(nightData["subjective_data"]["bed_times_after_sleep"]);
    timeInBedMetrics =d3.entries(timeInBedMetrics);
    timeInBedMetrics = timeInBedMetrics.filter(function(d){return  categoriesInBedMetrics.indexOf(d.key) > -1;});
    addSMContext(subjContextSmallMultiples.nightBedTimes,"scores",timeInBedMetrics,containerTimeInBedMetrics,nrDay);
    var activities = calculateNightActivities(nightData["subjective_data"]["night_activities"]);
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
        }else if(type == "wake_after_sleep"){
            result.WASO = result.WASO + duration;
        }else if(type == "wake_in_bed"){
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




function addTimeLineSubjContext(timeLineSubjContext,dayData,startDate,endDate,nrDay){

    generateDiary(timeLineSubjContext,dayData,nrDay);
    return ganttWrapperFunction(dayData["subjective_data"]["night_activities"],dayData["subjective_data"]["bed_times_after_sleep"],timeLineSubjContext,startDate,endDate,nrDay);
}

function  addTimeLineObjExternContext(timeLineObjExternContext,dayData){

}