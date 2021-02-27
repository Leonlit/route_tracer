'use strict'
let isRouteListOpen = false;

const routeContainer = document.getElementById("routeContainer");
function openCloseRouteList() {
    if (!isRouteListOpen) {
        openRouteList();
    }else {
        closeOpenList();   
    }

}

function openRouteList () {
    routeContainer.style.top = "0";
    isRouteListOpen = true;
}

function closRouteList(){
    routeContainer.style.top = "97%";
    isRouteListOpen = false;
}