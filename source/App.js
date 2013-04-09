MarkReadTimer = "";
MarkReadTimeout = "2000";

enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "Panels", name: "viewPanels", fit: true, classes: "panels-sample-sliding-panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "left", style: "width: 240px", showing: false, components: [
				{kind: "enyo.Scroller", fit: true, components: [
					{name: "main", classes: "nice-padding", allowHtml: true}
				]}
			]},
			{name: "left2", kind: "FittableRows", style: "width: 260px", components: [
				{kind: "onyx.Toolbar", components: [
					{content: "TT-RSS Reader"},
					{fit: true},
					{kind: "onyx.ToggleIconButton", name: "toggleUnread", onChange: "clickRefresh", value: true, src: "assets/menu-icon-bookmark.png"}
				]},
				{name: "left3", kind: "FittableRows", fit: true, components: [
					{kind: "Scroller", touch:true, fit: true, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
						{kind: "gts.DividerDrawer", name: "categoryHeader", caption: "Categories", open: true, onChange: "resize", components:[
							{kind: "Scroller", touch:true, fit: false, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
								{kind: "Repeater", name: "categoryRepeater", onSetupItem:"setupCategories", fit: true, ontap: "clickCategory", components: [
									{name: "categorylist", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-weight: bold;", components: [
										{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
												{tag: "span", name: "titel", style: "width: 100%; text-align: left; margin-left: 5px;"}
										]}
									]}
								]}
							]},					
						]},
						//{content: "Categories", name: "categoryHeader", style: "font-size: 1.2em; color: #ffffff; background: #000000; font-weight: bold;"},
						{kind: "gts.DividerDrawer", name: "feedHeader", caption: "Feeds", open: true, onChange: "resize", components:[
						//{content: "Feeds (Click to add)", name: "feedHeader", ontap: "addFeedClick", style: "font-size: 1.2em; color: #ffffff; background: #000000; font-weight: bold;"},
							{kind: "Scroller", touch:true, fit:true, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
								{kind: "Repeater", name: "feedRepeater", onSetupItem:"setupFeeds", fit: true, ontap: "clickFeed", components: [
									{name: "feedlist", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-weight: bold;", components: [
										{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
												{kind: "enyo.Image", fit: false, name: "icon", src: "assets/blankfeedicon.ico", style: "height: 25px"},
												{tag: "span", name: "unread", fit: false, style: "width: 50px; text-align: right;  margin-left: 2px"},
												{tag: "span", name: "titel", fit: true, style: "text-align: left; margin-left: 8px;"}
										]}
									]}
								]}
							]},
						]},
						{name: "left2blank", fit: true}
					]}	
				]},
				{kind: "onyx.Toolbar", components: [
					{kind: "onyx.Button", content: "Setup", ontap: "LoginTap"},
					{kind: "onyx.Button", content: "Add Feed", ontap: "addFeedClick"},
					{kind: "onyx.IconButton" , src: "assets/menu-icon-refresh.png", ontap: "clickRefresh"}
				]}
			]},
			{name: "middle", kind: "FittableRows", fit: true, style: "width: 400px", components: [
				//{name: "FeedTitle", content: "Feed"},
				{kind: "onyx.Toolbar", components: [
					{kind: "enyo.Image", name: "feedTitleIcon", fit: false, src: "", style: "height: 30px"}, //height: 54px"},
					{name: "lblFeedTitle", content: "Feed", style: "font-size: 1.2em; font-weight: bold"}
				]},
				{kind: "Scroller", name: "articleScroller", touch:true, fit:true, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
					{kind: "Repeater", name: "articleRepeater", onSetupItem:"setupArticles", fit: true, components: [
						{name: "item", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-weight: bold;", components: [
							{kind: "FittableRows", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
								{kind: "FittableColumns", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
									{kind: "onyx.IconButton", fit: false, name: "starredList", src: "assets/starred-footer20.png", style: "height: 20px", ontap: "toggleArticleStarredList"},
									{tag: "div", name: "titel", style: "width:100%; text-align:left;", ontap: "clickItem"}
								]},
								{tag: "div", name: "preview", style: "width:100%; text-align:left; font-weight:normal;", ontap: "clickItem"}
							]}
						]}
					]}
				]},
				{fit: true},
				{kind: "onyx.Toolbar", components: [
					{kind: "onyx.Grabber"},
					{kind: "onyx.Button", content: "All read", ontap: "MarkFeedReadClick"},
					{kind: "onyx.IconButton" , src: "assets/menu-icon-refresh.png", ontap: "UpdateFeedClick"}
				]}
				//{kind: "Scroller", classes: "enyo-fit", touch: true, components: [
				//	{name: "feedlist", classes: "nice-padding", allowHtml: true}
				//]}
			]},
			{name: "body", kind: "FittableRows", fit: true, components: [
				{name: "articleViewTitle", content: "", style: "padding: 5px; font-weight: bold;", ondragfinish: "titleDragFinish", ondragstart: "titleDragStart"},
				{name: "articleViewTitle2", content: "", style: "font-size: 0.8em; padding: 5px;"},
				{content: "", style: "border: 1px solid silver;"},
				{kind: "Scroller", name: "articleViewScroller", horizontal:"hidden", fit: true, touch: true, ondragfinish: "titleDragFinish", ondragstart: "titleDragStart", components: [
					{name: "articleView", classes: "panels-sample-sliding-content", allowHtml: true, content: ""}
				]},
				//{fit: true},
				{kind: "onyx.Toolbar", fit: true, components: [
					{kind: "onyx.Grabber"},
					{fit: true},
					{kind: "onyx.Button", style: "width: 40px", content: "<", ontap: "prevArticle"},
					//{content: "Read "},rr
					{fit: true},
					{kind:"onyx.Checkbox", style: "height: 29px", name: "chkArticleRead", onchange: "toggleArticleRead", checked: false},
					{fit: true},
					{name: "lblArticles", align: "right"},
					{fit: true},
					{kind: "onyx.IconButton" , src: "assets/browser2.png", ontap: "openArticle"},
					{fit: true},
					{kind: "onyx.IconButton" , name: "iconStarred", src: "assets/starred-footer-on.png", ontap: "toggleArticleStarred"},
					{fit: true},
					{kind: "onyx.Button", name: "btnFullArticle", content: "Full", ontap: "showFullArticle"},
					{fit: true},
					{kind: "onyx.Button", style: "width: 40px", content: ">", ontap: "nextArticle"}
				]}
			]}
		]},
		{kind: enyo.Signals, onkeyup: "handleKeyUp", onkeydown: "handleKeyDown", onkeypress: "handleKeyPress"},
		{kind: "enyo.ApplicationEvents", onBack: "goBack" },
		{kind: "onyx.Toolbar", showing: false, components: [
			//{kind: "onyx.Button", content: "Setup", ontap: "LoginTap"},
			{kind: "onyx.Button", content: "Categories", ontap: "getCategories"},
			{kind: "onyx.Button", content: "Get feeds:", ontap: "getFeeds"},
			{kind: "onyx.Input", name: "catID", style: "width: 50px", placeholder: "CatID", onchange:"getFeeds"},
			{kind: "onyx.Button", content: "Get content:", ontap: "getHeadlines"},
			{kind: "onyx.Input", name: "feedID", style: "width: 50px", placeholder: "FeedID", onchange: "getHeadlines"},
			{kind: "onyx.Button", content: "Get article:", ontap: "getArticle"},
			{kind: "onyx.Input", name: "articleID", style: "width: 50px", placeholder: "ID", onchange: "getArticle"}

		]},
		{name: "LoginPopup", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
			{kind: "onyx.Groupbox", style: "width:100%; background-color:#EAEAEA;", components: [
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "Server", name: "serverAddress", value: "..", style: "width:100%;"}
				]},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", name: "serverUser", placeholder: "Username", value: "", style: "width:100%;"}
				]},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", type:"password", name: "serverPassword", placeholder: "Enter password", value: "", style: "width:100%;"}
				]}
			]},
			{kind: "onyx.Checkbox", name: "alternativeView", content: "Alternative View (beta)", style: "width:100%; height:24px; padding:10px 0px 0px 40px;"},
			{kind: "onyx.Checkbox", name: "autoLoadFirstFeed", content: "Autoload 1st feed", style: "width:100%; height:24px; padding:10px 0px 0px 40px;"},
			{tag: "div", style: "height:10px;"},
			{kind: "onyx.Button", content: "Save", ontap: "LoginSave", style: "width:100%;"},
			{tag: "div", style: "height:2px;"},
			{kind: "onyx.Button", content: "Cancel", ontap: "LoginClose", style: "width:100%;"}
		]},
		{name: "AddFeedPopup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", components: [
			{content: "Add a new feed into:"},
			{name: "AddFeedCategory", content: ""},
			{kind: "onyx.Groupbox", style: "width:100%; background-color:#EAEAEA;", components: [
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "FeedURL", name: "AddFeedURL", value: "", style: "width:100%;"}
				]}
			]},
			{tag: "div", style: "height:10px;"},
			{kind: "onyx.Button", content: "Add", ontap: "addFeedSave", style: "width:100%;"},
			{tag: "div", style: "height:2px;"},
			{kind: "onyx.Button", content: "Cancel", ontap: "addFeedClose", style: "width:100%;"}
		]},
		{name: "MarkFeedReadPopup", kind: "onyx.Popup", centered: true, modal: true, floating: true, components: [
			{content: "Really mark feed as read?"},
			{tag: "div", style: "height:10px;"},
			{kind: "onyx.Button", classes: "onyx-negative", content: "Yes", ontap: "MarkFeedRead", style: "width:100%;"},
			{tag: "div", style: "height:2px;"},
			{kind: "onyx.Button", content: "No", ontap: "MarkFeedReadClose", style: "width:100%;"}
		]}
	],
	FeedID: [],
	FeedUnread: [],
	FeedTitle: [],
	FeedIcon: [],
	CategoryID: [],
	CategoryUnread: [],
	CategoryTitle: [],
	currentCategoryIndex: 0,
	currentFeedIndex: 0,
	currentFeedID: "",
	currentFeed: "",
	Articles: [],
	ArticleContent: [],
	ArticleID: [],
	ArticleURL: [],
	ArticleStarred: [],
	ttrssURL: null,
	ttrssUser: null,
	ttrssPassword: null,
	ttrssIconPath: null,
	ttrss_SID: "",
	
	//Settings
	alternativeView: false,
	AutoLoadFirstFeed: false,
	
	// Merkvariablen
	dragStartPanelIndex: null,
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		window.setTimeout(this.startapp(), 10);
	},
	create: function(){
		this.inherited(arguments);
	},
	startapp: function(inSender,inEvent){
		this.ttrssURL = localStorage.getItem("ttrssurl");
		this.ttrssPassword = localStorage.getItem("ttrsspassword");
		this.ttrssUser = localStorage.getItem("ttrssuser");
		this.alternativeView = (localStorage.getItem("alternativeView") == "true");
		this.AutoLoadFirstFeed = (localStorage.getItem("AutoLoadFirstFeed") == "true");
		if (this.ttrssURL == null)
		{
			this.$.LoginPopup.show();
		}
		else
		{
			ttrssLogin(this.ttrssURL, this.ttrssUser, this.ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
			var getUnreadOnly = this.$.toggleUnread.getValue();
			ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, 29, false, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
		};
		if (window.innerWidth < 1024) {
			this.$.btnFullArticle.setShowing(false);
			if (window.innerWidth > 400) {
				//Bei Pre 3 ArticelView vergrößern
				//this.$.categoryHeader.applyStyle("font-size", "1.8em");
				this.$.categoryRepeater.applyStyle("font-size", "1.8em");
				//this.$.feedHeader.applyStyle("font-size", "1.8em");
				this.$.feedRepeater.applyStyle("font-size", "1.8em");
				this.$.articleRepeater.applyStyle("font-size", "1.8em");
				this.$.articleViewScroller.applyStyle("font-size", "1.8em");
				this.$.articleViewTitle.applyStyle("font-size", "2.0em");
				this.$.articleViewTitle2.applyStyle("font-size", "1.6em");
			} else
			{
				//Bei Pre / Veer etc ArticelView vergrößern
				//this.$.categoryHeader.applyStyle("font-size", "1.2em");
				this.$.categoryRepeater.applyStyle("font-size", "1.2em");
				//this.$.feedHeader.applyStyle("font-size", "1.2em");
				this.$.feedRepeater.applyStyle("font-size", "1.2em");
				this.$.articleRepeater.applyStyle("font-size", "1.2em");
				this.$.articleViewScroller.applyStyle("font-size", "1.2em");
				this.$.articleViewTitle.applyStyle("font-size", "1.4em");
				this.$.articleViewTitle2.applyStyle("font-size", "1.0em");
			}
		}
	},
	resize: function(){
		//console.log("resize");
		this.$.left2.reflow();
		this.$.left2blank.reflow();
		this.$.feedRepeater.reflow();
		this.$.body.reflow();
	},
	LoginClose: function(inSender, inEvent){
		this.$.LoginPopup.hide();
	},
	LoginSave: function(inSender, inEvent) {
		this.ttrssURL = this.$.serverAddress.getValue();
		this.ttrssUser = this.$.serverUser.getValue();
		this.ttrssPassword = this.$.serverPassword.getValue();
		this.alternativeView = this.$.alternativeView.getValue();
		this.AutoLoadFirstFeed = this.$.autoLoadFirstFeed.getValue();

		localStorage.setItem("ttrssurl", this.ttrssURL);
		localStorage.setItem("ttrssuser", this.ttrssUser);
		localStorage.setItem("ttrsspassword", this.ttrssPassword);
		localStorage.setItem("alternativeView", this.alternativeView);
		localStorage.setItem("AutoLoadFirstFeed", this.AutoLoadFirstFeed);
		ttrssLogin(this.ttrssURL, this.ttrssUser, this.ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
		this.$.LoginPopup.hide();
	},
	LoginTap: function(inSender, inEvent) {
		this.$.serverAddress.setValue(this.ttrssURL);
		this.$.serverUser.setValue(this.ttrssUser);
		this.$.serverPassword.setValue(this.ttrssPassword);
		this.$.alternativeView.setValue(this.alternativeView)
		this.$.autoLoadFirstFeed.setValue(this.AutoLoadFirstFeed);
		this.$.LoginPopup.show();
		//ttrssLogin(ttrssURL, ttrssUser, ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
		//console.log("Antwort: " + ttlogin.status + " - " + ttlogin.sessionid + " - " + ttlogin.error);
	},
	processLoginSuccess: function(LoginResponse) {
		console.error("LOGIN SUCCESSS SID: " + LoginResponse.sessionid);
		this.ttrss_SID = LoginResponse.sessionid;
		this.$.main.setContent("LOGIN SUCCESSS SID: " + LoginResponse.sessionid);
		this.getCategories();
		ttrssGetConfig(this.ttrssURL, this.ttrss_SID, enyo.bind(this, "processGetConfigSuccess"), enyo.bind(this, "processGetConfigError"));
	},
	processLoginError: function(LoginResponse) {
		//LoginResponse = inResponse;
		console.error("LOGIN Error: " + LoginResponse.error);
		alert("LOGIN Error: " + LoginResponse.error);
		this.$.main.setContent("LOGIN ERROR: " + LoginResponse.error);
	},
	clickRefresh: function(inSender, inEvent){
		console.error("clickRefresh");
		this.getCategories();
	},
	getCategories: function (inSender){
		console.error("getCategories");
		//console.log(this.ttrss_SID);
		var getUnreadOnly = this.$.toggleUnread.getValue();
		ttrssGetCategories(this.ttrssURL, this.ttrss_SID, getUnreadOnly, enyo.bind(this, "processGetCategoriesSuccess"), enyo.bind(this, "processGetCategoriesError"));
	},
	processGetCategoriesSuccess: function(inEvent){
		console.error("processGetCategoriesSuccess");
		//console.log(inEvent);
		var TextHelp = "";
		this.CategoryTitle.length = 0;
		this.CategoryUnread.length = 0;
		this.CategoryID.length = 0;
		//Check if userdefined categories exist
		var userCategories = 0;
		var undefinedCategory = null;
		for (var i=0; i<inEvent.length; i++) {
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			TextHelp = TextHelp + "#" + inEvent[i].id + " " + inEvent[i].title + " - " + inEvent[i].unread + "<br>";
			this.CategoryTitle[i] = html_entity_decode(inEvent[i].title);
			this.CategoryUnread[i] = inEvent[i].unread;
			this.CategoryID[i] = inEvent[i].id;
			//User defined categories have positive IDs
			if (inEvent[i].id > 0){
				userCategories++;
			};
			if (inEvent[i].id == 0) {
				undefinedCategory = i; //All feeds of undefined category
			};
		};
		this.$.categoryRepeater.setCount(this.CategoryTitle.length);		
		if (this.CategoryTitle.length > 0) {
			if (userCategories) {
				//open first user defined category
				this.selectCategory(0);	
			} else
			{
				//open "undefined" category = all feeds if no categories defined
				this.$.categoryHeader.toggleOpen(false);
				this.selectCategory(undefinedCategory);					
			}
		}
		
		//open "undefined" category 
		if ((this.CategoryTitle.length > 0) && (userCategories)) {
			this.selectCategory(0);
		}		
		//console.log(inEvent);
	},
	processGetCategoriesError: function(inEvent){
		console.error("processGetCategoriesError");
		console.error(inEvent);
		alert(inEvent);
	},
	getFeeds: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		var getUnreadOnly = this.$.toggleUnread.getValue();
		ttrssGetFeeds(this.ttrssURL, this.ttrss_SID, getUnreadOnly, this.$.catID.getValue(), enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError"));
	},
	processGetFeedsSuccess: function(inEvent){
		this.FeedID.length = 0;
		this.FeedUnread.length = 0;
		this.FeedTitle.length = 0;
		ObjLength = inEvent.length  - 1;
		var totalUnread = 0;
		this.FeedTitle[0] = this.CategoryTitle[this.currentCategoryIndex];
		this.FeedIcon[0] = false;
		this.FeedID[0] = this.CategoryID[this.currentCategoryIndex];

		for (var i=0; i<inEvent.length; i++) {
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			this.FeedTitle[i + 1] = html_entity_decode(inEvent[i].title);
			this.FeedUnread[i + 1] = inEvent[i].unread;
			this.FeedID[i + 1] = inEvent[i].id;
			this.FeedIcon[i + 1] = inEvent[i].has_icon;
			totalUnread = totalUnread + inEvent[i].unread; 
		};
		this.FeedUnread[0] = totalUnread;
		
		this.$.feedRepeater.setCount(this.FeedTitle.length);
		if (this.AutoLoadFirstFeed) {
			this.selectFeed(0);	
		}
		//console.log(inEvent);
	},
	processGetFeedsError: function(inEvent){
		console.log(inEvent);
	},
	processGetConfigSuccess: function(inEvent){
		//console.log(inEvent);
		this.ttrssIconPath = this.ttrssURL + "/" + inEvent.icons_url + "/";
		//console.log(this.ttrssIconPath);
	},
	processGetConfigError: function(inEvent){
		console.log(inEvent);
	},
	getHeadlines: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		var getUnreadOnly = this.$.toggleUnread.getValue();
		ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, this.$.feedID.getValue(), false, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
	},
	processGetHeadlinesSuccess: function(inEvent){
		this.Articles.length = 0; //Artikelliste leeren
		this.ArticleContent.length = 0;
		this.ArticleID.length = 0;
		this.ArticleURL.length = 0;
		for (var i=0; i<inEvent.length; i++) {
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			this.Articles[i] = html_entity_decode(inEvent[i].title);
			this.ArticleID[i] = inEvent[i].id;
			//console.log(inEvent[i].marked);
			this.ArticleURL[i] = inEvent[i].link;
			this.ArticleStarred[i] = inEvent[i].marked; 
			if (this.alternativeView) {
				ttrssGetArticle(this.ttrssURL, this.ttrss_SID, inEvent[i].id,
					enyo.bind(this, function(i, inEvent) {
						this.ArticleContent[i] = stripHTML(html_entity_decode(inEvent[0].content));
						this.$.articleRepeater.renderRow(i);
					}, i),
					enyo.bind(this, function() {}));
			}
		};
		this.$.articleRepeater.setCount(this.Articles.length);
		this.$.articleScroller.setScrollTop(0);
		//this.$.feedlist.setContent(TextHelp);
		//console.log(inEvent);
	},
	processGetHeadlinesError: function(inEvent){
		console.log(inEvent);
	},
	getArticle: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.$.articleID.getValue(), enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
	},
	processGetArticleSuccess: function(inEvent){
		//console.log(inEvent);
		var TextHelp = "";
		//TextHelp = inEvent[0].title + "<br><br>" + inEvent[0].content;
		var timestamp = inEvent[0].updated;
		var pubDate = new Date(timestamp * 1000);
		var weekday = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
		var monthname = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		var formattedDate = weekday[pubDate.getDay()] + ' '
				    + monthname[pubDate.getMonth()] + ' '
				    + pubDate.getDate() + ', ' + pubDate.getFullYear() + ' ' + pubDate.getHours() + ':' + pubDate.getMinutes();
		//var pubDate = new Date(timestamp);
		//console.log(pubDate);
		this.$.articleViewTitle.setContent(html_entity_decode(inEvent[0].title));
		this.$.articleViewTitle2.setContent(html_entity_decode(inEvent[0].author) + " - " + formattedDate);
		this.$.articleView.setContent(inEvent[0].content);
		this.$.articleViewScroller.setScrollTop(0);
		this.$.articleViewScroller.setScrollLeft(0);
		//Checkbox ReadStatus setzen
		if (inEvent[0].unread) {
			this.$.chkArticleRead.setChecked(false);
			clearTimeout(this.MarkReadTimer);
			this.MarkReadTimer = setTimeout(enyo.bind(this, "TimedMarkRead"), MarkReadTimeout);
		}
		else
		{
			this.$.chkArticleRead.setChecked(true);
		}
		//Favorite-Stern setzen
		if(inEvent[0].marked) {
			this.$.iconStarred.setSrc("assets/starred-footer-on.png");
		} else
		{
			this.$.iconStarred.setSrc("assets/starred-footer.png");
		}
		//console.log("unread : " + inEvent[0].unread);
		this.$.lblArticles.setContent((this.RecentArticleIndex + 1) + "/" + this.Articles.length);
		//console.log(inEvent);
		this.resize();
	},
	processGetFullArticleSuccess: function(inContent){
		this.$.articleView.setContent(inContent);
		this.$.articleViewScroller.setScrollTop(0);
		this.$.articleViewScroller.setScrollLeft(0);
		//Checkbox ReadStatus setzen
		if (inEvent[0].unread) {
			this.$.chkArticleRead.setChecked(false);
			clearTimeout(this.MarkReadTimer);
			this.MarkReadTimer = setTimeout(enyo.bind(this, "TimedMarkRead"), MarkReadTimeout);
		}
		else
		{
			this.$.chkArticleRead.setChecked(true);
		}
		//console.log("unread : " + inEvent[0].unread);
		this.$.lblArticles.setContent((this.RecentArticleIndex + 1) + "/" + this.Articles.length);
	},
	processGetArticleError: function(inEvent){
		console.log(inEvent);
	},
	TimedMarkRead: function() {
		ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], !1, enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
		this.$.chkArticleRead.setChecked(!0);
		this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("color", "#999999");
		clearTimeout(this.MarkReadTimer);
	},
	toggleArticleRead: function(inSender, inEvent) {
		var Readstate = this.$.chkArticleRead.getValue();
		if (Readstate) {
			//als gelesen markieren
			ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], false,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
			this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("color", "#999999");
		} else
		{
			//als ungelesen markieren
			ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], true,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
			this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("color", "#333333");
		};
		//console.log(Readstate + " " + RecentArticle);
		//this.$.result.setContent(inSender.name + " was " + (inSender.getValue() ? " selected." : "deselected."));
	},
	processMarkArticleReadSuccess: function(inEvent){
		//console.log(inEvent);
	},
	processMarkArticleReadError: function(inEvent){
		//console.log(inEvent);
	},
	toggleArticleStarred: function(inSender, inEvent) {
		if (this.$.iconStarred.src == "assets/starred-footer.png") {
			//STARREN
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], true,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));
			this.$.iconStarred.setSrc("assets/starred-footer-on.png");
		} else
		{
			//STAR entfernen
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], false,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));
			this.$.iconStarred.setSrc("assets/starred-footer.png");
		}
	},
	toggleArticleStarredList: function(inSender, inEvent) {
		//console.log(inSender);

		if (this.ArticleStarred[inEvent.index]){
			//STAR entfernen
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[inEvent.index], false,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));
			this.ArticleStarred[inEvent.index] = false;
			inSender.setSrc("assets/starred-footer20.png");
		} else
		{
			//STARREN
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[inEvent.index], true,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));			
			this.ArticleStarred[inEvent.index] = true;
			inSender.setSrc("assets/starred-footer20-on.png");
		}		
	},
	processMarkArticleStarredSuccess: function(inEvent){
		//console.log(inEvent);
	},
	processMarkArticleStarredError: function(inEvent){
		//console.log(inEvent);
	},	
	setupCategories: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var categorylist = inEvent.item;
		if (index == this.currentCategoryIndex) {
			categorylist.$.titel.applyStyle("color", "#333333");
		} else {
			categorylist.$.titel.applyStyle("color", "#999999");
		}
		categorylist.$.titel.setContent(this.CategoryTitle[index] + " (" + this.CategoryUnread[index] + ")");
		this.resize();
		////////item.$.dauer.setContent(PCastsDuration[index]);
	},
	setupFeeds: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var feedlist = inEvent.item;
		if (index == this.currentFeedIndex) {
			feedlist.$.titel.applyStyle("color", "#333333");
		} else {
			feedlist.$.titel.applyStyle("color", "#999999");
		}
		if (this.FeedIcon[index]) {
			feedlist.$.icon.setSrc(this.ttrssIconPath + this.FeedID[index] + ".ico");
		}
		//feedlist.$.titel.setContent(this.FeedTitle[index] + " (" + this.FeedUnread[index] + ")");
		feedlist.$.unread.setContent(this.FeedUnread[index]);
		feedlist.$.titel.setContent(this.FeedTitle[index]);
		this.resize();
		////////item.$.dauer.setContent(PCastsDuration[index]);

	},
	setupArticles: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var item = inEvent.item;
		item.$.titel.setContent(this.Articles[index]);
		item.$.preview.setContent(this.ArticleContent[index]);
		if (this.ArticleStarred[index]) {
			item.$.starredList.setSrc("assets/starred-footer20-on.png");
		} else {
			item.$.starredList.setSrc("assets/starred-footer20.png");
		}		
	},
	clickCategory: function(inSender, inEvent) {
		this.selectCategory(inEvent.index);
	},
	selectCategory: function(index) {
		//console.log(this.CategoryID[index]);
		var oldCatIdx = this.currentCategoryIndex;
		this.currentCategoryIndex = index;
		this.$.categoryRepeater.renderRow(oldCatIdx);
		this.$.categoryRepeater.renderRow(this.currentCategoryIndex);
		var getUnreadOnly = this.$.toggleUnread.getValue();
		ttrssGetFeeds(this.ttrssURL, this.ttrss_SID, getUnreadOnly, this.CategoryID[index], enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError"));
		this.$.viewPanels.setIndex(1);
	},
	clickFeed: function(inSender, inEvent) {
		this.selectFeed(inEvent.index);
	},
	selectFeed: function(index) {
		//console.log(ArticleID[inEvent.index] + " - " + Articles[inEvent.index]);
		var oldFeedIdx = this.currentFeedIndex;
		this.currentFeedIndex = index;
		this.$.feedRepeater.renderRow(oldFeedIdx);
		this.$.feedRepeater.renderRow(this.currentFeedIndex);
		this.$.lblFeedTitle.setContent(this.FeedTitle[index]);
		if (this.FeedIcon[index]){
			var iconURL = this.ttrssIconPath + this.FeedID[index] + ".ico";
			//console.log(iconURL);
			this.$.feedTitleIcon.setShowing(true);
			this.$.feedTitleIcon.setSrc(iconURL);
		} else {
			this.$.feedTitleIcon.setShowing(false);
			//this.$.feedTitleIcon.setSrc("");
		};
		var getUnreadOnly = this.$.toggleUnread.getValue();
		var isCategory = false;
		//If "All articles" submit isCategory=true
		if (index == "0") {
			isCategory = true;
		};
		ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, this.FeedID[index], isCategory, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
		if (window.innerWidth < 1024) {
			this.$.viewPanels.setIndex(2);
		}
	},
	addFeedClick: function(inSender, inEvent) {
		this.$.AddFeedCategory.setContent(this.CategoryTitle[this.currentCategoryIndex]);
		this.$.AddFeedPopup.show();
	},
	addFeedSave: function(inSender, inEvent) {
		ttrssSubscribeToFeed(this.ttrssURL, this.ttrss_SID, this.$.AddFeedURL.getValue(), this.CategoryID[this.currentCategoryIndex], enyo.bind(this, "addFeedSuccess"), enyo.bind(this, "addFeedError"));
		this.$.AddFeedPopup.hide();
	},
	addFeedClose: function(inSender, inEvent) {
		this.$.AddFeedPopup.hide();
	},
	addFeedSuccess: function(inEvent) {
		this.getCategories();
	},
	addFeedError: function(inEvent) {
		console.log(inEvent);
		this.$.main.setContent(inEvent);
	},
	MarkFeedReadClick: function(inEvent){
		this.$.MarkFeedReadPopup.show();
	},
	MarkFeedRead: function(inEvent){
		ttrssCatchupFeed(this.ttrssURL, this.ttrss_SID, this.FeedID[this.currentFeedIndex], enyo.bind(this, "processMarkFeedReadSuccess"), enyo.bind(this, "processMarkFeedReadError"));
		this.$.MarkFeedReadPopup.hide();
	},
	processMarkFeedReadSuccess: function(inEvent) {
		console.log(inEvent);
		this.getCategories();
	},
	processMarkFeedReadError: function(inEvent) {
		console.log(inEvent);
	},
	MarkFeedReadClose: function(inEvent){
		this.$.MarkFeedReadPopup.hide();
	},
	UpdateFeedClick: function(inEvent) {
		ttrssUpdateFeed(this.ttrssURL, this.ttrss_SID, this.FeedID[this.currentFeedIndex], enyo.bind(this, "processUpdateFeedSuccess"), enyo.bind(this, "processUpdateFeedError"));
	},
	processUpdateFeedSuccess: function(inEvent) {
		console.log(inEvent);
		this.selectFeed(this.currentFeedIndex);
	},
	processUpdateFeedError: function(inEvent) {
		console.log(inEvent);
	},
	clickItem: function(inSender, inEvent){
		//console.log(ArticleID[inEvent.index] + " - " + Articles[inEvent.index]);
		this.RecentArticleIndex = inEvent.index;
		if (this.alternativeView) {
			ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"));
		} else {
			ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[inEvent.index], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
		}
		if (window.innerWidth < 1024) {
			this.$.viewPanels.setIndex(3);
		} else
		{
			this.$.viewPanels.setIndex(2);
		}
	},
	openArticle: function(inSender, inEvent){
		var FullArticelURL = this.ArticleURL[this.RecentArticleIndex];
		//if (this.ttrssURL == "..") {
		//	FullArticelURL = "proxy.php?proxy_url=" + FullArticelURL;
		//}		
		window.open(FullArticelURL);
	},
	showFullArticle: function(inSender, inEvent) {
		var FullArticelURL = this.ArticleURL[this.RecentArticleIndex];
		if (this.ttrssURL == "..") {
			FullArticelURL = "proxy.php?proxy_url=" + FullArticelURL;
		}
		ttrssGetFullArticle(FullArticelURL, enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"));
		this.$.viewPanels.setIndex(3);
	},
	prevArticle: function(inSender, inEvent){
		if (this.RecentArticleIndex >= 1){
			this.RecentArticleIndex = this.RecentArticleIndex - 1;
			if (this.alternativeView) {
				ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			} else {
				ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			}			
		};
		//console.log(RecentArticleIndex);
	},
	nextArticle: function(inSender, inEvent){
		if (this.RecentArticleIndex < (this.Articles.length - 1) ){
			this.RecentArticleIndex = this.RecentArticleIndex + 1;
			//console.log(RecentArticleIndex);
			if (this.alternativeView) {
				ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			} else {
				ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			}
		};
	},
	handleKeyDown: function(inSender, inEvent){
		//console.error("KeyDown: " + inEvent.keyIdentifier + "-" + inEvent.keyCode+".");
		var KeyCode = inEvent.keyCode;
	
		// Backgesture abfangen
		if (KeyCode == 27) {
			console.error(" BACK ");
			var WhichPanel = this.$.viewPanels.getIndex();
			switch (WhichPanel) {
				case 3:
					this.$.viewPanels.setIndex(2);
					break;
				case 2:
					this.$.viewPanels.setIndex(1);
					break;		
			};
			inEvent.preventDefault();
			inEvent.stopPropagation();
			return tre;
		};
	},
	handleKeyUp: function(inSender, inEvent){
		//console.error("Key Up: " + inEvent.keyIdentifier + "-" + inEvent.keyCode+".");
	},
	handleKeyPress: function(inSender, inEvent){
		//console.error("Key Press: " + inEvent.keyIdentifier + "-" + inEvent.keyCode+".");
	},	
	goBack: function(inSender, inEvent){
		console.error(" BACK ");
	},
	titleDragStart: function(inSender, inEvent){
		//Remember Panel Index to prevent Article swiching when draggin form 2 to 3!
		this.dragStartPanelIndex = this.$.viewPanels.getIndex();		
	},	
	titleDragFinish: function(inSender, inEvent){
		  if (+inEvent.dx < -80) {
			if (this.dragStartPanelIndex == 3) {
				//console.log("NEXT");
				if (this.$.viewPanels.getIndex() == 3) {
					//Only if Article Panel is shown alone! To prevent switching with dragging panel!	
					this.nextArticle();	
				}
			}
		  };
		  if (+inEvent.dx > 80) {
				//console.log("PREV");
				//this.prevArticle();
				//this.$.viewPanels.setIndex(3);
		  }						
	}		
});
