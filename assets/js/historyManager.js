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
    let newList = [{
        name: domain,
        timestamp: timestamp
    }];
    if (historyList != undefined) {
        try {
            jsonData = JSON.parse(historyList);
            jsonData = removeDuplicateInList(jsonData ,domain);
            jsonData.unshift(newList);
            newList = jsonData;
        }catch (err) {
            //since it's local storage better check if user changed it manually
            //and accidently break
            console.log(err);
            localStorage.removeItem(listName);
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
    const dataInJson = localStorage.getItem(domain)
    if (dataInJson != undefined) {
        const currentTimestamp = Date.now();
        const isHistoryOld = isHistoryTooOld(dataInJson.timestamp, currentTimestamp);
        if (!isHistoryOld) {
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

function setupHistoryPage () {
    const itemList = localStorage.getItem("historyNameList");
    const jsonData = JSON.parse(itemList);
    jsonData.forEach(item => {
        addItemIntoHistoryPage(item.name, item.timestamp);
    });
}

const historyList = document.getElementById("historyList");
function addItemIntoHistoryPage (name, timestamp) {
    const dateTime = formatingTimestamp(timestamp)
    const element = `
        <div class="historyItem">
            <span class="historyName clickable" onclick="openFromHistory('${name}')">${name}</span>
            <span class="historyDate">${dateTime}</span>
        </div>
    `
    historyList.innerHTML += element ;
}

function openFromHistory (name) {
    const data = localStorage.getItem(name);
    const jsonData = JSON.parse(data)
    if (data != undefined) {
        showLoading();
        generatingRoutesOnMap(jsonData.data)
        hideLoading();
        closeHistory();
    }else {
        showErrorPopUp(3);
    }
}

function formatingTimestamp (time) {
    const date = new Date(time * 1000);
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