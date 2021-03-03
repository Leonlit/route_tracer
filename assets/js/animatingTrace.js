/* // lat, long
let map; // = L.map("map").setView([51.505, -0.09], 13);
// Creating a Layer object
const mapLayer = new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
// Adding layer to the map
map.addLayer(mapLayer); */
const colours = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',
    '#ffffff', '#000000'
];

let map;
let public_coords; // [coord, routeObj]

function generatingRoutesOnMap (data) {
    public_coords = []
    if (map != null) {
        map.off();
        map.remove();
    }
    document.getElementById("routeList").innerHTML = "";
    document.getElementById("routeEdges").innerHTML = "";
    const routes= data["routes"]
    const generatedColours = generateRandomColours(routes.length, colours);
    console.log(generatedColours);
	const mapLayer = new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {noWrap: true});
    
    const centroidPoint = calculateCentriodPoint(routes)
    const boundary = generatingBoundary(routes);
    
    map = L.map("map", {
        minZoom: 2,
    });
    map.on('drag', function() {
        map.panInsideBounds(boundary, { animate: false });
    });
    map.addLayer(mapLayer);
    map.setView(centroidPoint, 2)
    
    routes.forEach((route, index) => {
        const colour = generatedColours[index]
        appendingRouteToListing(route, colour)

        if (route["ipType"] == "private") {
            return;
        }

        const icon = generateIconsForMarker(public_coords.length + 1, colour);
        const coord = route["loc"]
        public_coords.push([coord, route])
        // generating the edges will also return the centroid for the edges so that we can use it 
        // in the list generated
        const centroid = generateEdges(coord, colour, route["ip"])
        appendEdgeToList(route, colour, centroid)

        const marker = L.marker(
            coord,
            {icon: icon}
            ).addTo(map);
        marker.bindPopup(`<b>${route["city"]} ,${route["country"]}</b> [${route["loc"].join(", ")}]`)     
    })
}

function generateEdges (coord, colour, toIP) {
    if (public_coords.length > 1) {
        const initiatedPoint = public_coords[public_coords.length-2]
        const initiatedPointCoord = initiatedPoint[0];

        const offsetX = initiatedPointCoord[1] - coord[1],
        offsetY = initiatedPointCoord[0] - coord[0];

        const latlngs = [];
        const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
        theta = Math.atan2(offsetY, offsetX);
        const thetaOffset = (3.14 / 10);
        
        const  r2 = (r / 2) / (Math.cos(thetaOffset)),
        theta2 = theta + thetaOffset;

        const midpointX = (r2 * Math.cos(theta2)) + coord[1],
        midpointY = (r2 * Math.sin(theta2)) + coord[0];

        const midpointLatLng = [midpointY, midpointX];

        const options = {
            color: colour,
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1,
        }

        options.animate = {
            duration: 3000,
            easing: 'ease-in-out',
        }

        latlngs.push(coord, midpointLatLng, initiatedPointCoord);

        const curvedLine = new L.curve(
            [
                'M', coord,
                'Q', midpointLatLng,
                initiatedPointCoord
            ], options
        );

        const position = public_coords.length-1;
        popUp = `<b>${initiatedPoint[1]["ip"]}</b>  to  <b>${toIP}</b>`;
        curvedLine.on("click", function (e){
            map.flyTo(curvedLine.getCenter(),3);
            openRouteList();
            window.location.href = `#edge_${position}`;
        });
        curvedLine.addTo(map);
        curvedLine.bindPopup(popUp);
        return midpointLatLng;
    }
}

function generateIconsForMarker(num, colour) {
    const markerHtmlStyles = `
        background-color: ${colour};
    `

    return L.divIcon({
        className: "markerIcon",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<a id="marker_${num}" class="customeMarker" style="${markerHtmlStyles}" href="#route_${num}" onclick="openRouteList()"><div class="markerNum">${num}</div></a>`
    })
}

function calculateCentriodPoint(routes){
    let centroid =[0, 0];
    for (route in routes) {
        if (point = route["loc"] == undefined) {
            continue;
        }
        const coord = point.split(",");
        centroid[0] += parseInt(coord[0]);
        centroid[1] += parseInt(coord[1]);
    }
    centroid[0] = centroid[0]/(routes.length/2);
    centroid[1] = centroid[1]/(routes.length/2);
    return centroid;
}

function generateRandomColours(len, arr) {
    const colour = []
    while (len--) {
        j = Math.floor(Math.random() * (len+1));
        colour.push(arr[j]);
        arr.splice(j,1);
    }
    return colour
}

function appendEdgeToList (to, colour, coord) {
    const container = document.getElementById("routeEdges")
    if (public_coords.length > 1) {
        const fromIndex = public_coords.length-2
        const from = public_coords[fromIndex][1];
        const elements = `
            <div class="edgesInfo" id="edge_${fromIndex + 1}">
                <div class="edgesHeader" onclick="focusToEdge(${coord})">${fromIndex + 1} <span style="color:${colour};">|------></span> ${fromIndex + 2}</div>
                <div class="edgesWrapper">
                    <span class="edgesFrom">
                        <span>From</span>
                        <span>${from["city"]}</span>
                        <span>${from["region"]}</span>
                        <span>${from["country"]}</span>
                        <span>${from["loc"].join(", ")}</span>
                        <span>${from["ip"]}</span>
                    </span>
                    <span class="edgesTo">
                        <span>To</span>
                        <span>${to["city"]}</span>
                        <span>${to["region"]}</span>
                        <span>${to["country"]}</span>
                        <span>${to["loc"].join(", ")}</span>
                        <span>${to["ip"]}</span>
                    </span>
                </div>
            </div>
        `;
        container.innerHTML += elements;
    }
}

function appendingRouteToListing(route, colour){
    const container = document.getElementById("routeList");
    const org = (route["hostname"] | "") + route["org"]
    if (route["ipType"] == "public") {
        const currIndex = public_coords.length + 1;
        item = `
            <fieldset id="route_${currIndex}" class="route map_container" style="border: 2px solid ${colour};" onclick="focusMarker(${currIndex})">
                <legend>${currIndex}</legend>
                <span>${route["ip"]}</span>
                <span>${route["ipType"]}</span>
                <span>${route["loc"].join(", ")}</span>
                <span>${route["city"]}, ${route["region"]}, ${route["postal"]}</span>
                <span>${route["country"]}</span>
                <span>${org}</span>
        `
        if (route["hostname"] != undefined) {
            item += `<span>${route["hostname"]}</span>`
        }
    }else {
        item = `
            <fieldset class="route map_container" style="border: 2px solid grey;">
                <span>${route["ip"]}</span>
                <span>${route["ipType"]}</span>
        `
    }
    container.innerHTML += item + "</fieldset>";
}

function focusMarker (markerNum) {
    const container = document.getElementById(`marker_${markerNum}`);
    const element = container.getElementsByTagName("div")[0];
    const coord = public_coords[markerNum - 1][0]
    map.flyTo(new L.LatLng(coord[0], coord[1]), 6);

    element.classList.add("markerBlinking");
    setTimeout(()=>{
        element.classList.remove("markerBlinking");
    }, 7500)
}

function generatingBoundary(routes) {
    let lats = []
    let longs = []
    
    routes.forEach(route=>{
        const init = route["loc"];
        if (init == undefined) {
            return;
        }
        lats.push(init[0])
        longs.push(init[1])
    }) 
    lats.sort()
    longs.sort()
    const lowerBounds = new L.LatLng(lats[0] - 20 , longs[0] - 20);
    const upperBounds = new L.LatLng(lats[lats.length-1] + 20, longs[longs.length - 1] + 20);

    return new L.LatLngBounds(lowerBounds, upperBounds);
}

function focusToEdge (x, y) {
    map.flyTo(new L.LatLng(x, y), 3);
}