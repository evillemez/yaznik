'use strict';

var source = 'http://localhost:80/';

//styles to set for the iframe containing this widget
var iFrameStyles = {
    bottom: '0px',
    left: '0px',
    width: '100%',
    height: '60px',
    position: 'fixed',
    zIndex: '9999999'
};

var anonUser = {
    name: 'Anonymous',
    authenticated: false
};

angular.module('YaznikToolbarWidget', ['ngCookies'])
    .value('iFrameStyles', iFrameStyles)
	.factory('dispatcher', function() {
        var dispatcher = new Dispatcher(window, 'yazToolbar');
        return dispatcher;
	})
    .factory('user', function($cookieStore) {
	    return $cookieStore.get('user') || anonUser;
    })
	.controller('ToolbarController', function($scope, user, dispatcher) {
	    $scope.user = user;
        
        $scope.login = function() {
            dispatcher.loadWidget('yazAuth');
        };
        
        $scope.exit = function() {
            dispatcher.dispatch('yaznik.unload');
        };
        
        /* use cross-window dispatcher to be aware of changes */
        
        dispatcher.on('yaznik.user', function(user) {
            $scope.$apply(function() {
                $scope.user = user;
            });
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
