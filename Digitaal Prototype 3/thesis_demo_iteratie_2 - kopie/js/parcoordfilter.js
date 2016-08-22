/**
 * Created by Josi on 4/02/2016.
 */
var pc1;
function createParcoordfilter(allData){
    // linear color scale
    var blue_to_brown = d3.scale.linear()
        .domain([60, 100])
        .range(["steelblue", "brown"])
        .interpolate(d3.interpolateLab);

// interact with this variable from a javascript console
    console.log(allData);



        pc1 = d3.parcoords()("#parcoordsContainer")
            .data(allData)
            //.hideAxis(["name"])
            .composite("darker")
            .color(function(d) { return blue_to_brown(d['movement']); })  // quantitative color scale
            .alpha(0.35)
            .ticks(3).tickFormat(d3.format("s"))
            .render()
            .brushMode("1D-axes")  // enable brushing
            .interactive();  // command line mode

        pc1.on("brushend",function(){
            var emptyshit = this.brushed();
            d3.select("#chart").selectAll("rect.cell").attr("style",   "fill:white;opacity:1" );

            emptyshit.map(function(d){
                d3.select("#chart").selectAll("rect.cell.cc"+ d.epoch+".day"+ d.day).attr("style",function(d){
                    return "fill:blue;opacity:"+Math.max(0, (d.movement - config_features.movement.min)/(config_features.movement.max - config_features.movement.min)*0.5)
                })
            })
            //this.color(function(d) { return blue_to_brown(d['N']); })
            //this.render();





        });

        var explore_count = 0;
        var exploring = {};
        var explore_start = false;
        pc1.svg
            .selectAll(".dimension")
            .style("cursor", "pointer")
            .on("click", function(d) {
                exploring[d] = d in exploring ? false : true;
                event.preventDefault();
                if (exploring[d]) d3.timer(explore(d,explore_count));
            });

        function explore(dimension,count) {
            console.log(exploring);
            if (!explore_start) {
                explore_start = true;
                d3.timer(pc1.brush);
            }
            var speed = (Math.round(Math.random()) ? 1 : -1) * (Math.random()+0.5);
            return function(t) {
                if (!exploring[dimension]) return true;
                var domain = pc1.yscale[dimension].domain();
                var width = (domain[1] - domain[0])/4;

                var center = width*1.5*(1+Math.sin(speed*t/1200)) + domain[0];

                pc1.yscale[dimension].brush.extent([
                    d3.max([center-width*0.01, domain[0]-width/400]),
                    d3.min([center+width*1.01, domain[1]+width/100])
                ])(pc1.g()
                        .filter(function(d) {
                            return d == dimension;
                        })
                );
            };
        };


}