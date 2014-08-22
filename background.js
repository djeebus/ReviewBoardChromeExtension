var reviewboard = reviewboard || {};

(function () {
    var pendingReviews = 0;

    var SERVER_URL = 'http://reviewboard.kabbage.com/';

    // Nofication display time in ms.
    var NOTIFICATION_DISPLAY_TIME = 5000;

    // Store the last review
    var lastReview;

    // Store all pending reviews
    var reviews = [];
    var setAlarm = false;

    var alarmName = 'poll';
    reviewboard.initialize = function () {
        if (setAlarm) {
            chrome.alarms.clear(alarmName);
            console.log('alarm cleared');
        }

        reviewboard.config.get(function (config) {
            var alarmInfo = {
                delayInMinutes: 0,
                periodInMinutes: parseInt(config.pollTime, 10)
            };

            chrome.alarms.create(alarmName, alarmInfo);

            setAlarm = true;
        });
    }

    chrome.browserAction.onClicked.addListener(function () {
        reviewboard.config.get(function (config) {
            console.log('Going to reviewboard...');
            chrome.tabs.getAllInWindow(undefined, function (tabs) {
                for (var i = 0, tab; tab = tabs[i]; i++) {
                    if (tab.url && isReviewboardUrl(tab.url, config.url)) {
                        console.log('Found Reviewboard tab: ' + tab.url + '. ' +
                                    'Focusing and refreshing count...');
                        chrome.tabs.update(tab.id, { selected: true });
                        return;
                    }
                }
                console.log('Could not find Reviewboard tab. Creating one...');
                chrome.tabs.create({ url: config.url });
            });
        });
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        switch (alarm.name) {
            case alarmName:
                reviewboard.config.get(function (config) {
                    reviewboard.client.getReviewCount(
                        config.url,
                        function (count) {
                            updateRequestCount(count);
                        });
                });
                break;
        }
    });

    function isReviewboardUrl(url, rbUrl ) {
        // Return whether the URL starts with the Gmail prefix.
        return url.indexOf(rbUrl) == 0;
    }

    // Reset the badge counter when a user click on the browser action icon.
    function updateRequestCount(count) {
        if (!count || count == 0) {
            chrome.browserAction.setBadgeText({ text: '' });
            return;
        }

        chrome.browserAction.setBadgeBackgroundColor({ color: '#F00' });
        chrome.browserAction.setBadgeText({ text: count.toString() });
    }

    reviewboard.displayError = function () {
        chrome.browserAction.setBadgeBackgroundColor({ color: '#C0C0C0' });
        chrome.browserAction.setBadgeText({ text: '?' });
    };
})();

reviewboard.initialize();