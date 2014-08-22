/// <reference script='js/config.js' />

(function () {
    var eleUrl = document.getElementById('url'),
        eleUsername = document.getElementById('username'),
        elePassword = document.getElementById('password'),
        elePoll = document.getElementById('poll'),
        eleSave = document.getElementById('save'),
        eleStatus = document.getElementById('status');

    function loadSettings() {
        reviewboard.config.get(function (settings) {
            eleUsername.value = settings.username;
            elePassword.value = settings.password;
            elePoll.value = settings.pollTime;
            eleUrl.value = settings.url;
        });
    }

    function saveSettings() {
        var settings = {
            'username': eleUsername.value,
            'password': elePassword.value,
            'url': eleUrl.value,
            'pollTime': elePoll.value
        }

        reviewboard.config.set(settings, function () {
            eleStatus.innerText = 'settings saved';
            setTimeout(function () {
                eleStatus.innerText = '';
            }, 5000);
            
        });
    }

    eleSave.addEventListener('click', function (event) {
        saveSettings();

        event.preventDefault();
    });

    loadSettings();
})();