'use strict'
let isRouteListOpen = false;

const routeContainer = document.getElementById("routeContainer");
const openCloseBar = document.getElementById("openCloseList");
function openCloseRouteList() {
    if (!isRouteListOpen) {
        openRouteList();
    }else {
        closRouteList();   
    }

}

function openRouteList () {
    routeContainer.style.top = "0";
    setTimeout(()=>{
        const routeWrapper = document.getElementById("routeWrapper");
        openCloseBar.style.position = "fixed"
        routeWrapper.style.marginTop = "3vh";
    }, 550)
    isRouteListOpen = true;
}

function closRouteList(){
    openCloseBar.style.position = "inherit"
    routeContainer.style.top = "97%";
    isRouteListOpen = false;
    setTimeout(()=>{
        routeWrapper.style.marginTop = "0";
    }, 550)
}