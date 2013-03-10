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

/* Some raw jquery for intro animation */
$(document).ready(function() {
    $('body').hide().fadeIn('fast');
});

/* Angular module for this app */
angular.module('YaznikAuthWidget', [])
    .value('iFrameStyles', iFrameStyles)
	.factory('dispatcher', function() {
        var dispatcher = new Dispatcher(window, 'yazAuth');
        return dispatcher;
	})
	.controller('AuthController', function($scope, dispatcher) {
        
        $scope.cancel = function() {
            dispatcher.dispatch('yaznik.user', {name: "Anonymous"});
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
        
        dispatcher.on('yaznik.dispatcher.init', function() {
            dispatcher.dispatch('yaznik.user', {name: 'Evan'});
        });
        
        /* listen for things from other widgets */
        
        //stuff here
    })
;
