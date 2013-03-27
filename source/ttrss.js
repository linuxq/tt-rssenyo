//**************** Login ********************
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
				//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
				successCallback(loginresult);
                    } else {
				loginresult.error = response.content.error;
				//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
				errorCallback(loginresult);
                    } ;  	
};


//**************** getCategories********************
function ttrssGetCategories(ttrssurl, successCallback, errorCallback) {
		//console.log("GET CATEGORIES");
		var data = {
		  op: "getCategories",
		  enable_nested: false
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data),
		});
		request.response(function(daten) {ttrssGetCategoriesResponse(daten, successCallback, errorCallback)});
		request.go(data);
                    
	return;
};

function ttrssGetCategoriesResponse(inEvent, successCallback, errorCallback) {
	//console.log (successCallback);
                    response = JSON.parse(inEvent.xhrResponse.body);
		    //console.log(response);
                    if (response.status == 0){

				successCallback(response.content);
                    } else {
				loginresult.error = response.content.error;
				//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
				errorCallback("Error");
                    } ;  	
};


//**************** getFeeds ********************
function ttrssGetFeeds(ttrssurl, catID, successCallback, errorCallback) {
		//console.log("GET CATEGORIES");
		var data = {
		  op: "getFeeds",
		  cat_id: catID,
		  enable_nested: true
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data),
		});
		request.response(function(daten) {ttrssGetFeedsResponse(daten, successCallback, errorCallback)});
		request.go(data);
                    
	return;
};

function ttrssGetFeedsResponse(inEvent, successCallback, errorCallback) {
	//console.log (successCallback);
                    response = JSON.parse(inEvent.xhrResponse.body);
		    //console.log(response);
                    if (response.status == 0){

				successCallback(response.content);
                    } else {
				loginresult.error = response.content.error;
				//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
				errorCallback("Error");
                    } ;  	
};


//**************** getHeadlines ********************
function ttrssGetHeadlines(ttrssurl, feedID, successCallback, errorCallback) {
		//console.log("GET CATEGORIES");
		var data = {
		  op: "getHeadlines",
		  feed_id: feedID,
		  view_mode: "unread",
		  show_excerpt: true,
		  show_content: true,
		  enable_nested: true
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data),
		});
		request.response(function(daten) {ttrssGetHeadlinesResponse(daten, successCallback, errorCallback)});
		request.go(data);
                    
	return;
};

function ttrssGetHeadlinesResponse(inEvent, successCallback, errorCallback) {
	//console.log (successCallback);
                    response = JSON.parse(inEvent.xhrResponse.body);
		    console.log(response);
                    if (response.status == 0){

				successCallback(response.content);
                    } else {
				loginresult.error = response.content.error;
				//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
				errorCallback("Error");
                    } ;  	
};

//**************** getArticle ********************
function ttrssGetArticle(ttrssurl, articleID, successCallback, errorCallback) {
		//console.log("GET CATEGORIES");
		var data = {
		  op: "getArticle",
		  article_id: articleID
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data),
		});
		request.response(function(daten) {ttrssGetHeadlinesResponse(daten, successCallback, errorCallback)});
		request.go(data);
                    
	return;
};

function ttrssGetArticleResponse(inEvent, successCallback, errorCallback) {
	//console.log (successCallback);
                    response = JSON.parse(inEvent.xhrResponse.body);
		    console.log(response);
                    if (response.status == 0){

				successCallback(response.content);
                    } else {
				loginresult.error = response.content.error;
				//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
				errorCallback("Error");
                    } ;  	
};

