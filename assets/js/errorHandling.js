const ERROR_TYPE = {
    0 :{
        message: "Not a valid url"
    },
    1: {
        message: "Server not running/down at the moment"
    }
}

function showErrorPopUp(type) {
    console.log(ERROR_TYPE[type].message);
}