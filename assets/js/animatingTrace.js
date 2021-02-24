/* // lat, long
let map; // = L.map("map").setView([51.505, -0.09], 13);
// Creating a Layer object
const mapLayer = new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
// Adding layer to the map
map.addLayer(mapLayer); */
const colours = [
    "#00ffff", "#f0ffff", "#f5f5dc", "#0000ff", "#a52a2a", "#00ffff", "#00008b", "#008b8b", "#a9a9a9",
    "#006400","#bdb76b","#8b008b","#556b2f","#ff8c00","#9932cc","#8b0000","#e9967a","#9400d3","#ff00ff","#ffd700",
    "#008000","#4b0082","#f0e68c","#add8e6","#e0ffff","#90ee90","#d3d3d3","#ffb6c1","#ffffe0","#00ff00","#ff00ff",
    "#800000","#000080","#808000","#ffa500","#ffc0cb","#800080","#800080","#ff0000","#c0c0c0","#ffff00"
];

function generatingRoutesOnMap (data) {  
    document.getElementById("routeList").innerHTML = "";
    const routes= data["routes"]
    const generatedColours = generateRandomColours(routes.length, colours);
    let map = L.map("map");
	const mapLayer = new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');

    map.addLayer(mapLayer);
    const centroidPoint = calculateCentriodPoint(routes)
    const public_coords = []
    console.log(centroidPoint);
    map.setView(centroidPoint, 2)
    routes.forEach((route, index) => {
        const colour = generatedColours[index]
        appendingRouteToListing(route, colour)
        if (route["ipType"] == "private") {
            return;
        }
        const icon = generateIconsForMarker(colour);
        const coord = route["loc"].split(",")
                    .map(num=>parseFloat(num));
        public_coords.push(coord)
        console.log(public_coords);
        const marker = L.marker(
            coord,
            {icon: icon}
            ).addTo(map);
        marker.bindPopup(`<b>${route["city"]} ,${route["country"]}</b> [${route["loc"]}]`)
        if (public_coords.length > 1) {
            const secondPoint = public_coords[public_coords.length-2]
            const a = new L.LatLng(coord[0], coord[1])
            const b = new L.LatLng(secondPoint[0], secondPoint[1])
            const pointList = [a, b];
            const line = new L.Polyline(pointList, {
                color: colour,
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
            line.addTo(map);
        }
        if (index == routes.length - 1 ) {
            const initialPoint = public_coords[0]
            const a = new L.LatLng(coord[0], coord[1])
            const b = new L.LatLng(initialPoint[0], initialPoint[1])
            const pointList = [a, b];
            const line = new L.Polyline(pointList, {
                color: colour,
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            });
            line.addTo(map);
        }
    })
}

function generateIconsForMarker(colour) {
    const markerHtmlStyles = `
        background-color: ${colour};
        width: 3rem;
        height: 3rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF
    `

    return L.divIcon({
        className: "markerIcon",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
    })
}

function calculateCentriodPoint(routes){
    console.log(routes);
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
    console.log(centroid);
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

function appendingRouteToListing(route, colour){
    const container = document.getElementById("routeList");
    const org = (route["hostname"] | "") + route["org"]
    if (route["ipType"] == "public") {
        item = `
            <div class="route map_container" style="border: 2px solid ${colour};">
                <span>${route["ip"]}</span>
                <span>${route["ipType"]}</span>
                <span>${route["loc"]}</span>
                <span>${route["city"]}, ${route["region"]}, ${route["postal"]}</span>
                <span>${route["country"]}</span>
                <span>${org}</span>
            </div>
        `
    }else {
        item = `
            <div class="route map_container" style="border: 2px solid grey;">
                <span>${route["ip"]}</span>
                <span>${route["ipType"]}</span>
            </div>
        `
    }
    container.innerHTML += item;
}