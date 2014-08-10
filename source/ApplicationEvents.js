//* @public

/**
	Events that have no explicit target flow to instances of this component.

	Create an ApplicationEvents wherever you want to handle these global events.
	Note that a global event will flow to all instances of ApplicationEvents, so
	application code will need to handle conflicts.

	Example: 

		...
		components: [
			{kind: "ApplicationEvents", onWindowRotated: "windowRotated"}
		...
		],
		...
		windowRotated: function(inSender) {
			// do work when orientation changes
		}
*/
enyo.kind({
	name: "enyo.ApplicationEvents",
	kind: enyo.Component,
	events: {
		//* sent after window has completed loading
		onLoad: '',
		//* sent when window is closed
		onUnload: '',
		//* sent when the window cannot be loaded properly
		onError: '',
		//* sent when user brings window to the front
		onWindowActivated: '',
		//* sent when user leaves the window
		onWindowDeactivated: '',
		/** sent when window parameters are changed via <a href="#enyo.windows">enyo.windows</a> methods 
		    _activateWindow_ or _setWindowParams_ */
		onWindowParamsChange: '',
		//* sent when the application has been relaunched by the system manager
		onApplicationRelaunch: '',
		//* sent when user rotates device
		onWindowRotated: '',
		//* sent when user taps on app menu area or hits the app menu key (ctrl+tilde) on desktop
		onOpenAppMenu: '',
		//* sent when the app menu is dismissed
		onCloseAppMenu: '',
		//* @protected
		//* sent when a "keepAlive" app window is hidden
		onWindowHidden: '',
		//* sent when a "keepAlive" app window is shown
		onWindowShown: '',
		//* @public
		//* sent for DOM keyup event
		onKeyup: '',
		//* sent for DOM keydown event
		onKeydown: '',
		//* sent for DOM keypress event
		onKeypress: '',
		//* send when user makes a back gesture or hits ESC key
		onBack: '',
		/**
		send when keyboard state has changed:

		- params
			- showing
				- `true` when keyboard is *going to be* shown (before resize)
				- `false` when keyboard *has been* hidden (after resize)
		*/
		onKeyboardShown: ''
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		enyo.dispatcher.rootHandler.addListener(this);
		window.addEventListener('unload', this.dispatchDomEvent.bind(this));
		window.addEventListener('load', this.dispatchDomEvent.bind(this));
		window.addEventListener('resize', this.dispatchDomEvent.bind(this));
		window.addEventListener('message', this.dispatchDomEvent.bind(this));
	},
	destroy: function() {
		enyo.dispatcher.rootHandler.removeListener(this);
		this.inherited(arguments);
	},
	dispatchDomEvent: function(e) {
		//this.log('on' + enyo.cap(e.type));
		return this.bubble('on' + enyo.cap(e.type), arguments);
	}
});



//* @protected
// experimental

// FIXME: should be a Component
enyo.dispatcher.rootHandler = {
	// ensures events handled by the rootHandler receive no special gesture treatment
	requiresDomMousedown: true,
	listeners: [],
	addListener: function(inListener) {
		this.listeners.push(inListener);
	},
	removeListener: function(inListener) {
		enyo.remove(inListener, this.listeners);
	},
	dispatchDomEvent: function(e) {
		// note some root events should be dispatched to all controls via enyo master
		// avoid propagating resize to listeners
		if (e.type == "resize") {
			this.broadcastMessage("resize");
			return;
		}
		// send an "autoHide" message when window hides or deactivates
		if (e.type == "windowDeactivated" || e.type == "windowHidden") {
			this.broadcastMessage("autoHide");
		}
		return this.broadcastEvent(e);
	},
	// messages go to enyo master.
	broadcastMessage: function(inMessage) {
		for (var n in enyo.master.$) {
			//console.log("broadcasting message", inMessage, "to", n);
			enyo.master.$[n].broadcastMessage(inMessage);
		}
	},
	// events go to listeners.
	broadcastEvent: function(e) {
		var r = false;
		for (var i=0, l; l=this.listeners[i]; i++) {
			// if any of the listeners return true to this event, return
			// true to the originator of the event. this is due to
			// the Mojo.relaunch api where if we don't return true, it
			// will focus the first app card. we may want a different api
			// to handle this in the future.
			r = l.dispatchDomEvent(e) || r;
		}
		return r;
	},
	// FIXME: we are implementing a subset of Component interface in an adhoc manner.
	// This much of the interface is required.
	isDescendantOf: function() {
		return false;
	}
};