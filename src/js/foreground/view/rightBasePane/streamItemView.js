﻿define([
    'common/enum/listItemType',
    'common/model/utility',
    'foreground/collection/contextMenuItems',
    'foreground/view/deleteButtonView',
    'foreground/view/multiSelectListItemView',
    'foreground/view/saveToPlaylistButtonView',
    'foreground/view/playInStreamButtonView',
    'text!template/listItem.html'
], function (ListItemType, Utility, ContextMenuItems, DeleteButtonView, MultiSelectListItemView, SaveToPlaylistButtonView, PlayInStreamButtonView, ListItemTemplate) {
    'use strict';

    var Playlists = chrome.extension.getBackgroundPage().Playlists;
    var StreamItems = chrome.extension.getBackgroundPage().StreamItems;
    var Player = chrome.extension.getBackgroundPage().YouTubePlayer;
    var User = chrome.extension.getBackgroundPage().User;
    var PlayPauseButton = chrome.extension.getBackgroundPage().PlayPauseButton;

    var StreamItemView = MultiSelectListItemView.extend({

        className: MultiSelectListItemView.prototype.className + ' stream-item',

        template: _.template(ListItemTemplate),

        attributes: function () {
            return {
                'data-id': this.model.get('id'),
                'data-type': ListItemType.StreamItem
            };
        },
        
        events: _.extend({}, MultiSelectListItemView.prototype.events, {
            'dblclick': 'activateOrToggleState'
        }),
        
        modelEvents: _.extend({}, MultiSelectListItemView.prototype.modelEvents, {
            'change:active': 'setActiveClass'
        }),
        
        buttonViews: [PlayInStreamButtonView, SaveToPlaylistButtonView, DeleteButtonView],

        onShow: function () {
            //  If the stream item is active -- ensure it is instantly visible.
            if (this.model.get('active')) {
                //  Pass 0 into scrollIntoView to have no animation/show instantly.
                this.$el.scrollIntoView(0);
            }
        },

        onRender: function () {
            this.setActiveClass();
     
            MultiSelectListItemView.prototype.onRender.apply(this, arguments);
        },

        activateOrToggleState: function () {
            if (!this.model.get('active')) {
                this.model.set('active', true);
            } else {
                PlayPauseButton.tryTogglePlayerState();
            }
        },

        //  Force the view to reflect the model's active class. It's important to do this here, and not through render always, because
        //  render will cause the lazy-loaded image to be reset.
        setActiveClass: function () {
            var active = this.model.get('active');
            this.$el.toggleClass('active', active);

            if (active) {
                this.$el.scrollIntoView();
            }
        },

        showContextMenu: function (event) {

            //  Whenever a context menu is shown -- set preventDefault to true to let foreground know to not reset the context menu.
            event.preventDefault();
            var self = this;

            var userSignedIn = User.get('signedIn');

            var activePlaylist = Playlists.getActivePlaylist();
            var areadyExists = false;

            if (userSignedIn) {
                areadyExists = activePlaylist.get('items').hasSong(self.model.get('song'));
            }

            var saveTitle = '';

            if (userSignedIn && areadyExists) {
                saveTitle = chrome.i18n.getMessage('duplicatesNotAllowed');
            } else if (!userSignedIn) {
                saveTitle = chrome.i18n.getMessage('cantSaveNotSignedIn');
            }

            ContextMenuItems.reset([{
                    text: chrome.i18n.getMessage('save'),
                    title: saveTitle,
                    disabled: !userSignedIn || areadyExists,
                    onClick: function () {
                        activePlaylist.addSongs(self.model.get('song'));
                    }
                }, {
                    text: chrome.i18n.getMessage('copyUrl'),
                    onClick: function () {

                        chrome.extension.sendMessage({
                            method: 'copy',
                            text: self.model.get('song').get('url')
                        });

                    }
                }, {
                    text: chrome.i18n.getMessage('copyTitleAndUrl'),
                    onClick: function() {

                        chrome.extension.sendMessage({
                            method: 'copy',
                            text: '"' + self.model.get('title') + '" - ' + self.model.get('song').get('url')
                        });

                    }
                }, {
                    text: chrome.i18n.getMessage('delete'),
                    onClick: function () {
                        self.model.destroy();
                    }
                }, {
                    text: chrome.i18n.getMessage('banUntilClear'),
                    disabled: StreamItems.getRelatedSongs().length < 5,
                    onClick: function () {
                        StreamItems.ban(self.model);
                        self.model.destroy();
                    }
                }, {
                    text: chrome.i18n.getMessage('watchOnYouTube'),
                    onClick: function () {
     
                        var url = self.model.get('song').get('url');
                        if (Player.get('loadedSongId') === self.model.get('song').get('id')) {
                            url += '?t=' + Player.get('currentTime') + 's';
                        }
                        
                        chrome.tabs.create({
                            url:  url
                        });

                        Player.pause();
                      }
                  }]
            );

        }
    });

    return StreamItemView;
});
