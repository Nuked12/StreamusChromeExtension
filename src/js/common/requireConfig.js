﻿define(function () {

    require.config({

        baseUrl: 'js/',

        enforceDefine: true,

        paths: {

            //  Paths:
            'template': '../template',

            //  Third Party:
            'async': 'thirdParty/async',
            'boot': 'thirdParty/boot',
            'backbone.babysitter': 'thirdParty/backbone.babysitter',
            'backbone': 'thirdParty/backbone',
            'backbone.marionette': 'thirdParty/backbone.marionette',
            'backbone.wreqr': 'thirdParty/backbone.wreqr',
            'googleAnalytics': 'thirdParty/googleAnalytics',
            'jasmine': 'thirdParty/jasmine',
            'jasmine-html': 'thirdParty/jasmine-html',
            'jquery.hoverIntent': 'thirdParty/jquery.hoverIntent',
            'jquery': 'thirdParty/jquery',
            'jquery.qtip': 'thirdParty/jquery.qtip',
            'jquery.scrollIntoView': 'thirdParty/jquery.scrollIntoView',
            'jquery.transit': 'thirdParty/jquery.transit',
            'jqueryUi': 'thirdParty/jqueryUi',
            'keymaster': 'thirdParty/keymaster',
            'less': 'thirdParty/less',
            'lodash': 'thirdParty/lodash',
            'microplugin': 'thirdParty/microplugin',
            'selectize': 'thirdParty/selectize',
            'sifter': 'thirdParty/sifter',
            'text': 'thirdParty/text'
        },

        shim: {

            'backbone': {
                //  These script dependencies should be loaded before loading backbone.js
                deps: ['lodash', 'jquery'],
                //  Once loaded, use the global 'Backbone' as the module value.
                exports: 'Backbone'
            },
            'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            },
            'googleAnalytics': {
                deps: ['jquery'],
                exports: '_gaq'
            },
            'jasmine': {
                exports: 'window.jasmineRequire'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            },
            'jquery.hoverIntent': {
                deps: ['jquery'],
                exports: '$.fn.hoverIntent'
            },
            'jquery.scrollIntoView': {
                deps: ['jquery'],
                exports: '$.fn.scrollIntoView'
            },
            'jquery.transit': {
                deps: ['jquery'],
                exports: '$.transit'
            },
            'jqueryUi': {
                deps: ['jquery'],
                exports: '$.ui'
            },
            'keymaster': {
                exports: 'window.key'
            },
            'less': {
                exports: 'window.less'
            }

        }

    });
});