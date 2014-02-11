//***************** Check URL ****************
function CheckUrl(chkurl) {
    var xhr = new XMLHttpRequest();
    var file = chkurl; //
    var randomNum = Math.round(Math.random() * 10000);
     
    xhr.open('HEAD', file + "?rand=" + randomNum, false);
     
    try {
        xhr.send();
         
        if (xhr.status >= 200 && xhr.status < 304) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};

//**************** Login ********************
function ttrssLogin(ttrssurl, ttrssuser, ttrsspassword, successCallback, errorCallback) {
	var data = {
		op: "login",
		user: ttrssuser,
		password : ttrsspassword
	};
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssLoginResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/index.php",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssLoginResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssLoginResponse(response, successCallback, errorCallback) {
	//console.log (successCallback);
	var loginresult = {
		status: "99",
		sessionid: "99",
		error: "99"
	};
	loginresult.status = response.status;
	if (loginresult.status == 0) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssGetCategoriesResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssGetCategoriesResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssGetCategoriesResponse(response, successCallback, errorCallback) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssGetFeedsResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssGetFeedsResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssGetFeedsResponse(response, successCallback, errorCallback) {
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	};
};


//**************** getHeadlines ********************
function ttrssGetHeadlines(ttrssurl, ttrssSID, unreadOnly, feedID, isCategory, successCallback, errorCallback) {
	//console.log(feedID);
	var viewmode = "unread";
	if (unreadOnly) {
		viewmode = "unread";
	} else {
		viewmode = "all_articles";
	};
	var data = {
		op: "getHeadlines",
		feed_id: feedID,
		is_cat: isCategory,
		view_mode: viewmode,
		limit: 100,
		show_excerpt: true,
		show_content: true,
		enable_nested: true,
		sid: ttrssSID
	};
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssGetHeadlinesResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssGetHeadlinesResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssGetHeadlinesResponse(response, successCallback, errorCallback) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssGetHeadlinesResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssGetHeadlinesResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssGetArticleResponse(response, successCallback, errorCallback) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssMarkArticleReadResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssMarkArticleReadResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssMarkArticleReadResponse(response, successCallback, errorCallback) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssMarkArticleStarredResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssMarkArticleStarredResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssMarkArticleStarredResponse(response, successCallback, errorCallback) {
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};

//**************** PublishArticleStarred ********************
function ttrssPublishArticle(ttrssurl, ttrssSID, articleID, published, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "updateArticle",
		article_ids: articleID,
		mode: published,
		field: 1, //publish-Status
		sid: ttrssSID
	};
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssPublishArticleResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssPublishArticleResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssPublishArticleResponse(response, successCallback, errorCallback) {
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};


//**************** SubscribeToFeed ********************
function ttrssSubscribeToFeed(ttrssurl, ttrssSID, url, categoryID, successCallback, errorCallback) {
	if (gblApiLevel <= 4) {
		var data = {
			op: "subscribeToFeed",
			feed_url: url,
			category_id: categoryID,
			sid: ttrssSID
		};
		var request = new enyo.Ajax({
			url: ttrssurl + "/public.php?op=subscribe&feed_url=" + url,
			method: "GET"
			//url: ttrssurl + "/api/",
			//method: "POST",
			//handleAs: "json",
			//postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssSubscribeToFeedResponse(daten, successCallback, errorCallback)});
		request.go();
	} else {
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
		request.response(function(daten) {ttrssSubscribeToFeedResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
		request.go(data);		
	}
	//request.go(data);

	return;
};

function ttrssSubscribeToFeedResponse(response, successCallback, errorCallback) {
	//console.log (successCallback);
	//response = JSON.parse(inEvent.xhrResponse.body);
	//console.log(response.content.status);
	successCallback(response);
	/*
	successCallback(response.content);
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		//console.log("Login: " + loginresult.status + ", " + response.content.session_id + ", " +response.content.error);
		errorCallback(response.content.error);
	}
	*/
};

//**************** UnsubscribeFeed ********************
function ttrssUnsubscribeFeed(ttrssurl, ttrssSID, feedID, successCallback, errorCallback) {
	var data = {
		op: "unsubscribeFeed",
		feed_id: feedID,
		sid: ttrssSID
	};
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssUnsubscribeFeedResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssUnsubscribeFeedResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssUnsubscribeFeedResponse(response, successCallback, errorCallback) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssGetConfigResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssGetConfigResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssGetConfigResponse(response, successCallback, errorCallback) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssCatchupFeedResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssCatchupFeedResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssCatchupFeedResponse(response, successCallback, errorCallback) {
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
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssUpdateFeedResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssUpdateFeedResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssUpdateFeedResponse(response, successCallback, errorCallback) {
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};

//**************** GetApiLevel ********************
function ttrssGetApiLevel(ttrssurl, ttrssSID, successCallback, errorCallback) {
	//console.log("GET CATEGORIES");
	var data = {
		op: "getApiLevel",
		sid: ttrssSID
	};
	if (gblUseJsonpRequest) {
		var request = new enyo.JsonpRequest({
			url: ttrssurl + "/api/index.php"
		});
		request.response(function(request, response) {ttrssGetApiLevelResponse(response, successCallback, errorCallback)});
	} else {
		var request = new enyo.Ajax({
			url: ttrssurl + "/api/",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data)
		});
		request.response(function(daten) {ttrssGetApiLevelResponse(JSON.parse(daten.xhrResponse.body), successCallback, errorCallback)});
	}
	request.go(data);

	return;
};

function ttrssGetApiLevelResponse(response, successCallback, errorCallback) {
	if (response.status == 0) {
		successCallback(response.content);
	} else {
		errorCallback(response.content.error);
	}
};
