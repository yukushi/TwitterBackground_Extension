var scriptVal;
var scriptValRadio;
var scriptCheck;
var localImg64;

//ローカルストレージに保存された画像情報の呼び出し
chrome.storage.local.get({bg64: ''}, 
function(localItems) {
  localImg64 = localItems.bg64;
});

setTimeout(localImg64, 4000);

//画像の読み込み時間を考慮
var waitLoad = function(){
  //バックグラウンド通信
  chrome.runtime.sendMessage({
      contents: "Open"
    },
    function (response) {
      if (response) {
        console.log("レスポンスOK");

        scriptVal = response.BtoS_URL; //Localに保存されたURL
        scriptValRadio = response.BtoS_Radio;//Localに保存されたラジオボタン情報
        scriptCheck = response.BtoS_Check;//チェックボックス情報
            //ローカル画像がない場合にURLを展開
            if(localImg64 == undefined || localImg64 == ""){
                if(scriptVal != undefined){
                  $("body").css({
                  "background-image": `url(${scriptVal}:orig)`,
                  "background-attachment": "fixed",
                  });

                }else{
                  console.log("画像無し");
                }
            }else{
              console.log("ローカル画像利用");
              $("body").css({
                "background-image": `url(${localImg64})`,
                "background-attachment": "fixed",
                });
            }

            //背景オプション判定
            if(scriptValRadio == 1){
              $("body").css({"background-repeat": "no-repeat",});
            }else{
              $("body").css({"background-repeat": "repeat",});            
            }
            //シースルーチェック
            if(scriptCheck=="true"){
                  $('head').append(`<style>
                  .stream-item,
                  .DashboardProfileCard,
                  .Trends,
                  .flex-module
                  {
                      background:rgba(255,255,255,0.85) !important;
                  }
                  </style>
                  `);
            }
      }else{
          console.log("レスポンスなし");
      }
    }
  );
}

setTimeout(waitLoad, 1000);