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

function closeRouteList(){
    openCloseBar.style.position = "inherit"
    routeContainer.style.top = "97%";
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
    console.log("test");
    loadingShader.style.display = "none";
}

const historyContainer = document.getElementById("historyListContainer");
const historyShader = document.getElementById("historyShader");

function openHistory() {
    historyContainer.style.display = "block"
    historyShader.style.display = "block"
}

function closeHistory (){
    console.log("test");
    historyContainer.style.display = "none"
    historyShader.style.display = "none"
}