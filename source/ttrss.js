ttsessionID = "";
ttstattus = "";

function SuchenUndErsetzen(QuellText, SuchText, ErsatzText) { // Erstellt von Ralf Pfeifer
	// Fehlerpruefung
	if ((QuellText == null) || (SuchText == null)) {
		return null;
	}
	if ((QuellText.length == 0) || (SuchText.length == 0)) {
		return QuellText;
	}

	// Kein ErsatzText ?
	if ((ErsatzText == null) || (ErsatzText.length == 0)) {
		ErsatzText = "";
	}

	var LaengeSuchText = SuchText.length;
	var LaengeErsatzText = ErsatzText.length;
	var Pos = QuellText.indexOf(SuchText, 0);

	while (Pos >= 0) {
		QuellText = QuellText.substring(0, Pos) + ErsatzText
				+ QuellText.substring(Pos + LaengeSuchText);
		Pos = QuellText.indexOf(SuchText, Pos + LaengeErsatzText);
	}
	return QuellText;
};

function ttrssLogin(ttrssurl, ttrssuser, ttrsspassword, successCallback, errorCallback) {
		var data = {
		  op: "login",
		  user: ttrssuser,
		  password : ttrsspassword
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data),
		});
		request.response(function(daten) {ttrssLoginResponse(daten, successCallback, errorCallback)});
		request.go(data);
                    
	return;
};

function ttrssLoginResponse(inEvent, successCallback, errorCallback) {
	//console.log (successCallback);
	var loginresult = {
		status: "99",
		sessionid: "99",
		error: "99"
	};
                    response = JSON.parse(inEvent.xhrResponse.body);
                    loginresult.status = response.status;
                    if (loginresult.status == 0){
				loginresult.sessionid = response.content.session_id;
				ttsessionID = response.content.session_id;
				console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
                    } else {
				loginresult.error = response.content.error;
				console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
                    } ;  	
};