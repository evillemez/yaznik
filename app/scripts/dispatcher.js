'use strict';

function Dispatcher(window, widgetId) {
    this.window = window;
    this.widgetId = widgetId;
    this.targetWindow = null;
    this.targetOrigin = null;
    this.listeners = {};
    
    //no, I don't understand why I have to do this.  Javascript: wtf, seriously?!
    var dispatcher = this;
    this.window.addEventListener('message', function(event) { dispatcher.handleWindowEvent(event); }, false);
}

Dispatcher.prototype.handleWindowEvent = function(event, dispatcher) {
    switch (event.data.event) {
        case 'yaznik.dispatcher.init' : this.onInitialize(event); break;
        case 'yaznik.dispatcher.config.set' : this.onConfigSet(event); break;
        default : this.handleWidgetEvent(event); break;
    }
};

Dispatcher.prototype.onInitialize = function(event) {
    this.targetWindow = event.source;
    this.targetOrigin = event.origin;
    
    //widget needs to know about the init event
    this.handleWidgetEvent(event);
};

Dispatcher.prototype.handleWidgetEvent = function(event) {
    var eventName = event.data.event;
    if (this.listeners[eventName]) {
        for (var index in this.listeners[eventName]) {
            var cb = this.listeners[eventName][index];
            cb(event.data);
        }
    }
};

Dispatcher.prototype.onConfigSet = function(event) {
    // body...
};

Dispatcher.prototype.dispatch = function(eventName, data) {
    if (this.targetWindow) {
        var eventData = {
            event: eventName,
            data: data,
            from: this.widgetId
        }
        
        this.targetWindow.postMessage(eventData, this.targetOrigin);
    }
};

Dispatcher.prototype.on = function(eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(callback);
};

Dispatcher.prototype.set = function(key, val) {
    // body...
};

Dispatcher.prototype.get = function(key, callback) {
    // body...
};
