'use strict';

var source = 'http://localhost:80/';

//styles to set for the iframe containing this widget
var iFrameStyles = {
    bottom: '0px',
    left: '0px',
    width: '100%',
    height: '60px',
    position: 'fixed',
    zIndex: '10005'
};

angular.module('YaznikToolbarWidget', [])
    .value('iFrameStyles', iFrameStyles)
	.factory('dispatcher', function() {
        var dispatcher = new Dispatcher(window, 'yazToolbar');
        return dispatcher;
	})
	.controller('ToolbarController', function($scope, dispatcher) {
	    $scope.user = {
	        name: 'Anonymous',
            authenticated: false
	    };
        
        $scope.login = function() {
            dispatcher.loadWidget('yaznik.auth');
        };
        
        $scope.exit = function() {
            dispatcher.dispatch('yaznik.unload');
        };
        
        /* use cross-window dispatcher to be aware of changes */
        
        dispatcher.on('yaznik.user', function(e) {
            $scope.user = e.user;
        });
	})
    .run(function(dispatcher, iFrameStyles) {

        /* register callback to register once dispatcher has connection to parent  */
        dispatcher.on('yaznik.dispatcher.init', function() {
            dispatcher.dispatch('yaznik.widget.styles', {
                styles: iFrameStyles
            });
        });
        
        /* listen for things from other widgets */
        
        //stuff here
    })
;
