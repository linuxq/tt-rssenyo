ttrss_SID = "";
ttrssURL = null;
ttrssUser = null;
ttrssPassword = null;

enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Tiny-Tiny Rss Reader"},
		{kind: "Panels", fit: true, classes: "panels-sample-sliding-panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "left", style: "width: 240px", components: [
				{kind: "enyo.Scroller", fit: true, components: [
					{name: "main", classes: "nice-padding", allowHtml: true}
				]}
			]},
			{name: "middle", tyle: "width: 500px", components: [
				{kind: "Scroller", classes: "enyo-fit", touch: true, components: [
					{name: "feedlist", classes: "nice-padding", allowHtml: true}
				]}
			]},
			{name: "body", fit: true, components: [
				{kind: "Scroller", classes: "enyo-fit", touch: true, components: [
					{name: "articleView", classes: "panels-sample-sliding-content", allowHtml: true, content: ""}
				]}
			]}
		]},		
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Setup", ontap: "LoginTap"},
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
		console.log("LOGIN SUCCESSS SID: " + LoginResponse.sessionid);
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
		ObjLength = inEvent.length  - 1;
		for ( i=0; i<=ObjLength; i++  ){
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			TextHelp = TextHelp + "#" + inEvent[i].id + " " + inEvent[i].title + " - " + inEvent[i].unread + "<br>";
		};
		this.$.main.setContent(TextHelp);
		console.log(inEvent);
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
		ObjLength = inEvent.length  - 1;
		for ( i=0; i<=ObjLength; i++  ){
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			TextHelp = TextHelp + "#" + inEvent[i].id + " " + inEvent[i].title + " - " + inEvent[i].unread + "<br>";
		};
		this.$.main.setContent(TextHelp);
		console.log(inEvent);
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
		ObjLength = inEvent.length  - 1;
		for ( i=0; i<=ObjLength; i++  ){
			//console.log(inEvent[i].title + " - " + inEvent[i].unread);
			TextHelp = TextHelp + "#" + inEvent[i].id + " " + inEvent[i].title + " - " + inEvent[i].unread + "<br>";
		};
		this.$.feedlist.setContent(TextHelp);
		console.log(inEvent);
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
		TextHelp = TextHelp + "#" + inEvent[0].id + " " + inEvent[0].title + "<br><br>" + inEvent[0].content;
		this.$.articleView.setContent(TextHelp);
		console.log(inEvent);
	},
	processGetArticleError: function(inEvent){
		console.log(inEvent);
	},	
});
