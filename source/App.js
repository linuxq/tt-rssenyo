ttrssURL = null;
ttrssUser = null;
ttrssPassword = null;

RecentArticle = ""; //Merker für ArticleID des angeigten Artikels
RecentArticleIndex = "";

Category = new Array();
CategoryID = new Array();
FeedTitle = new Array();
FeedID = new Array();
Articles = new Array();
ArticleID = new Array();
ArticleURL = new Array();

MarkReadTimer = "";
MarkReadTimeout = "2000";

enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Tiny-Tiny Rss Reader",components: [
			{content: "Tiny-Tiny-RSS Reader"},
			{kind: "onyx.Button", content: "Setup", ontap: "LoginTap"}
		]},
		{kind: "Panels", name: "viewPanels", fit: true, classes: "panels-sample-sliding-panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "left", style: "width: 240px", showing: false, components: [
				{kind: "enyo.Scroller", fit: true, components: [
					{name: "main", classes: "nice-padding", allowHtml: true}
				]}
			]},
			{name: "left2", kind: "FittableRows", fit: true, style: "width: 240px", components: [
				{content: "Categories"},
				{kind: "Scroller", touch:true, fit: false, classes: "scroller-sample-scroller", components: [
					{kind: "Repeater", name: "categoryRepeater", onSetupItem:"setupCategories", fit: true, ontap: "clickCategory", components: [
						{name: "categorylist", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-size: 12px; font-weight: bold;", components: [
							{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
									{tag: "span", name: "titel", style: "width: 100%; text-align: left"}
							]}
						]}
					]},
				]},
				{content: "Feeds"},
				{kind: "Scroller", touch:true, fit:true, classes: "scroller-sample-scroller", components: [
					{kind: "Repeater", name: "feedRepeater", onSetupItem:"setupFeeds", fit: true, ontap: "clickFeed", components: [
						{name: "feedlist", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-size: 12px; font-weight: bold;", components: [
							{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
									{tag: "span", name: "titel", style: "width: 100%; text-align: left"}
							]}
						]}
					]}
				]},
			]},			
			{name: "middle", kind: "FittableRows", fit: true, style: "width: 400px", components: [
					//{name: "FeedTitle", content: "Feed"},
					{kind: "Scroller", name: "articleScroller", touch:true, fit:true, classes: "scroller-sample-scroller", components: [
	
						{kind: "Repeater", onSetupItem:"setupArticles", fit: true, ontap: "clickItem", components: [
							{name: "item", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-size: 12px; font-weight: bold;", components: [
								{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
										{tag: "span", name: "titel", style: "width: 100%; text-align: left"}
								]}
							]}
						]}
					]},
				{fit: true},
				{kind: "onyx.Toolbar", components: [
					{kind: "onyx.Grabber"}
				]}				
				//{kind: "Scroller", classes: "enyo-fit", touch: true, components: [
				//	{name: "feedlist", classes: "nice-padding", allowHtml: true}
				//]}
			]},
			{name: "body", kind: "FittableRows", fit: true, components: [
				
				{kind: "Scroller", name: "articleViewScroller", fit: true, touch: true, components: [
					{name: "articleView", classes: "panels-sample-sliding-content", allowHtml: true, content: "", value: 0}
				]},
				{fit: true},
				{kind: "onyx.Toolbar", fit: true, components: [
					{kind: "onyx.Grabber"},
					{content: "Read "},
					{kind:"onyx.Checkbox", style: "height: 29px", name: "chkArticleRead", onchange: "toggleArticleRead", checked: false},		
					{kind: "onyx.IconButton" , src: "assets/browser2.png", ontap: "openArticle"},
					{kind: "onyx.Button", style: "width: 40px", content: "<", ontap: "prevArticle"},
					{kind: "onyx.Button", style: "width: 40px", content: ">", ontap: "nextArticle"},
					{fit: true},
					{name: "lblArticles", align: "right"}
				]}
			]}
		]},		
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
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "Server", name: "serverAddress", value: "http://rss.meissel.com"}
				]},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", name: "serverUser", placeholder: "Username", value: "webosmz"}
				]},				
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", type:"password", name: "serverPassword", placeholder: "Enter password", value: "IchWillLesen"}
				]},			
				{tag: "br"},
				{kind: "onyx.Button", content: "Save", ontap: "LoginSave"},
				{kind: "onyx.Button", content: "Cancel", ontap: "LoginClose"}
		]},		
	],
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		window.setTimeout(this.startapp(), 10);
	},	
	create: function(){
		this.inherited(arguments);
	},
	startapp: function(inSender,inEvent){
		/*ttrssURL = "http://rss.meissel.com";
		ttrssUser = "webosmz";
		ttrssPassword = "IchWillLesen";
		ttrssLogin(ttrssURL, ttrssUser, ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
		*/
		ttrssURL = localStorage.getItem("ttrssurl");
		ttrssPassword = localStorage.getItem("ttrsspassword");
		ttrssUser = localStorage.getItem("ttrssuser");
		if (ttrssURL == null)
		{
			this.$.LoginPopup.show();
		} else
		{
			ttrssLogin(ttrssURL, ttrssUser, ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
			ttrssGetHeadlines(ttrssURL, 29, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
		}
	},	
	LoginClose: function(inSender, inEvent){
		this.$.LoginPopup.hide();
	},	
	LoginSave: function(inSender, inEvent){
		ttrssURL = this.$.serverAddress.getValue();
		ttrssUser = this.$.serverUser.getValue();
		ttrssPassword = this.$.serverPassword.getValue();
		
		localStorage.setItem("ttrssurl", ttrssURL);
		localStorage.setItem("ttrssuser", ttrssUser);
		localStorage.setItem("ttrsspassword", ttrssPassword);
		ttrssLogin(ttrssURL, ttrssUser, ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));				
		this.$.LoginPopup.hide();
	},	
	LoginTap: function(inSender, inEvent) {
		this.$.LoginPopup.show();
		//ttrssLogin(ttrssURL, ttrssUser, ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
		//console.log("Antwort: " + ttlogin.status + " - " + ttlogin.sessionid + " - " + ttlogin.error);
	},
	processLoginSuccess: function(inResponse) {
		//console.log(inResponse.status);
		LoginResponse = inResponse;
		//console.log("LOGIN SUCCESSS SID: " + LoginResponse.sessionid);
		ttrss_SID = LoginResponse.sessionid;
		this.$.main.setContent("LOGIN SUCCESSS SID: " + LoginResponse.sessionid);
		this.getCategories();
	},
	processLoginError: function(LoginResponse) {
		//LoginResponse = inResponse;
		console.log("LOGIN Error: " + LoginResponse.error);
		this.$.main.setContent("LOGIN ERROR: " + LoginResponse.error);
	},
	getCategories: function (inSender){
		//console.log(this.ttrss_SID);
		ttrssGetCategories(ttrssURL, enyo.bind(this, "processGetCategoriesSuccess"), enyo.bind(this, "processGetCategoriesError"));
	},
	processGetCategoriesSuccess: function(inEvent){
		var TextHelp = "";
		var i;
		Category = [];
		CategoryID = [];
		ObjLength = inEvent.length  - 1;
		for ( i=0; i<=ObjLength; i++  ){
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			TextHelp = TextHelp + "#" + inEvent[i].id + " " + inEvent[i].title + " - " + inEvent[i].unread + "<br>";
			Category[i] = inEvent[i].title + " (" + inEvent[i].unread + ")";
			CategoryID[i] = inEvent[i].id;
		};
		this.$.main.setContent(TextHelp);
		this.$.categoryRepeater.setCount(Category.length);
		//console.log(inEvent);
	},
	processGetCategoriesError: function(inEvent){
		console.log(inEvent);
	},
	getFeeds: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		ttrssGetFeeds(ttrssURL, this.$.catID.getValue(), enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError"));
	},
	processGetFeedsSuccess: function(inEvent){
		var TextHelp = "";
		var i;
		FeedID = [];
		FeedTitle = [];
		ObjLength = inEvent.length  - 1;
		for ( i=0; i<=ObjLength; i++  ){
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			TextHelp = TextHelp + "#" + inEvent[i].id + " " + inEvent[i].title + " - " + inEvent[i].unread + "<br>";
			FeedTitle[i] = inEvent[i].title + " (" + inEvent[i].unread + ")";
			FeedID[i] = inEvent[i].id;
		};
		this.$.main.setContent(TextHelp);
		this.$.feedRepeater.setCount(FeedTitle.length);
		//console.log(inEvent);
	},
	processGetFeedsError: function(inEvent){
		console.log(inEvent);
	},	
	getHeadlines: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		ttrssGetHeadlines(ttrssURL, this.$.feedID.getValue(), enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
	},
	processGetHeadlinesSuccess: function(inEvent){
		var TextHelp = "";
		var i;
		Articles = []; //Artikelliste leeren
		ArticleID = [];
		ArticleURL = [];
		ObjLength = inEvent.length  - 1;
		for ( i=0; i<=ObjLength; i++  ){
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			TextHelp = TextHelp + "#" + inEvent[i].id + " " + inEvent[i].title + " - " + inEvent[i].unread + "<br>";
			Articles[i] = inEvent[i].title;
			ArticleID[i] = inEvent[i].id;
			//console.log(inEvent[i].id);
			ArticleURL[i] = inEvent[i].link;
		};
		this.$.repeater.setCount(Articles.length);
		this.$.articleScroller.setScrollTop(0);
		//this.$.feedlist.setContent(TextHelp);
		//console.log(inEvent);
	},
	processGetHeadlinesError: function(inEvent){
		console.log(inEvent);
	},	
	getArticle: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		ttrssGetArticle(ttrssURL, this.$.articleID.getValue(), enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
	},
	processGetArticleSuccess: function(inEvent){
		var TextHelp = "";
		TextHelp = inEvent[0].title + "<br><br>" + inEvent[0].content;
		this.$.articleView.setContent(TextHelp);
		this.$.articleViewScroller.setScrollTop(0);
		this.$.articleViewScroller.setScrollLeft(0);
		//Checkbox ReadStatus setzen
		if (inEvent[0].unread) {
			this.$.chkArticleRead.setChecked(false);
			clearInterval(this.MarkReadTimer);
			this.MarkReadTimer = setInterval(this.TimedMarkRead.bind(this), MarkReadTimeout);
		}
		else
		{
			this.$.chkArticleRead.setChecked(true);
		}
		//console.log("unread : " + inEvent[0].unread);
		RecentArticle = inEvent[0].id;
		this.$.lblArticles.setContent((RecentArticleIndex + 1) + "/" + Articles.length);
		//console.log(inEvent);
	},
	processGetArticleError: function(inEvent){
		console.log(inEvent);
	},
	TimedMarkRead: function() {
		ttrssMarkArticleRead(ttrssURL, RecentArticle, !1, enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
		this.$.chkArticleRead.setChecked(!0);
		this.$.repeater.children[RecentArticleIndex].$.titel.applyStyle("color", "#999999");
		clearInterval(this.MarkReadTimer);
	},
	toggleArticleRead: function(inSender, inEvent) {
		var Readstate = this.$.chkArticleRead.getValue();
		if (Readstate) {
			//als gelesen markieren
			ttrssMarkArticleRead(ttrssURL, RecentArticle, false,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));	
		} else
		{
			//als gelesen markieren
			ttrssMarkArticleRead(ttrssURL, RecentArticle, true,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));				
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
	setupCategories: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var categorylist = inEvent.item;
		categorylist.$.titel.setContent(Category[index]);
		////////item.$.dauer.setContent(PCastsDuration[index]);
		
	},	
	setupFeeds: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var feedlist = inEvent.item;
		feedlist.$.titel.setContent(FeedTitle[index]);
		////////item.$.dauer.setContent(PCastsDuration[index]);
		
	},	
	setupArticles: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var item = inEvent.item;
		item.$.titel.setContent(Articles[index]);
		////////item.$.dauer.setContent(PCastsDuration[index]);
		
	},
	clickCategory: function(inSender, inEvent){
		console.log(CategoryID[inEvent.index]);
		ttrssGetFeeds(ttrssURL, CategoryID[inEvent.index], enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError"));
		this.$.viewPanels.setIndex(1);
	},
	clickFeed: function(inSender, inEvent){
		//console.log(ArticleID[inEvent.index] + " - " + Articles[inEvent.index]);
		ttrssGetHeadlines(ttrssURL, FeedID[inEvent.index], enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
		if (window.innerWidth < 1024) {
			this.$.viewPanels.setIndex(2);
		}
	},	
	clickItem: function(inSender, inEvent){
		//console.log(ArticleID[inEvent.index] + " - " + Articles[inEvent.index]);
		RecentArticleIndex = inEvent.index;
		ttrssGetArticle(ttrssURL, ArticleID[inEvent.index], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
		if (window.innerWidth < 1024) {
			this.$.viewPanels.setIndex(3);
		}
	},
	openArticle: function(inSender, inEvent){
		window.open(ArticleURL[RecentArticleIndex]);
	},
	prevArticle: function(inSender, inEvent){
		if (RecentArticleIndex >=1){
			RecentArticleIndex = RecentArticleIndex - 1;
			ttrssGetArticle(ttrssURL, ArticleID[RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));	
		};
		//console.log(RecentArticleIndex);
	},
	nextArticle: function(inSender, inEvent){
		if (RecentArticleIndex < (Articles.length - 1) ){
			RecentArticleIndex = RecentArticleIndex + 1;
			//console.log(RecentArticleIndex);
			ttrssGetArticle(ttrssURL, ArticleID[RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));	
		};		
	}
});
