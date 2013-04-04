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
function ttrssGetCategories(ttrssurl, ttrssSID, unreadOnly, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "getCategories",
		unread_only: unreadOnly,
		enable_nested: false,
		sid: ttrssSID
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
function ttrssGetFeeds(ttrssurl, ttrssSID, unreadOnly, catID, successCallback, errorCallback) {
	var data = {
		op: "getFeeds",
		cat_id: catID,
		unread_only: unreadOnly,
		enable_nested: true,
		sid: ttrssSID
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
function ttrssGetHeadlines(ttrssurl, ttrssSID, unreadOnly, feedID, successCallback, errorCallback) {
	var viewmode = "unread";
	if (unreadOnly) {
		viewmode = "unread";
	} else {
		viewmode = "all_articles";
	};
	var data = {
		op: "getHeadlines",
		feed_id: feedID,
		view_mode: viewmode,
		limit: 100,
		show_excerpt: true,
		show_content: true,
		enable_nested: true,
		sid: ttrssSID
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
function ttrssGetArticle(ttrssurl, ttrssSID, articleID, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "getArticle",
		article_id: articleID,
		sid: ttrssSID
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

function ttrssGetArticleResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};

//**************** MarkArticleRead ********************
function ttrssMarkArticleRead(ttrssurl, ttrssSID, articleID, unread, successCallback, errorCallback) {
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
		field: 2, //unread-Status
		sid: ttrssSID
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

//**************** MarkArticleStarred ********************
function ttrssMarkArticleStarred(ttrssurl, ttrssSID, articleID, starred, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var starredhelper = 1;
	if (starred) {
		starredhelper = 1;
	} else
	{
		starredhelper = 0;
	};
	var data = {
		op: "updateArticle",
		article_ids: articleID,
		mode: starred,
		field: 0, //unread-Status
		sid: ttrssSID
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssMarkArticleStarredResponse(daten, successCallback, errorCallback)});
	request.go(data);

	return;
};

function ttrssMarkArticleStarredResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};

//**************** SubscribeToFeed ********************
function ttrssSubscribeToFeed(ttrssurl, ttrssSID, url, categoryID, successCallback, errorCallback) {
	var data = {
		op: "subscribeToFeed",
		feed_url: url,
		category_id: categoryID,
		sid: ttrssSID
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
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
function ttrssUnsubscribeFeed(ttrssurl, ttrssSID, feedID, successCallback, errorCallback) {
	var data = {
		op: "unsubscribeFeed",
		feed_id: feedID,
		sid: ttrssSID
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
function ttrssGetConfig(ttrssurl, ttrssSID, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "getConfig",
		sid: ttrssSID
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssGetConfigResponse(daten, successCallback, errorCallback)});
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

//**************** catchupFeed ********************
function ttrssCatchupFeed(ttrssurl, ttrssSID, feedID, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "catchupFeed",
		feed_id: feedID,
		is_cat: false,
		sid: ttrssSID
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssCatchupFeedResponse(daten, successCallback, errorCallback)});
	request.go(data);

	return;
};

function ttrssCatchupFeedResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	console.log(response);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};

//**************** updateFeed ********************
function ttrssUpdateFeed(ttrssurl, ttrssSID, feedID, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "updateFeed",
		feed_id: feedID,
		sid: ttrssSID
	};
	var request = new enyo.Ajax({
		url: ttrssurl + "/api/",
		method: "POST",
		handleAs: "json",
		postBody: JSON.stringify(data)
	});
	request.response(function(daten) {ttrssUpdateFeedResponse(daten, successCallback, errorCallback)});
	request.go(data);

	return;
};

function ttrssUpdateFeedResponse(inEvent, successCallback, errorCallback) {
	response = JSON.parse(inEvent.xhrResponse.body);
	console.log(response);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};
