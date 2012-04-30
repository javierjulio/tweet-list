(function() {
  var $, TweetList,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = window.jQuery;

  TweetList = (function() {

    function TweetList() {
      this.loadTweets = __bind(this.loadTweets, this);
      this.linkURLs = __bind(this.linkURLs, this);
      this.linkMentions = __bind(this.linkMentions, this);
      this.linkHashes = __bind(this.linkHashes, this);
      this.formatLinks = __bind(this.formatLinks, this);
    }

    TweetList.prototype.formatLinks = function(text) {
      text = this.linkURLs(text);
      text = this.linkHashes(text);
      text = this.linkMentions(text);
      return text;
    };

    TweetList.prototype.linkHashes = function(text) {
      var hash, url, _i, _len, _ref;
      _ref = text.match(/\#[\w]*/gi);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hash = _ref[_i];
        url = '<a href="http://twitter.com/#search/%23' + hash.replace("#", "") + '">' + hash + '</a>';
        text = text.replace(hash, url);
      }
      return text;
    };

    TweetList.prototype.linkMentions = function(text) {
      var mention, url, username, _i, _len, _ref;
      _ref = text.match(/@[\w]*/gi);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mention = _ref[_i];
        username = mention.replace("@", "");
        url = '@<a href="http://twitter.com/' + username + '">' + username + '</a>';
        text = text.replace(mention, url);
      }
      return text;
    };

    TweetList.prototype.linkURLs = function(text) {
      var url, _i, _len, _ref;
      _ref = text.match(/http(s)?:\/\/[\S]*/gi);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        url = _ref[_i];
        text = text.replace(url, '<a href="' + url + '">' + url + '</a>');
      }
      return text;
    };

    TweetList.prototype.loadTweets = function() {
      var parameters, query,
        _this = this;
      parameters = ["screen_name=javierjulio", "count=5", "trim_user=1", "include_rts=1", "include_entities=1"];
      query = "?" + parameters.join("&");
      console.log(query);
      return $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "http://api.twitter.com/1/statuses/user_timeline.json" + query,
        error: function(xhr, status, error) {
          return console.log('error handler');
        },
        success: function(data, status, xhr) {
          return console.log('success handler');
        }
      });
    };

    return TweetList;

  })();

  $.fn.tweetList = function(option) {
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('tweetList');
      console.log($this, data);
      if (!data) $this.data('tweetList', (data = new TweetList(this)));
      data.loadTweets();
      if (typeof option === 'string') return data[option].call($this);
    });
  };

  $.fn.tweetList.Constructor = TweetList;

}).call(this);
