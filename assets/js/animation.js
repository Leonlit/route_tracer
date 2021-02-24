'use strict'
let isRouteListOpen = false;

function openCloseRouteList() {
    const routeContainer = document.getElementById("routeContainer");
    if (!isRouteListOpen) {
        routeContainer.style.top = "0"
        isRouteListOpen = true
    }else {
        routeContainer.style.top = "97%"
        isRouteListOpen = false;
    }

}