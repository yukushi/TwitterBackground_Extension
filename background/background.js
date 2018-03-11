//確認用
// TwImg = localStorage.getItem('Twitter_Image_URL');
// TwRadio = localStorage.getItem('RadioButton_Check');
// TwCheck = localStorage.getItem('CheckBox_Checked');
// console.log("現在のURL = " + TwImg + "，背景設定 = " + TwRadio + "，シースルー=" + TwCheck); //現在localStorageに保存されているURL

//popupからのリクエスト応答
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.URL_res == undefined){ //URL入力時以外は何もしない
        console.log("No data / existed data");
    } else{
        //console.log(request.URL_res); //レスポンス内容確認用
        sendResponse({"msg":"[OK]"});
        console.log("URL = " + request.URL_res);
        localStorage.setItem('Twitter_Image_URL', request.URL_res);
        localStorage.setItem('RadioButton_Check', request.radio);
        localStorage.setItem('CheckBox_Checked', request.cbox);
    }
});

//リセット応答
chrome.extension.onMessage.addListener(function(resetReq, sender, resetSendResponse) {
    // console.log(resetReq);
    if(resetReq.AllReset == "allreset"){
        localStorage.removeItem('Twitter_Image_URL'); //ローカルストレージ削除
        chrome.storage.local.clear(function() {}); //ローカルファイル削除
        resetSendResponse({
            ResetReq:"resetOK",
        });
    }
});

//Twitterを開いた時の動作
chrome.extension.onMessage.addListener(function(TwReq, sender, sendResponse) {
    console.log(TwReq);
    if(TwReq.contents == "Open"){
        //毎回更新するためにもう一度記述
        TwImg = localStorage.getItem('Twitter_Image_URL');
        TwRadio = localStorage.getItem('RadioButton_Check');
        TwCheck = localStorage.getItem('CheckBox_Checked');
        console.log("Openレスポンスを受取");
        sendResponse({
            "BtoS_URL":TwImg,
            "BtoS_Radio":TwRadio,
            "BtoS_Check":TwCheck
        });
    }
});