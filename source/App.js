MarkReadTimer = "";
gblUseJsonpRequest = false;
gblApiLevel = 0;

enyo.kind({
	name: "App",
	kind: "FittableRows",
	handlers: {
		//oncontextmenu: "handleContextMenu",
		onmousemove: "handleGlobalMouseMove",
		onmousedown: "handleGlobalMouseDown",
		onmouseup: "handleGlobalMouseUp"
	},
	fit: true,
	components:[
		{kind: "Panels", name: "viewPanels", fit: true, classes: "panels-sample-sliding-panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
			{name: "left", style: "width: 240px", showing: false, components: [
				{kind: "enyo.Scroller", fit: true, components: [
					{name: "main", classes: "nice-padding", allowHtml: true}
				]}
			]},
			{name: "left2", kind: "FittableRows", classes: "panels-theme-light", style: "width:260px; background-color:#fff;", components: [
				{kind: "onyx.Toolbar", components: [
					{content: "TT-RSS Reader"},
					{fit: true},
					{kind: "onyx.ToggleIconButton", name: "toggleUnread", onChange: "clickRefresh", style:" position:fixed; right:5px;", value: true, src: "assets/menu-icon-bookmark.png"}
				]},
				{name: "left3", kind: "FittableRows", fit: true, classes: "panels-theme-light", components: [
					{kind: "Scroller", touch:true, fit: true, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
						{kind: "gts.DividerDrawer", name: "categoryHeader", caption: "Categories", open: true, onChange: "resize", components:[
							{kind: "Scroller", touch:true, fit: false, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
								{kind: "Repeater", name: "categoryRepeater", onSetupItem:"setupCategories", fit: true, ontap: "clickCategory", components: [
									//{name: "categorylist", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px;nowr font-weight: bold;", components: [
									{name: "categorylist", classes:"repeater-sample-item", style: "padding: 5px;nowr font-weight: bold;", components: [
										{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
												{tag: "span", name: "titel", fit:true, style: "white-space:nowrap; text-align:left; margin-left:5px; overflow:hidden;"},
												{tag: "span", name: "unread", fit: false, style: "width:50px; text-align:right; margin-left:2px; margin-right:2px; font-weight:normal;"}
										]}
									]}
								]}
							]},
						]},
						//{content: "Categories", name: "categoryHeader", style: "font-size: 1.2em; color: #ffffff; background: #000000; font-weight: bold;"},
						{kind: "gts.DividerDrawer", name: "feedHeader", fit: true, caption: "Feeds", open: true, onChange: "resize", components:[
						//{content: "Feeds (Click to add)", name: "feedHeader", ontap: "addFeedClick", style: "font-size: 1.2em; color: #ffffff; background: #000000; font-weight: bold;"},
							{kind: "Scroller", touch:true, fit: false, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
								{kind: "Repeater", name: "feedRepeater", onSetupItem:"setupFeeds", fit: true, ontap: "clickFeed", components: [
									//{name: "feedlist", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-weight: bold;", components: [
									{name: "feedlist", classes:"repeater-sample-item", style: "padding: 5px; font-weight: bold;", components: [
										{kind: "FittableColumns", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
												{kind: "enyo.Image", fit: false, name: "icon", src: "assets/blankfeedicon.ico", style: "height:32px; width:32px;"},
												{tag: "span", name: "titel", fit: true, style: "width:auto; white-space:nowrap; text-align:left; margin-left:5px; padding-top:8px; overflow:hidden;"},
												{tag: "span", name: "unread", fit: false, style: "width:50px; text-align:right; margin-left:2px; margin-right:2px; padding-top:8px; font-weight:normal;"}
										]}
									]}
								]}
							]},
						]},
						{name: "left2blank", fit: true}
					]}
				]},
				{kind: "onyx.Toolbar", style: "background: #252525;", components: [
					{kind: "onyx.Button", content: "Setup", ontap: "LoginTap"},
					{kind: "onyx.Button", content: "Add Feed", ontap: "addFeedClick"},
					{kind: "onyx.IconButton" , src: "assets/menu-icon-refresh.png", ontap: "clickRefresh"}
				]}
			]},
			{name: "middle", kind: "FittableRows", fit: true, style: "width:400px;", classes: "panels-theme-light", components: [
				//{name: "FeedTitle", content: "Feed"},
				{kind: "onyx.Toolbar", components: [
					{kind: "enyo.Image", name: "feedTitleIcon", fit: false, src: "", style: "height:30px;"}, //height: 54px"},
					{name: "lblFeedTitle", content: "Feed", style: "font-size:1.2em; font-weight:bold;"},
					{fit: true},
					{kind: "onyx.ToggleIconButton", name: "toggleFeedUnread", onChange: "UpdateFeedClick", style:" position:fixed; right:5px;", value: true, src: "assets/menu-icon-bookmark.png"}
				]},

				/* With "star/unstar" ->  too slow :(
				{kind: "Scroller", name: "articleScroller", touch:true, fit:true, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
					{kind: "Repeater", name: "articleRepeater", onSetupItem:"setupArticles", fit: true, components: [
						{name: "item", classes:"repeater-sample-item", style: "border: 1px solid silver; padding: 5px; font-weight: bold;", components: [
							{kind: "FittableRows", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
								{kind: "FittableColumns", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
									{kind: "onyx.IconButton", fit: false, name: "starredList", src: "assets/starred-footer32.png", style: "height: 32px;", ontap: "toggleArticleStarredList"},
									{tag: "div", name: "titel", fit: true, style: "text-align:left;", ontap: "clickItem"},
								]},
								{tag: "div", name: "preview", style: "width:100%; text-align:left; font-weight:normal;", ontap: "clickItem"}
							]}
						]}
					]}
				]},
				*/

				{kind: "Scroller", name: "articleScroller", touch:true, fit:true,  horizontal:"hidden", classes: "scroller-sample-scroller", components: [
					{kind: "Repeater", name: "articleRepeater", onSetupItem:"setupArticles", fit: true, ontap: "clickItem", onhold: "holdItem",  components: [
						{name: "item", classes:"repeater-sample-item", style: "border: 1px solid black; padding: 5px; font-weight: bold;", components: [
							{kind: "FittableRows", name: "Data1", fit: true, classes: "fittable-sample-shadow", style: "height: auto", components: [
								{tag: "div", name: "titel", style: "width:100%; text-align:left;"},
								{tag: "div", name: "preview", style: "width:100%; text-align:left; font-weight:normal;"},
								{tag: "div", name: "timestamp", style: "width:100%; text-align:right; font-size:10px;"}
							]}
						]}
					]}
				]},

				{fit: true},
				{kind: "FittableColumns", name: "listviewtoolbar", showing: true, style: "width:100%; height: 60px; background: #252525;", components:[
					{kind: "enyo.Image", name: "bb10listviewgrabber", fit: false, src: "assets/bb10panelBack.png", style: "height:60px;", ontap: "bb10backmain"}, //height: 54px"},
					{style: "width: 10px"},
					{kind: "FittableRows", style: "height: 60px; background: #252525;", components:[
						{style: "height: 14px"},
						{kind: "FittableColumns", style: "height: 32px; background: #252525;", components:[
							{kind: "onyx.Grabber", name: "listviewgrabber", style: "height: 30px"},
							{style: "width: 10px"},
							{kind: "onyx.MenuDecorator", style: "width: 100px", onSelect: "MarkFeedReadClick", components: [
								{kind: "onyx.Button", content: "Mark"},
								{kind: "onyx.Menu", components: [
									{content: "read until current", name: "current"},
									{content: "list read", name: "list"},
									{content: "feed read", name: "feed"}
								]}
							]},
							{style: "width: 10px"},
							{kind: "onyx.IconButton" , style: "height: 32px; margin-top: 15px", src: "assets/menu-icon-refresh.png", ontap: "UpdateFeedClick"},
							{style: "width: 10px"},
							{kind: "onyx.Button", name: "FeedListPageUpButton", content: "Up", onmousedown: "FeedListPageUpDown", onmouseup: "FeedListPageUpUp", showing: false, style: "margin-left:0px; margin-right:0px; width:68px;"},
							{style: "width: 10px"},
							{kind: "onyx.Button", name: "FeedListPageDownButton", content: "Dwn", onmousedown: "FeedListPageDownDown", onmouseup: "FeedListPageDownUp", showing: false, style: "margin-left:0px; margin-right:0px; width:68px;"}
						]},
						{style: "height: 14px"}
					]}		
				]},
				//{kind: "Scroller", classes: "enyo-fit", touch: true, components: [
				//	{name: "feedlist", classes: "nice-padding", allowHtml: true}
				//]}
			]},
			{name: "body", kind: "FittableRows", fit: true, classes: "panels-theme-light", components: [
				{name: "articleViewTitle", content: "", style: "padding: 5px; font-weight: bold;", ontap: "enablePanels", ondragfinish: "titleDragFinish", ondragstart: "titleDragStart"},
				{kind: "FittableColumns", fit: false, style: "height: 40px; padding: 5px", ontap: "enablePanels", components: [
					{kind: "enyo.Image", name: "articleTitleIcon", fit: false, src: "", style: "height:30px; width:30px;"}, //height: 54px"},
					{name: "articleViewTitle2", content: "", style: "font-size: 0.8em; padding: 5px;"},
				]},
				{content: "", style: "border: 1px solid silver;"},
				{kind: "Scroller", name: "articlePreviewScroller", horizontal:"hidden", fit: true, touch: true, ondragfinish: "titleDragFinish", ondragstart: "titleDragStart", components: [
					{name: "articlePreview", classes: "panels-sample-sliding-content", allowHtml: true, content: ""}
				]},
				{kind: "Scroller", name: "articleViewScroller", horizontal:"hidden", fit: true, touch: true, ondragfinish: "titleDragFinish", ondragstart: "titleDragStart", components: [
					{name: "articleView", kind: "MyAjaxWebView", classes: "panels-sample-sliding-content", allowHtml: true, content: ""}
				]},
				//{fit: true},
				{kind: "FittableColumns", name: "articleviewtoolbar", showing: true, style: "width:100%; height: 60px; background: #252525;", components:[
					
					{kind: "enyo.Image", name: "bb10articleviewgrabber", fit: false, src: "assets/bb10panelBack.png", style: "height:60px;", ontap: "enablePanels"}, //height: 54px"},
					//{style: "width: 10px"},
					{kind: "onyx.Grabber", name: "grabberArticleView", ontap: "enablePanels"},
					{kind: "FittableRows", style: "height: 60px; background: #252525;", components:[
						{style: "height: 14px"},
						{kind: "FittableColumns", style: "height: 32px; background: #252525;", components:[
							{style: "width: 5px"},
							{kind: "onyx.Button", name: "btnUnlockPanels", content: "<-", ontap: "enablePanels", showing: false},				
							{style: "width: 5px"},
							{kind: "onyx.Button", name: "btnPrevArticle", style: "width: 40px", content: "<", ontap: "prevArticle"},
							{style: "width: 5px"},
							{kind:"onyx.Checkbox", style: "height: 29px", name: "chkArticleRead", onchange: "toggleArticleRead", checked: false},
							//{style: "width: 5px"},
							{kind: "onyx.IconButton", name: "bb10btnread", src: "assets/bb10readoff.png", showing:true, ontap: "markreadbb10"},
							{style: "width: 8px"},							
							
							{kind: "FittableRows", style: "background: #252525; width: 23px; padding-right: 5px;", components:[
								//{style: "height: 14px"},
								{name: "lblArticles1", align: "center", style: "font-size: 11px; text-align: center; color: white; height: 20px; padding-top: 1px; padding-bottom: 1px; vertical-align: top;"},
								//{content: "of", align: "center", style: "font-size: 5px; color: white; height: 10px; padding-top: 1px; padding-bottom: 1px; vertical-align: middle;"},
								{name: "lblArticles2", align: "center", style: "font-size: 11px; text-align: center; color: white; height: 20px; padding-top: 1px; padding-bottom: 1px; vertical-align: bottom;"},
								{style: "height: 3px"},
							]},

							//{style: "width: 5px"},
							{kind: "onyx.MenuDecorator", onSelect: "shareArticle", components: [
								{kind: "onyx.Button", name: "btnshare", content: "..."},
								{kind: "onyx.Menu", components: [
									//{components: [
									//	{kind: "onyx.IconButton", src: "assets/menu-icon-bookmark.png"},
										{content: "Twitter", name: "shareTW"},
									//]},
									{content: "Facebook", name: "shareFB"},
									//{classes: "onyx-menu-divider"},
									{content: "App.net"},
									{content: "G+"},
                                    {content: "Instapaper"}
									//{content: "ReadItLater", active: false},
								]}
							]},							
							//{style: "width: 5px"},
							{kind: "onyx.IconButton", name: "bb10btnshare", src: "assets/bb10-share32.png", showing:true, ontap: "shareArticlebb10"},
							{style: "width: 8px"},
							{kind: "onyx.IconButton" , name: "btnbrowser", src: "assets/browser2.png", ontap: "openArticle"},
							{style: "width: 8px"},
							{kind: "onyx.IconButton" , name: "iconStarred", src: "assets/starred-footer.png", ontap: "toggleArticleStarred"},
							{style: "width: 8px"},
							{kind: "onyx.IconButton" , name: "iconPublished", src: "assets/published-off.png", ontap: "toggleArticlePublished"},
							{style: "width: 8px"},
							{kind: "onyx.Button", name: "btnFullArticle", content: "Full", ontap: "showFullArticle"},
							{style: "width: 8px"},
							{kind: "onyx.Button", name: "btnNextArticle", style: "width: 40px", content: ">", ontap: "nextArticle"}
						]},
						{style: "height: 14px"}
					]}
				]}
			]}
		]},
		{name: "loadbar", content: "", classes: "squaresWaveG", style: "position: relative; width: auto; height:5px", showing:false},
		{name: "loadbarBlank", content: "", style: "position: relative; width: auto; height:5px; background: #000000"},
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
		{name: "LoginPopup", style: "width:320px; height", classes: "onyx-sample-popup", kind: "onyx.Popup", centered: true, modal: true, floating: true, onShow: "popupShown", onHide: "popupHidden", autoDismiss: false, components: [
			{kind: "Scroller", style: "height: 280px", touch:true, fit:true, horizontal:"hidden", classes: "scroller-sample-scroller", components: [
				{kind: "onyx.Groupbox", style: "width:100%; background-color:#EAEAEA;", components: [
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", placeholder: "Server (with http:// or https://)", name: "serverAddress", value: "http://", style: "width:100%;"}
					]},
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", name: "serverUser", placeholder: "Username", value: "", style: "width:100%;"}
					]},
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", type:"password", name: "serverPassword", placeholder: "Enter password", value: "", style: "width:100%;"}
					]}
				]},
				{kind: "FittableColumns", style: "width:100%; margin-top:5px;", components:[
					{kind: "onyx.PickerDecorator", style: "width:100%;", components: [
						{style: "width:100%;", classes: "onyx-blue"}, // A content-less PickerButton
						{kind: "onyx.Picker", name: "pickViewMode", onSelect: "handleViewModeChange", components: [
							{content: "Standard 3 Columns View", value: "0", name: "VM0", active: true},
							{content: "Alternative 2 Columns view", value: "1", name: "VM1"},
							{content: "Alternative 3 Columns view", value: "2", name: "VM2"}
						]}
					]}
				]},
				{kind: "onyx.Checkbox", name: "useJsonpRequest", content: "Use JsonpRequest", style: "width:100%; height:24px; padding:10px 0px 0px 40px;"},
				{kind: "onyx.Checkbox", name: "autoLoadFirstFeed", content: "Autoload 1st feed", style: "width:100%; height:24px; padding:10px 0px 0px 40px;", onchange: "AutoLoadChanged"},
				{kind: "onyx.Checkbox", name: "autoLoadAllArticles", content: "Autoload 'all articles' feed", style: "width:100%; height:24px; padding:10px 0px 0px 40px;", onchange: "AutoLoadChanged"},
				{kind: "onyx.Checkbox", name: "autoLockPanels", checked: true, content: "Swipeable article view (on phones)", style: "width:100%; height:24px; padding:10px 0px 0px 40px;"},
				{kind: "FittableColumns", style: "height: auto", components: [
					{kind: "onyx.PickerDecorator", components: [
						{},
						{kind: "onyx.Picker", name: "pickMarkReadTimeout", onSelect: "changeMarkReadTimeout", components: [
							{content: "1s", value: 1000, name: "T1s"},
							{content: "2s", value: 2000, name: "T2s", active: true},
							{content: "3s", value: 3000, name: "T3s"},
							{content: "5s", value: 5000, name: "T5s"},
							{content: "off", value: 0, name: "Toff"}
						]}
					]},
					{content: "Auto mark read timer", style: "padding-left: 10px; vertical-align: middle"}
				]},
                {kind: "onyx.Groupbox", style: "width:100%; background-color:#EAEAEA;", components: [
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", name: "instapaperUser", placeholder: "Instapaper User", value: "", style: "width:100%;"}
					]},
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", type:"password", name: "instapaperPW", placeholder: "Enter instapaper password", value: "", style: "width:100%;"}
					]}
				]},
				]},
				//{tag: "div", style: "height:10px;"},
				{kind: "FittableColumns", style: "width:100%; margin-top:5px;", components:[
					{kind: "onyx.Button", content: "Save", ontap: "LoginSave", style: "width:50%;"},
					{kind: "onyx.Button", content: "Cancel", ontap: "LoginClose", style: "width:50%;"}
				]}
			//]}
		]},
		{name: "AddFeedPopup", kind: "onyx.Popup", centered: true, modal: true, floating: true, autoDismiss: false, onShow: "popupShown", onHide: "popupHidden", components: [
			{content: "Add a new feed into:"},
			{name: "AddFeedCategory", content: ""},
			{kind: "onyx.Groupbox", style: "width:100%; background-color:#EAEAEA;", components: [
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", placeholder: "FeedURL", name: "AddFeedURL", value: "", selectOnFocus: true, style: "width:100%;"}
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
	ArticleData: [],
	ArticleID: [],
	ArticleURL: [],
	ArticleUnread: [],
	ArticleStarred: [],
	ttrssURL: null,
	ttrssUser: null,
	ttrssPassword: null,
	ttrssIconPath: null,
	ttrss_SID: "",
    instapaperUser: "",
    instapaperPW: "",
	ttrssAutoMarkRead: "2000",
	JustStarted: true,
	staredon: "assets/starred-footer-on.png",
	staredoff: "assets/starred-footer.png",
	publishedon: "assets/published-on.png",
	publishedoff: "assets/published-off.png",

	//Settings
	ViewMode: "0",
	AutoLoadFirstFeed: false,
	AutoLockPanels: true,
	AutoLoadAllArticles: false,

	// Merkvariablen
	dragStartPanelIndex: null,
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		window.setTimeout(enyo.bind(this, "startapp"), 10);
	},
	create: function(){
		this.inherited(arguments);
	},
	startapp: function(inSender,inEvent) {
		
		//Debug
		//gblBB10 = true;
		
		//Beta Laufzeit bis 12.10.2013
		BetaDate = "20131012"; 
		jetzt = new Date();
		Tag = jetzt.getDate();
		// bei einstelligem Wert Null voranstellen
		Tag  = ((Tag < 10) ? "0" + Tag : Tag);
		Monat = jetzt.getMonth()+1;
		// bei einstelligem Wert Null voranstellen
		Monat  = ((Monat < 10) ? "0" + Monat : Monat);
		Jahr = jetzt.getYear() + 1900;
		Datum = Jahr + Monat + Tag;
		if (Datum > BetaDate){
			console.log("BETA abgelaufen");
			window.close();
		}
		

		this.ttrssURL = localStorage.getItem("ttrssurl");
		this.ttrssPassword = localStorage.getItem("ttrsspassword");
		this.ttrssUser = localStorage.getItem("ttrssuser");
		this.ttrssAutoMarkRead = localStorage.getItem("ttrssautomarkreadtimeout");
		this.ViewMode = localStorage.getItem("ViewMode");
		this.AutoLoadFirstFeed = (localStorage.getItem("AutoLoadFirstFeed") == "true");
		this.AutoLoadAllArticles= (localStorage.getItem("AutoLoadAllArticles") == "true");
		this.AutoLockPanels = (localStorage.getItem("AutoLockPanels") == "true");
		gblUseJsonpRequest = (localStorage.getItem("UseJsonpRequest") == "true");
        this.instapaperUser = localStorage.getItem("instapaperUser");
        this.instapaperPW = localStorage.getItem("instapaperPW");

		this.changeViewMode();

		if (this.ttrssURL == null) {
			this.$.LoginPopup.show();
		} else {
			ttrssLogin(this.ttrssURL, this.ttrssUser, this.ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
			/*var getUnreadOnly = this.$.toggleUnread.getValue();
			if (this.AutoLoadAllArticles) {
				ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, -4, false, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
			} else
			{
				ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, 29, false, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
			}
			*/
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
				this.$.articlePreviewScroller.applyStyle("font-size", "1.8em");
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
				this.$.articlePreviewScroller.applyStyle("font-size", "1.2em");
				this.$.articleViewScroller.applyStyle("font-size", "1.2em");
				this.$.articleViewTitle.applyStyle("font-size", "1.4em");
				this.$.articleViewTitle2.applyStyle("font-size", "1.0em");
			}
		} else {
			this.$.viewPanels.layout.peekWidth = 40;
			if (this.ViewMode == "0") {
				this.$.btnFullArticle.setShowing(true);
			} else {
				this.$.btnFullArticle.setShowing(false);
			}
		}
		//Hide arrows in Article View for LockedPanels
		if (this.AutoLockPanels) {
			this.$.btnNextArticle.setShowing(false);
			this.$.btnPrevArticle.setShowing(false);	
		}		
		//BB10 Scaling / UI
		if (gblBB10) {
			//this.$.bb10articleviewgrabber.setShowing(false);
			//this.$.btnUnlockPanels.setShowing(true);			
			this.$.bb10articleviewgrabber.setShowing(true);
			this.$.btnUnlockPanels.setShowing(false);
			
			this.$.listviewgrabber.setShowing(false);
			this.$.bb10listviewgrabber.setShowing(true);
			this.$.bb10btnshare.setShowing(true);
			this.$.btnshare.setShowing(false);
			this.$.bb10btnread.setShowing(true);
			this.$.chkArticleRead.setShowing(false);
			
			
			//this.$.grabberArticleView.setShowing(false);
			//this.$.btnbb10share.setShowing(true);
			//this.$.mnuShare.setShowing(false);
			//this.$.btnUnlockPanels.applyStyle("width", "20px");
			this.$.chkArticleRead.applyStyle("height", "20px");
			//this.$.mnuShare.applyStyle("height", "20px");
			this.staredon =  "assets/bb10staron.png";
			this.staredoff = "assets/bb10staroff.png";
			this.$.iconStarred.setSrc(this.staredoff);
			this.publishedon = "assets/bb10publishon.png";
			this.publishedoff = "assets/bb10publishoff.png";
			this.$.btnbrowser.setSrc("assets/bb10browser.png");						
		} else {
			this.$.bb10articleviewgrabber.setShowing(false);
			this.$.btnUnlockPanels.setShowing(true);
			this.$.listviewgrabber.setShowing(true);
			this.$.bb10listviewgrabber.setShowing(false);
			this.$.bb10btnshare.setShowing(false);
			this.$.btnshare.setShowing(true);
			this.$.bb10btnread.setShowing(false);
			this.$.chkArticleRead.setShowing(true);
			
			//this.$.bb10listviewtoolbar.setShowing(false);
			//this.$.listviewtoolbar.setShowing(true);						
			
			//this.$.btnbb10share.setShowing(false);
			//this.$.mnuShare.setShowing(true);
		}
	},
	resizeHandler: function() {
	  // don't forget to call the default implementation
	  this.inherited(arguments);
	  // do my resizing tasks
		if (window.innerWidth < 1024) {
			this.$.btnFullArticle.setShowing(false);
			if (window.innerWidth > 400) {
				//Bei Pre 3 ArticelView vergrößern
				//this.$.categoryHeader.applyStyle("font-size", "1.8em");
				this.$.categoryRepeater.applyStyle("font-size", "1.8em");
				//this.$.feedHeader.applyStyle("font-size", "1.8em");
				this.$.feedRepeater.applyStyle("font-size", "1.8em");
				this.$.articleRepeater.applyStyle("font-size", "1.8em");
				this.$.articlePreviewScroller.applyStyle("font-size", "1.8em");
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
				this.$.articlePreviewScroller.applyStyle("font-size", "1.2em");
				this.$.articleViewScroller.applyStyle("font-size", "1.2em");
				this.$.articleViewTitle.applyStyle("font-size", "1.4em");
				this.$.articleViewTitle2.applyStyle("font-size", "1.0em");
			}
		} else {
			this.$.viewPanels.layout.peekWidth = 40;
			if (this.ViewMode == "0") {
				this.$.btnFullArticle.setShowing(true);
			} else {
				this.$.btnFullArticle.setShowing(false);
			}
		}
	},
	resize: function(){
		//console.log("resize");
		this.$.left2.reflow();
		this.$.middle.reflow();
		this.$.left2blank.reflow();
		this.$.feedRepeater.reflow();
		this.$.body.reflow();
		this.resized();
	},
	LoginClose: function(inSender, inEvent){
		this.$.LoginPopup.hide();
	},
	LoginSave: function(inSender, inEvent) {
		this.ttrssURL = this.$.serverAddress.getValue();
		this.ttrssUser = this.$.serverUser.getValue();
		this.ttrssPassword = this.$.serverPassword.getValue();
		this.ViewMode = this.$.pickViewMode.getSelected().value;
		this.AutoLoadFirstFeed = this.$.autoLoadFirstFeed.getValue();
		this.AutoLockPanels = this.$.autoLockPanels.getValue();
		this.AutoLoadAllArticles = this.$.autoLoadAllArticles.getValue();
        this.instapaperUser = this.$.instapaperUser.getValue();
        this.instapaperPW = this.$.instapaperPW.getValue();
		gblUseJsonpRequest = this.$.useJsonpRequest.getValue();
		localStorage.setItem("ttrssurl", this.ttrssURL);
		localStorage.setItem("ttrssuser", this.ttrssUser);
		localStorage.setItem("ttrsspassword", this.ttrssPassword);
		localStorage.setItem("ViewMode", this.ViewMode);
		localStorage.setItem("AutoLoadFirstFeed", this.AutoLoadFirstFeed);
		localStorage.setItem("AutoLoadAllArticles", this.AutoLoadAllArticles);
		localStorage.setItem("AutoLockPanels", this.AutoLockPanels);
		localStorage.setItem("UseJsonpRequest", gblUseJsonpRequest);
		localStorage.setItem("ttrssautomarkreadtimeout", this.ttrssAutoMarkRead);
        localStorage.setItem("instapaperUser", this.instapaperUser);
        localStorage.setItem("instapaperPW", this.instapaperPW);
		ttrssLogin(this.ttrssURL, this.ttrssUser, this.ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
		this.$.LoginPopup.hide();
	},
	LoginTap: function(inSender, inEvent) {
		this.$.serverAddress.setValue(this.ttrssURL);
		this.$.serverUser.setValue(this.ttrssUser);
		this.$.serverPassword.setValue(this.ttrssPassword);
		switch (this.ViewMode) {
			case '0':
				this.$.pickViewMode.setSelected(this.$.VM0);
				break;
			case '1':
				this.$.pickViewMode.setSelected(this.$.VM1);
				break;
			case '2':
				this.$.pickViewMode.setSelected(this.$.VM2);
				break;
		}
		this.$.autoLoadFirstFeed.setValue(this.AutoLoadFirstFeed);
		this.$.autoLoadAllArticles.setValue(this.AutoLoadAllArticles);
		this.$.autoLockPanels.setValue(this.AutoLockPanels);
		switch (this.ttrssAutoMarkRead) {
			case '1000':
				this.$.pickMarkReadTimeout.setSelected(this.$.T1s);
				break;
			case '2000':
				this.$.pickMarkReadTimeout.setSelected(this.$.T2s);
				break;
			case '3000':
				this.$.pickMarkReadTimeout.setSelected(this.$.T3s);
				break;
			case '5000':
				this.$.pickMarkReadTimeout.setSelected(this.$.T5s);
				break;
			case '0':
				this.$.pickMarkReadTimeout.setSelected(this.$.Toff);
				break;
		};
        this.$.instapaperUser.setValue(this.instapaperUser);
        this.$.instapaperPW.setValue(this.instapaperPW);
		this.$.LoginPopup.show();
		//ttrssLogin(ttrssURL, ttrssUser, ttrssPassword, enyo.bind(this, "processLoginSuccess"), enyo.bind(this, "processLoginError"));
		//console.log("Antwort: " + ttlogin.status + " - " + ttlogin.sessionid + " - " + ttlogin.error);
	},
	handleViewModeChange: function(inSender, inEvent) {
		this.ViewMode = inEvent.selected.value;
		this.selectFeed(this.currentFeedIndex);
		this.changeViewMode();
	},
	changeViewMode: function(inSender, inEvent) {
		if (this.ViewMode == "1") {
			this.$.articlePreviewScroller.setShowing(true);
			this.$.articleViewScroller.setShowing(false);
			this.$.body.setShowing(false);
			if (gblBB10) {
				this.$.FeedListPageUpButton.setShowing(false);
				this.$.FeedListPageDownButton.setShowing(false);
			} else {
				this.$.FeedListPageUpButton.setShowing(true);
				this.$.FeedListPageDownButton.setShowing(true);				
			};
		} else if (this.ViewMode == "2") {
			this.$.articlePreviewScroller.setShowing(false);
			this.$.articleViewScroller.setShowing(true);
			this.$.body.setShowing(true);
			this.$.FeedListPageUpButton.setShowing(false);
			this.$.FeedListPageDownButton.setShowing(false);
		} else {
			this.$.articlePreviewScroller.setShowing(true);
			this.$.articleViewScroller.setShowing(false);
			this.$.body.setShowing(true);
			this.$.FeedListPageUpButton.setShowing(false);
			this.$.FeedListPageDownButton.setShowing(false);
		}
	},
	changeMarkReadTimeout: function(inSender, inEvent){
		this.ttrssAutoMarkRead = inEvent.selected.value;
	},
	processLoginSuccess: function(LoginResponse) {
		//console.error("LOGIN SUCCESSS SID: " + LoginResponse.sessionid);
		this.$.LoginPopup.hide();
		this.ttrss_SID = LoginResponse.sessionid;
		this.$.main.setContent("LOGIN SUCCESSS SID: " + LoginResponse.sessionid);
		this.getCategories();
		ttrssGetConfig(this.ttrssURL, this.ttrss_SID, enyo.bind(this, "processGetConfigSuccess"), enyo.bind(this, "processGetConfigError"));
		ttrssGetApiLevel(this.ttrssURL, this.ttrss_SID, enyo.bind(this, "processGetApiLevelSuccess"), enyo.bind(this, "processGetApiLevelError"));
		var getUnreadOnly = this.$.toggleUnread.getValue();
		if (this.AutoLoadAllArticles)
		{
			this.$.lblFeedTitle.setContent("All articles");
			this.$.feedTitleIcon.setShowing(false);
			ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, -4, false, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
			if (window.innerWidth < 1024) {
				this.$.viewPanels.setIndex(2);
			}
		} else
		{
			//ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, 29, false, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
		}
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
		//console.error("getCategories");
		//console.log(this.ttrss_SID);
		this.setLoadbar(true);
		var getUnreadOnly = this.$.toggleUnread.getValue();
		this.$.toggleFeedUnread.setValue(getUnreadOnly);
		ttrssGetCategories(this.ttrssURL, this.ttrss_SID, getUnreadOnly, enyo.bind(this, "processGetCategoriesSuccess"), enyo.bind(this, "processGetCategoriesError"));
	},
	processGetCategoriesSuccess: function(inEvent) {
		console.error("processGetCategoriesSuccess");
		if (inEvent.length == 0) {
			console.log("GetCategories: NO Categories");
			this.setLoadbar(false);
			alert("Sorry, no news!");
			this.setLoadbar(false);
			return;
		};	
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
		if (this.AutoLoadAllArticles){
			this.setLoadbar(true);
			var getUnreadOnly = this.$.toggleUnread.getValue();
			ttrssGetFeeds(this.ttrssURL, this.ttrss_SID, getUnreadOnly, -1, enyo.bind(this, "processGetFeedsSuccess"), enyo.bind(this, "processGetFeedsError"));
		} else {
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
		}
		//console.log(inEvent);
		//this.setLoadbar(false);
	},
	processGetCategoriesError: function(inEvent){
		console.error("processGetCategoriesError");
		console.error(inEvent);
		alert(inEvent);
		this.setLoadbar(false);
	},
	getFeeds: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		this.setLoadbar(true);
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
		//this.setLoadbar(false);
	},
	processGetFeedsError: function(inEvent){
		console.log(inEvent);
		this.setLoadbar(false);
	},
	processGetConfigSuccess: function(inEvent){
		//console.log(inEvent);
		this.ttrssIconPath = this.ttrssURL + "/" + inEvent.icons_url + "/";
		//console.log(this.ttrssIconPath);
	},
	processGetConfigError: function(inEvent){
		console.log(inEvent);
	},
	processGetApiLevelSuccess: function(inEvent){
		gblApiLevel = inEvent.level;
	},
	processGetApiLevelError: function(inEvent){
		console.log(inEvent);
	},
	getHeadlines: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		this.setLoadbar(true);
		var getUnreadOnly = this.$.toggleFeedUnread.getValue();
		ttrssGetHeadlines(this.ttrssURL, this.ttrss_SID, getUnreadOnly, this.$.feedID.getValue(), false, enyo.bind(this, "processGetHeadlinesSuccess"), enyo.bind(this, "processGetHeadlinesError"));
	},
	processGetHeadlinesSuccess: function(inEvent){
		console.log(inEvent.length);
		this.Articles.length = 0; //Artikelliste leeren
		//this.ArticleContent.length = 0;
		this.ArticleData.length = 0;
		this.ArticleID.length = 0;
		this.ArticleURL.length = 0;
		this.ArticleUnread.length = 0;
		this.ArticleStarred.length = 0;
		if (inEvent.length == 0) {
			console.log("GetHeadlines: NO HEADLINES");
			this.setLoadbar(false);
			this.$.articleRepeater.setCount(0);
			this.$.articleScroller.setScrollTop(0);
			this.$.viewPanels.setIndex(1);
			this.clickRefresh();
			return;
		} else {
			for (var i=0; i<inEvent.length; i++) {
				//console.log(inEvent[i].title + " - " + inEvent[i].unread);
				this.Articles[i] = html_entity_decode(inEvent[i].title);
				this.ArticleID[i] = inEvent[i].id;
				this.ArticleURL[i] = inEvent[i].link;
				this.ArticleUnread[i] = inEvent[i].unread;
				this.ArticleStarred[i] = inEvent[i].marked;
				ttrssGetArticle(this.ttrssURL, this.ttrss_SID, inEvent[i].id,
					enyo.bind(this, function(i, inEvent) {
						//this.ArticleContent[i] = stripHTML(html_entity_decode(inEvent[0].content));
						this.ArticleData[i] = inEvent;
						if ((this.ViewMode == "1") || (this.ViewMode == "2")) {
							this.$.articleRepeater.renderRow(i);
						}
					}, i),
					enyo.bind(this, function() {}));
			};
			this.$.articleRepeater.setCount(this.Articles.length);
			this.$.articleScroller.setScrollTop(0);
		}
		//this.$.feedlist.setContent(TextHelp);
		//console.log(inEvent);	
		//if (inEvent.length == 0)
		//	this.setLoadbar(false);
	},
	processGetHeadlinesError: function(inEvent){
		console.log(inEvent);
		this.setLoadbar(false);
	},
	getArticle: function(inSender, inEvent){
		//console.log(this.$.catID.getValue());
		this.setLoadbar(true);
		ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.$.articleID.getValue(), enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
	},
	processGetArticleSuccess: function(inEvent){
		//console.log(inEvent[0].content);
		var TextHelp = "";
		//TextHelp = inEvent[0].title + "<br><br>" + inEvent[0].content;
		var timestamp = inEvent[0].updated;
		var pubDate = new Date(timestamp * 1000);
		var weekday = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
		var monthname = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		var formattedDate = weekday[pubDate.getDay()] + ' '
				    + monthname[pubDate.getMonth()] + ' '
				    + pubDate.getDate() + ', ' + pubDate.getFullYear() + ' ' + pubDate.getHours() + ':' + format_number(pubDate.getMinutes(), 2, "0");
		//var pubDate = new Date(timestamp);
		//console.log(pubDate);
		this.$.articleViewTitle.setContent(html_entity_decode(inEvent[0].title));
		this.$.articleViewTitle2.setContent(html_entity_decode(inEvent[0].author) + " - " + formattedDate);
		this.$.articleViewScroller.setShowing(false);
		this.$.articlePreviewScroller.setShowing(true);
		this.$.articlePreview.setContent(inEvent[0].content);
		this.$.articlePreviewScroller.setScrollTop(0);
		this.$.articlePreviewScroller.setScrollLeft(0);
		//Checkbox ReadStatus setzen
		if (inEvent[0].unread) {
			this.$.chkArticleRead.setChecked(false);
			this.$.bb10btnread.setSrc("assets/bb10readoff.png");
			clearTimeout(this.MarkReadTimer);
			if (this.ttrssAutoMarkRead != '0') {
				this.MarkReadTimer = setTimeout(enyo.bind(this, "TimedMarkRead"), this.ttrssAutoMarkRead);
			}
		}
		else
		{
			this.$.chkArticleRead.setChecked(true);
			this.$.bb10btnread.setSrc("assets/bb10readon.png");
		}
		//Favorite-Stern setzen
		if(inEvent[0].marked) {
			this.$.iconStarred.setSrc(this.staredon);
		} else
		{
			this.$.iconStarred.setSrc(this.staredoff);
		}
		//FPublish-Stern setzen
		if(inEvent[0].published) {
			this.$.iconPublished.setSrc(this.publishedon);
		} else
		{
			this.$.iconPublished.setSrc(this.publishedoff);
		}
		//console.log("unread : " + inEvent[0].unread);
		//this.$.lblArticles.setContent((this.RecentArticleIndex + 1) + "/" + this.Articles.length);
		this.$.lblArticles1.setContent((this.RecentArticleIndex + 1));
		this.$.lblArticles2.setContent(this.Articles.length)
		this.$.articleTitleIcon.setSrc(this.ttrssIconPath + inEvent[0].feed_id + ".ico");
		//console.log(inEvent);
		this.resize();
		this.setLoadbar(false);
	},
	processGetFullArticleSuccess: function(inContent) {
		var inEvent = this.ArticleData[this.RecentArticleIndex];
		//console.log(inEvent);
		var TextHelp = "";
		//TextHelp = inEvent[0].title + "<br><br>" + inEvent[0].content;
		var timestamp = inEvent[0].updated;
		var pubDate = new Date(timestamp * 1000);
		var weekday = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
		var monthname = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
		var formattedDate = weekday[pubDate.getDay()] + ' '
				    + monthname[pubDate.getMonth()] + ' '
				    + pubDate.getDate() + ', ' + pubDate.getFullYear() + ' ' + pubDate.getHours() + ':' + format_number(pubDate.getMinutes(), 2, "0");
		//var pubDate = new Date(timestamp);
		//console.log(pubDate);
		this.$.articleViewTitle.setContent(html_entity_decode(inEvent[0].title));
		this.$.articleViewTitle2.setContent(html_entity_decode(inEvent[0].author) + " - " + formattedDate);
		this.$.articlePreviewScroller.setShowing(false);
		this.$.articleViewScroller.setShowing(true);
		this.$.articleView.call(this.ArticleURL[this.RecentArticleIndex], inContent);
		this.$.articleViewScroller.setScrollTop(0);
		this.$.articleViewScroller.setScrollLeft(0);

		//Checkbox ReadStatus setzen
		if (inEvent[0].unread) {
			this.$.chkArticleRead.setChecked(false);
			clearTimeout(this.MarkReadTimer);
			if (this.ttrssAutoMarkRead != '0') {
				this.MarkReadTimer = setTimeout(enyo.bind(this, "TimedMarkRead"), this.ttrssAutoMarkRead);
			};
		} else {
			this.$.chkArticleRead.setChecked(true);
		}

		//Favorite-Stern setzen
		if(inEvent[0].marked) {
			this.$.iconStarred.setSrc(this.staredon);
		} else {
			this.$.iconStarred.setSrc(this.staredoff);
		}
		//Publish-Stern setzen
		if(inEvent[0].published) {
			this.$.iconPublished.setSrc(this.publishedon);
		} else {
			this.$.iconPublished.setSrc(this.publishedoff);
		}
		//console.log("unread : " + inEvent[0].unread);
		//this.$.lblArticles.setContent((this.RecentArticleIndex + 1) + "/" + this.Articles.length);
		this.$.lblArticles1.setContent((this.RecentArticleIndex + 1));
		this.$.lblArticles2.setContent(this.Articles.length)
		this.$.articleTitleIcon.setSrc(this.ttrssIconPath + inEvent[0].feed_id + ".ico");
		//console.log(inEvent);
		this.resize();
		this.setLoadbar(false);
	},
	processGetArticleError: function(inEvent){
		console.log(inEvent);
		this.setLoadbar(false);
	},
	TimedMarkRead: function() {
		this.MarkArticleRead();
		this.$.chkArticleRead.setChecked(!0);
		clearTimeout(this.MarkReadTimer);
	},
	toggleArticleRead: function(inSender, inEvent) {
		var Readstate = this.$.chkArticleRead.getValue();
		if (Readstate) {
			this.MarkArticleRead();
		} else
		{
			this.MarkArticleUnread();
		};
		//console.log(Readstate + " " + RecentArticle);
		//this.$.result.setContent(inSender.name + " was " + (inSender.getValue() ? " selected." : "deselected."));
	},
	markreadbb10: function () {
		var Readstate = this.$.bb10btnread.src;
		if (Readstate == "assets/bb10readoff.png") {
			this.$.chkArticleRead.setValue(true);
			this.MarkArticleRead();
		} else
		{
			this.$.chkArticleRead.setValue(false);
			this.MarkArticleUnread();
		};
	},
	MarkArticleRead: function() {
		//als gelesen markieren
		ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], false,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
		this.ArticleUnread[this.RecentArticleIndex] = false;
		//this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("color", "#999999");
		this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("font-weight", "normal");
		this.$.articleRepeater.children[this.RecentArticleIndex].$.preview.applyStyle("color", "#999999");
		this.$.bb10btnread.setSrc("assets/bb10readon.png");
	},
	MarkArticleUnread: function() {
		//als ungelesen markieren
		ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], true,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
		this.ArticleUnread[this.RecentArticleIndex] = true;
		//this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("color", "#333333");
		this.$.articleRepeater.children[this.RecentArticleIndex].$.titel.applyStyle("font-weight", "bold");
		this.$.articleRepeater.children[this.RecentArticleIndex].$.preview.applyStyle("color", "#333333");
		this.$.bb10btnread.setSrc("assets/bb10readoff.png");
	},
	processMarkArticleReadSuccess: function(inEvent){
		//console.log(inEvent);
	},
	processMarkArticleReadError: function(inEvent){
		//console.log(inEvent);
	},
	toggleArticleStarred: function(inSender, inEvent) {
		console.log(this.staredon);
		if (this.$.iconStarred.src == this.staredoff) { //"assets/starred-footer.png") {
			//STARREN
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], true,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));
			this.$.iconStarred.setSrc(this.staredon);//"assets/bb10staron.png");//starred-footer-on.png");
		} else
		{
			//STAR entfernen
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], false,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));
			this.$.iconStarred.setSrc(this.staredoff);//"assets/bb10staroff.png");//starred-footer.png");
		}
	},
	toggleArticleStarredList: function(inSender, inEvent) {
		//console.log(inSender);

		if (this.ArticleStarred[inEvent.index]){
			//STAR entfernen
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[inEvent.index], false,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));
			this.ArticleStarred[inEvent.index] = false;
			inSender.setSrc("assets/starred-footer32.png");
		} else
		{
			//STARREN
			ttrssMarkArticleStarred(this.ttrssURL, this.ttrss_SID, this.ArticleID[inEvent.index], true,  enyo.bind(this, "processMarkArticleStarredSuccess"), enyo.bind(this, "processMarkArticleStarredError"));
			this.ArticleStarred[inEvent.index] = true;
			inSender.setSrc("assets/starred-footer32-on.png");
		}
	},
	processMarkArticleStarredSuccess: function(inEvent){
		//console.log(inEvent);
	},
	processMarkArticleStarredError: function(inEvent){
		//console.log(inEvent);
	},
	toggleArticlePublished: function(inSender, inEvent) {
		if (this.$.iconPublished.src == this.publishedoff) {
			//Publish
			console.log("PUBLISH");
			ttrssPublishArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], true,  enyo.bind(this, "processPublishArticleSuccess"), enyo.bind(this, "processPublishArticleError"));
			this.$.iconPublished.setSrc(this.publishedon);
		} else
		{
			//PuBublish
			console.log("UNPUBLISH");
			ttrssPublishArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], false,  enyo.bind(this, "processPublishArticleSuccess"), enyo.bind(this, "processPublishArticleError"));
			//ttrssPublishArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], false,  enyo.bind(this, "processPublishArticleSuccess"), enyo.bind(this, "processPulishArticleError"));
			this.$.iconPublished.setSrc(this.publishedoff);
		}
	},
	processPublishArticleSuccess: function(inEvent){
		//console.log(inEvent);
	},
	processPublishArticleError: function(inEvent){
		//console.log(inEvent);
	},
	setupCategories: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var categorylist = inEvent.item;
		if (typeof categorylist != "undefined") {
			if (index == this.currentCategoryIndex) {
				//categorylist.$.titel.applyStyle("color", "#333333");
				categorylist.$.titel.applyStyle("font-weight", "bold");
				categorylist.$.unread.applyStyle("font-weight", "bold");
			} else {
				//categorylist.$.titel.applyStyle("color", "#999999");
				categorylist.$.titel.applyStyle("font-weight", "normal");
				categorylist.$.unread.applyStyle("font-weight", "normal");
			}
			categorylist.$.titel.setContent(this.CategoryTitle[index]);
			categorylist.$.unread.setContent(this.CategoryUnread[index]);
		}
		this.resize();
		////////item.$.dauer.setContent(PCastsDuration[index]);
	},
	setupFeeds: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var feedlist = inEvent.item;
		if (index == this.currentFeedIndex) {
			//feedlist.$.titel.applyStyle("color", "#333333");
			feedlist.$.titel.applyStyle("font-weight", "bold");
			feedlist.$.unread.applyStyle("font-weight", "bold");
		} else {
			//feedlist.$.titel.applyStyle("color", "#999999");
			feedlist.$.titel.applyStyle("font-weight", "normal");
			feedlist.$.unread.applyStyle("font-weight", "normal");
		}
		if (this.FeedIcon[index]) {
			feedlist.$.icon.setSrc(this.ttrssIconPath + this.FeedID[index] + ".ico");
		}
		//feedlist.$.titel.setContent(this.FeedTitle[index] + " (" + this.FeedUnread[index] + ")");
		feedlist.$.unread.setContent(this.FeedUnread[index]);
		feedlist.$.titel.setContent(this.FeedTitle[index]);
		this.resize();
		if (( index + 1) == this.FeedID.length) {
			this.setLoadbar(false);
		};
		////////item.$.dauer.setContent(PCastsDuration[index]);

	},
	setupArticles: function(inSender, inEvent) {
		//console.log(inEvent.item);
		var index = inEvent.index;
		var item = inEvent.item;
		item.$.titel.setContent(this.Articles[index]);
		if (this.ArticleData.length > index) {
			var data = this.ArticleData[index];
			item.$.preview.setContent(stripHTML(html_entity_decode(data[0].content)));
			var timestamp = data[0].updated;
			var pubDate = new Date(timestamp * 1000);
			var weekday = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
			var monthname = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
			var formattedDate = weekday[pubDate.getDay()] + ' '
						+ monthname[pubDate.getMonth()] + ' '
						+ pubDate.getDate() + ', ' + pubDate.getFullYear() + ' ' + pubDate.getHours() + ':' + format_number(pubDate.getMinutes(), 2, "0");
			item.$.timestamp.setContent(formattedDate);
		}
		if (this.ArticleUnread[index]) {
			//item.$.titel.applyStyle("color", "#333333");
			item.$.titel.applyStyle("font-weight", "bold");
			item.$.preview.applyStyle("color", "#333333");
		} else {
			//item.$.titel.applyStyle("color", "#999999");
			item.$.titel.applyStyle("font-weight", "normal");
			item.$.preview.applyStyle("color", "#999999");
		};
		if (( index + 1) == this.Articles.length) {
			this.setLoadbar(false);
		};
		/* Too slow :(
		if (this.ArticleStarred[index]) {
			item.$.starredList.setSrc("assets/starred-footer32-on.png");
		} else {
			item.$.starredList.setSrc("assets/starred-footer32.png");
		}
		*/
	},
	clickCategory: function(inSender, inEvent) {
		this.selectCategory(inEvent.index);
	},
	selectCategory: function(index) {
		this.setLoadbar(true);
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
		this.setLoadbar(true);
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
		var getUnreadOnly = this.$.toggleFeedUnread.getValue();
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
	MarkFeedReadClick: function(inSender, inEvent) {
		switch (inEvent.originator.name) {
			case "current":
				var top = 0;
				var currentArticle = 0;
				for (var i=0; i<this.$.articleScroller.controlAtIndex(1).controls.length; i++) {
					top += this.$.articleScroller.controlAtIndex(1).controls[i].children[0].children[0].node.offsetHeight;
					currentArticle++;
					if (top > this.$.articleScroller.getScrollTop()) {
						break;
					}
				}
				for (var i=0; i<currentArticle; i++) {
					ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[i], false,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
					this.ArticleUnread[i] = false;
				}
				this.setLoadbar(true);
				this.selectFeed(this.currentFeedIndex);
				break;
			case "list":
				for (var i=0; i<this.ArticleID.length; i++) {
					ttrssMarkArticleRead(this.ttrssURL, this.ttrss_SID, this.ArticleID[i], false,  enyo.bind(this, "processMarkArticleReadSuccess"), enyo.bind(this, "processMarkArticleReadError"));
					this.ArticleUnread[i] = false;
				}
				this.setLoadbar(true);
				this.selectFeed(this.currentFeedIndex);
				this.getCategories();
				break;
			case "feed":
				ttrssCatchupFeed(this.ttrssURL, this.ttrss_SID, this.FeedID[this.currentFeedIndex], enyo.bind(this, "processMarkFeedReadSuccess"), enyo.bind(this, "processMarkFeedReadError"));
				break;
		};
		this.clickRefresh();
		this.$.viewPanels.setIndex(1);

		//als gelesen markieren

		//this.$.MarkFeedReadPopup.show();
	},
	MarkFeedRead: function(inEvent){
		ttrssCatchupFeed(this.ttrssURL, this.ttrss_SID, this.FeedID[this.currentFeedIndex], enyo.bind(this, "processMarkFeedReadSuccess"), enyo.bind(this, "processMarkFeedReadError"));
		this.$.MarkFeedReadPopup.hide();
	},
	processMarkFeedReadSuccess: function(inEvent) {
		console.error(enyo.json.stringify(inEvent));
		this.$.articleRepeater.setCount(0);
		this.$.articleScroller.setScrollTop(0);
		this.getCategories();
	},
	processMarkFeedReadError: function(inEvent) {
		console.error(enyo.json.stringify(inEvent));
	},
	MarkFeedReadClose: function(inEvent){
		this.$.MarkFeedReadPopup.hide();
	},
	UpdateFeedClick: function(inEvent) {
		this.setLoadbar(true);
		this.selectFeed(this.currentFeedIndex);
		//ttrssUpdateFeed(this.ttrssURL, this.ttrss_SID, this.FeedID[this.currentFeedIndex], enyo.bind(this, "processUpdateFeedSuccess"), enyo.bind(this, "processUpdateFeedError"));
	},
	FeedListPageUp: function(first) {
		var step = first ? window.innerHeight/10 : Math.min(Math.abs(this.startY - this.mouseY) / 4, window.innerHeight / 10);
		this.$.articleScroller.setScrollTop(this.$.articleScroller.getScrollTop() - step);
	},
	FeedListPageUpDown: function(inSender, inEvent) {
		this.startY = this.mouseY = inEvent.screenY;
		this.FeedListPageUp(true);
		if (!this.FeedListPageUpInterval) {
			this.FeedListPageUpInterval = setInterval(enyo.bind(this, "FeedListPageUp"), 200);
		}
		// page up? then ensure we cancel page down
		if (this.FeedListPageDownInterval) {
			clearInterval(this.FeedListPageDownInterval);
		}
		this.FeedListPageDownInterval = null;
	},
	FeedListPageUpUp: function(inSender, inEvent) {
		if (this.FeedListPageUpInterval) {
			clearInterval(this.FeedListPageUpInterval);
		}
		this.FeedListPageUpInterval = null;
	},
	FeedListPageDown: function(first) {
		var step = first ? window.innerHeight/10 : Math.min(Math.abs(this.startY - this.mouseY) / 4, window.innerHeight/10);
		//console.log("step " + step + " " + window.innerHeight/5 + " " + this.startY + " " + this.mouseY + " " + (this.startY - this.mouseY));
		this.$.articleScroller.setScrollTop(this.$.articleScroller.getScrollTop() + step);
	},
	FeedListPageDownDown: function(inSender, inEvent) {
		this.startY = this.mouseY = inEvent.screenY;
		this.FeedListPageDown(true);
		if (!this.FeedListPageDownInterval) {
			this.FeedListPageDownInterval = setInterval(enyo.bind(this, "FeedListPageDown"), 200);
		}
		// page down? then ensure we cancel page up
		if (this.FeedListPageUpInterval) {
			clearInterval(this.FeedListPageUpInterval);
		}
		this.FeedListPageUpInterval = null;
	},
	FeedListPageDownUp: function(inSender, inEvent) {
		if (this.FeedListPageDownInterval) {
			clearInterval(this.FeedListPageDownInterval);
		}
		this.FeedListPageDownInterval = null;
	},
	handleGlobalMouseUp: function(inSender, inEvent) {
		if (this.FeedListPageDownInterval) {
			clearInterval(this.FeedListPageDownInterval);
		}
		this.FeedListPageDownInterval = null;
		if (this.FeedListPageUpInterval) {
			clearInterval(this.FeedListPageUpInterval);
		}
		this.FeedListPageUpInterval = null;
	},
	handleGlobalMouseDown: function(inSender, inEvent) {
		this.mouseY = inEvent.screenY;
	},
	handleGlobalMouseMove: function(inSender, inEvent) {
		this.mouseY = inEvent.screenY;
	},
	processUpdateFeedSuccess: function(inEvent) {
		console.log(inEvent);
		this.selectFeed(this.currentFeedIndex);
	},
	processUpdateFeedError: function(inEvent) {
		console.error(inEvent);
	},
	holdItem: function(inSender, inEvent){
		//Show only article view to be able to use swipe for previous article
		if ((window.innerWidth < 1024) && (this.ViewMode == 0)) {
			this.$.viewPanels.setIndex(3);
			this.$.left2.setShowing(false);
			this.$.middle.setShowing(false);
			if (gblBB10) {
				this.$.btnUnlockPanels.setShowing(false);
			} else {
				this.$.btnUnlockPanels.setShowing(true);	
			};
			this.$.btnPrevArticle.setShowing(false);
			this.$.btnNextArticle.setShowing(false);
			this.$.grabberArticleView.setShowing(false);
			this.$.viewPanels.setDraggable(false);
			this.clickItem(" ", inEvent);
			this.resize();
		};
	},
	enablePanels: function(inSender, inEvent){
		console.log("ENABLE Panels");
		this.UpdateFeedClick();
		this.$.left2.setShowing(true);
		this.$.middle.setShowing(true);
		this.$.btnUnlockPanels.setShowing(false);
		this.$.btnPrevArticle.setShowing(true);
		this.$.btnNextArticle.setShowing(true);
		this.$.grabberArticleView.setShowing(true);
		this.$.viewPanels.setIndex(2);
		this.resize();
		this.$.viewPanels.setDraggable(true);
	},
	clickItem: function(inSender, inEvent){
		//console.log(inEvent);
		//console.log(ArticleID[inEvent.index] + " - " + Articles[inEvent.index]);
		this.RecentArticleIndex = inEvent.index;
		if (this.ViewMode == "1") {
			// no content preview
			var FullArticelURL = this.ArticleURL[this.RecentArticleIndex];
			window.open(FullArticelURL);
			this.MarkArticleRead();
			return;
		} else if (this.ViewMode == "2") {
			// content preview
			this.setLoadbar(true);
			ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"));
		} else {
			// classic feed title / feed content structure
			this.setLoadbar(true);
			if ((window.innerWidth < 1024) && (this.AutoLockPanels)) {
				this.$.viewPanels.setIndex(3);
				this.$.left2.setShowing(false);
				this.$.middle.setShowing(false);
				if (gblBB10) {
					this.$.btnUnlockPanels.setShowing(false);
				} else {
					this.$.btnUnlockPanels.setShowing(true);	
				};
				this.$.btnPrevArticle.setShowing(false);
				this.$.btnNextArticle.setShowing(false);
				this.$.grabberArticleView.setShowing(false);
				this.$.viewPanels.setDraggable(false);
				this.resize();
			};
			ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[inEvent.index], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
		}
		if (window.innerWidth < 1024) {
			this.$.viewPanels.setIndex(3);
		} else {
			this.$.viewPanels.setIndex(2);
		}
	},
	openArticle: function(inSender, inEvent){
		var FullArticelURL = this.ArticleURL[this.RecentArticleIndex];
        if (FullArticelURL.indexOf("www.zeit.de") > 0) {
            FullArticelURL = FullArticelURL.replace("www.zeit.de", "mobil.zeit.de");   
        }
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
		if ((this.RecentArticleIndex == 0)) {
			this.UpdateFeedClick();
			this.enablePanels();
		}
		if (this.RecentArticleIndex >= 1){
			this.setLoadbar(true);
			this.RecentArticleIndex = this.RecentArticleIndex - 1;
			if (this.ViewMode != "0") {
				ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			} else {
				ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			}
		};
		//console.log(RecentArticleIndex);
	},
	nextArticle: function(inSender, inEvent){
		if (this.RecentArticleIndex < (this.Articles.length - 1) ){
			this.setLoadbar(true);
			this.RecentArticleIndex = this.RecentArticleIndex + 1;
			//console.log(RecentArticleIndex);
			if (this.ViewMode != "0") {
				ttrssGetFullArticle(this.ArticleURL[this.RecentArticleIndex], enyo.bind(this, "processGetFullArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			} else {
				ttrssGetArticle(this.ttrssURL, this.ttrss_SID, this.ArticleID[this.RecentArticleIndex], enyo.bind(this, "processGetArticleSuccess"), enyo.bind(this, "processGetArticleError"));
			}
		} else {
			this.vibrate();
		};
	},
	shareArticle: function(inSender, inEvent){
		var ShareUrl = this.ArticleURL[this.RecentArticleIndex];
        if (ShareUrl.indexOf("www.zeit.de") > 0) {
            ShareUrl = ShareUrl.replace("www.zeit.de", "mobil.zeit.de");   
        }
		ShareText = this.ArticleData[this.RecentArticleIndex][0].title;
		switch (inEvent.originator.content) {
			case "Twitter":

				//console.log(this.ArticleData[this.RecentArticleIndex][0].title);
				window.open("http://www.twitter.com/share?text=" + "Via%20%23ttrssenyo:%20'" + ShareText + "'&url=" + ShareUrl);
				break;
			case "Facebook":
				//window.open("http://www.facebook.com/sharer/sharer.php?u=" + PCastsUrl[PCMerker.index] + "&t=Interessanter%20Podcast");
				window.open("http://www.facebook.com/sharer/sharer.php?u=" + ShareUrl); //+ "&i=http://cdn.detektor.fm/assets/bilder/detektor-fm-webradio.png" );
				//http://cdn.detektor.fm/assets/bilder/detektor-fm-webradio.png
				break;
			case "G+":
				window.open("https://m.google.com/app/plus/x/?v=compose&content=" + ShareText + "%20" + ShareUrl); // + "%20via%20%23ttrssenyo");
				break;
			case "App.net":
				window.open("https://alpha.app.net/intent/post?text=" + ShareText + "%20" + ShareUrl + "%20via%20%23ttrssenyo");
				break;
            case "Instapaper":
                window.open("https://www.instapaper.com/api/add?username="+ this.instapaperUser + "&password=" + this.instapaperPW + "&redirect=close&url=" + ShareUrl);
                break;
		};

	},
	shareArticlebb10: function(inSender, inEvent){
		var ShareUrl = this.ArticleURL[this.RecentArticleIndex];
		ShareText = this.ArticleData[this.RecentArticleIndex][0].title;
		var request = {
		  action: 'bb.action.SHARE',
		  mimeType: "text/plain",		
		  // for a file
		  uri: ShareUrl,
		  // for text you'd use 'data'
		  data: ShareText + " " + ShareUrl + " via #ttrssenyo",
		
		  target_type: ["APPLICATION", "VIEWER", "CARD"]
		};
		blackberry.invoke.card.invokeTargetPicker(request, "Share",
		
		    // success callback
		    function() {
			console.log('success');
		    },
		
		    // error callback
		    function(e) {
			console.log('error: ' + e);
		    }
		);		
	},	
	handleKeyDown: function(inSender, inEvent){
		//console.error("KeyDown: " + inEvent.keyIdentifier + "-" + inEvent.keyCode+".");
		var KeyCode = inEvent.keyCode;

		switch (KeyCode) {
			case 27:// Backgesture abfangen
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
				break;
			case 37: // Left
				if (this.$.viewPanels.getIndex(1)) {
					this.prevArticle();
				};			    ;
				break;
			case 38: // Up
				switch (this.$.viewPanels.getIndex()) {
					case 2:
						//this.$.articleScroller.scrollTo(0, (this.$.articleScroller.getScrollBounds().top)  - 100);
						this.$.articleViewScroller.scrollTo(0, (this.$.articleViewScroller.getScrollBounds().top)  - 100);
						break;
					case 3:
						this.$.articleViewScroller.scrollTo(0, (this.$.articleViewScroller.getScrollBounds().top)  - 100);
						break;
				};		    ;
				break;
			case 39: // Right - next
				if (this.$.viewPanels.getIndex(1)) {
					this.nextArticle();
				};			    ;
				break;
			case 40: // Down
				switch (this.$.viewPanels.getIndex()) {
					case 2:
						//this.$.articleScroller.scrollTo(0, (this.$.articleScroller.getScrollBounds().top)  + 100);
						this.$.articleViewScroller.scrollTo(0, (this.$.articleViewScroller.getScrollBounds().top)  + 100);
						break;
					case 3:
						this.$.articleViewScroller.scrollTo(0, (this.$.articleViewScroller.getScrollBounds().top)  + 100);
						break;
				};
				break;
			case 74: // J
				if (this.$.viewPanels.getIndex(1)) {
					this.prevArticle();
				};			    ;
				break;
			case 75: // K - next
				if (this.$.viewPanels.getIndex(1)) {
					this.nextArticle();
				};			    ;
				break;
		};
		return ;
		if (KeyCode == 27) {

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
	AutoLoadChanged: function(inSender, inEvent){
		if (inSender == this.$.autoLoadAllArticles) {
			if (inSender.getValue()) {
				this.$.autoLoadFirstFeed.setValue(false);
			}
		};
		if (inSender == this.$.autoLoadFirstFeed) {
			if (inSender.getValue()) {
				this.$.autoLoadAllArticles.setValue(false);
			}
		}
	},
	titleDragStart: function(inSender, inEvent){
		//Remember Panel Index to prevent Article swiching when draggin form 2 to 3!
		this.dragStartPanelIndex = this.$.viewPanels.getIndex();
		//console.log("DRAGSTART");
	},
	titleDragFinish: function(inSender, inEvent){
		console.log("DRAGSTOP " + inEvent.dx);
		this.resize();
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
			  if (this.$.btnUnlockPanels.getShowing()) {
				this.prevArticle();
				//this.$.viewPanels.setIndex(3);
			  };
			  if (this.$.bb10articleviewgrabber.getShowing()) {
				this.prevArticle();
				//this.$.viewPanels.setIndex(3);
			  }			  
		  }
		  this.resize();
	},
	bb10backmain: function (){
		this.$.viewPanels.setIndex(1);
	},
	setLoadbar: function (status){
		if (status) {
			this.$.loadbar.setShowing(true);
			this.$.loadbarBlank.setShowing(false);
			//console.log("TRUE");
		} else {
			this.$.loadbar.setShowing(false);
			this.$.loadbarBlank.setShowing(true);
			//console.log("FALSE");
		}
	},
	vibrate: function (){
		//BB10
		if (gblBB10) {		
			navigator.vibrate(100);
		};
	}
});
