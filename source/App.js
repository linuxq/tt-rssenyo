enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Hello World"},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "main", classes: "nice-padding", allowHtml: true}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Tap me", ontap: "helloWorldTap"}
		]},
		{kind: "WebService", name:"wslogin", url: "http://rss.meissel.com/api", onResponse:"wsloginResponse", callbackName: "callback"},
	],
	helloWorldTap: function(inSender, inEvent) {
		//this.$.main.addContent("The button was tapped.<br/>");
		

		var data = {
		  op: "login",
		  user: "webosmz",
		  password : "IchWillLesen"
		};
		

		var request = new enyo.Ajax({
			url: "http://rss.meissel.com/api",
			method: "POST",
			handleAs: "json",
			postBody: JSON.stringify(data) //formData
		});
		request.response(enyo.bind(this, "wsloginResponse"));
		//request.error(this, "processSetTimerError");
		console.log("GO");
		request.go(); 		
	},
	wsloginResponse: function(inSender, inEvent){
		console.log(inEvent);
		data = inEvent;
		if (data.status == 0){
			this.$.main.setContent("OK: Session-ID "  + data.content.session_id);	
		} else {
			this.$.main.setContent("Fehler: "  + data.content.error);	
		}
	}
});
