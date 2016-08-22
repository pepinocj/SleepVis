/**
 * Created by Josi on 15/11/2015.
 */

var jsonMapper={};
jsonMapper["sleep"] = "sleep";
jsonMapper["SOL"] = "wake_before_sleep";
jsonMapper["WASO"] = "wake_after_sleep";
jsonMapper["EMA"] = "wake_in_bed";

var translator = {};
translator   [ "wake_before_sleep"] = "SOL";
        translator [ "wake_after_sleep"] = "WASO";
        translator [ "wake_in_bed" ]="EMA";
        translator [  "sleep"] = "TST";
        translator ["nightmare"] = "nightmare";
        translator["toilet"] = "toilet";
        translator["light_off"] = "light off";
        translator ["light_on"] = "light on";
        translator["sport"] = "sport";
        translator["M"] = "Medicin";
        translator ["A"] = "Alcohol";
        translator ["C"] = "Coffee";
        translator["Fat_food"] = "Fat food";


//function ganttWrapperFunction(nightActivities, timesInBed,container,minDate,maxDate,nrDay,width,height,left_margin   ){
function ganttWrapperFunction(activities,container,minDate,maxDate,nrDay,width,height,left_margin   ){
    var taskNames = Object.keys(activities);

    var tasks = [
        //{"startDate":new Date("Sun Dec 09 01:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 04:56:32 EST 2012"),"endDate":new Date("Sun Dec 09 06:35:47 EST 2012"),"taskName":"Bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 06:29:53 EST 2012"),"endDate":new Date("Sun Dec 09 06:34:04 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:35:21 EST 2012"),"endDate":new Date("Sun Dec 09 06:21:22 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:00:06 EST 2012"),"endDate":new Date("Sun Dec 09 05:05:07 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 03:46:59 EST 2012"),"endDate":new Date("Sun Dec 09 04:54:19 EST 2012"),"taskName":"Outside bed","status":"RUNNING"}
    ];

    function convertToGanttTask(record,taskName){
        var result = {};

        result["startDate"] =  new Date(record["start"]);
        if(record["end"] == 'none'){
            result["endDate"] = result["startDate"];
        }else{
            result["endDate"] =new Date(record["end"]);
        }
        result["taskName"] = taskName;
        result["status"] = record["label"];


        return result;
    }

    taskNames.map(function(d){
        activities[d].map(function(e){
            tasks.push(convertToGanttTask(e,d));
        })
    });

    //for(var j =0;j<taskNames.length;j++){
    //    for(var i = 0 ; i< activities[taskNames[j]].length;i++){
    //        tasks.push(convertToGanttTask(nightActivities[i],"Activity"));
    //    }
    //}








    var taskStatus = {};
    taskStatus   [jsonMapper[ "SOL"]] = "SOL";
        taskStatus [ jsonMapper[ "WASO"]] = "WASO";
        taskStatus [ jsonMapper["EMA" ]]="EMA";
        taskStatus [  jsonMapper["sleep"]] = "TST";
        taskStatus ["nightmare"] = "nightmare";
        taskStatus["toilet"] = "toilet";
        taskStatus["light_off"] = "light_off";
        taskStatus ["light_on"] = "light_on";
        taskStatus["sport"] = "sport";
        taskStatus["M"] = "M";
        taskStatus ["A"] = "A";
        taskStatus ["C"] = "C";
        taskStatus["Fat_food"] = "Fat_food";




    tasks.sort(function(a, b) {
        return a.endDate - b.endDate;
    });
//var maxDate = tasks[tasks.length - 1].endDate;
    tasks.sort(function(a, b) {
        return a.startDate - b.startDate;
    });
//var minDate = tasks[0].startDate;


    var format = "%H:%M";

    var ganttInContainer = d3.gantt();
     ganttInContainer.timeDomainMode('fixed')
        .taskTypes(taskNames)
        .taskStatus(taskStatus)
        .tasks(tasks)
        .tickFormat(format)
        .width(width)
        .height(height)
         .margin({
             top : 0,
             right : 40,
             bottom : 0,
             left : left_margin
         })
         .day(nrDay)
        .timeDomain([minDate,maxDate]);
    ganttInContainer(tasks,container);
    return ganttInContainer;

}

function generateSubjectiveOverview(container,listDays,feature){

    listDays.map(function(nrDay){
        var dayData = data["user1"]["smart_phone_data"][nrDay];
        var allActivities = dayData["subjective_data"]["bed_times_after_sleep"].concat(dayData["subjective_data"]["night_activities"]);
        var filteredAct = allActivities.filter(function(d){return feature == d.label});
        ganttWrapperFunction({nrDay:filteredAct},container,collection_day_data[nrDay].date,new Date(collection_day_data[nrDay].date.getTime()+24*60*60*1000),nrDay,timeFeatures.brusher.width,15,0);

    });

}

function generateSubjectiveOverviewAllFeatures(container,listDays){

    listDays.map(function(nrDay){
        var dayData = data["user1"]["smart_phone_data"][nrDay];
        var allActivities = {a:dayData["subjective_data"]["bed_times_after_sleep"],b:dayData["subjective_data"]["night_activities"]};
       // var filteredAct = allActivities.filter(function(d){return feature == d.label});
        ganttWrapperFunction(allActivities,container,collection_day_data[nrDay].date,new Date(collection_day_data[nrDay].date.getTime()+24*60*60*1000),nrDay,timeFeatures.brusher.width,8,0);

    });

}


