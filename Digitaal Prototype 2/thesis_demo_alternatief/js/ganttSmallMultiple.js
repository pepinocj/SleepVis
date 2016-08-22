/**
 * Created by Josi on 15/11/2015.
 */

var jsonMapper={};
jsonMapper["sleep"] = "sleep";
jsonMapper["SOL"] = "wake_before_sleep";
jsonMapper["WASO"] = "wake_after_sleep";
jsonMapper["EMA"] = "wake_in_bed";


function ganttWrapperSmallMultipleFunction(width,activities,container,minDate,maxDate,days   ){


    var tasks = [
        //{"startDate":new Date("Sun Dec 09 01:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 04:56:32 EST 2012"),"endDate":new Date("Sun Dec 09 06:35:47 EST 2012"),"taskName":"Bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 06:29:53 EST 2012"),"endDate":new Date("Sun Dec 09 06:34:04 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:35:21 EST 2012"),"endDate":new Date("Sun Dec 09 06:21:22 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:00:06 EST 2012"),"endDate":new Date("Sun Dec 09 05:05:07 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 03:46:59 EST 2012"),"endDate":new Date("Sun Dec 09 04:54:19 EST 2012"),"taskName":"Outside bed","status":"RUNNING"}
    ];

    function convertToGanttTask(record){
        var result = {};

        result["startDate"] =  new Date(record["start"]);
        result["startDate"] =  new Date(result["startDate"].getTime() - record.day * 24 * 60 * 1000);
        if(record["end"] == 'none'){
            result["endDate"] = result["startDate"];
        }else{
            result["endDate"] =new Date(record["end"]);
            result["endDate"] =  new Date(result["endDate"].getTime() - record.day * 24 * 60 * 1000);
        }

        result["taskName"] = record.day;
        result["status"] = record.label;




        return result;
    }

    for(var i = 0 ; i< activities.length;i++){
        tasks.push(convertToGanttTask(activities[i]));
    }






    var taskStatus = {};
    taskStatus   [jsonMapper[ "SOL"]] = "SOL";
    taskStatus [ jsonMapper[ "WASO"]] = "WASO";
    taskStatus [ jsonMapper["EMA" ]]="EMA";
    taskStatus [  jsonMapper["sleep"]] = "TST";
    taskStatus ["nightmare"] = "nightmare";
    taskStatus["toilet"] = "toilet";
    taskStatus["light_off"] = "light_off";


    var taskNames = days;

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
        .height(50)
        .day(nrDay)
        .timeDomain([minDate,maxDate]);
    ganttInContainer(tasks,container);
    return ganttInContainer;

}

