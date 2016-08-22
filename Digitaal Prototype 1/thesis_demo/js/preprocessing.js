function getVisualDataForFeature(category, feature,bool_fft){
    var results = {};
    var data_objects = data['user1']['data_obj'];
    var nrRows = data_objects.length;



    var rearrangedObjects = rearrangeData(1,data_objects,category,300);
    var days = rearrangedObjects.map(function(d){return d.dateJS;})
    var nrColumns =rearrangedObjects[4][feature].length; //TODO: hacky, longest day
    for (var i = 0; i<rearrangedObjects.length; i++){
        var signal;
        signal = rearrangedObjects[i][feature];


        //nrColumns = signal.length;

        for(var j=0; j<signal.length;j++){
            if(signal[j] !== null){
                results[i+","+j]={value:signal[j],row:i,col:j,sortedColIndex:null,sortedRowIndex:null,feature:feature,numMapFeature: config_features[feature]['numMap']};
            }


        }

    }




    addSortedResults(results,nrRows,nrColumns);
    var resultArray = [];
    for(var key in results) {
        resultArray.push(results[key]);
    }
    return [resultArray,days];

}
//hours_interval default 24u
function rearrangeData(hours_interval,data_objects,category,epoch){ //epoch meegeven bij visualisatie + preprocessed array vervangen door dictionary, more flattening in matlab
    var resultDataObjects=[];
    var tempStart = data_objects[0]['date'];
    var tempStartJS =  new Date(data_objects[0]['date_string']);
    var tempEnd = tempStart + hours_interval;
    var tempEndJS = new Date((new Date(tempStartJS)).getTime() + 24*60*60*1000);
    var signals;
    var columns = 0;
    var startDateDO = data_objects[0]['date'];
    var endDateDO = data_objects[0]['end_date'];

    resultDataObjects.push({date:tempStart, dateJS:tempStartJS});

    for (var i = 0; i<data_objects.length; i++) {
        startDateDO = data_objects[i]['date'];
        //skip columns --> here
        var diff = startDateDO - endDateDO;
        var columnsToSkip = Math.floor(diff / (epoch / (24*3600.0)));

        if(columnsToSkip>0){
            columns = columns + columnsToSkip;
        }


        for (var j = 0; j < columnsToSkip; j++) {

            resultDataObjects[resultDataObjects.length - 1][key].push(null);
        }
        endDateDO = data_objects[i]['end_date'];
        signals = data_objects[i].preprocessed[1][category];


        var keys = Object.keys(signals);
        var firstKey = keys[0];
        var firstSignal = signals[firstKey].slice();
        for (var j = 0; j < firstSignal.length; j++) {

            if (j * (epoch/(24*3600.0)) + startDateDO > tempEnd) {

                resultDataObjects.push({date: tempEnd,dateJS:tempEndJS});//binding?


                tempStart = tempEnd;
                tempStartJS = tempEndJS;
                tempEnd = tempStart + hours_interval;
                tempEndJS = new Date((new Date(tempStartJS)).getTime() + 24*60*60*1000);
                columns = 0;

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    resultDataObjects[resultDataObjects.length - 1][key] = [];
                }


            }

            for (var k = 0; k < keys.length; k++) {
                var key = keys[k];

                if (typeof resultDataObjects[resultDataObjects.length - 1][key] === 'undefined') {
                    (resultDataObjects[resultDataObjects.length - 1])[key] = [];
                }
                (resultDataObjects[resultDataObjects.length - 1])[key].push(signals[key][j]);
            }
            columns = columns + 1;


        }
    }
    return resultDataObjects;
}

function addSortedResults(matObjects,nrRows,nrColumns){

    horSort(matObjects,nrRows,nrColumns);
    verSort(matObjects,nrRows,nrColumns);
}

function horSort(matObjects,nrRows,nrColumns){
    var arr;
    for (var i= 0;i<nrRows; i++){
        arr=[];
        for (var j= 0;j<nrColumns; j++){
            arr.push(matObjects[i+","+j]);

        }
        arr.sort(function(a, b){return a.value- b.value});
        for (var j= 0;j<nrColumns; j++){
            if(typeof arr[j] !== 'undefined'){
                arr[j]['sortedColIndex'] = j;
            }

        }
    }
}

function verSort(matObjects,nrRows,nrColumns){
    var arr ;
    for (var j= 0;j<nrColumns; j++){
        arr =  [];
        for (var i= 0;i<nrRows; i++){
            arr.push(matObjects[i+","+j]);
        }
        arr.sort(function(a, b){return a.value- b.value});
        for (var i= 0;i<nrRows; i++){
            if(typeof arr[i] !== 'undefined') {
                arr[i]['sortedRowIndex'] = i;
            }
        }
    }

}

function preprocessSmartPhoneData(data){
    var result = {};
    result.date = data.date_begin_sleep;
    result.dayActivities = data.subjective_data.day_activities ;//introduce day en evening + sumation


    result.dayDurableActivities = getDurationActivities(data.subjective_data.day_activities.filter(function(d){return d.end != "none"}));
    result.daySimpleActivities = getCountSimpleActivities(data.subjective_data.day_activities.filter(function(d){return d.end == "none"}));

    result.nightActivities = data.subjective_data.night_activities;


    result.nightDurableActivities = getDurationActivities(data.subjective_data.night_activities.filter(function(d){return d.end != "none"}));
    result.nightSimpleActivities = getCountSimpleActivities(data.subjective_data.night_activities.filter(function(d){return d.end == "none"}));;


    result.allActivities = ((result.dayActivities).concat(result.nightActivities)).concat();

    var timeInBedMetrics = calculateTimeInBedMetrics(data["subjective_data"]["bed_times_after_sleep"]);
    timeInBedMetrics =d3.entries(timeInBedMetrics);
    timeInBedMetrics = timeInBedMetrics.filter(function(d){return  categoriesInBedMetrics.indexOf(d.key) > -1;});
    result.nightBedTimes = timeInBedMetrics;

    result.allActivities = ((result.dayActivities).concat(result.nightActivities)).concat(result.nightBedTimes);

    result.flattened = {};

    d3.entries(result.dayDurableActivities).map(function(d){
        result.flattened[d.key] = d.value;
    });

    d3.entries(result.nightDurableActivities).map(function(d){
        result.flattened[d.key] = d.value;
    });

    d3.entries(result.daySimpleActivities).map(function(d){
        result.flattened[d.key] = d.value;
    });

    d3.entries(result.nightSimpleActivities).map(function(d){
        result.flattened[d.key] = d.value;
    });

   result.nightBedTimes.map(function(d){
        result.flattened[d.key] = d.value;
    });

    return result;

}

function getDurationActivities( data){

    var result = {};


    var type;
    var duration;


    for (var i = 0; i< data.length;i++){
        type = data[i].label;

        duration = getDuration(data[i]["end"],data[i]["start"]);



        if(type in result){
            result[type] = result[type] + duration
        }else{
            result[type] = duration;
        }
    }


    return result;
}

function getCountSimpleActivities(data){//eerder bollen dan bar chart --> tooltip per bol
    var result = {};

    var type;
    for (var i = 0; i< data.length;i++){
        type = data[i].label;
        if(type in result){
            result[type] = result[type] + 1;
        }else{
            result[type] = 1;
        }


    }


    return result;
}
