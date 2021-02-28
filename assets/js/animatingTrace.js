/* // lat, long
let map; // = L.map("map").setView([51.505, -0.09], 13);
// Creating a Layer object
const mapLayer = new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
// Adding layer to the map
map.addLayer(mapLayer); */
const colours = [
    "#00ffff", "#f0ffff", "#f5f5dc", "#0000ff", "#a52a2a", "#00ffff", "#00008b", "#008b8b", "#a9a9a9",
    "#006400","#bdb76b","#8b008b","#556b2f","#ff8c00","#9932cc","#8b0000","#e9967a","#9400d3","#ff00ff",
    "#008000","#4b0082","#f0e68c","#add8e6","#e0ffff","#90ee90","#d3d3d3","#ffb6c1","#00ff00","#ff00ff",
    "#800000","#000080","#808000","#ffa500","#ffc0cb","#800080","#800080","#ff0000","#c0c0c0"
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
    const routes= data["routes"]
    const generatedColours = generateRandomColours(routes.length, colours);
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
        const edgesCentroid = generateEdges(coord, colour, route["ip"])
        appendEdgeToList(route, colour, edgesCentroid)

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
        const a = new L.LatLng(coord[0], coord[1]);
        const b = new L.LatLng(initiatedPointCoord[0], initiatedPointCoord[1]);
        const pointList = [a, b];
        const line = new L.Polyline(pointList, {
            color: colour,
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });
        const position = public_coords.length-1;
        popUp = `<b>${initiatedPoint[1]["ip"]}</b>  to  <b>${toIP}</b>`;
        line.on("click", function (e){
            map.flyTo(line.getCenter());
            openRouteList();
            window.location.href = `#edge_${position}`;
        });
        line.addTo(map);
        line.bindPopup(popUp);
        return line.getCenter();
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
        console.log(point);
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

function appendEdgeToList (to, colour, flyTo) {
    const container = document.getElementById("routeEdges")
    if (public_coords.length > 1) {
        const fromIndex = public_coords.length-2
        const from = public_coords[fromIndex][1];
        const elements = `
            <div class="edgesInfo" id="edge_${fromIndex + 1}">
                <div class="edgesHeader">${fromIndex + 1} |------> ${fromIndex + 2}</div>
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
    map.flyTo(new L.LatLng(coord[0], coord[1]), 5);

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