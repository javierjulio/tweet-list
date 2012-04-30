(function() {
  var $, TweetList,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = window.jQuery;

  TweetList = (function() {
    var defaults;

    defaults = {
      count: 5,
      includeEntities: true,
      includeRetweets: true,
      timeout: 5000,
      trimUser: true,
      username: 'javierjulio'
    };

    function TweetList(element, options) {
      this.loadTweets = __bind(this.loadTweets, this);
      this.linkURLs = __bind(this.linkURLs, this);
      this.linkMentions = __bind(this.linkMentions, this);
      this.linkHashes = __bind(this.linkHashes, this);
      this.formatLinks = __bind(this.formatLinks, this);      this.el = $(element);
      this.settings = $.extend({}, defaults, options);
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
          url = '<a href="http://twitter.com/#search/%23' + hash.replace("#", "") + '">' + hash + '</a>';
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
      console.log(query);
      return $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "http://api.twitter.com/1/statuses/user_timeline.json" + query,
        error: function(xhr, status, error) {
          return console.log('error handler');
        },
        success: function(tweets, status, xhr) {
          var formattedTweet, from, html, isRetweet, permaUrl, timestamp, tweet, tweetId;
          console.log('success handler');
          console.log(tweets);
          html = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = tweets.length; _i < _len; _i++) {
              tweet = tweets[_i];
              isRetweet = tweet.retweeted_status;
              from = isRetweet ? tweet.entities.user_mentions[0].screen_name : tweet.user.screen_name;
              tweetId = isRetweet ? tweet.retweeted_status.id_str : tweet.id_str;
              permaUrl = "http://twitter.com/" + from + "/status/" + tweetId;
              timestamp = new Date();
              formattedTweet = this.formatLinks(tweet.text);
              _results.push('<div>' + formattedTweet + '<time datetime="' + timestamp + '" pubdate></time></div>');
            }
            return _results;
          }).call(_this);
          return _this.el.html(html.join(''));
        }
      });
    };

    return TweetList;

  })();

  $.fn.tweetList = function(options) {
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('tweetList');
      console.log($this, data);
      if (!data) $this.data('tweetList', (data = new TweetList(this, options)));
      return data.loadTweets();
    });
  };

  $.fn.tweetList.Constructor = TweetList;

}).call(this);
