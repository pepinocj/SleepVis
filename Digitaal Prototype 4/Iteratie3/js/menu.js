    /**
     * Created by Josi on 5/12/2015.
     */






    var menuButtons = {
        subjectiveChartsShown: false,
        switcherShown: false,
        subjectiveTimeLineShown: true,
        sensorDataShown: true,
        sortData: false,
        standingDataShown: false,
        objectiveDataShown: false,
        zoom: false
    };

    function invokeButtons() { // is overbodig indien elke feature in een svg zat ==> displayblock, false



        d3.selectAll(".subjContext").classed("hidden", !menuButtons.subjectiveChartsShown);
        //    d3.select("#heartFeaturesSelectors").classed("hidden",!menuButtons.objectiveDataShown);
        //    d3.select("#linesSelectors").classed("hidden",!menuButtons.switcherShown);
        //    d3.select("#sortSelectors").classed("hidden",!menuButtons.sortData);
        //    d3.select("#movementFeaturesSelectors").classed("hidden",!menuButtons.standingDataShown);
        d3.select("#chart").selectAll(".standing").classed("hidden", !config_features["standing"].active);
        d3.selectAll(".g3").classed("transparent", !config_features["movement"].active);

        d3.selectAll(".lyingMarker").classed("hidden", !config_features["lying"].active);

        d3.selectAll(".g6").classed("hidden", !isYAxisOn);

        d3.selectAll(".viz.patch").classed("hidden", !menuButtons.sensorDataShown);
        d3.selectAll(".viz.subjective").classed("hidden", !menuButtons.subjectiveTimeLineShown);

        //if(Object.keys(mappingSelectedFeatureRow).length == 0 ){
        //    d3.selectAll(".viz.patch").classed("hidden",true);
        //}else{
        //    d3.selectAll(".viz.patch").classed("hidden",false);
        //}
    }


    function initButtons() {
        d3.select("#standingDataButton").classed("clickedButton", menuButtons.standingDataShown);
        d3.select("#sortButton").classed("clickedButton", menuButtons.sortData);
        d3.select("#subjectiveChartsButton").classed("clickedButton", menuButtons.subjectiveChartsShown);
        d3.select("#subjectiveTimeLineButton").classed("clickedButton", menuButtons.subjectiveTimeLineShown);
        d3.select("#objectiveDataButton").classed("clickedButton", menuButtons.objectiveDataShown);
        d3.select("#zoomButton").classed("clickedButton", menuButtons.zoom);



        d3.select("#myonoffswitch").on("click", function () {

            d3.select("#detailsContainer").classed("hidden", !d3.select("#detailsContainer").classed("hidden"));
            d3.select("#subjectiveOverviewContainer").classed("hidden", !d3.select("#subjectiveOverviewContainer").classed("hidden"));

        })


        d3.select("#standingDataButton").on("click", function () {
            var bool = !d3.select("#movementFeaturesSelectors").classed("hidden");
            d3.selectAll(".selectorsContainer").classed("hidden", true);
            d3.selectAll(".button").classed("clickedButton", false);

            d3.select("#standingDataButton").classed("clickedButton", !bool);
            //d3.selectAll(".standing").classed("hidden", menuButtons.standingDataShown);
            d3.select("#movementFeaturesSelectors").classed("hidden", bool);
            menuButtons.standingDataShown = !(menuButtons.standingDataShown);
        });

        d3.select("#journalFeaturesButton").on("click", function () {
            var bool = !d3.select("#focusSelectors").classed("hidden");
            d3.selectAll(".selectorsContainer").classed("hidden", true);
            d3.selectAll(".button").classed("clickedButton", false);

            d3.select("#journalFeaturesButton").classed("clickedButton", !bool);

            d3.select("#focusSelectors").classed("hidden", bool);

        });

        d3.select("#sortButton").on("click", function () {
            var bool = !d3.select("#sortSelectors").classed("hidden");
            d3.selectAll(".selectorsContainer").classed("hidden", true);
            d3.selectAll(".button").classed("clickedButton", false);

            //d3.selectAll(".standing").classed("hidden", menuButtons.standingDataShown);
            d3.select("#sortSelectors").classed("hidden", bool);
            d3.select("#sortButton").classed("clickedButton", !bool);
            menuButtons.sortData = !(menuButtons.sortData);
        });


        d3.select("#zoomButton").on("click", function () {
            d3.selectAll(".selectorsContainer").classed("hidden", true);
            d3.selectAll(".button").classed("clickedButton", false);
            d3.select("#movingDataButton").classed("clickedButton", !menuButtons.zoom);
            isYAxisOn = !menuButtons.zoom;
            d3.selectAll(".g6").classed("hidden", isYAxisOn);
            showLoadScreenDuringCall(redrawVisualisations);

            menuButtons.zoom = !(menuButtons.zoom);
        });


        d3.select("#subjectiveChartsButton")
            .on("click", function () {
                d3.selectAll(".selectorsContainer").classed("hidden", true);
            
                d3.select("#subjectiveChartsButton").classed("clickedButton", !menuButtons.subjectiveChartsShown);

                d3.selectAll(".subjContext").classed("hidden", menuButtons.subjectiveChartsShown);



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
            .on("click", function () {
                var bool = !d3.select("#heartFeaturesSelectors").classed("hidden");
                d3.selectAll(".selectorsContainer").classed("hidden", true);
d3.selectAll(".button").classed("clickedButton", false);

                d3.select("#heartFeaturesSelectors").classed("hidden", bool);
                d3.select("#objectiveDataButton").classed("clickedButton", !bool);
                menuButtons.objectiveDataShown = !(menuButtons.objectiveDataShown);
            });

        d3.select("#switcherButton")
            .on("click", function () {
                var bool = !d3.select("#linesSelectors").classed("hidden");
                d3.selectAll(".selectorsContainer").classed("hidden", true);
d3.selectAll(".button").classed("clickedButton", false);
                d3.select("#switcherButton").classed("clickedButton", !bool);
                d3.select("#linesSelectors").classed("hidden", bool);
                menuButtons.switcherShown = !(menuButtons.switcherShown);
            });

        d3.select("#hideDiaryButton").on("click", function () {
            d3.select("#floatingDiary").classed("hidden", true);
        });



        var cont = d3.select("#linesSelectors")
            .append('div').attr("class", "selectorContainer selector");


        cont.append("input").attr("type", "checkbox").property('checked', menuButtons.sensorDataShown)
            .on("change", function () {

                menuButtons.sensorDataShown = !(menuButtons.sensorDataShown);
                d3.selectAll(".viz.patch").classed("hidden", !menuButtons.sensorDataShown);

                // d3.select("#chart").selectAll(".viz.subjective").classed("hidden",!menuButtons.subjectiveTimeLineShown);



            });
        cont.append("span").text("Sensor data");
        cont.append("img").attr("src", "Icons/sensor.png").attr("width", "200px");
        var cont2 = d3.select("#linesSelectors")
            .append('div').attr("class", "selectorContainer selector");


        cont2.append("input").attr("type", "checkbox").property('checked', menuButtons.subjectiveTimeLineShown)
            .on("change", function () {

                menuButtons.subjectiveTimeLineShown = !(menuButtons.subjectiveTimeLineShown);
                d3.selectAll(".viz.subjective").classed("hidden", !menuButtons.subjectiveTimeLineShown);

            });
        cont2.append("span").text("Journal data");
        cont2.append("img").attr("src", "Icons/journal.png").attr("width", "200px");

    }

    function generateSelectors() {
        var features = d3.entries(config_features);

        var heartFeatures = features.filter(function (d) {
            return config_features[d.key].type == 'heart';
        });
        var moveFeatures = features.filter(function (d) {
            return config_features[d.key].type == 'mov' && visualizedMovement.indexOf(d.key) > -1;
        });

        function genMenus(features, box) {

            var select_all_h = d3.select("#" + box).append('div').attr("class", "allSelectorContainer");
            select_all_h.append("input").attr("type", "checkbox").property('checked',
                    features.filter(function (d) {
                        return config_features[d.key].active;
                    }).length == features.length)
                .on("change", function (d) {
                    var bool = features.filter(function (d) {
                        return config_features[d.key].active;
                    }).length == features.length;

                    for (var k = 0; k < features.length; k++) {
                        config_features[features[k].key].active = !bool;
                    }

                    d3.select("#" + box).selectAll('input').property('checked', !bool);
                    generateNewMapping();
                    showLoadScreenDuringCall(redrawVisualisations);
                });
            select_all_h.append("span").text("All");

            var s_cont = d3.select("#" + box).selectAll('.selectorContainer')
                .data(features)
                .enter()
                .append('div').attr("class", function (d) {
                    return "selectorContainer selector" + d.key
                });


            s_cont.append("input").attr("type", "checkbox").property('checked', function (d) {
                    return config_features[d.key].active;
                })
                .on("change", function (d) {
                    config_features[d.key].active = !config_features[d.key].active;
                    if (!config_features[d.key].active) {
                        d3.select("#" + box).select(".allSelectorContainer").select('input').property('checked', false);
                    }
                    generateNewMapping();
                    showLoadScreenDuringCall(redrawVisualisations);
                });
            s_cont.append("span").text(function (d) {
                return config_features[d.key]["name"]
            });



            return s_cont;
        }

        var coll = genMenus(heartFeatures, "heartFeaturesSelectors");
        coll.append("span").attr("style","position:relative").text(function(d){
            return ": "+config_features[d.key].extra_info
        })
//        coll.append("button").attr({
//            class: "focusSelector"
//        }).text("FOCUS").on("click", function (d) {
//            focusFeature(d.key);
//
//        });

        //focusFeature(d.feature);

        coll = genMenus(moveFeatures, "movementFeaturesSelectors");

        coll.append("img").attr("width", 150).attr("style", "right:0px").attr("src", function (d) {
            if (d.key == "movement") {
                return "Icons/movement_marker.png";
            }

            if (d.key == "lying") {
                return "Icons/lying_maker.png";
            }

            if (d.key == "standing") {
                return "Icons/standing_marker.png";
            }
        })







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


    function focusFeature(feature) {
        var heartFeatures = d3.entries(config_features).filter(function (d) {
            return config_features[d.key].type == 'heart';
        });

        for (var i = 0; i < heartFeatures.length; i++) {
            var active = (heartFeatures[i].key == feature);
            config_features[heartFeatures[i].key].active = active;
            d3.select("#heartFeaturesSelectors").select(".selector" + heartFeatures[i].key).select('input').property('checked', active);
        }


        d3.select("#heartFeaturesSelectors").select(".allSelectorContainer").select('input').property('checked', false);

        if (!menuButtons.zoom) {

            $("#zoomButton").d3Click();
        }

        if (menuButtons.subjectiveChartsShown) {

            $("#subjectiveChartsButton").d3Click();
        }


        generateNewMapping();
        showLoadScreenDuringCall(redrawVisualisations);
    }

    function generateSortSelectors() {

        var tempCat = categoriesInBedMetrics.concat("SE");
        console.log(tempCat);
        var s_cont = d3.select("#sortSelectors").selectAll('.selectorContainer')
            .data(tempCat)
            .enter()
            .append('div').attr("class", function (d) {
                return "selectorContainer selector" + d
            });


        s_cont.append("input").attr("type", "radio") //.property('checked', function(d){return config_features[d.key].active;})
            .on("change", function (d) {
                d3.select("#sortSelectors").selectAll("input").property('checked', false);
                d3.select(this).property('checked', true);
                visualizedDays = sortOnFeature(d);
                showLoadScreenDuringCall(redrawVisualisations);
            });
        s_cont.append("span").text(function (d) {
            return d
        });

        var s = d3.select("#sortSelectors").append('div').attr("class", "selectorContainer selector default");
        s.append("input").attr("type", "radio") //.property('checked', function(d){return config_features[d.key].active;})
            .on("change", function (d) {
                d3.select("#sortSelectors").selectAll("input").property('checked', false);
                d3.select(this).property('checked', true);
                visualizedDays = visualizedDays.sort();
                showLoadScreenDuringCall(redrawVisualisations);
            });
        s.append("span").text("Default (chronological)");

    }

    function generateJournalSelectors() {

        
        var cont1 = d3.select("#focusSelectors").append("div").attr("style","width:100%;float:left;margin-top:10");
        cont1.append("p").attr("style","width:100%").text("Activities");
        
        var cont2 = d3.select("#focusSelectors").append("div").attr("style","width:100%;float:left;margin-top:10");
        cont2.append("p").attr("style","width:100%").text("Bed");
        
        var cont3 = d3.select("#focusSelectors").append("div").attr("style","width:100%;float:left");
        
        
        

        function getCol(act,cont){
            var s_cont = cont.selectAll('.selectorContainer')
            .data(act)
            .enter()
            .append('div').attr("class", function (d) {
                return "selectorContainer activitySelector selector" + d + " " + d + " otherFeature"
            });
            
            return  s_cont;
        }
        
        
        
        


        //        s_cont.append("input").attr("type","checkbox").property('checked',true)//.property('checked', function(d){return config_features[d.key].active;})
        //            .on("change",function(d){
        //
        //                    small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), d);
        //
        //                    d3.select("#small_line_chart").append("svg:image").attr("xlink:href",  contextMapping[d])
        //                    .attr("height",30).attr("width", 30).attr("y",20);
        //
        //
        //                    d3.selectAll("."+d).classed("notSelected",!d3.select("."+d).classed("notSelected"));
        //
        //
        //
        //            });
        
        
        
        function addFeatureSelectors(s_cont){
                s_cont.append("span").text(function (d) {
            return translator[d]
        });
        s_cont.append("img").attr("src", function (d) {
            return contextMapping[d]
        });
        //        s_cont.append("button").attr({class:"focusSelector"}).text("FOCUS").on("click",function(d){
        //            d3.select("#small_line_chart").remove();
        //
        //
        //
        //                    small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), d);
        //
        //                    d3.select("#small_line_chart").append("svg:image").attr("xlink:href",  contextMapping[d])
        //                    .attr("height",30).attr("width", 30).attr("y",20);
        //
        //                    d3.selectAll(".bar").classed("notSelected",true);
        //                    d3.selectAll(".activitySelector").classed("notSelected",true).select('input').property('checked',false);
        //                    d3.selectAll("."+d).classed("notSelected",false);
        //                    d3.selectAll("."+d).select('input').property('checked',true);
        //            
        //                    
        //
        //        });
        s_cont.append("input").attr("type", "radio").property('checked', false).attr({
                class: "focusSelector"
            }) //.property('checked', function(d){return config_features[d.key].active;})
            .on("change", function (d) {
                focusOnFeature(d);

            });
        }
        
        
        var s_cont = getCol(event_activities,cont1);
        addFeatureSelectors(s_cont);
        
        var s_cont2 = getCol(bed_times,cont2);
        addFeatureSelectors(s_cont2);
        
        
        var twt_div = cont2.append('div').attr("class",  "selectorContainer activitySelector selector" + "TWT" + " " + "TWT" + " otherFeature")
        twt_div.append("span").text("Total wake time");
        twt_div.append("img").attr("src", contextMapping["TWT"]);
        
        twt_div.append("input").attr("type", "radio").property('checked', false).attr({
                class: "focusSelector"
            }) //.property('checked', function(d){return config_features[d.key].active;})
            .on("change", function () {
                focusOnFeature("TWT");

            });
        
    



        var s = d3.select("#focusSelectors").append('div').attr("style","width:100%;float:left;text-align:center;margin-top:10");//.attr("class", "selectorContainer selector default");
        s.append("button")
            .on("click", function (d) {

                defocusFeature(d);
                small_bar_chart_context_default(d3.select("#subjectiveSelectedOverviewContainer"));

            }).text("NO FOCUS");

    }


    function sortOnFeature(feature) {
        var dataPoints;


        if (feature == "SE") {
            dataPoints = visualizedDays.map(function (d, i) {
                return {
                    day: d,
                    value: collection_day_data[d.nrDay].smartPhoneData.flattened["TST"] / (collection_day_data[d.nrDay].smartPhoneData.flattened["TST"] + collection_day_data[d.nrDay].smartPhoneData.flattened["TWT"])
                };
            });
        } else {
            dataPoints = visualizedDays.map(function (d, i) {
                return {
                    day: d,
                    value: collection_day_data[d.nrDay].smartPhoneData.flattened[feature]
                };
            });
        }


        function tempSort(a, b) {
            return a.value - b.value;
        }
        var sortedData = dataPoints.sort(tempSort);

        var sortedDays = sortedData.map(function (d) {
            return d.day;
        });

        return sortedDays;

    }
