/** This is a sample code for your bot**/
function MessageHandler(context, event) {
    var msg0 = event.message;
    msg0 = msg0.toString();
    msg0 = msg0.split(" ");
    
    query = msg0.slice(1,msg0.length);
    query = query.join(" ");
    
    switch(msg0[0]) {
        case "search":
            var query = encodeURIComponent(event.message);
            var mapurl = "https://maps.googleapis.com/maps/api/staticmap?markers=" + query + "&size=400x400&maptype=roadmap&zoom=17&key=insertkeyhere";
            context.console.log(mapurl);
            var message = [
                {"type":"image","originalUrl":mapurl,"previewUrl":mapurl},
                "View the full map here: https://www.google.com/maps/place/"+query+"/"
            ];
            context.sendResponse(JSON.stringify(message));
            break;
        case "directions":
            query = query.toString();
            query = query.split(",");
            var ori = query[0];
            var origin = encodeURIComponent(ori);
            var dest = query[1];
            var destination = encodeURIComponent(dest);
            var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&language=en&key=insertkeyhere";
            context.simplehttp.makeGet(url,null,polylineParser);
            break;
        default:
            var defmsg = [
                "To use this bot type 'search' then an address, GPS Co-ordinates or name",
                "or type 'directions' then 'address 1, address 2' to get a list of directions"
            ];
            context.sendResponse(defmsg);
            break;
    }
}

function polylineParser(context, event) {
    var polyline = JSON.parse(event.getresp);
    var routeline = polyline.routes[0].overview_polyline.points;

    var distance = polyline.routes[0].legs[0].distance.text;
    distance = distance.replace(/<\/?[^>]+>/gi, '');
    var duration = polyline.routes[0].legs[0].duration.text;
    duration = duration.replace(/<\/?[^>]+>/gi, '');
    
    var directions = polyline.routes[0].legs[0].steps[0].html_instructions;
    directions = directions.replace(/<\/?[^>]+>/gi, '');
    
    //var directions = []; // need a for loop here to find all instatnces of steps[x]
    //strip out the html then print it all out
    
    var mapurl = encodeURI("https://maps.googleapis.com/maps/api/staticmap?size=400x400&path=enc:" + routeline + "&key=insertkeyhere");
    
    var message = [
        {"type":"image","originalUrl":mapurl,"previewUrl":mapurl},
        "The distance is " + distance ,
        "The duration of travel is " + duration ,
        "Please head to Google Maps for full directions"
    ];

    context.sendResponse(JSON.stringify(message));
    
    return;
}

/** Functions declared below are required **/
function EventHandler(context, event) {
    if(! context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
    context.sendResponse("Thanks for adding me. You are:" + numinstances);
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    context.sendResponse(event.getresp);
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}


//###### 
//Auto generated code from devbox
//######
 
exports.onMessage = MessageHandler;
exports.onEvent = EventHandler;
exports.onHttpResponse = HttpResponseHandler;
exports.onDbGet = DbGetHandler;
exports.onDbPut = DbPutHandler;
if(typeof LocationHandler == 'function'){exports.onLocation = LocationHandler;}
if(typeof  HttpEndpointHandler == 'function'){exports.onHttpEndpoint = HttpEndpointHandler;}
