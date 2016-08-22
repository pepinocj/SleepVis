var formatDate="DD-MM-YYYY hh:mm:ss";

function getDuration(dateMax,dateMin){
    //var a = moment(dateMax,formatDate);
    //var b = moment(dateMin,formatDate);
    //return a.diff(b,"seconds");
    if(dateMin == "none"){
        return 0;
    }
    return (new Date(dateMax)-new Date(dateMin))/(1000*60);
}

function label3DPosition(colorString){
    var color = colorString;

    var x = color.substring(1,3);
    var y = color.substring(3,5);
    var z = color.substring(5,7);

    x = parseInt(x,16)/256;
    y = parseInt(y,16)/256;
    z = parseInt(z,16)/256;

    var bounds = [0.25,0.75];
    function convert(arr){
console.log(arr);
        var result = [];
        arr.map(function(d){
            if(d<bounds[0]){
                result.push(0);
            }
            if(d>bounds[1]){
                result.push(1);
            }


        });

        if(result.length != arr.length){
            return -1;
        }

        if(result.indexOf(0)<0||result.indexOf(1)<0){
            return -1;
        }
            return result;



    }


    var temp = convert([x,y,z]);

    if(temp==-1){
        return "unknown position";
    }

    return posMapping["_"+temp[0]+""+temp[1]+""+temp[2]];





}

var posMapping = {_100:"LEFT",
    _011:"RIGHT",
    _110:"BELLY",
    _001:"BACK",
    _010:"UD",
    _101:"STANDING"

};

function getColorOfBin(bin){
    var r = parseInt(bin.charAt(1));
    var g = parseInt(bin.charAt(2));
    var b = parseInt(bin.charAt(3));

    function getHex(i){
        if (i==0){
            return "00";
        }
        else{
            return "ff"
        }
    }

    return "#"+getHex(r)+getHex(g)+getHex(b);
}

function getRedColor(nr){
    return "0x"+nr.toString(16)+"0000";
}

function generateStandingPeriods(datapoints){
    var results=[];

    var standing = false;
    datapoints.map(function(d){
        if(d.value<-0.55){
            if(standing){
                results[results.length-1].to = results[results.length-1].to + 1;
            }else{
                results.push({from: d.col,to: d.col+1});
                standing = true;
            }
        }else{
            standing = false;
        }
    });

    return results;
}

function generateLyingPeriods(datapoints){
    var results=[];

    var standing = false;
    datapoints.map(function(d){
        if(d.value>-0.45){
            if(standing){
                results[results.length-1].to = results[results.length-1].to + 1;
            }else{
                results.push({from: d.col,to: d.col+1});
                standing = true;
            }
        }else{
            standing = false;
        }
    });

    return results;
}

