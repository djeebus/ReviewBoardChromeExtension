var reviewboard = reviewboard || {};

(function () {
    var CONFIG_KEY = 'config';
    var DEFAULT_SETTINGS = {
        'username': '',
        'password': '',
        'url': '',
        'pollTime': 15
    };

    reviewboard.config = {
        get: function (callback) {
            chrome.storage.sync.get(
                [ 'username', 'password', 'url', 'pollTime' ],
                function (settings) {
                    settings = settings || DEFAULT_SETTINGS;

                    callback(settings);
                })
        },

        set: function (settings, callback) {
            chrome.storage.sync.set(settings, function () {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                    return;
                }

                callback && callback();
            });
        }
    }
})();