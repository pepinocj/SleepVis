/**
 * Created by Josi on 15/11/2015.
 */

var jsonMapper = {};
jsonMapper["sleep"] = "sleep";
jsonMapper["SOL"] = "wake_before_sleep";
jsonMapper["WASO"] = "wake_in_bed";
jsonMapper["EMA"] = "wake_after_sleep";

var translator = {};
translator["wake_before_sleep"] = "Sleep Onset Latency";
translator["wake_after_sleep"] = "Early morning awakening";
translator["wake_in_bed"] = "Wake after sleep onset";
translator["SOL"] = "Sleep Onset Latency";
translator["EMA"] = "Early morning awakening";
translator["WASO"] = "Wake after sleep onset";
translator["Sleep"] = "Sleep";
translator["sleep"] = "Sleep";
translator["TST"] = "Sleep";
translator["nightmare"] = "nightmare";
translator["toilet"] = "toilet";
translator["light_off"] = "light off";
translator["light_on"] = "light on";
translator["sport"] = "sport";
translator["M"] = "Medicin";
translator["A"] = "Alcohol";
translator["C"] = "Coffee";
translator["HEAVY_MEAL"] = "Heavy meal";
translator["tv"] = "tv";
translator["TELEVISION"] = "tv";
translator["TWT"] = "Total wake time";
translator["TST"] = "Sleep";
translator.SPORT = "Sport"
translator.LIGHT_ON = "light on";
translator.NIGHTMARE = "nightmare";
translator.TOILET = "toilet";
translator.SPORT = "sport";
translator.ALCOHOL = "alcohol";
translator.MEDICIN = "medicine";
translator.LIGHT_OFF = "light off";
translator.READING = "reading";
translator.WALKING = "walking";
translator.NAP = "nap";
translator.OTHER = "other";
translator.CIGARETTE = "cigarette";
translator.NIGHT_CALL = "night call";
translator.LAPTOP = "laptop/pc use";
translator.SMARTPHONE ="smartphone use";
translator.MEDICINE= "medicine";
translator.COFFEE= "Coffee";
translator.TBT = "Total bed time"



//function ganttWrapperFunction(nightActivities, timesInBed,container,minDate,maxDate,nrDay,width,height,left_margin   ){
function ganttWrapperFunction(activities, container, minDate, maxDate, nrDay, width, height, left_margin) {
    var taskNames = Object.keys(activities);

    var tasks = [
        //{"startDate":new Date("Sun Dec 09 01:36:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:45 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 04:56:32 EST 2012"),"endDate":new Date("Sun Dec 09 06:35:47 EST 2012"),"taskName":"Bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 06:29:53 EST 2012"),"endDate":new Date("Sun Dec 09 06:34:04 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:35:21 EST 2012"),"endDate":new Date("Sun Dec 09 06:21:22 EST 2012"),"taskName":"Outside bed","status":"RUNNING"},
        //{"startDate":new Date("Sun Dec 09 05:00:06 EST 2012"),"endDate":new Date("Sun Dec 09 05:05:07 EST 2012"),"taskName":"Bed","status":"Succeeded"},
        //{"startDate":new Date("Sun Dec 09 03:46:59 EST 2012"),"endDate":new Date("Sun Dec 09 04:54:19 EST 2012"),"taskName":"Outside bed","status":"RUNNING"}
    ];

    function convertToGanttTask(record, taskName, id) {
        var result = {};

        result["startDate"] = new Date(record["start"]);
        if (record["end"] == 'none') {
            result["endDate"] = result["startDate"];
        } else {
            result["endDate"] = new Date(record["end"]);
        }
        result["taskName"] = taskName;
        result["status"] = record["label"];
        result["ganttID"] = id;
        result.notes ="";
        if(record.notes != undefined){
            result.notes = record.notes;
        }

        return result;
    }

    //    taskNames.map(function(d){
    //        activities[d].map(function(e){
    //            tasks.push(convertToGanttTask(e,d));
    //        })
    //    });

    taskNames.map(function (d, i) {
        activities[d].map(function (e, j) {
            console.log(convertToGanttTask(e, d, "ganttID_" + i + "_" + j));
            tasks.push(convertToGanttTask(e, d, "ganttID_" + i + "_" + j));
        })
    });

    //for(var j =0;j<taskNames.length;j++){
    //    for(var i = 0 ; i< activities[taskNames[j]].length;i++){
    //        tasks.push(convertToGanttTask(nightActivities[i],"Activity"));
    //    }
    //}








    var taskStatus = {};
    taskStatus[jsonMapper["SOL"]] = "SOL";
    taskStatus[jsonMapper["WASO"]] = "WASO";
    taskStatus[jsonMapper["EMA"]] = "EMA";
    taskStatus[jsonMapper["sleep"]] = "TST";
    taskStatus["nightmare"] = "nightmare";
    taskStatus["toilet"] = "toilet";
    taskStatus["light_off"] = "light_off";
    taskStatus["light_on"] = "light_on";
    taskStatus["sport"] = "sport";
    taskStatus["M"] = "M";
    taskStatus["A"] = "A";
    taskStatus["C"] = "C";
    taskStatus["Fat_food"] = "Fat_food";
    taskStatus["tv"] = "tv";
    taskStatus.SPORT = "SPORT"
taskStatus.LIGHT_ON = "LIGHT_ON";
taskStatus.NIGHTMARE = "NIGHTMARE";
taskStatus.TOILET = "TOILET";
taskStatus.SPORT = "SPORT";
taskStatus.ALCOHOL = "ALCOHOL";
taskStatus.MEDICIN = "MEDICIN";
taskStatus.LIGHT_OFF = "LIGHT_OFF";
taskStatus.READING = "READING";
taskStatus.WALKING = "WALKING";
taskStatus.NAP = "NAP";
taskStatus.OTHER = "OTHER";
taskStatus.CIGARETTE = "CIGARETTE";
taskStatus.NIGHT_CALL = "NIGHT_CALL";
taskStatus.LAPTOP = "LAPTOP";
taskStatus.SMARTPHONE ="SMARTPHONE";
taskStatus.MEDICINE= "MEDICINE";
taskStatus.COFFEE= "COFFEE";
taskStatus.TELEVISION= "TELEVISION";


    tasks.sort(function (a, b) {
        return a.endDate - b.endDate;
    });
    //var maxDate = tasks[tasks.length - 1].endDate;
    tasks.sort(function (a, b) {
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
            top: 0,
            right: 40,
            bottom: 0,
            left: left_margin
        })
        .day(nrDay)
        .timeDomain([minDate, maxDate]);
    ganttInContainer(tasks, container);
    return ganttInContainer;

}

function generateSubjectiveOverview(container, listDays, feature) {

    listDays.map(function (d) {
        var nrDay = d.nrDay;
        var dayData = data["user1"]["smart_phone_data"][nrDay];
        var allActivities = dayData["subjective_data"]["bed_times_after_sleep"].concat(dayData["subjective_data"]["night_activities"]);
        var filteredAct = allActivities.filter(function (d) {
            return feature == d.label
        });
        ganttWrapperFunction({
            nrDay: filteredAct
        }, container, collection_day_data[nrDay].date, new Date(collection_day_data[nrDay].date.getTime() + 24 * 60 * 60 * 1000), nrDay, timeFeatures.brusher.width, 15, 0);

    });

}

           

function generateSubjectiveOverviewAllFeatures(container, listDays) {

    listDays.map(function (d) {
        var nrDay = d.nrDay;
        var dayData = collection_day_data[nrDay].smartPhoneData;
        console.log(dayData)
        var allActivities = {
            a: dayData["bed_times_after_sleep"]
        };
        // var filteredAct = allActivities.filter(function(d){return feature == d.label});

        var dayViz = container.append("div").attr("class", "subjMini dayLine dayLine" + nrDay)

        dayViz.on("mouseover", function () {

            
            //d3.selectAll(".bar").classed("subjectiveFeatureSelected",false);
            d3.select("#small_line_chart").selectAll(".bar.day" + nrDay).classed("subjectiveFeatureSelected", true);
//             location.href = "#";
//        location.href = '#dayViz'+nrDay;
            
         // $.scrollTo(document.getElementById('dayViz'+nrDay), 800);
//        $("#chart").scrollTo({top:'-=100px', left:'+=100'}, 800);
 
        d3.selectAll(".dayData").classed("hidden", true);
            d3.select("#dayData" + nrDay).classed("hidden", false);
             d3.select("#dayInspecting").text(dateFormat(new Date(dayData.shown_date), "ddd, d/m"));
            
            focusOnDay(nrDay);
            
        }).on("mouseout", function () {
            d3.select("#small_line_chart").selectAll(".bar.day" + nrDay).classed("subjectiveFeatureSelected", false);
        }).on("click",function(){
            $('#dayViz'+nrDay).scrollView();
        })

        var tempD =  new Date(collection_day_data[nrDay].smartPhoneData.date_begin_sleep);
            tempD.setHours(12);
            tempD.setMinutes(0);

        ganttWrapperFunction(allActivities, dayViz, tempD, new Date(tempD.getTime() + 24 * 60 * 60 * 1000), nrDay, timeFeatures.brusher.width, 8, 0);
        //container.append("input").attr("type","checkbox").attr("style","position:absolute;left:0");

    });

}
