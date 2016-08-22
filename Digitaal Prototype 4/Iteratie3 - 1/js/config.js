/**
 * Created by Josi on 11/11/2015.
 */
var colors_body_positions = ['black', 'purple', 'purple', 'yellow', 'yellow', 'red', 'red', 'black'];
var colors_green_to_red  = ['#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B', '#9EC2B3', '#B8D4CB', '#D2E6E3', '#EDF8FB', '#FFFFFF', '#F1EEF6', '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C', '#A63467', '#9B1A53', '#91003F'];

var colors_days = ["#7B68EE", "#6A5ACD", "#483D8B", "#4169E1", "#0000FF", "#0000CD", "#00008B"];
var colors_blue_to_red = ["E51400",
    "E15800",
    "DD9900",
    "D9D700",
    "97D500",
    "55D200",
    "16CE00",
    "00CA27",
    "00C662",
    "00C29A",
    "00ADBF"];

colors_blue_to_red = colors_blue_to_red.reverse();

var colors_white_to_red = ["E51400",
    "E15800",
    "DD9900",
    "D9D700",
    "97D500",
    "55D200",
    "16CE00",
    "AAAAAA",
    "BBBBBB",
    "EEEEEE",
    "FFFFFF"].reverse();


var config_features = {
    N: {
        color: colors_blue_to_red,
        min: 30,
        max: 120,
        type: 'heart',
        active: true,
        name: "bpm",
        extra_info: "Beats per minute"
    },
    meanNN: {
        color: colors_blue_to_red,
        min: 500,
        max: 900,
        type: 'heart',
        active: false,
        name: "meanNN",
        extra_info: "Mean of beat to beat intervals"
    },
    SDNN: {
        color: colors_blue_to_red,
        min: 0,
        max: 500,
        type: 'heart',
        active: false,
        name: "SDNN",
        extra_info: "Standard deviation of beat to beat intervals"
    },
    RMSSD: {
        color: colors_blue_to_red,
        min: 50,
        max: 550,
        type: 'heart',
        active: false,
        name: "RMSSD",
        extra_info: "Root mean square of SDNN"
    } //wrong
    //,NN50count1:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    //,NN50count2:{color:colors_green_to_red, min:0 , max: 1000,type:'heart'}
    //,NN50count:{color:colors_green_to_red, min:0 , max: 700,type:'heart'}
    //,pNN50:{color:colors_blue_to_red, min:0 , max: 1,type:'heart',active:false,name:"pNN50"}
    //,SD1:{color:colors_green_to_red, min:0 , max: 1500,type:'heart'}
    //,SD2:{color:colors_green_to_red, min:0 , max: 1500,type:'heart'}
    //,r_RR:{color:colors_blue_to_red.slice().reverse(),min: -1, max: 1,type:'heart',active:false,name:"r_RR"}
    //,HRVindex128:{color:colors_green_to_red, min:0, max:50,type:'heart'}
    //,VLF:{color:colors_green_to_red, min:0, max:20000,type:'heart'}
    //,LF:{color:colors_green_to_red, min:0, max:20000,type:'heart'}
    //,HF:{color:colors_green_to_red.slice().reverse(), min:0, max:20000,type:'heart'}
    //,TotalPower:{color:colors_green_to_red, min:0, max:100000,type:'heart'}
    //,LFHFratio:{color:colors_green_to_red,min:0, max:5,type:'heart'}
    //,LFnu:{color:colors_green_to_red,min:0, max:0.25,type:'heart'}
    //,HFnu:{color:colors_green_to_red,min:0, max:0.25,type:'heart'}
    //,FFT_VLF:{color:colors_blue_to_red, min:0, max:100000,type:'heart',active:false,name:"VLF"}
    //,FFT_LF:{color:colors_blue_to_red, min:0, max:50000,type:'heart',active:true,name:"LF"}
    //,FFT_HF:{color:colors_blue_to_red, min:0, max:50000,type:'heart',active:true,name:"HF"}
    //,FFT_TotalPower:{color:colors_green_to_red, min:0, max:100000,type:'heart'}
    //,FFT_LFHFratio:{color:colors_green_to_red,min:0, max:5,type:'heart'}
    ,
    FFT_LFnu: {
        color: colors_green_to_red,
        min: 0,
        max: 1,
        type: 'heart',
        active: true,
        name: "LFnu",
        extra_info: "Indication of sympathetic activity of ANS (stress) and REM sleep"
    },
    FFT_HFnu: {
        color: colors_green_to_red,
        min: 0,
        max: 1,
        type: 'heart',
        active: true,
        name: "HFnu",
        extra_info: "Indication of parasympathetic activity of ANS (rest)"
    }
    //    //,FFT_VLF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    //,FFT_LF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    //,FFT_HF:{color:colors_green_to_red, min:0, max:50000,type:'heart'}
    //,FFT_TotalPower:{color:colors_green_to_red, min:0, max:100000,type:'heart'}
    ,
    FFT_LFHFratio: {
        color: colors_green_to_red,
        min: 0,
        max: 3,
        active: false,
        type: 'heart',
        name: "LFnu/HFnu",
        extra_info: "Indication of sympathovagal balance"
    }
    //,FFT_LFnu:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    //,FFT_HFnu:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    //,failed:{color:colors_green_to_red,min:0, max:1,type:'heart'}
    ,
    movement: {
        color: colors_white_to_red,
        min: 0,
        max: 75,
        type: 'mov',
        active: true,
        name: "movement",
        extra_info: "movement intensity"
    }
    //,movement_std:{color:colors_blue_to_red,min:0, max:10,type:'mov',active:false,name:"movement_std"}
    ,
    mean_x_norm: {
        color: colors_green_to_red,
        min: -1,
        max: 1,
        type: 'mov',
        active: false,
        name: "x"
    },
    mean_y_norm: {
        color: colors_green_to_red.slice().reverse(),
        min: -1,
        max: 1,
        type: 'mov',
        active: false,
        name: "rate standing-lying"
    },
    mean_z_norm: {
        color: colors_green_to_red,
        min: -1,
        max: 1,
        type: 'mov',
        active: false,
        name: "z"
    }

    ,
    mean_position: {
        color: colors_body_positions,
        min: -3.14,
        max: 3.14,
        type: 'mov',
        active: false,
        name: "lying position"
    }
};

var visualizedMovement = ["movement", "mean_3D_position", "movement_std", "standing", "lying", "positions"];


var config_subjective_data;

var mapping_to_type_subjective_data = {};





function addPostProcessingFeatures() {

    config_features["standing"] = {
        color: colors_body_positions,
        min: 0,
        max: 1,
        type: 'mov',
        active: true,
        name: "standing periods"
    };
    config_features["lying"] = {
        color: colors_body_positions,
        min: 0,
        max: 1,
        type: 'mov',
        active: true,
        name: "lying periods"
    };
    // add3DPosition();
}

function add3DPosition() {
    config_features["mean_3D_position"] = {
        color: colors_body_positions,
        min: 0,
        max: 1,
        type: 'mov',
        active: false,
        name: "full detail position"
    };
    calculateDefaultNumeralMapping();
    var x = collection_metrics.mean_x_norm[0];

    var y = collection_metrics.mean_y_norm[0];
    var z = collection_metrics.mean_z_norm[0];
    var processedData = [];

    function getRGBString(xD, yD, zD) {
        var r = 0;
        var g = 0;
        var b = 0;

        var norm = Math.sqrt(xD * xD + yD * yD + zD * zD);
        var xnorm = Math.abs(xD) / norm;
        var ynorm = Math.abs(yD) / norm;
        var znorm = Math.abs(zD) / norm;

        var xD = xD * xnorm;
        var yD = yD * ynorm;

        var zD = zD * znorm;

        if (xD > 0) {
            b = b + xD * 255;
        } else {

            r = r + Math.abs(xD) * 255;
            g = g + Math.abs(xD) * 255;

        }

        if (yD > 0) {
            r = r + yD * 255;
        } else {
            b = b + Math.abs(yD) * 255;
            g = g + Math.abs(yD) * 255;
        }

        if (zD > 0) {
            g = g + zD * 255;
        } else {
            r = r + Math.abs(zD) * 255;
            b = b + Math.abs(zD) * 255;
        }
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);

        function convertToHex(str) {
            var result = str.toString(16);
            if (result.length < 2) {
                result = "0" + result;
            }
            return result;
        }





        var result = "#" + convertToHex(b) + convertToHex(r) + convertToHex(g);
        return result;
    }
    x.map(function (d, i) {
        var clone = jQuery.extend(true, {}, d);
        clone.value = getRGBString(x[i].value, y[i].value, z[i].value);
        clone.numMapFeature = config_features["mean_3D_position"]["numMap"];
        clone.feature = "mean_3D_position";
        processedData.push(clone);

    });




    add_metric("mean_3D_position", [processedData, function (d) {
        return d
    }]);


}



function calculateDefaultNumeralMapping() {
    var i = 0;
    for (var key in config_features) {
        config_features[key]['numMap'] = i;
        i = i + 1;
    }
}
calculateDefaultNumeralMapping();


var cellSize = 5;


var verDetail;
var horDetail;

var margin,
    width,
    height;

var detailsMargin;

var timeFeatures;





var parseDate = d3.time.format("%b %Y").parse;
var isYAxisOn = false;

function getCellHeightMainViz(focus) {
    var factor = 1;
    if (isYAxisOn || focus) {
        factor = 7;
    }
    return factor * cellHeightDayView;
}

var nrDataPoints;
var xScale,
    x2Scale;
var chartX;
var chartXAxis;
var brushX;
var brushXAxis;
var cellWidthDayView;
var cellHeightDayView;


var visualizedDays = []; //,4,5,0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5];
var config_subjective_features;
var svgContext;
var brush;

function initializeConfigVariables() {
    contextMappingGeneration();
    margin = {
            top: 0,
            right: 0,
            bottom: 10,
            left: 90
        },
        width = document.body.clientWidth * 0.6 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    detailsMargin = {
        top: 0,
        right: 10,
        bottom: 10,
        left: 0
    };

    timeFeatures = {
        brusher: {
            width: document.body.clientWidth * 0.4,
            height: 10
        },
        shared: {
            width: document.body.clientWidth - margin.left - margin.right,
            margin: {
                right: 10,
                left: 90
            }
        },
        objectiveFeatures: {
            margin: {
                top: 0,
                bottom: 10
            },

            height: 200 - margin.top - margin.bottom
        },
        subjectiveFeatures: {
            margin: {
                top: 0,
                bottom: 10
            },

            height: 200 - margin.top - margin.bottom
        }
    };


    nrDataPoints = 290;
    xScale = d3.scale.linear().range([0, width]).domain([0, nrDataPoints]),
        x2Scale = d3.scale.linear().range([0, timeFeatures.brusher.width]).domain([0, nrDataPoints]);

    cellWidthDayView = width / nrDataPoints;
    cellHeightDayView = 12;


    brush = d3.svg.brush()
        .x(x2Scale)
        .on("brush", brushed);




    var simple_activities = ["M", "C", "A", "Dutjes", "nightmare", "light_off", "light_on", "Fat_food",

"LIGHT_ON",
"NIGHTMARE",

"ALCOHOL",
"MEDICIN",
"LIGHT_OFF",

"MEDICINE",
"COFFEE"
];
    var durable_activities = ["WASO", "EMA", "SOL", "sport", "TWT", "toilet", "tv",
                             "READING", "TOILET",
"SPORT",
"WALKING",
"NAP",
"OTHER",
"CIGARETTE",
"NIGHT_CALL",
"LAPTOP", "TELEVISION",
"SMARTPHONE"];
    
    
    var sleep_activities = ["Sleep", "TST","TBT"];

    config_subjective_durations = {
        simple: {
            min: 0,
            max: 5
        },
        durable: {
            min: 0,
            max: 300
        },
        sleep: {
            min: 0,
            max: 800
        }
    };

    simple_activities.map(function (d) {
        mapping_to_type_subjective_data[d] = config_subjective_durations.simple;
    });

    durable_activities.map(function (d) {
        mapping_to_type_subjective_data[d] = config_subjective_durations.durable;
    });

    sleep_activities.map(function (d) {
        mapping_to_type_subjective_data[d] = config_subjective_durations.sleep;
    });

    config_subjective_features = {};

    events = simple_activities.concat(durable_activities)
    all_activities = events.concat(sleep_activities);

    bed_times = ["TST", "WASO", "EMA", "SOL","TBT"];
    event_activities = [
                       "LIGHT_ON",
"NIGHTMARE",
"TOILET",
"SPORT",
"ALCOHOL",
"MEDICIN",
"LIGHT_OFF",

"MEDICINE",
"COFFEE",
                       "READING",
"WALKING",
"NAP",
"OTHER",
"CIGARETTE",
"NIGHT_CALL",
"LAPTOP", "TELEVISION",
"SMARTPHONE"];


}

function provideRoomForSevenDays() {
    var newMargin = document.body.clientHeight - 8 * d3.select("#chart").select(".dayViz").node().getBoundingClientRect().height;
    d3.select("#chart").selectAll(".dayViz").attr("style", "padding-top:" + Math.max(newMargin / 7, 0));
}


function calculateTimeLineWidth() {

}


var xTimeScale = d3.time.scale();
var xTimeYearScale = d3.time.scale();

var mappingSelectedFeatureRow = {};
var mappingSelectedPositionContext = {};



function generateNewMapping() {
    mappingSelectedFeatureRow = {};
    mappingSelectedPositionContext = {};
    var i = 0;

    for (var k in config_features) {
        if (config_features[k].active && config_features[k].type == "heart") {
            mappingSelectedFeatureRow[k] = i;
            i = i + 1;
        }
    }

    for (var k in config_features) {
        if (config_features[k].active && config_features[k].type == "mov") { // && visualizedMovement.indexOf(k)>-1
            mappingSelectedPositionContext[k] = i;
            i = i + 1;
        }
    }

}


var contextMapping;
var imageFolder;

function contextMappingGeneration() {
    imageFolder = "Icons/";

    contextMapping = {
        SPORT: imageFolder + "sport.png",
        LIGHT_ON: imageFolder + "technology.svg",
        NIGHTMARE: imageFolder + "scary_mask-512.png",
        TOILET: imageFolder + "toilet.png",
        SPORT: imageFolder + "sport.png",
        ALCOHOL: imageFolder + "glass-and-bottle-of-wine.png",
        MEDICIN: imageFolder + "pill.png",
        COFFEE: imageFolder + "koffie.png",
        LIGHT_OFF: imageFolder + "light.svg",
        READING: imageFolder + "book.svg",
        WALKING: imageFolder + "sports.svg",
        NAP: imageFolder + "rest.svg",
        OTHER: imageFolder + "mark.svg",
        CIGARETTE: imageFolder + "silhouette.svg",
        NIGHT_CALL: imageFolder + "telephone.svg",
        LAPTOP: imageFolder + "computer.svg",
        SMARTPHONE: imageFolder + "icon.svg",
        MEDICINE: imageFolder + "tv.png",
        TELEVISION: imageFolder + "screen.svg"
    }





}
