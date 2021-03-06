﻿define([
    'foreground/eventAggregator',
    'foreground/view/prompt/clearStreamPromptView',
    'foreground/view/clearStreamView',
    'foreground/view/prompt/saveSongsPromptView'
], function (EventAggregator, ClearStreamPromptView, ClearStreamView, SaveSongsPromptView) {

    var Settings = chrome.extension.getBackgroundPage().Settings;
    var StreamItems = chrome.extension.getBackgroundPage().StreamItems;

    var StreamAction = Backbone.Model.extend({
        clearStream: function () {

            if (StreamItems.length > 0) {
                //  TODO: Maybe the prompt itself should know this.
                var remindClearStream = Settings.get('remindClearStream');

                if (remindClearStream) {
                    EventAggregator.trigger('showPrompt', new ClearStreamPromptView());
                } else {
                    StreamItems.clear();
                }
            }

        },
        
        saveStream: function() {
            if (StreamItems.length > 0) {
                EventAggregator.trigger('showPrompt', new SaveSongsPromptView({
                    songs: StreamItems.pluck('song')
                }));
            }
        }
    });

    return new StreamAction();
});