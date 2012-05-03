(function() {
  var $, TweetList,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = window.jQuery;

  TweetList = (function() {

    function TweetList(element, options) {
      this.loadTweets = __bind(this.loadTweets, this);
      this.linkURLs = __bind(this.linkURLs, this);
      this.linkMentions = __bind(this.linkMentions, this);
      this.linkHashes = __bind(this.linkHashes, this);
      this.formatLinks = __bind(this.formatLinks, this);      this.el = $(element);
      this.settings = $.extend({}, defaults, options, this.el.data());
      console.log('settings', this.settings);
    }

    TweetList.prototype.formatLinks = function(text) {
      text = this.linkURLs(text);
      text = this.linkHashes(text);
      text = this.linkMentions(text);
      return text;
    };

    TweetList.prototype.linkHashes = function(text) {
      var hash, hashes, url, _i, _len;
      hashes = text.match(/\#[\w]*/gi);
      if (hashes != null) {
        for (_i = 0, _len = hashes.length; _i < _len; _i++) {
          hash = hashes[_i];
          url = '<a href="http://twitter.com/search/%23' + hash.replace("#", "") + '">' + hash + '</a>';
          text = text.replace(hash, url);
        }
      }
      return text;
    };

    TweetList.prototype.linkMentions = function(text) {
      var mention, mentions, url, username, _i, _len;
      mentions = text.match(/@[\w]*/gi);
      if (mentions != null) {
        for (_i = 0, _len = mentions.length; _i < _len; _i++) {
          mention = mentions[_i];
          username = mention.replace("@", "");
          url = '@<a href="http://twitter.com/' + username + '">' + username + '</a>';
          text = text.replace(mention, url);
        }
      }
      return text;
    };

    TweetList.prototype.linkURLs = function(text) {
      var url, urls, _i, _len;
      urls = text.match(/http(s)?:\/\/[\S]*/gi);
      if (urls != null) {
        for (_i = 0, _len = urls.length; _i < _len; _i++) {
          url = urls[_i];
          text = text.replace(url, '<a href="' + url + '">' + url + '</a>');
        }
      }
      return text;
    };

    TweetList.prototype.loadTweets = function() {
      var parameters, query,
        _this = this;
      parameters = ["screen_name=" + this.settings.username, "count=" + this.settings.count, "trim_user=" + this.settings.trimUser, "include_rts=" + this.settings.includeRetweets, "include_entities=" + this.settings.includeEntities];
      query = "?" + parameters.join("&");
      return $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "http://api.twitter.com/1/statuses/user_timeline.json" + query,
        error: function(xhr, status, error) {
          return console.log('error');
        },
        success: function(tweets, status, xhr) {
          var formattedTweet, htmlTweets, isRetweet, permaUrl, retweet, retweeted_by, text, timestamp, tweet, tweetId, userId, username;
          console.log('loaded', tweets);
          htmlTweets = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = tweets.length; _i < _len; _i++) {
              tweet = tweets[_i];
              username = this.settings.username;
              isRetweet = tweet.retweeted_status != null;
              if (isRetweet) retweet = tweet.retweeted_status;
              userId = isRetweet ? retweet.user.id : tweet.user.id;
              tweetId = isRetweet ? retweet.id_str : tweet.id_str;
              permaUrl = "http://twitter.com/" + userId + "/status/" + tweetId;
              timestamp = new Date();
              text = isRetweet ? retweet.text : tweet.text;
              formattedTweet = this.formatLinks(text);
              retweeted_by = isRetweet ? '<div class="retweet-by">Retweeted by <a href="http://twitter.com/' + username + '">' + username + '</a></div>' : '';
              _results.push('<li>\
            <a href="http://twitter.com/account/redirect_by_id?id=' + userId + '">\
              <img src="https://api.twitter.com/1/users/profile_image/' + userId + '">\
            </a>\
            ' + formattedTweet + retweeted_by + '\
            <time datetime="' + timestamp + '" pubdate></time>\
          </li>');
            }
            return _results;
          }).call(_this);
          return _this.el.html(htmlTweets.join('')).animate({
            height: "toggle",
            opacity: "toggle"
          }, 300);
        }
      });
    };

    return TweetList;

  })();

  $.fn.tweetList = function(options) {
    return this.each(function() {
      var $el, data;
      $el = $(this);
      data = $el.data('tweetList');
      if (!data) $el.data('tweetList', (data = new TweetList(this, options)));
      return data.loadTweets();
    });
  };

  $.fn.tweetList.Constructor = TweetList;

  $.fn.tweetList.defaults = {
    count: 5,
    includeEntities: true,
    includeRetweets: true,
    timeout: 5000,
    trimUser: true,
    username: 'javierjulio'
  };

}).call(this);
