'use strict';

var source = 'http://localhost:80/';

//styles to set for the iframe containing this widget
var iFrameStyles = {
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    position: 'fixed',
    zIndex: '9999998',
    backgroundColor: 'transparent'
};

var anonUser = {
    name: 'Anonymous',
    authenticated: false
};

/* Some raw jquery for intro animation */
$(document).ready(function() {
    $('body').fadeIn('fast');
});

/* Angular module for this app */
angular.module('YaznikAuthWidget', ['ngCookies'])
    .value('iFrameStyles', iFrameStyles)
    .value('anonUser', anonUser)
	.factory('dispatcher', function() {
        var dispatcher = new Dispatcher(window, 'yazAuth');
        return dispatcher;
	})
    .factory('user', function($cookieStore) {
	    return $cookieStore.get('user') || anonUser;
	})
	.controller('AuthController', function($scope, $cookieStore, user, anonUser, dispatcher) {
                
        $scope.user = user;
        
        $scope.signin = function() {
            $scope.user.authenticated = true;
            
            $cookieStore.put('user', $scope.user);
            dispatcher.set('yaznik.user', $scope.user);
            dispatcher.dispatch('yaznik.user', $scope.user);

            dispatcher.unloadWidget('yazAuth');
        };
        
        $scope.signout = function() {
            $scope.user = anonUser;
            
            $cookieStore.put('user', $scope.user);
            dispatcher.set('yaznik.user', $scope.user);
            dispatcher.dispatch('yaznik.user', $scope.user);

            dispatcher.unloadWidget('yazAuth');
        };
        
        $scope.cancel = function() {
            dispatcher.unloadWidget('yazAuth');
        };
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
