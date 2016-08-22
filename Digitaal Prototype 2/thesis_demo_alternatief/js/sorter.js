function horSortAll(){
    for (var key in collection_metrics){
        var svg = collection_metrics[key]['svg'];
        horSortSVG(d3.select("#featViz_" + key));

    }
}

function verSortAll(){

    for (var key in collection_metrics){
        var svg = collection_metrics[key]['svg'];
        verSortSVG(d3.select("#featViz_" + key));
    }
}

function defaultSettingAll(){
    for (var key in collection_metrics){
        var svg = collection_metrics[key]['svg'];
        defaultSettingSVG(d3.select("#featViz_" + key));
    }
}

function horSortSVG(svg){
    var t = svg.transition().duration(3000);

    t.selectAll(".cell")
        .attr("x", function(d) { return xScale(d.sortedColIndex) * cellSize/2; })
    ;
    t.selectAll(".cell")
        .attr("y", function (d) { return (d.row+1) * cellSize/2; })
    ;

}

function verSortSVG(svg){
    var t = svg.transition().duration(3000);

    t.selectAll(".cell")
        .attr("y", function(d) { return (d.sortedRowIndex+1) * cellSize/2; })
    ;
    t.selectAll(".cell")
        .attr("x", function (d) { return xScale(d.col) * cellSize/2; })
    ;

}

function defaultSettingSVG(svg){
    var t = svg.transition().duration(3000);

    t.selectAll(".cell")
        .attr("y", function (d) { return (d.row+1) * cellSize/2; })
    ;
    t.selectAll(".cell")
        .attr("x", function (d) { return xScale(d.col) * cellSize/2; })
    ;

}

function order(value) {


    if (value == "horsort") {
        //horSortAll();
        settingSorting = "horSort";

    }
    else if (value == "versort") {

        //verSortAll();
        settingSorting = "verSort";

    }
    else if (value == "defaultSetting") {
        settingSorting = "default";
        //defaultSettingAll();

    }
    brushed();
}