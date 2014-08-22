var reviewboard = reviewboard || {};
reviewboard.client = reviewboard.client || {};

(function () {
    reviewboard.client.getReviewCount = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) {
                return;
            }

            if (xhr.status != 200) {
                console.error('status: ' + xhr.status);
                reviewboard.displayError();
                return;
            }

            var response = JSON.parse(xhr.responseText);

            callback && callback(response.count);
        }
        xhr.open('GET', url + '/api/review-requests/?counts-only=true&status=pending', true);
        xhr.send();

    };
})();