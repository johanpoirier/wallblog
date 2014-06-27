Wallblog.TextArea = Ember.TextArea.extend(Ember.ViewTargetActionSupport, {
    click: function() {
        this.triggerAction({
            action: 'expand',
            target: this.get('parentView')
        });
    }
});

Wallblog.TextArea.reopen(Ember.I18n.TranslateableAttributes);