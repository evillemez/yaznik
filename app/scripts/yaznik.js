'use strict';

//setup namespace and initial configt
var Yaznik = Yaznik || {
    INITIALIZED: false
};

//hard code some config
Yaznik.config = {
    widgets: {
        'yazToolbar': 'http://localhost/yaznik/app/widgets/toolbar/index.html'
//        ,'yazGlosser': 'http://localhost/yaznik/app/widgets/glosser/index.html',
        ,'yazAuth': 'http://localhost/yaznik/app/widgets/auth/index.html'
    }
};

//the Yaznik loader - will only initialize once.
Yaznik.Loader = function(config) {
    this.config = config;
    this.loadedWidgets = {};
};

Yaznik.Loader.prototype.onWindowMessage = function(event) {
    //validate event, if it's ours
    if (event.origin !== 'http://localhost') {
        return;
    }
    
    var name = event.data.event;
    var data = event.data.data;
    
    switch (name) {
        case 'yaznik.widget.init' : this.handleWidgetInit(event.data); break;
        case 'yaznik.widget.styles' : this.handleWidgetStyle(event.data); break;
        case 'yaznik.widget.load' : this.onWidgetLoad(event); break;
        case 'yaznik.widget.unload' : this.onWidgetUnload(event); break;
        case 'yaznik.unload' : this.unload(); break;
        default : this.relayEventToWidgets(event); break;
    }
};

Yaznik.Loader.prototype.init = function() {
    var loader = this;
    
    if (!Yaznik.INITIALIZED) {
        window.addEventListener('message', function(event) { loader.onWindowMessage(event); });
        
        this.loadWidget('yazToolbar');
        
        Yaznik.INITIALIZED = true;
    }
};

Yaznik.Loader.prototype.handleWidgetInit = function(data) {
};

Yaznik.Loader.prototype.onWidgetLoad = function(event) {
    this.loadWidget(event.data.data.widget);
};

Yaznik.Loader.prototype.onWidgetUnload = function(event) {
    this.unloadWidget(event.data.data.widget);
};

Yaznik.Loader.prototype.handleWidgetStyle = function(data) {
    var iframe = this.loadedWidgets[data.from];
    var styles = data.data.styles;
    for (var key in styles) {
        iframe.style[key] = styles[key];
    }
};

Yaznik.Loader.prototype.relayEventToWidgets = function(event) {
    for (var key in this.loadedWidgets) {
        if (key !== event.data.from) {
            this.loadedWidgets[key].contentWindow.postMessage(event.data, 'http://localhost:80/');
        }
    }
};

Yaznik.Loader.prototype.loadWidget = function(name) {
    if (this.config.widgets[name]) {
        var widget = document.createElement('iframe');
        widget.id = name;
        widget.className = 'yaznik-widget';
        widget.frameBorder = 0;
        widget.setAttribute('allowtransparency', 'true');
        widget.onload = function() {
            widget.contentWindow.postMessage({event: 'yaznik.dispatcher.init'}, 'http://localhost:80/');
        };
        widget.src = this.config.widgets[name];
        document.getElementsByTagName('body')[0].appendChild(widget);
        widget.setAttribute('allowtransparency', 'true');

        this.loadedWidgets[name] = widget;
    }
};

Yaznik.Loader.prototype.unloadWidget = function(name) {
    var body = document.getElementsByTagName('body')[0];
    body.removeChild(this.loadedWidgets[name]);
};


Yaznik.Loader.prototype.broadcast = function(eventName, data) {
    // body...
};

Yaznik.Loader.prototype.unload = function() {
    for (var id in this.loadedWidgets) {
        this.unloadWidget(id);
    }
    
    Yaznik.INITIALIZED = false;
    Yaznik.yaz = null;
    delete window.__z;
};

//initialize and run the damn thing
if (!Yaznik.yaz) {
    Yaznik.yaz = new Yaznik.Loader(Yaznik.config);
    Yaznik.yaz.init();
}
