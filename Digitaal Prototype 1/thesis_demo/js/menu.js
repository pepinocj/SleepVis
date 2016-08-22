/**
 * Created by Josi on 5/12/2015.
 */


var menuButtons = { subjectiveChartsShown : true,
 subjectiveTimeLineShown : true,
 objectiveDataShown : true};

function invokeButtons(){
    if(!menuButtons.subjectiveChartsShown){
        d3.selectAll(".subjContext").classed("hidden",true);

        //d3.selectAll(".mainViz").classed("full-view",true);
    }else{
        d3.selectAll(".subjContext").classed("hidden",false);
        //d3.selectAll(".mainViz").classed("full-view",false);
    }

    if(!menuButtons.subjectiveTimeLineShown){
        d3.selectAll(".viz.subjective").classed("hidden",true);
    }else{
        d3.selectAll(".viz.subjective").classed("hidden",false);
    }

    if(!menuButtons.objectiveDataShown){
        d3.selectAll(".viz.patch").classed("hidden",true);

    }else{
        d3.selectAll(".viz.patch").classed("hidden",false);
    }
}


function initButtons(){
    d3.select("#subjectiveChartsButton")
        .on("click", function(){
            if(menuButtons.subjectiveChartsShown){
                d3.selectAll(".subjContext").classed("hidden",true);
                d3.selectAll(".mainViz").classed("full-view",true);
            }else{
                d3.selectAll(".subjContext").classed("hidden",false);
                d3.selectAll(".mainViz").classed("full-view",false);
            }


            menuButtons.subjectiveChartsShown = !(menuButtons.subjectiveChartsShown);
        });

    d3.select("#subjectiveTimeLineButton")
        .on("click", function(){

            if(menuButtons.subjectiveTimeLineShown){
                d3.selectAll(".viz.subjective").classed("hidden",true);
            }else{
                d3.selectAll(".viz.subjective").classed("hidden",false);
            }


            menuButtons.subjectiveTimeLineShown = !(menuButtons.subjectiveTimeLineShown);
        });

    d3.select("#objectiveDataButton")
        .on("click", function(){
            if(menuButtons.objectiveDataShown){
                d3.selectAll(".viz.patch").classed("hidden",true);

            }else{
                d3.selectAll(".viz.patch").classed("hidden",false);
            }

            menuButtons.objectiveDataShown = !(menuButtons.objectiveDataShown);
        });
}

function generateSelectors(){
var features =  d3.entries(config_features);

    var s_cont = d3.select("#selectorsContainer").selectAll('.selectorContainer')
        .data(features)
        .enter()
        .append('div').attr("class","selectorContainer");

    s_cont.append("input").attr("type","checkbox").property('checked', function(d){return config_features[d.key].active;})
        .on("change",function(d){
            config_features[d.key].active = !config_features[d.key].active;
            generateNewMapping();
            redrawVisualisations();
        })
    s_cont.append("span").text(function(d){return d.key});


}

