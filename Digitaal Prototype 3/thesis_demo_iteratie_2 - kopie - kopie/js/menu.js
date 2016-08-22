/**
 * Created by Josi on 5/12/2015.
 */


var menuButtons = { subjectiveChartsShown : false,
    switcherShown : false,
    subjectiveTimeLineShown : true,
    sensorDataShown : true,
    sortData : false,
    standingDataShown : false,
 objectiveDataShown : false,
zoom:false};

function invokeButtons(){ // is overbodig indien elke feature in een svg zat ==> displayblock, false


    d3.select("#movementFeaturesSelectors").classed("hidden",!menuButtons.standingDataShown);
    d3.selectAll(".subjContext").classed("hidden",!menuButtons.subjectiveChartsShown);
    d3.select("#heartFeaturesSelectors").classed("hidden",!menuButtons.objectiveDataShown);
    d3.select("#linesSelectors").classed("hidden",!menuButtons.switcherShown);
    d3.select("#sortSelectors").classed("hidden",!menuButtons.sortData);

    d3.select("#chart").selectAll(".standing").classed("hidden", !config_features["standing"].active);
    d3.selectAll(".g3").classed("transparent", !config_features["movement"].active);

    d3.selectAll(".lyingMarker").classed("hidden", !config_features["lying"].active);

    d3.selectAll(".g6").classed("hidden",!isYAxisOn);

    //if(Object.keys(mappingSelectedFeatureRow).length == 0 ){
    //    d3.selectAll(".viz.patch").classed("hidden",true);
    //}else{
    //    d3.selectAll(".viz.patch").classed("hidden",false);
    //}
}


function initButtons(){
    d3.select("#standingDataButton").classed("clickedButton", menuButtons.standingDataShown);
    d3.select("#sortButton").classed("clickedButton", menuButtons.sortData);
    d3.select("#subjectiveChartsButton") .classed("clickedButton", menuButtons.subjectiveChartsShown);
    d3.select("#subjectiveTimeLineButton").classed("clickedButton", menuButtons.subjectiveTimeLineShown);
    d3.select("#objectiveDataButton").classed("clickedButton", menuButtons.objectiveDataShown);
    d3.select("#zoomButton").classed("clickedButton", menuButtons.zoom);
    


    d3.select("#myonoffswitch").on("click",function(){
        console.log("go");
        d3.select("#detailsContainer").classed("hidden", !d3.select("#detailsContainer").classed("hidden"));
        d3.select("#subjectiveOverviewContainer").classed("hidden", !d3.select("#subjectiveOverviewContainer").classed("hidden"));
        
    })


    d3.select("#standingDataButton").on("click", function(){
        d3.select("#standingDataButton").classed("clickedButton", !menuButtons.standingDataShown);
        //d3.selectAll(".standing").classed("hidden", menuButtons.standingDataShown);
        d3.select("#movementFeaturesSelectors").classed("hidden",menuButtons.standingDataShown);
        menuButtons.standingDataShown = !(menuButtons.standingDataShown);
    });

    d3.select("#sortButton").on("click", function(){
        d3.select("#sortButton").classed("clickedButton", !menuButtons.sortData);
        //d3.selectAll(".standing").classed("hidden", menuButtons.standingDataShown);
        d3.select("#sortSelectors").classed("hidden",menuButtons.sortData);
        menuButtons.sortData = !(menuButtons.sortData);
    });


    d3.select("#zoomButton").on("click", function(){
        d3.select("#movingDataButton").classed("clickedButton", !menuButtons.zoom);
        isYAxisOn = !menuButtons.zoom;
        d3.selectAll(".g6").classed("hidden",isYAxisOn);
        redrawVisualisations();
        menuButtons.zoom = !(menuButtons.zoom);
    });


    d3.select("#subjectiveChartsButton")
        .on("click", function(){
            d3.select("#subjectiveChartsButton") .classed("clickedButton", !menuButtons.subjectiveChartsShown);

                d3.selectAll(".subjContext").classed("hidden",menuButtons.subjectiveChartsShown);



            menuButtons.subjectiveChartsShown = !(menuButtons.subjectiveChartsShown);
        });

    //d3.select("#subjectiveTimeLineButton")
    //    .on("click", function(){
    //        d3.select("#subjectiveTimeLineButton").classed("clickedButton", !menuButtons.subjectiveTimeLineShown);
    //            d3.select("#lineSelectors").classed("hidden",menuButtons.subjectiveTimeLineShown);
    //
    //
    //        menuButtons.subjectiveTimeLineShown = !(menuButtons.subjectiveTimeLineShown);
    //    });

    d3.select("#objectiveDataButton")
        .on("click", function(){
            d3.select("#objectiveDataButton").classed("clickedButton", !menuButtons.objectiveDataShown);

            d3.select("#heartFeaturesSelectors").classed("hidden",menuButtons.objectiveDataShown);
            menuButtons.objectiveDataShown = !(menuButtons.objectiveDataShown);
        });

    d3.select("#switcherButton")
        .on("click", function(){
            d3.select("#switcherButton").classed("clickedButton", !menuButtons.switcherShown);
            d3.select("#linesSelectors").classed("hidden",menuButtons.switcherShown);
            menuButtons.switcherShown = !(menuButtons.switcherShown);
        });

    d3.select("#hideDiaryButton").on("click", function(){
        d3.select("#floatingDiary").classed("hidden",true);
    });



    var cont = d3.select("#linesSelectors")
        .append('div').attr("class", "selectorContainer selector" );


    cont.append("input").attr("type","checkbox").property('checked',  menuButtons.sensorDataShown)
        .on("change",function(){

            menuButtons.sensorDataShown = !(menuButtons.sensorDataShown);
            d3.selectAll(".viz.patch").classed("hidden",!menuButtons.sensorDataShown);

            // d3.select("#chart").selectAll(".viz.subjective").classed("hidden",!menuButtons.subjectiveTimeLineShown);



        });
    cont.append("span").text("sensor data");

   var cont2 = d3.select("#linesSelectors")
        .append('div').attr("class", "selectorContainer selector" );


    cont2.append("input").attr("type","checkbox").property('checked',  menuButtons.subjectiveTimeLineShown)
        .on("change",function(){

            menuButtons.subjectiveTimeLineShown = !(menuButtons.subjectiveTimeLineShown);
            d3.selectAll(".viz.subjective").classed("hidden",!menuButtons.subjectiveTimeLineShown);

        });
    cont2.append("span").text("gantt");


}

function generateSelectors(){
var features =  d3.entries(config_features);

    var heartFeatures = features.filter(function(d){
        return config_features[d.key].type == 'heart';
    });
    var moveFeatures =features.filter(function(d){
        return config_features[d.key].type == 'mov' &&  visualizedMovement.indexOf(d.key)>-1;
    });

    function genMenus(features,box){
        var select_all_h = d3.select("#"+box).append('div').attr("class","allSelectorContainer");
        select_all_h.append("input").attr("type","checkbox").property('checked',
            features.filter(function(d){
                return config_features[d.key].active;
            }).length == features.length)
            .on("change",function(d){
                var bool = features.filter(function(d){
                        return config_features[d.key].active;
                    }).length == features.length;

                for(var k = 0;k<features.length;k++){
                    config_features[features[k].key].active = !bool;
                }

                d3.select("#"+box).selectAll('input').property('checked', !bool);
                generateNewMapping();
                redrawVisualisations();
            });
        select_all_h.append("span").text("All");

        var s_cont = d3.select("#"+box).selectAll('.selectorContainer')
            .data(features)
            .enter()
            .append('div').attr("class",function(d){return "selectorContainer selector" + d.key});


        s_cont.append("input").attr("type","checkbox").property('checked', function(d){return config_features[d.key].active;})
            .on("change",function(d){
                config_features[d.key].active = !config_features[d.key].active;
                if(!config_features[d.key].active){
                    d3.select("#"+box).select(".allSelectorContainer").select('input').property('checked',false);
                }
                generateNewMapping();
                redrawVisualisations();
            });
        s_cont.append("span").text(function(d){return config_features[d.key]["name"]});
    }

    genMenus(heartFeatures,"heartFeaturesSelectors");
    genMenus(moveFeatures,"movementFeaturesSelectors");







    //var m_cont = d3.select("#movementFeaturesSelectors").selectAll('.selectorContainer')
    //    .data(moveFeatures)
    //    .enter()
    //    .append('div').attr("class","selectorContainer");
    //
    //m_cont.append("input").attr("type","checkbox").property('checked', function(d){return config_features[d.key].active;})
    //    .on("change",function(d){
    //        config_features[d.key].active = !config_features[d.key].active;
    //        generateNewMapping();
    //        redrawVisualisations();
    //    });
    //m_cont.append("span").text(function(d){return d.key});


}

jQuery.fn.d3Click = function () {
    this.each(function (i, e) {
        var evt = new MouseEvent("click");
        e.dispatchEvent(evt);
    });
};


function focusFeature(feature){
    var heartFeatures = d3.entries(config_features).filter(function(d){
        return config_features[d.key].type == 'heart';
    });

    for (var i = 0 ; i < heartFeatures.length; i++){
        var active =  (heartFeatures[i].key == feature);
        config_features[heartFeatures[i].key].active = active;
        d3.select("#heartFeaturesSelectors").select(".selector"+heartFeatures[i].key).select('input').property('checked',active);
    }


        d3.select("#heartFeaturesSelectors").select(".allSelectorContainer").select('input').property('checked',false);

    if(!menuButtons.zoom){

        $("#zoomButton").d3Click();
    }

    if(menuButtons.subjectiveChartsShown){

        $("#subjectiveChartsButton").d3Click();
    }


    generateNewMapping();
    redrawVisualisations();
}

function generateSortSelectors(){

    var tempCat = categoriesInBedMetrics.concat("SE");
    console.log(tempCat);
    var s_cont = d3.select("#sortSelectors").selectAll('.selectorContainer')
        .data(tempCat)
        .enter()
        .append('div').attr("class",function(d){return "selectorContainer selector" + d});


    s_cont.append("input").attr("type","radio")//.property('checked', function(d){return config_features[d.key].active;})
        .on("change",function(d){
            d3.select("#sortSelectors").selectAll("input").property('checked',false);
            d3.select(this).property('checked',true);
            visualizedDays = sortOnFeature(d);
            redrawVisualisations();
        });
    s_cont.append("span").text(function(d){return d});

    var s = d3.select("#sortSelectors").append('div').attr("class", "selectorContainer selector default");
    s.append("input").attr("type","radio")//.property('checked', function(d){return config_features[d.key].active;})
        .on("change",function(d){
            d3.select("#sortSelectors").selectAll("input").property('checked',false);
            d3.select(this).property('checked',true);
            visualizedDays = visualizedDays.sort();
            redrawVisualisations();
        });
    s.append("span").text("Default (chronological)");

}

function sortOnFeature(feature){
    var dataPoints;
    
    
    if(feature == "SE"){
        dataPoints= collection_day_data.map(function(d,i){
        return {day:i, value:d.smartPhoneData.flattened["TST"]/(d.smartPhoneData.flattened["TST"]+d.smartPhoneData.flattened["TWT"])};
    });
    }else{
        dataPoints= collection_day_data.map(function(d,i){
        return {day:i, value:d.smartPhoneData.flattened[feature]};
    });
    }


    function tempSort(a,b){
        return a.value - b.value;
    }
    var sortedData = dataPoints.sort(tempSort);

    var sortedDays = sortedData.map(function(d){return d.day;});

    return sortedDays;

}

