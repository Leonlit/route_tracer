'use strict'

//saving history into the localhost for later use and for viewing back those
//data
function saveDataIntoHistory (domain, data, timestamp) {
    const listName = "historyNameList"
    let jsonData = {
        timestamp: timestamp,
        data: data
    }

    localStorage.setItem(domain, JSON.stringify(jsonData))
    const historyList = localStorage.getItem(listName);
    let newList = {
        name: domain,
        timestamp: timestamp
    };
    if (historyList == null || historyList == "") {
        newList = [newList];
    }else {
        try {
            jsonData = JSON.parse(historyList);
            jsonData = removeDuplicateInList(jsonData ,domain);
            jsonData.unshift(newList);
            newList = jsonData;
        }catch (err) {
            //since it's local storage better check if user changed it manually
            //and accidently break
            console.log(err);
            deleteHistory(listName);
        }
    }
    localStorage.setItem(listName, JSON.stringify(newList));
    addItemIntoHistoryPage(domain, timestamp);
}

//the list will be in JSON form
//removing all duplicates (chances that user added manually into localstorage)
function removeDuplicateInList(list, name) {
    for (let index = 0; index< list.length; index++) {
        if (list[index].name == name) {
            list.splice(index, 1);
        }
    }
    return list;
}

//finding the Json data from local storage, if the timestamp
//is less than 10 minute, we can use back the data
function searchDataInHistory (domain) {
    let dataInJson = localStorage.getItem(domain)
    if (dataInJson != undefined) {
        const currentTimestamp = Date.now();
        const isHistoryOld = isHistoryTooOld(dataInJson.timestamp, currentTimestamp);
        dataInJson = JSON.parse(dataInJson);
        if (!isHistoryOld) {
            console.log(dataInJson);
            return dataInJson.data;
        }
    }
    return false
}

//checking if the time is over 10 minutes
function isHistoryTooOld (currTime, prevTime) {
    const timeout = 600000;
    if (currTime - prevTime >= timeout) {
        return true;
    }
    return false;
}

const historyList = document.getElementById("historyList");
function setupHistoryPage () {
    const itemList = localStorage.getItem("historyNameList");
    console.log(itemList);
    historyList.innerHTML = "";
    if (itemList == null || itemList == "[]") {
        return
    }
    historyList.innerHTML = "";
    const jsonData = JSON.parse(itemList);
    const cleanedData = removeOldData(jsonData.slice());
    cleanedData.forEach(item => {
        try {
            addItemIntoHistoryPage(item.name, item.timestamp);
        }catch (err){
            console.log("An error occured when setting up history list.");
        }
    });
}

function removeOldData (jsonData) {
    const currTimestamp = Date.now();
    for (let index = 0; index < jsonData.length; index++) {
        const currItem = jsonData[index];
        if (isHistoryTooOld(currTimestamp, currItem.timestamp)) {
            jsonData.splice(index, 1);
            deleteHistory(currItem.name)
        }
    }
    localStorage.setItem("historyNameList", JSON.stringify(jsonData));
    return jsonData;
}

function addItemIntoHistoryPage (name, timestamp) {
    const dateTime = formatingTimestamp(timestamp);
    const index = document.getElementById("historyList").children.length;
    const element = `
        <div class="historyItem map_container">
            <span class="historyName clickable" onclick="openFromHistory('${name}')">${name}</span>
            <span class="historyDate">${dateTime}</span>
            <span class="deleteHistoryBtn clickable" onclick="removeItemFromHistoryPage('${name}', ${index})">X</span>
        </div>
    `
    historyList.innerHTML += element ;
}

function removeItemFromHistoryPage (name, index) {
    const child = document.getElementsByClassName("historyItem")[index];
    historyList.removeChild(child)
    deleteHistory(name);
}

function deleteHistory (name) {
    try {
        if (name != "historyNameList") {
            const data = localStorage.getItem("historyNameList");
            const jsonData = JSON.parse(data);
            for (let index=0;index < jsonData.length;index++) {
                if (jsonData[index].name == name) {
                    jsonData.splice(index, 1);
                    break;
                }
            }
            localStorage.setItem("historyNameList", JSON.stringify(jsonData))
        }
        localStorage.removeItem(name);
    }catch (err) {
        console.log(err);
    }
}

function openFromHistory (name) {
    const data = localStorage.getItem(name);
    const jsonData = JSON.parse(data)
    if (data != undefined) {
        showLoading();
        generatingRoutesOnMap(jsonData.data);
        changeShowingNameText(name);
        hideLoading();
        closeHistory();
    }else {
        showErrorPopUp(3);
    }
}

function formatingTimestamp (time) {
    const date = new Date(time);
    const timeArr = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];
    const dateArr = [
        date.getFullYear(),
        date.getMonth()+1,
        date.getDate()
    ]
    return timeArr.join(":") + " " + dateArr.join("/")
}