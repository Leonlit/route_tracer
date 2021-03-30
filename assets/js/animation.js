'use strict'
let isRouteListOpen = false;

const routeContainer = document.getElementById("routeContainer");
const openCloseBar = document.getElementById("openCloseList");
const routeWrapper = document.getElementById("routeWrapper");
const footer = document.getElementsByTagName("footer")[0]

function openCloseRouteList() {
    if (!isRouteListOpen) {
        openRouteList();
    }else {
        closeRouteList();   
    }

}

function openRouteList () {
    let position = "0";
    if (isMobileScreen()) {
        position = "50%"
        footer.style.opacity = "0"
        setTimeout(() => {
            footer.style.display = "none"
        }, 310);
    }
    routeContainer.style.top = position;
    setTimeout(()=>{
        openCloseBar.style.position = "fixed"
    }, 550)
    isRouteListOpen = true;
}

const routeEdges = routeWrapper.getElementsByTagName("details")[1];
const routeConnections = routeWrapper.getElementsByTagName("details")[0];
function openRouteConnection () {
    openRouteList();
    routeEdges.open = false;
    routeConnections.open = true;
}

function openRouteEdges () {
    openRouteList();
    routeConnections.open = false;
    routeEdges.open = true;
}

function isMobileScreen () {
    return screen.width < 600;
}

function closeRouteList(){
    let position = "97%"
    if (isMobileScreen()) {
        footer.style.display = "inline"
        setTimeout(() => {
            footer.style.opacity = "1"
        }, 0);
    }
    openCloseBar.style.position = "inherit"
    routeContainer.style.top = position;
    isRouteListOpen = false;
    setTimeout(()=>{
        routeWrapper.style.marginTop = "3vh";
    }, 550)
}

const loadingShader = document.getElementById("loaderShader");
function showLoading(){
    loadingShader.style.display = "block";
}

function hideLoading() {
    loadingShader.style.display = "none";
}

const historyContainer = document.getElementById("historyListContainer");
const historyShader = document.getElementById("historyShader");

function openHistory() {
    historyContainer.style.display = "block"
    historyShader.style.display = "block"
}

function closeHistory (){
    historyContainer.style.display = "none"
    historyShader.style.display = "none"
}