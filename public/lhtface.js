var url = "ws://127.0.0.1:22226";
var websocket;
var connected = false;

function releaseSocketPro() {
    var data = JSON.stringify({ 'function': 'releaseSocketPro' });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

window.onbeforeunload = function () {

    CloseCamera();  //关闭摄像头
    console.log("onbeforeunload");
    releaseSocketPro();
    try
    {
        websocket.close();
        websocket = null;
    }
    catch (ex) {
    }
};


function GetDocument(id) {
    return document.getElementById(id);
}


function toSleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}


function addEvent(obj, xEvent, fn) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + xEvent, fn);
    } else {
        obj.addEventListener(xEvent, fn, false);
    }
}


function Connect_Server() {
    ConnectServer(sendMessage, ""); //连接服务器
}



/**
* 初始化webSocket连接
* @param callback
* @param value
* @constructor
*/
function ConnectServer(callback, value) {

    //建立连接
    websocket = new WebSocket(url);

    websocket.onopen = function (e) {
        connected = true;
        var Obj = JSON.stringify({ 'functionName': 'ConnectSuccess' });
        var jsonObj = JSON.parse(Obj.replace(/[\r\n]/g, ""));
        MessageProCallback(jsonObj);
        //console.log("onopen sucess"); 
    }
    websocket.onclose = function (e) {
        connected = false;
        //reconnect();
        var Obj = JSON.stringify({ 'functionName': 'ConnectClose' });
        var jsonObj = JSON.parse(Obj.replace(/[\r\n]/g, ""));
        MessageProCallback(jsonObj);
        console.log("onclose");
        try
        {
            websocket.close();
            websocket = null;
        }
        catch (ex) {
        }
    }
    websocket.onmessage = function (e) {
        onMessage(e);
    }
    websocket.onerror = function (e) {
        var Obj = JSON.stringify({ 'functionName': 'ConnectError' });
        var jsonObj = JSON.parse(Obj.replace(/[\r\n]/g, ""));
        MessageProCallback(jsonObj);
        try
        {
            websocket.close();
            websocket = null;
        }
        catch (ex) {
        }
        //console.log("未连接服务，请确保已运行服务端！!!!")
    };

}


/**
* 接收服务器消息
* @param e
*/
function onMessage(e) {
    var jsonObj = JSON.parse(e.data.replace(/[\r\n]/g, ""));
    MessageProCallback(jsonObj);
}


/**
* 向服务器发送信息的共享方法
* @param jsonStr
*/
function sendMessage(jsonStr) {
    connected ? websocket.send(jsonStr) : console.log("未连接websocket服务器，请确保已运行服务端！")
}



/*****************************************************************************************************************/

//*************打开摄像头***************
function OpenCamera() {
    var data = JSON.stringify({ 'function': 'OpenCamera'});
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

//*************关闭摄像头***************
function CloseCamera() {
    var data = JSON.stringify({ 'function': 'CloseCamera'});
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

//*************开始活检***************
function StartLiveDetect() {
    var data = JSON.stringify({ 'function': 'StartLiveDetect' });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

//*************取消活检***************
function StopLiveDetect() {
    var data = JSON.stringify({ 'function': 'StopLiveDetect' });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}


//*************拍人脸照***************
function TakeFacePhoto(filePath) {
    var data = JSON.stringify({ 'function': 'TakeFacePhoto', 'filePath': filePath });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}


//*************拍照***************
function TakePhoto(filePath) {   
    var data = JSON.stringify({ 'function': 'TakePhoto', 'filePath': filePath });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

//*************人脸比对***************
function FaceCompare(FaceBase64Str1, FaceBase64Str2) {
    var data = JSON.stringify({ 'function': 'FaceCompare', 'FaceBase64Str1': FaceBase64Str1, 'FaceBase64Str2': FaceBase64Str2 });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

function FaceCompareEx(filePath1, filePath2) {
    var data = JSON.stringify({ 'function': 'FaceCompareEx', 'filePath1': filePath1, 'filePath2': filePath2 });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

function Heartbeat() {
    var data = JSON.stringify({ 'function': 'Heartbeat' });
    connected ? sendMessage(data) : ConnectServer(sendMessage, data)
}

/************************************************************************************************************************************************/



