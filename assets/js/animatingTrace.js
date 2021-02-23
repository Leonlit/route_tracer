const colors = [
    "#00ffff", "#f0ffff", "#f5f5dc", "#000000", "#0000ff", "#a52a2a", "#00ffff", "#00008b", "#008b8b", "#a9a9a9",
    "#006400","#bdb76b","#8b008b","#556b2f","#ff8c00","#9932cc","#8b0000","#e9967a","#9400d3","#ff00ff","#ffd700",
    "#008000","#4b0082","#f0e68c","#add8e6","#e0ffff","#90ee90","#d3d3d3","#ffb6c1","#ffffe0","#00ff00","#ff00ff",
    "#800000","#000080","#808000","#ffa500","#ffc0cb","#800080","#800080","#ff0000","#c0c0c0","#ffffff","#ffff00"
];

dummyData = {
    "domain": "google.com",
    "routes": [
        {
            "ip": "192.168.68.1",
            "info": {
                "ipType": "private"
            }
        },
        {
            "ip": "175.140.89.254",
            "info": {
                "ipType": "public",
                "ip": "175.140.89.254",
                "city": "Seremban",
                "region": "Negeri Sembilan",
                "country": "MY",
                "loc": "2.7297,101.9381",
                "org": "AS4788 TM Net, Internet Service Provider",
                "postal": "70600",
                "timezone": "Asia/Kuala_Lumpur"
            }
        },
        {
            "ip": "10.55.106.75",
            "info": {
                "ipType": "private"
            }
        },
        {
            "ip": "10.55.39.154",
            "info": {
                "ipType": "private"
            }
        },
        {
            "ip": "10.55.48.58",
            "info": {
                "ipType": "private"
            }
        },
        {
            "ip": "72.14.198.56",
            "info": {
                "ipType": "public",
                "ip": "72.14.198.56",
                "city": "Mountain View",
                "region": "California",
                "country": "US",
                "loc": "37.4056,-122.0775",
                "org": "AS15169 Google LLC",
                "postal": "94043",
                "timezone": "America/Los_Angeles"
            }
        },
        {
            "ip": "108.170.250.1",
            "info": {
                "ipType": "public",
                "ip": "108.170.250.1",
                "city": "Mountain View",
                "region": "California",
                "country": "US",
                "loc": "37.4056,-122.0775",
                "org": "AS15169 Google LLC",
                "postal": "94043",
                "timezone": "America/Los_Angeles"
            }
        },
        {
            "ip": "108.170.230.129",
            "info": {
                "ipType": "public",
                "ip": "108.170.230.129",
                "city": "Mountain View",
                "region": "California",
                "country": "US",
                "loc": "37.4056,-122.0775",
                "org": "AS15169 Google LLC",
                "postal": "94043",
                "timezone": "America/Los_Angeles"
            }
        },
        {
            "ip": "216.58.196.14",
            "info": {
                "ipType": "public",
                "ip": "216.58.196.14",
                "hostname": "kul08s09-in-f14.1e100.net",
                "city": "Bangkok",
                "region": "Bangkok",
                "country": "TH",
                "loc": "13.7540,100.5014",
                "org": "AS15169 Google LLC",
                "postal": "10100",
                "timezone": "Asia/Bangkok"
            }
        }
    ]
};

// lat, long
let map = L.map('mapid').setView([51.505, -0.09], 13);
// Creating a Layer object
const mapLayer = new L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');
// Adding layer to the map
map.addLayer(mapLayer);

function generatingRoutesOnMap (data) {
    tableContents = "";
    for (const route in data["routes"]) {
        const org = (route["hostname"] | "") + route["org"]
        elements = `
                <div class="route">
                    <div class="routeHeader">
                        <div><span class="lineColor" style="${Math.floor(Math.random() * colors)}"></span></div>
                        <div>${route["ip"]}</div>
                        <div>${route["ipType"]}</div>
                    </div>
                    <div class="routeBody">
                        <div>${route["city"]}, ${route["region"]}, ${route["postal"]}, ${route["country"]}</div>
                    </div>
                    <div class="routeFooter">
                        ${org}
                        <div>${route["loc"]}</div>
                    </div>
                </div>
                `
    }
}

let marker = L.marker([51.5, -0.09]).addTo(map);