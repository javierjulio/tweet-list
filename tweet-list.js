(function() {
  var $, TweetList,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = window.jQuery;

  TweetList = (function() {

    function TweetList() {
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

    return TweetList;

  })();

  window.TweetList = TweetList;

}).call(this);
