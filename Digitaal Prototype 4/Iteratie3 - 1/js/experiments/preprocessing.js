function format(raw_data) {
    console.log(raw_data);
    var newDataCollection = [];
    var keys = Object.keys(raw_data[0]);
    
    var ID_keys=getIDKeys(keys);
    
    //console.log(keys);
    //init structure
    for (var i = 0; i < config.length; i++) {
        //Get amount of corresponding columns
        var columnName = config[i].columnName.toLowerCase();
        var dataSet = [];
        var matchedColumns = [];
        for (var j = 0; j < keys.length; j++) {
//            console.log(dataSet);

            if (keys[j].toLowerCase().indexOf(columnName) > -1) {
                dataSet.push([]);
                matchedColumns.push(keys[j]);
            }
        }

        newDataCollection.push({'columnRegex': config[i].columnName, 'name': config[i].name, 'data': dataSet, 'unit':config[i].unit, 'matchedColumns': matchedColumns}); //TODO elke array in dataSet eigenlijk object maken met specifieke naam erbij
    }

    

    //Fill structure
    for (var j = 0; j < 10; j++) {//raw_data.length
        var raw_data_object = raw_data[j]; //veronderstelling dat keys van alle objecten gelijk zijn

        for (var i = 0; i < newDataCollection.length; i++) {

            
             for (var k = 0; k < newDataCollection[i].matchedColumns.length; k++){ //
                
                //newDataCollection[i].data[k].push(createDataPointObject(raw_data_object,newDataCollection[i].matchedColumns[k],ID_keys,newDataCollection[i].unit));
                
                addDataPointObjects(newDataCollection[i].data[k],raw_data_object,newDataCollection[i].matchedColumns[k],ID_keys,newDataCollection[i].unit)
               
            }


        }

    }
    
    
    
        for (var i = 0; i < newDataCollection.length; i++) {
        
        newDataCollection[i]["min_x"]=  minimum_value("x",newDataCollection[i].data);
        newDataCollection[i]["max_x"]=  maximum_value("x",newDataCollection[i].data);
        newDataCollection[i]["min_y"]=  minimum_value("y",newDataCollection[i].data);
        newDataCollection[i]["max_y"]=  maximum_value("y",newDataCollection[i].data);
        
        }
    

   console.log(newDataCollection);
    return newDataCollection;



}

//onderscheid meervoudige data
function addDataPointObjects(array,raw_data_object,key,ID_keys,unit){
    console.log(key);
    console.log(raw_data_object[key]);
    if(raw_data_object[key] != null &&raw_data_object[key].indexOf(";") > -1){//aggr, semi hardcoded
        var arrayDataPointObjects = convertAggregateToArrayDataPoints(raw_data_object,key,ID_keys,unit,";");
        for(var k = 0; k< arrayDataPointObjects.length;k++){
            array.push(arrayDataPointObjects[k]);
        }
        
    }else{
        array.push(createDataPointObject(raw_data_object,key,ID_keys,unit));
    }
}
//BETER A EN B IPV FROM TO, OOK IN VIEW!!!
function convertAggregateToArrayDataPoints(raw_data_object,key,ID_keys,unit,seperator){//FROM TO BEPALEN, NU DEFAULT
    var dpObjects = [];
    var a=Number(raw_data_object[x_dimension.kp_name])*1000 + Number(raw_data_object[x_dimension.kp_m]);
    var b=Number(raw_data_object[x_dimension.kp_name_to])*1000 + Number(raw_data_object[x_dimension.kp_m_to]);
    var from;
    var to;
    if(a<b){
        from = a;
        to = b;
    }else{
        to = a;
        from = b;
    }
    
    var dataString = raw_data_object[key];
    var dataArray = dataString.split(seperator);
    var step = (to-from)/(dataArray.length);
    var id = createID_object(raw_data_object,ID_keys);
    id.push({'from':from, 'to':to});
    
    var debug = false;
    if(debug){
        var y = null;
        
        if(dataArray[0]!=""){
            y = Number(dataArray[0]);     
            
        }
        var x = to + 0*step;
        
        
        
        dpObjects.push({'x':x,'y':y,'id':id,'unit':unit});

        
    }else{
        for(var k=0;k<dataArray.length;k++){
        var y = null;
        
        if(dataArray[k]!=""){
            y = Number(dataArray[k]);     
            
        }
        var x = to + k*step;
        dpObjects.push({'x':x,'y':y,'id':id,'unit':unit});
    }
    }
    
    
    
    
    
    
    
    
    
    
    
    
   
    return dpObjects;
    
}

//TODO: Elke datapoint array deel laten uitmaken van een object met hoofdnaam, <min,max,mean>, functie

function getIDKeys(keys){
    var cand = ID_Regex.toLowerCase();
    var ID_keys=[];
        for (var j = 0; j < keys.length; j++) {
//            console.log(dataSet);

            if (keys[j].toLowerCase().indexOf(cand) > -1) {
                
                ID_keys.push(keys[j]);
            }
        }
        
   return ID_keys;
}

function createDataPointObject(raw_data_object,key,ID_keys,unit){ //extra info omzetten van array naar string
    var x = Number(raw_data_object[x_dimension.kp_name])*1000 + Number(raw_data_object[x_dimension.kp_m]);
    
    var y = Number(raw_data_object[key]);//TODO
    
    if(raw_data_object[key]==null){
        y=null;
    }
   
    var id = createID_object(raw_data_object,ID_keys);
     
    return {'x':x,'y':y,'id':id,'unit':unit};
}

function createID_object(object,ID_keys){
    var id_obj = [];
    
    for(var d=0;d<ID_keys.length;d++){
        var obj = {};
        obj[ID_keys[d]]=object[ID_keys[d]];
        id_obj.push( obj);
    }
   
    return id_obj;
    
}

function loadDATA(file) {
//    d3.json("data/" + file + ".json", function (err, data) {
//       
//        visualize( format(data));
//    });
    
    
    console.log(myServerData);
    
       
        visualize( format(myServerData));
    


}

function minimum_value(key,dataSet){
    
    var array = flatten(dataSet);
    return d3.min(array, function(d) { return d[key]; });
    
    
}

function maximum_value(key,dataSet){
    var array = flatten(dataSet);
    return d3.max(array, function(d) { return d[key]; });
    
}

function flatten(dataSet){
    var merged = [];
    merged = merged.concat.apply(merged, dataSet);
    
    return merged;
}