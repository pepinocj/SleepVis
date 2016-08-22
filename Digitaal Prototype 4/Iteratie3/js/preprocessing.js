function getVisualDataForFeature(category, feature,bool_fft){
    var results = {};
    var data_objects = data['user1']['data_obj'];
    var nrRows = data_objects.length;
    var category = category;
    

    var rearrangedObjects = rearrangeData(1,data_objects,category,300);
    var days = rearrangedObjects.map(function(d){return d.dateJS;})
    var nrColumns =288;//rearrangedObjects[4][feature].length; //TODO: hacky, longest day
    for (var i = 0; i<rearrangedObjects.length; i++){
        var signal;
        
        signal = rearrangedObjects[i][feature];
        if(feature == "movement"){
            signal = rearrangedObjects[i]["movement_count_sum"]
    }


        //nrColumns = signal.length;

        for(var j=0; j<signal.length;j++){
            if(signal[j] !== null){
//                if(feature == "N"){
//                    signal[j] = Math.round(signal[j]/5);
//                }
                results[i+","+j]={value:signal[j],row:i,col:j,sortedColIndex:null,sortedRowIndex:null,feature:feature,numMapFeature: config_features[feature]['numMap'],valid:true};
            }
            else{
                results[i+","+j]={value:0,row:i,col:j,sortedColIndex:null,sortedRowIndex:null,feature:feature,numMapFeature: config_features[feature]['numMap'],valid:false};
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
    tempStartJS.setHours(12);
    var d = new Date()
    
    
    
    
    
    var tempEnd = Math.floor(tempStart) +1/2+ hours_interval;
    var tempEndJS = new Date((new Date(tempStartJS)).getTime() + 24*60*60*1000);
    var signals;
    var columns = 0;
    
    
    var startDateDO = data_objects[0]['date'];
    var endDateDO = Math.floor(data_objects[0]['date']) + 1/2;

    resultDataObjects.push({date:tempStart, dateJS:tempStartJS});

    for (var i = 0; i<data_objects.length; i++) {
        startDateDO = data_objects[i]['date'];
        //skip columns --> here
        var diff = startDateDO - endDateDO;
        var columnsToSkip = Math.floor(diff / (epoch / (24*3600.0)));

        if(columnsToSkip>0){
            columns = columns + columnsToSkip;
        }
     signals = data_objects[i].preprocessed[category];//HALP


        var keys = Object.keys(signals);
        var firstKey = keys[0];
        
        
        
        for (var j = 0; j < columnsToSkip; j++) {
            for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                
                    if(resultDataObjects[resultDataObjects.length - 1][key] === undefined){
                         resultDataObjects[resultDataObjects.length - 1][key] = [];
                    }
                   resultDataObjects[resultDataObjects.length - 1][key].push(null);
                }
            
            
             if (j * (epoch/(24*3600.0)) + endDateDO > tempEnd) {

                resultDataObjects.push({date: tempEnd,dateJS:tempEndJS});//binding?


                tempStart = tempEnd;
                tempStartJS = tempEndJS;
                tempEnd = tempStart + hours_interval;
               // console.log(tempStart,tempStartJS,tempEnd)
                tempEndJS = new Date((new Date(tempStartJS)).getTime() + 24*60*60*1000);
                columns = 0;

                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    resultDataObjects[resultDataObjects.length - 1][key] = [];
                }
            
        }
        }

        
        endDateDO = data_objects[i]['end_date'];
        
        
   
        
        
        if(signals[firstKey]==0 ){
           signals[firstKey]=[0];
        }
        
        var firstSignal = signals[firstKey].slice();
        for (var j = 0; j < firstSignal.length; j++) {

            if (j * (epoch/(24*3600.0)) + startDateDO > tempEnd) {

                resultDataObjects.push({date: tempEnd,dateJS:tempEndJS});//binding?


                tempStart = tempEnd;
                tempStartJS = tempEndJS;
                tempEnd = tempStart + hours_interval;
               // console.log(tempStart,tempStartJS,tempEnd)
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
    result.shown_date = data.date_begin_sleep;
    result.date_begin_sleep = data.date_begin_sleep;
    
    result.sleep_diary = data.subjective_data.sleep_diary;
    result.dayActivities = data.subjective_data.day_activities ;//introduce day en evening + sumation


    result.dayDurableActivities = getDurationActivities(data.subjective_data.day_activities.filter(function(d){return d.end != "none"}));
    result.daySimpleActivities = getCountSimpleActivities(data.subjective_data.day_activities.filter(function(d){return d.end == "none"}));

    result.nightActivities = data.subjective_data.night_activities;


    result.nightDurableActivities = getDurationActivities(data.subjective_data.night_activities.filter(function(d){return d.end != "none"}));
    result.nightSimpleActivities = getCountSimpleActivities(data.subjective_data.night_activities.filter(function(d){return d.end == "none"}));;


    result.allActivities = ((result.dayActivities).concat(result.nightActivities)).concat();
    result.bed_times_after_sleep = data["subjective_data"]["bed_times_after_sleep"]
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

function createTestData(){
//    var l = collection_day_data.length;
//    for(var i = 0; i<l*4;i++){
//        
//        var temp = jQuery.extend(true, {}, collection_day_data[i]);
//        temp.smartPhoneData.shown_date= ""+(l+i)+"-jul-2015";
//        collection_day_data.push(temp);
//    }
//    
//    
//    visualizedDays = [1,2,3,4,7,8,9,10,13,14,15];//[1,2,3,4,7,8,9,10,13,14,15,1,2,3,4,7,8,9,10,13,14,15,15,1,2,3,4,7,8,9,10,13,14,15]
//    visualizedDays = visualizedDays.map(function(d){
//        return {nrDay:d,focus:false};
//    })
    
    
    var l = collection_day_data.length;
    for(var i = 0; i<l*5;i++){
        var temp = jQuery.extend(true, {}, collection_day_data[i]);
      
        //temp.smartPhoneData.shown_date= ""+(i)+"-jul-2015";
        collection_day_data.push(temp);
    }
    visualizedDays = [0,1,2,3,4,5,6]
    visualizedDays = visualizedDays.map(function(d){
        return {nrDay:d,focus:false};
    })
    for(var i = 0; i < visualizedDays.length; i++){
        //collection_day_data[visualizedDays[i].nrDay].smartPhoneData.shown_date= ""+(i+1)+"-jul-2015";
    }
}
