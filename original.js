/* original source code: daniellacy.com */
var dl = {

    /**
     * Regular expressions for matching various special content in tweet text.
    **/
    regExes : {
        urls: /http(s)?:\/\/[\S]*/gi,
        mentions: /@[\w]*/gi,
        hashes: /\#[\w]*/gi
    },

    /**
     * Array of tweets with their HTML.
    **/
    tweets : [],
    
    /**
     * Returns a machine readable timestamp for the datetime attributes:
     * YYYY-MM-DDTHH:MM-Offset
     *
     * @date {object} Twitter's date object response
    **/
    getTimestamp : function (date) {
        var d       = new Date(date),
            year    = d.getUTCFullYear(),
            month   = (d.getUTCMonth() < 10) ? "0" + d.getUTCMonth() : d.getUTCMonth(),
            day     = (d.getUTCDate() < 10) ? "0" + d.getUTCDate() : d.getUTCDate(),
            hour    = (d.getUTCHours() < 10) ? "0" + d.getUTCHours() : d.getUTCHours(),
            minute  = (d.getUTCMinutes() < 10) ? "0" + d.getUTCMinutes() : d.getUTCMinutes(),
            offset  = d.getTimezoneOffset() / 60;

        return year + "-" + month + "-" + day + "T" + hour + ":" + minute + "-0" + offset + ":00";
    },

    /**
     * Looks for URLs within a string and wraps them in an anchor tag.
     *
     * @text {string} Tweet text
    **/
    formatLinks : function (text) {
        // Find and Link URLs
        if (text.match(dl.regExes.urls)) {
            text = dl.linkUrls(text);
        }

        // Find and Link Hash Tags
        if (text.match(dl.regExes.hashes)) {
            text = dl.linkHashes(text);
        }

        // Find and Link User Mentions
        if (text.match(dl.regExes.mentions)) {
            text = dl.linkMentions(text);
        }

        return text;
    },

    /**
     * Look for any URLs within the text and wrap them in an anchor.
     *
     * @text {string} Tweet text
    **/
    linkUrls : function (text) {
        for (var a = 0, l = text.match(dl.regExes.urls).length; a < l; a++) {
            var url = text.match(dl.regExes.urls)[a];

            text = text.replace(url, '<a href="' + url + '">' + url + '</a>');
        }

        return text;
    },

    /**
     * Look for hash tags within the text and link them to a search query for similar tags.
     *
     * @text {string} Tweet text
    **/
    linkHashes : function (text) {
        for (var h = 0, l = text.match(dl.regExes.hashes).length; h < l; h++) {
            var match   = text.match(dl.regExes.hashes)[h],
                hash    = match.replace("#", ""),
                hashUrl = '<a href="http://twitter.com/#search/%23' + hash + '">' + match + '</a>';

            text = text.replace(match, hashUrl);
        }

        return text;
    },

    /**
     * Look for any mentions of other users within the text and link them to the user's page.
     *
     * @text {string} Tweet text
    **/
    linkMentions : function (text) {
        for (var u = 0, l = text.match(dl.regExes.mentions).length; u < l; u++) {
            var match       = text.match(dl.regExes.mentions)[u],
                mention     = match.replace("@", ""),
                mentionurl  = '@<a href="http://twitter.com/' + mention + '">' + mention + '</a>';

            text = text.replace(match, mentionurl);
        }

        return text;
    }
};

/**
 * On ready, request latest tweets from Twitter Public API.
 * Format the selected response into HTML, then append to #article-01.
**/
$(document).ready(function () {
    // Parameters for our Twitter API request.
    var parameters = [
            "screen_name=javierjulio",
            "count=5",
            "trim_user=1",
            "include_rts=1",
            "include_entities=1"
        ],
        query = "?" + parameters.join("&");

    $.ajaxSetup({
        type     : "GET",
        dataType : "jsonp",
        url      : "http://api.twitter.com/1/statuses/user_timeline.json" + query
    });

    // Submit our request and handle success and error cases.
    $.ajax({
        error: function (xhr, status, error) {
            $("#article-01").append('<p>Twitter might be down at the moment, otherwise you\'d see my latest posts here. You can try following me @<a href="http://twitter.com/javierjulio">javierjulio</a>.</p>');

        },

        success: function (data, status, xhr) {
            var container = $('<div class="tweets" role="complementary" id="temporary-tweets" style="display: none;">' +
                            '<ol></ol></div>');

            for (var i = 0; i < 5; i++) {
                var tweet       = data[i];

                if (tweet === undefined) { continue; }

                var isRetweet   = (tweet.retweeted_status) ? true : false,
                    from        = (isRetweet) ? tweet.entities.user_mentions[0].screen_name : tweet.user.screen_name,
                    tweetId     = (isRetweet) ? tweet.retweeted_status.id_str : tweet.id_str,
                    permaUrl    = "http://twitter.com/" + from + "/status/" + tweetId,
                    timestamp   = dl.getTimestamp(tweet.created_at),
                    niceText    = dl.formatLinks(tweet.text),
                    listItem    = '<li>' + niceText + '<time datetime="' + timestamp + '" pubdate><a href="' + permaUrl + '">' + tweet.created_at + '</a></time></li>';

                dl.tweets.push(listItem);
            }

            container.find("ol").append(dl.tweets.join("") + '<li><a href="http://twitter.com/javierjulio">More&hellip;</a></li>');

            $("#article-01").append(container);

            container.slideDown(600);
        }
    }); // End .ajax
}); // End document.ready