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
    map = L.map("map");
    document.getElementById("routeList").innerHTML = "";
    const routes= data["routes"]
    const generatedColours = generateRandomColours(routes.length, colours);
	const mapLayer = new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
    map.addLayer(mapLayer);

    const centroidPoint = calculateCentriodPoint(routes)
    map.setView(centroidPoint, 2)
    
    routes.forEach((route, index) => {
        const colour = generatedColours[index]
        appendingRouteToListing(route, colour)

        if (route["ipType"] == "private") {
            return;
        }

        const icon = generateIconsForMarker(public_coords.length + 1, colour);
        const coord = route["loc"].split(",")
                    .map(num=>parseFloat(num));
        public_coords.push([coord, route])
        appendEdgeToList(route, colour)
        generateEdges(coord, colour, route["ip"])

        const marker = L.marker(
            coord,
            {icon: icon}
            ).addTo(map);
        marker.bindPopup(`<b>${route["city"]} ,${route["country"]}</b> [${route["loc"]}]`)     
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
        popUp = `<b>${initiatedPoint[1]["ip"]}</b>  to  <b>${toIP}</b>`
        line.addTo(map);
        line.bindPopup(popUp)
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
        html: `<span class="customeMarker" style="${markerHtmlStyles}"><div class="markerNum">${num}</div></span>`
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

function appendEdgeToList (to) {
    const container = document.getElementById("routeEdges")
    if (public_coords.length > 1) {
        const fromIndex = public_coords.length-2
        const from = public_coords[fromIndex][1];
        const elements = `
            <div class="edgesInfo">
                <div class="edgesHeader">${fromIndex + 1} |------> ${fromIndex + 2}</div>
                <div class="edgesWrapper">
                    <span class="edgesFrom">
                        <span>From</span>
                        <span>${from["city"]}</span>
                        <span>${from["region"]}</span>
                        <span>${from["country"]}</span>
                        <span>${from["loc"]}</span>
                        <span>${from["ip"]}</span>
                    </span>
                    <span class="edgesTo">
                        <span>To</span>
                        <span>${to["city"]}</span>
                        <span>${to["region"]}</span>
                        <span>${to["country"]}</span>
                        <span>${to["loc"]}</span>
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
        item = `
            <fieldset class="route map_container" style="border: 2px solid ${colour};">
                <legend>${public_coords.length + 1}</legend>
                <span>${route["ip"]}</span>
                <span>${route["ipType"]}</span>
                <span>${route["loc"]}</span>
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