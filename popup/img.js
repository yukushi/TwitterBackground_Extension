//Global
var URL,result,mediaImg,reset,bgOption,op_check,throughCheck;

//各要素取得
function defs(){
	URL = document.getElementById("urlid").value;
	result = document.getElementsByClassName("msg");
	mediaImg = document.getElementById("mediaImg");
	reset = document.getElementById("update").value;
	//ラジオボタン
	bgOption = document.getElementsByName("op1");
	//シースルーチェック取得
	throughCheck = document.getElementById("through").checked;
	// 背景オプション（ラジオ）選択状態の値を取得
	for (op_check="", i=bgOption.length; i--;) {
		if ( bgOption[i].checked ) {
			op_check = bgOption[i].value ;
			break ;
		}
	}
}

//エスケープ
function escapeHTML(URL){
	if(URL.match(/"/) || 
	   URL.match(/</) ||
	   URL.match(/>/) ||
	   URL.match(/&/) ||
	   URL.match(/'/)   )
	{return 1;}
	else
	{return 0;}
}

//画像URLにおける処理
document.getElementById("update").onclick = function(){
	defs();
	//Twitterにアップロードされた画像のみを許可
	if(URL == ""){result[0].innerText = "URLが入力されていません";}
	else if(escapeHTML(URL)== 1){result[0].innerText = "エラー";}
	else{
		//メイン動作
		//入力された情報
		console.log(`URL = ${URL}，Radio = ${op_check}，CheckBox = ${throughCheck}`);
		//バックグラウンドとの通信
		chrome.runtime.sendMessage({
			URL_res: URL, //バックグラウンドに飛ばすレスポンス内容記載
			radio:op_check, //ラジオボタンチェックの値
			cbox:throughCheck//チェックボックスの値
			},
			function (response) {
				if (response) {
					if(URL != ""){
						document.getElementById("urlid").value = "";
					}
					console.log("BackGround -> popup.js");
					result[0].innerText = "[設定完了]Twitterを更新して下さい";
					document.getElementById("target").disabled = true;
					//画像表示
					mediaImg.src  = URL;
					//画像URLが利用されたらローカルは削除する
					chrome.storage.local.clear(function() {});
				}
			}
		);
	}
}

//ローカル画像実装
document.getElementById("target").addEventListener( "change", function() {
	defs();
	//ファイル取得
	var fileList = this.files[0];
	var reader  = new FileReader();

	reader.onload = function(){
		var localImg64 = reader.result;

		chrome.runtime.sendMessage({
			URL_res: URL,
			radio:op_check, //ラジオボタンチェックの値
			cbox:throughCheck//チェックボックスの値
			},
			function (response) {
				if (response) {
					console.log("ローカルに対するオプションOK");
				}
			}
		);

		chrome.storage.local.set({
			bg64: localImg64
		  }, function() {
			  mediaImg.src  = localImg64;
			  document.getElementById("urlid").disabled = true;
			  document.getElementById("update").disabled = true;
			  document.getElementsByClassName("msg")[0].innerText="[設定完了]Twitterを更新して下さい";

			}
		);
	}
	reader.readAsDataURL(fileList);
} ) ;

//リセット
document.getElementById("allreset").onclick = function(){
	//ファイル選択の初期化
	document.getElementById("target").remove();
	document.getElementById("update").remove();
	document.getElementById("urlid").remove();
	document.getElementById("resetMsg").innerText = "こちらをクリックして再読込して下さい";
	//バックグラウンド通信
	chrome.runtime.sendMessage({
		AllReset: "allreset"
	  },
	  function (response) {
		if (response) {
		  document.getElementsByClassName("msg")[0].innerText="リセットされました";
		  document.getElementById("mediaImg").src = "";
		}else{
			console.log("error")
		}
	  }
	);
}

document.getElementById("resetMsg").onclick = function(){
	location.reload();
}