/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

console.log("TODO: algemene  brush + voor elke shizzel zooming OF Y-Domain selector + Gaussiaanse mogelijkheid");

/*
 * Data processing
 *  
 * 
 */

var aggregate_max = 5;
var fetchedData = [];





/* AGGREGATE */
function aggregate(val, i) {
    aggregate_data(val, i);
    render();
}

/* AGGREGATE */
function aggregate_data(val, i) {
    var oldData = fetchedData[i].data;
    var newData = [];

    console.log(fetchedData[i].data);

    for (var j = 0; j < oldData.length; j++) {
        newData.push([]);
    }

    var newLength = Math.floor(oldData[0].length / val);
    for (var k = 0; k < oldData.length; k++) {
        for (var l = 0; l < newLength; l++) {
            newData[k].push(oldData[k][l * val]);
        }

    }
    console.log(fetchedData[i].data);

    allData[i].data = newData;
}




//************************************************************
// Variabelen geldend voor alle locatie gebaseerde charts
//************************************************************

var default_dom = {'min_x': 0, 'min_y': 0, 'max_x': 10, 'max_y': 10}; // Dynamisch maken
var allData;
var aggregate_ranges = [];
var colors = [
    'steelblue',
    'green',
    'red',
    'purple'
];

var allColors = [
    'steelblue',
    'green',
    'red',
    'purple',
    'yellow',
    'black',
    'green',
    'blue'
];

/* ZOOM FUNCTIONALITEIT MOMENTEEL NIET GEBRUIKT
 MAYBE BRUSHING?
 var zoom = d3.behavior.zoom()
 .x(x)
 .y(y)
 .scaleExtent([1, 10]) //min en max zoom
 .on("zoom", zoomed);  //$(edit_link).click(function(){ return changeViewMode(myvar); });	
 
 
 function gen_y(min,max){
 return d3.scale.linear()
 .domain([min, max])
 .range([height, 0]);
 }
 
 function gen_x(min,max){
 return d3.scale.linear()
 .domain([min, max])
 .range([0, width]);
 }
 //************************************************************
 // Zoom specific updates
 //************************************************************
 function zoomed() {
 svg.select(".x.axis").call(xAxis);
 svg.select(".y.axis").call(yAxis);   
 svg.selectAll('path.line').attr('d', line);  
 
 points.selectAll('circle').attr("transform", function(d) { 
 return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
 );  
 }
 
 */
//var margin = {top: 20, right: 30, bottom: 30, left: 50},
//width = 960 - margin.left - margin.right,
//        height = 500 - margin.top - margin.bottom;
//
//var margin2 = {top: 430, right: 10, bottom: 20, left: 40},
//height2 = 500 - margin2.top - margin2.bottom;

var margin = {top: 10, right: 100, bottom: 100, left: 40},
margin2 = {top: 430, right: 100, bottom: 20, left: 40},
width = document.documentElement.clientWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        height2 = 500 - margin2.top - margin2.bottom;

/*
 * Dimensions
 */
var downloadedData;



var all_x = [];
var all_y = [];
var all_x_slider = [];
var all_y_slider = [];
var all_xAxis = [];
var all_xAxis_slider = [];
var all_yAxis = [];
var all_lines = [];
var all_lines_slider = [];
var all_brushes = [];
var all_circle_groups = [];
var tip ;
var main_slider_xAxis;
var main_slider_brush;

//TODO: Generische wrapper maken indien mogelijk
function brush_wrap(a) {
    return d3.svg.brush()
            .x(all_x_slider[a])
            .on("brush", function () {
                all_x[a].domain(all_brushes[a].empty() ? all_x_slider[a].domain() : all_brushes[a].extent()); // ook in rendermethode doen :)
                var v_focus = d3.select("#loc_vis_svg" + a).selectAll(".transformation_chart");

                v_focus.selectAll(".line").attr("d", all_lines[a]);
                v_focus.select(".x.axis").call(all_xAxis[a]);
                all_circle_groups[a].attr("transform", function (d) {

                    return "translate(" + all_x[a](d.point.x) + "," + all_y[a](d.point.y) + ")";
                }
                );

            });
}

function tool_tip_wrap() {
    return d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])

            .html(function (d) {
                var unit = d.point.unit;
                if (unit.toLowerCase() == "none") {
                    unit = "";
                }

                var info = "";
                var ids = d.point.id;
                console.log(ids);
                console.log(d.point);
                for (var i = 0; i < ids.length; i++) {

                    info = info + " " + JSON.stringify(ids[i]) + "<br>";
                }
                
                
//                console.log("GO");
//                $(".datapoint_"+d.point.x).stop(true,true).trigger("mouseenter");
                  
//                $(".datapoint_"+d.point.x).on('mouseenter mouseleave', function(e) {
//    $(".datapoint_"+d.point.x).trigger(e.type);
////})
//$(window).load(function(){
//     $(".datapoint_"+d.point.x).trigger('mouseenter');
//});

//            $(".datapoint_"+d.point.x).mouseover(function () { //Dirty hier te plaatsen, andere kant ook performanter. Als hier, dan beter hide van tooltip laten callbacken naar een transparent van stroke (class verwijderen)
//                $(".datapoint_"+d.point.x).css({
//                    "stroke": "rgba(68, 127, 255, 0.3)"
//                })
//            });
//
//            $(".datapoint_"+d.point.x).mouseout(function () {
//                $(".datapoint_"+d.point.x).css({
//                    "stroke": "transparent"
//
//                })
//            });






            return " <span style='color:red'>" + d.point.y + unit + "</span>"
                        + "<br>"
                        + info; //Kleur van tooltip aanpakken met css file (subclassing etc)
            });

}


function line_wrap(a) {
    return d3.svg.line()
            .interpolate("linear")
            .defined(function (d) {
                return d.y != null;
            })
            .x(function (d) {
                return all_x[a](d.x);
            })
            .y(function (d) {
                return all_y[a](d.y);
            });

}

function line_slider_wrap(a) {
    return d3.svg.line()
            .interpolate("linear")
            .defined(function (d) {
                return d.y != null;
            })
            .x(function (d) {

                return all_x_slider[a](d.x);
            })
            .y(function (d) {
                return all_y_slider[a](d.y);
            });
}



function visibilityCheckboxChange(a, b) {
    if ($("#checkbox_" + a + "_" + b).is(":checked")) {
        $("#line_" + a + "_" + b).show();
        $("#lineSlider_" + a + "_" + b).show();
        $(".dotLine_" + a + "_" + b).show();
        //$(".dotLine_"+a+"_"+b).show();
    }

    else {
        $("#line_" + a + "_" + b).hide();
        $("#lineSlider_" + a + "_" + b).hide();
        $(".dotLine_" + a + "_" + b).hide();
        //$(".dotLine_"+a+"_"+b).hide();
    }
}

function render() { //render all




//************************************************************
// Create D3 line object and draw data on our SVG object
//************************************************************





    for (var i = 0; i < allData.length; i++) {






        var svg = d3.select('#loc_vis_svg' + i).select(".transformation_chart");

        svg.selectAll(".line").remove();
        svg.selectAll(".line")
                .data(allData[i].data)
                .enter()
                .append("path")
                .attr("class", function (d, j) {
                    return "line chart" + i + " drawn" + j
                })
                .attr("id", function (d, j) {
                    return "line_" + i + "_" + j;
                })

                //  .attr("clip-path", "url(#clip)")
                .attr('stroke', function (d, j) {
                    return colors[j % colors.length];
                })
                .attr("d", all_lines[i]);


        var v_context = d3.select("#loc_vis_svg" + i).selectAll(".context");


        v_context.selectAll(".line").remove();
        v_context.selectAll(".line")
                .data(allData[i].data)
                .enter()
                .append("path")
                .attr("id", function (d, j) {
                    return "lineSlider_" + i + "_" + j;
                })
                .attr("class", function (d, j) {
                    return "line chart" + i + " drawn" + j; //TODO NEW
                })
                //  .attr("clip-path", "url(#clip)")
                .attr('stroke', function (d, j) {
                    return colors[j % colors.length];
                })
                .attr("d", all_lines_slider[i]);






//************************************************************
// Draw points on SVG object based on the data given
//************************************************************
        svg.selectAll(".dots").remove();
        var points = svg.selectAll('.dots')
                .data(allData[i].data)
                .enter()
                .append("g")
                .attr("class", function (d, k) {

                    return "dots chart" + i + " drawn"+k;
                } );
        //    .attr("clip-path", "url(#clip)");


        var circle_group = points.selectAll('.dot')
                .data(function (d, index) {
                    var a = [];
                    d.forEach(function (point, i) {
                        if (point.y != null) {
                            a.push({'index': index, 'point': point});
                        }

                    });
                    return a;
                })
                .enter()
                .append('circle')

                .attr('class', function (d, k) {

                    return "dot datapoint_"+d.point.x+" dotLine_" + i + "_" + d.index;
                })
                .attr("r", 2.5)
                .attr('fill', function (d, i) {

                    return colors[d.index % colors.length];
                })

                .on('mouseover', function(d){tip.show(d);
                $(".datapoint_"+d.point.x).css({
                    "stroke": "rgba(68, 127, 255, 0.3)"
                });})
                .on('mouseout', function(d){tip.hide(d);
                $(".datapoint_"+d.point.x).css({
                    "stroke": ""
                });});
        


        all_circle_groups[i] = circle_group; //beetje dirty om hier te doen, beter met een arr van functies werken? [Dispatcher]

        circle_group.attr("transform", function (d) {

            return "translate(" + all_x[i](d.point.x) + "," + all_y[i](d.point.y) + ")";
        }
        );

        
    }



$(document).ready(function () {
            for (var j = 0; j < allColors.length; j++) {
                $(".line.drawn" + j).css("stroke", allColors[j]).css("color", allColors[j]);
                $(".line_identifier.drawn" + j).css("stroke", allColors[j]).css("color", allColors[j]);
                $(".dots.drawn" + j).css("fill", allColors[j]);

            }
    
//
//    for (var j = allData[0].min_x; j < allData[0].max_x; j++) {
//        $(".datapoint_" + j).mouseover(function () {
//            $(".datapoint_" + j).css({
//                "fill-opacity": 1,
//                "stroke": "#043e83",
//                "stroke-width": 2
//            })
//        });
//
//        $(".datapoint_" + j).mouseout(function () {
//            $(".datapoint_" + j).css({
//                "fill-opacity": 0.7,
//                "stroke-width": 0
//
//            })
//        });
//    }
            
            
        });



}


function setOnTop(i){
   var id=  $(".loc_vis_cont").eq(0).attr("id");
    console.log(i);
    console.log(id);
    $('#loc_vis_'+i).insertBefore( "#"+id);

}





function visualize(dataSet) {
    allData = dataSet;
    fetchedData = [];
    for (var i = 0; i < dataSet.length; i++) {
        fetchedData.push(jQuery.extend(true, {}, dataSet[i]));
    }

    var menu = d3.selectAll("#visualisations_menu").append("ul");
var charts = menu.selectAll(".has-sub") //TODO add view element and priority element http://stackoverflow.com/questions/220273/use-css-to-reorder-divs
        .data(allData)
        .enter()
        .append("li")
        .attr("class", function(d,i){return "has-sub chart_menu_"+ i;});

    charts.append("a").text(function(d){return d.name;});

// var priority_menu =   menu.append("li").attr("class", "has-sub priority_menu");
//        priority_menu.append("a").text("Priority");
//
//  var priority_list =   priority_menu.append("ul");
//    var  priority_list_item = priority_list.selectAll(".last")
//        .data(allData)
//        .enter()
//        .append("li")
//        .attr("class", function(d,i){return "last chart_submenu_"+i});

//    priority_list_item.append("a").text(function(d){return d.name;});
//    priority_list_item.append("input").attr("type","text");
//    priority_list.append("li").append("button").attr("type","button").text("Click me!");





    var submenu = charts.append("ul").selectAll(".has-sub")
        .data(function(d){return d.matchedColumns})
        .enter()
        .append("li")
        .attr("class", function(d,i){return "last chart_submenu_"+i});
    submenu.append("a").text(function(d){return d}).attr("class",function(d,i){return "cb_label line_identifier drawn"+i});




    d3.select("body").append("input")
        .attr("type", "range")
        .attr("id", "heightslider")
        //.attr("oninput", "aggregate(this.value," + i + ")")
        //.attr("onchange","foo()")
        .attr("min", "1")
        .attr("max", aggregate_max)
        .attr("value", "1");






    for (var i = 0; i < allData.length; i++) {


        all_x.push(d3.scale.linear()
                .domain([allData[i].min_x, allData[i].max_x])
                .range([0, width]));

        all_y.push(d3.scale.linear()
                .domain([allData[i].min_y, allData[i].max_y])
                .range([height, 0]));


        all_x_slider.push(d3.scale.linear()
                .domain([allData[i].min_x, allData[i].max_x])
                .range([0, width]));

        all_y_slider.push(d3.scale.linear()
                .domain([allData[i].min_y, allData[i].max_y])
                .range([height2, 0]));



        all_xAxis.push(d3.svg.axis()
                .scale(all_x[i])
                .tickSize(-height)
                .tickPadding(10)
                .tickSubdivide(true)
                .orient("bottom"));

        all_xAxis_slider.push(d3.svg.axis()
                .scale(all_x_slider[i])
                .tickSize(-height2)
                .tickPadding(10)
                .tickSubdivide(true)
                .orient("bottom"));

        all_yAxis.push(d3.svg.axis()
                .scale(all_y[i])
                .tickPadding(10)
                .tickSize(-width)
                .tickSubdivide(true)
                .orient("left"));

        all_brushes.push(brush_wrap(i));

        all_lines.push(line_wrap(i));

        all_lines_slider.push(line_slider_wrap(i));

        tip = tool_tip_wrap();

    }
//************************************************************
// Generate our SVG objects
//************************************************************

    var main_slider = d3.select("#vis_container")
            .append("div")
            .attr("id", "mainslider");

    var svg_cs = main_slider.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height2 + margin.top + margin.bottom);

    main_slider_brush = d3.svg.brush()//Maakt programma redelijk zwaar
            .x(all_x_slider[0])//equal
            .on("brush", function () {
                var extent_rect = d3.select("#mainslider").select(".extent");
                var x_val = extent_rect.attr("x");
                var width_val = extent_rect.attr("width");
                for (var a = 0; a < allData.length; a++) {
                    all_x[a].domain(main_slider_brush.empty() ? all_x_slider[a].domain() : main_slider_brush.extent()); // ook in rendermethode doen :)
                    var v_focus = d3.select("#loc_vis_svg" + a).selectAll(".transformation_chart");

                    v_focus.selectAll(".line").attr("d", all_lines[a]);
                    v_focus.select(".x.axis").call(all_xAxis[a]);
                    all_circle_groups[a].attr("transform", function (d) {

                        return "translate(" + all_x[a](d.point.x) + "," + all_y[a](d.point.y) + ")";
                    }
                    );
                    var v_context = d3.select("#loc_vis_svg" + a).selectAll(".context");
                    v_context.selectAll(".extent").attr("x", x_val).attr("width", width_val);

                }

            });

    main_slider_xAxis = all_xAxis_slider[0];

    svg_cs.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+margin.left+"," + height2 + ")")
            .call(main_slider_xAxis);

    svg_cs.append("g") //eerder zetten
            .attr("class", "x brush")
            .call(main_slider_brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);

    for (var i = 0; i < allData.length; i++) {
        aggregate_ranges.push(1);





        var container = d3.select("#vis_container")
                .append("div")
                .attr("class", "loc_vis_cont")
                .attr("id", "loc_vis_" + i);
        container.append("h2").text(allData[i].name);

        d3.select(".chart_menu_"+i).select("ul").append("li").attr("class","last").append("input")
                .attr("type", "range")
                .attr("id", "slider" + i)
                //.attr("oninput", "aggregate(this.value," + i + ")")
                .attr("onchange", "aggregate(this.value," + i + ")")
                .attr("min", "1")
                .attr("max", aggregate_max)
                .attr("value", "1");

       var priority =  d3.select(".chart_menu_"+i).select("ul").append("li").attr("class","last");
    priority.append("input")
            .attr("type", "text")
            .attr("id", "input_text_" + i)
            .attr("value", "Not used");


        priority.append("button")
            .attr("type", "button")
            .attr("id", "priority_button_" + i).text("click me!").attr("onclick","setOnTop("+i+")");


        var checkboxes = container.append("div")
                .attr("id", "#checkboxes" + i);

        for (var j = 0; j < allData[i].data.length; j++) {
           //checkboxes.append("div").attr("class", "line_identifier drawn" + j).text(allData[i].matchedColumns[j]);//Data obj aanpassen naar volle kolom namen

            d3.select(".chart_menu_"+i).select(".chart_submenu_"+j).append("input")
                    .attr("type", "checkbox")
                    .attr("id", "checkbox_" + i + "_" + j)
                    .attr("class", "cb checkbox_collection" + i)
                    .attr("checked", "true")
                .attr("float","right")
                    .attr("oninput", "visibilityCheckboxChange(" + i + "," + j + ")")
                    .attr("onchange", "visibilityCheckboxChange(" + i + "," + j + ")");



        }


        var svg = container.append("svg")
                //.call(zoom) //zoom voorlopig uitgeschakeld
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "loc_vis_svg")
                .attr("id", "loc_vis_svg" + i);






//The clipping path restricts the region to which paint can be applied.  
//http://tutorials.jenkov.com/svg/clip-path.html
        /*    svg.append("clipPath")
         .attr("id", "clip")
         .append("rect")
         .attr("width", width)
         .attr("height", height);
         */

// garbage: var svg2 = d3.select('#loc_vis_svg' + i).select(".transformation_chart");



        var focus = svg.append("g")
                .attr("class", "transformation_chart")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        focus.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(all_xAxis[i]);

        focus.append("g")
                .attr("class", "y axis")
                .call(all_yAxis[i]);


        focus.call(tip);

        var context = svg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + (margin2.top) + ")");


        context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height2 + ")")
                .call(all_xAxis_slider[i]);

        context.append("g") //eerder zetten
                .attr("class", "x brush")
                .call(all_brushes[i])
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", height2 + 7);

    }
    go();
    render();//TODO checkboxes en rendered data syncen
//    var newWindow = window.open('');
//    var newWindowRoot = d3.select(newWindow.document.body);
//    newWindowRoot.append("p").text("hello world!");

}