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
		postBody: JSON.stringify(data)
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
	}
};


//**************** getCategories********************
function ttrssGetCategories(ttrssurl, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "getCategories",
		unread_only: true,
		enable_nested: false
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssGetCategoriesResponse(daten, successCallback, errorCallback)});
	request.go(data);

	return;
};

function ttrssGetCategoriesResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	};
};


//**************** getFeeds ********************
function ttrssGetFeeds(ttrssurl, catID, successCallback, errorCallback) {
	var data = {
		op: "getFeeds",
		cat_id: catID,
		unread_only: true,
		enable_nested: true
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssGetFeedsResponse(daten, successCallback, errorCallback)});
	request.go(data);

	return;
};

function ttrssGetFeedsResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	};
};


//**************** getHeadlines ********************
function ttrssGetHeadlines(ttrssurl, feedID, successCallback, errorCallback) {
	var data = {
		op: "getHeadlines",
		feed_id: feedID,
		view_mode: "unread",
		limit: 100,
		show_excerpt: true,
		show_content: true,
		enable_nested: true
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssGetHeadlinesResponse(daten, successCallback, errorCallback)});
	request.go(data);

	return;
};

function ttrssGetHeadlinesResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
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
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};

//**************** MarkArticleRead ********************
function ttrssMarkArticleRead(ttrssurl, articleID, unread, successCallback, errorCallback) {
		//console.log("GET CATEGORIES");
		var unreadhelper = 1;
		if (unread) {
			unreadhelper = 1;
		} else
		{
			unreadhelper = 0;
		};
		var data = {
		  op: "updateArticle",
		  article_ids: articleID,
		  mode: unreadhelper,
		  field: 2 //unread-Status
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssMarkArticleReadResponse(daten, successCallback, errorCallback)});
		request.go(data);

	return;
};

function ttrssMarkArticleReadResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};

//**************** SubscribeToFeed ********************
function ttrssSubscribeToFeed(ttrssurl, url, categoryID, successCallback, errorCallback) {
		var data = {
		  op: "subscribeToFeed",
		  feed_url: url,
		  category_id: categoryID
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data),
		});
		request.response(function(daten) {ttrssSubscribeToFeedResponse(daten, successCallback, errorCallback)});
		request.go(data);

	return;
};

function ttrssSubscribeToFeedResponse(inEvent, successCallback, errorCallback) {
	//console.log (successCallback);
	response = JSON.parse(inEvent.xhrResponse.body);
	//console.log(response.content.status);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
		errorCallback(response.content.error);
	}
};

//**************** UnsubscribeFeed ********************
function ttrssUnsubscribeFeed(ttrssurl, feedID, successCallback, errorCallback) {
	var data = {
		op: "unsubscribeFeed",
		feed_id: feedID
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssUnsubscribeFeedResponse(daten, successCallback, errorCallback)});
	request.go(data);

	return;
};

function ttrssUnsubscribeFeedResponse(inEvent, successCallback, errorCallback) {
	//console.log (successCallback);
	response = JSON.parse(inEvent.xhrResponse.body);
	//console.log(response.content.status);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
		errorCallback(response.content.error);
	}
};

//*************** Get full article (might be optional for some feeds, like heise.de) ***************
function ttrssGetFullArticle(articleUrl, successCallback, errorCallback) {
	var request = new enyo.Ajax({
		url: articleUrl,
		method: "GET"
	});
	request.response(function(result) {successCallback(result.xhrResponse.body);});
	request.go();
};

//**************** getConfig ********************
function ttrssGetConfig(ttrssurl, successCallback, errorCallback) {
		//console.log("GET CATEGORIES");
		var data = {
		  op: "getConfig"
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

function ttrssGetConfigResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};