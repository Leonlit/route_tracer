'use strict'
let isRouteListOpen = false;

const routeContainer = document.getElementById("routeContainer");
const openCloseBar = document.getElementById("openCloseList");
const routeWrapper = document.getElementById("routeWrapper");
function openCloseRouteList() {
    if (!isRouteListOpen) {
        openRouteList();
    }else {
        closeRouteList();   
    }

}

function openRouteList () {
    routeContainer.style.top = "0";
    setTimeout(()=>{
        openCloseBar.style.position = "fixed"
    }, 550)
    isRouteListOpen = true;
}

function closeRouteList(){
    openCloseBar.style.position = "inherit"
    routeContainer.style.top = "97%";
    isRouteListOpen = false;
    setTimeout(()=>{
        routeWrapper.style.marginTop = "3vh";
    }, 550)
}