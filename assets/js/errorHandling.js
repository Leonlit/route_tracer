const ERROR_TYPE = {
    0 :{
        message: "Not a valid url"
    },
    1: {
        message: "Server not running/down at the moment"
    },
    2: {
        message: "API rate limit reached!"
    },
    3: {
        message: "Cannot load data from history, please try again."
    }
}

function showErrorPopUp(type) {
    //need an interface
    openError(ERROR_TYPE[type].message);
}

const errShader = document.getElementById("errorShader");
const errContent = document.getElementById("errorContainer");

function closeError(){
    errShader.style.display = "none";
    errContent.innerHTML = '';
}

function openError(msg){
    errShader.style.display = "block";
    errContent.innerHTML = msg;
}