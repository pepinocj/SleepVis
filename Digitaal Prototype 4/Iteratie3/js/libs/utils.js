var formatDate="DD-MM-YYYY hh:mm:ss";

function getDuration(dateMax,dateMin){
    //var a = moment(dateMax,formatDate);
    //var b = moment(dateMin,formatDate);
    //return a.diff(b,"seconds");
    if(dateMin == "none"){
        return 0;
    }
    return (new Date(dateMax)-new Date(dateMin))/(1000*60);
}

function label3DPosition(colorString){
    var color = colorString;

    var x = color.substring(1,3);
    var y = color.substring(3,5);
    var z = color.substring(5,7);

    x = parseInt(x,16)/256;
    y = parseInt(y,16)/256;
    z = parseInt(z,16)/256;

    var bounds = [0.25,0.75];
    function convert(arr){
console.log(arr);
        var result = [];
        arr.map(function(d){
            if(d<bounds[0]){
                result.push(0);
            }
            if(d>bounds[1]){
                result.push(1);
            }


        });

        if(result.length != arr.length){
            return -1;
        }

        if(result.indexOf(0)<0||result.indexOf(1)<0){
            return -1;
        }
            return result;



    }


    var temp = convert([x,y,z]);

    if(temp==-1){
        return "unknown position";
    }

    return posMapping["_"+temp[0]+""+temp[1]+""+temp[2]];





}

var posMapping = {_100:"LEFT",
    _011:"RIGHT",
    _110:"BELLY",
    _001:"BACK",
    _010:"UD",
    _101:"STANDING"

};

function getColorOfBin(bin){
    var r = parseInt(bin.charAt(1));
    var g = parseInt(bin.charAt(2));
    var b = parseInt(bin.charAt(3));

    function getHex(i){
        if (i==0){
            return "00";
        }
        else{
            return "ff"
        }
    }

    return "#"+getHex(r)+getHex(g)+getHex(b);
}

function getRedColor(nr){
    return "0x"+nr.toString(16)+"0000";
}

function generateStandingPeriods(datapoints){
    var results=[];

    var standing = false;
    datapoints.map(function(d){
        if(d.value<-0.60){
            if(standing){
                results[results.length-1].to = results[results.length-1].to + 1;
            }else{
                results.push({from: d.col,to: d.col+1});
                standing = true;
            }
        }else{
            standing = false;
        }
    });

    return results;
}

function generateLyingPeriods(datapoints){
    var results=[];

    var standing = false;
    datapoints.map(function(d){
        if(d.value>-0.60){
            if(standing){
                results[results.length-1].to = results[results.length-1].to + 1;
            }else{
                results.push({from: d.col,to: d.col+1});
                standing = true;
            }
        }else{
            standing = false;
        }
    });

    return results;
}

function showLoadScreenDuringCall(f){
    d3.select("#loadScreen").classed("hidden",false);
   
	setTimeout(function(){
    f();
    d3.select("#loadScreen").classed("hidden",true);
}, 100);
        

    
    
}

function showLoadScreenDuringCallAndGoToDay(f,day){
    d3.select("#loadScreen").classed("hidden",false);
   
	setTimeout(function(){
    f();
    d3.select("#loadScreen").classed("hidden",true);
    $("#dayViz"+day).scrollView();
                   
}, 100);
        

    
    
}

    function focusOnFeature(d) {
        d3.select("#small_line_chart").remove();
        

        d3.select("#small_line_chart").append("svg:image").attr("xlink:href", contextMapping[d])
            .attr("height", 30).attr("width", 30).attr("y", 20);

        d3.selectAll(".bar").classed("notSelected", true);
        d3.selectAll(".activitySelector").classed("notSelected", true).select('input').property('checked', false);
        d3.selectAll("." + d).classed("notSelected", false);
        d3.selectAll("." + d).select('input').property('checked', true);
        
        if(d == "TWT"){
            d3.select("#chart").selectAll("." + "SOL").classed("notSelected", false);
        d3.select("#chart").selectAll("." + "WASO").classed("notSelected", false);
        d3.select("#chart").selectAll("." + "EMA").classed("notSelected", false);
        }
        
                            
        small_bar_chart_context(d3.select("#subjectiveSelectedOverviewContainer"), d);
    }

    function defocusFeature(d){
        d3.select("#small_line_chart").remove();
        d3.selectAll(".bar").classed("notSelected", false);
        d3.selectAll(".activitySelector").classed("notSelected", false).select('input').property('checked', false);
    }

function focusOnDay(day){
    d3.selectAll(".dayLine").classed("selectedDay",false);
    d3.selectAll(".dayLine"+day).classed("selectedDay",true);
}




