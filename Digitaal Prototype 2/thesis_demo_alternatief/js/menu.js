/**
 * Created by Josi on 5/12/2015.
 */


var menuButtons = { subjectiveChartsShown : false,
 subjectiveTimeLineShown : true,
    movingDataShown : true,
    standingDataShown : true,
 objectiveDataShown : true};

function invokeButtons(){
    d3.select("#standingDataButton").classed("clickedButton", menuButtons.standingDataShown);
    d3.select("#subjectiveChartsButton") .classed("clickedButton", menuButtons.subjectiveChartsShown);
    if(!menuButtons.subjectiveChartsShown){
        d3.selectAll(".subjContext").classed("hidden",true);
        //d3.selectAll(".viz.patch").classed("hidden",false);
        //d3.selectAll(".mainViz").classed("full-view",true);
    }else{
        d3.selectAll(".subjContext").classed("hidden",false);
        //d3.selectAll(".viz.patch").classed("hidden",true);
        //d3.selectAll(".mainViz").classed("full-view",false);
    }
    d3.select("#subjectiveTimeLineButton").classed("clickedButton", menuButtons.subjectiveTimeLineShown);
    if(!menuButtons.subjectiveTimeLineShown){

        d3.selectAll(".viz.subjective").classed("hidden",true);
    }else{
        d3.selectAll(".viz.subjective").classed("hidden",false);
    }

    d3.select("#objectiveDataButton").classed("clickedButton", menuButtons.objectiveDataShown);
    if(!menuButtons.objectiveDataShown){
        d3.selectAll(".viz.patch").classed("hidden",true);

    }else{
        d3.selectAll(".viz.patch").classed("hidden",false);
    }
}


function initButtons(){
    d3.select("#standingDataButton").on("click", function(){
        d3.select("#standingDataButton").classed("clickedButton", !menuButtons.standingDataShown);
            d3.selectAll(".standing").classed("hidden", menuButtons.standingDataShown);

        menuButtons.standingDataShown = !(menuButtons.standingDataShown);
    });
    d3.select("#movingDataButton").on("click", function(){
        d3.select("#movingDataButton").classed("clickedButton", menuButtons.movingDataShown);
        d3.selectAll(".cell").classed("transparent", menuButtons.movingDataShown);





        menuButtons.movingDataShown = !(menuButtons.movingDataShown);
    });


    d3.select("#subjectiveChartsButton")
        .on("click", function(){
            d3.select("#subjectiveChartsButton") .classed("clickedButton", !menuButtons.subjectiveChartsShown);
            if(menuButtons.subjectiveChartsShown){
                d3.selectAll(".subjContext").classed("hidden",true);
               // d3.selectAll(".viz.patch").classed("hidden",false);
                //d3.selectAll(".mainViz").classed("full-view",true);
            }else{
                d3.selectAll(".subjContext").classed("hidden",false);
               // d3.selectAll(".viz.patch").classed("hidden",true);
                //d3.selectAll(".mainViz").classed("full-view",false);
            }


            menuButtons.subjectiveChartsShown = !(menuButtons.subjectiveChartsShown);
        });

    d3.select("#subjectiveTimeLineButton")
        .on("click", function(){
            d3.select("#subjectiveTimeLineButton").classed("clickedButton", !menuButtons.subjectiveTimeLineShown);
            if(menuButtons.subjectiveTimeLineShown){
                d3.selectAll(".viz.subjective").classed("hidden",true);
            }else{
                d3.selectAll(".viz.subjective").classed("hidden",false);
            }


            menuButtons.subjectiveTimeLineShown = !(menuButtons.subjectiveTimeLineShown);
        });

    d3.select("#objectiveDataButton")
        .on("click", function(){
            d3.select("#objectiveDataButton").classed("clickedButton", !menuButtons.objectiveDataShown);
            if(menuButtons.objectiveDataShown){
                d3.selectAll(".viz.patch").classed("hidden",true);

            }else{
                d3.selectAll(".viz.patch").classed("hidden",false);
            }

            menuButtons.objectiveDataShown = !(menuButtons.objectiveDataShown);
        });

    d3.select("#hideDiaryButton").on("click", function(){
        d3.select("#floatingDiary").classed("hidden",true);
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
        });
    s_cont.append("span").text(function(d){return d.key});


}

