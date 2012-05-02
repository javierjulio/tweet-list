$ = window.jQuery

class TweetList
  
  defaults =
    count: 5
    includeEntities: true
    includeRetweets: true
    timeout: 5000
    trimUser: true
    username: 'javierjulio'
  
  constructor: (element, options) ->
    @el = $(element)
    @settings = $.extend {}, defaults, options, @el.data()
    console.log('settings', @settings)
  
  formatLinks: (text) =>
    text = @linkURLs(text)
    text = @linkHashes(text)
    text = @linkMentions(text)
    text
  
  linkHashes: (text) =>
    hashes = text.match(/\#[\w]*/gi)
    
    if hashes?
      for hash in hashes
        url = '<a href="http://twitter.com/search/%23' + hash.replace("#", "") + '">' + hash + '</a>'
        text = text.replace(hash, url)
    
    text
  
  linkMentions: (text) =>
    mentions = text.match(/@[\w]*/gi)
    
    if mentions?
      for mention in mentions
        username = mention.replace("@", "")
        url = '@<a href="http://twitter.com/' + username + '">' + username + '</a>'
        text = text.replace(mention, url)
    
    text
  
  linkURLs: (text) =>
    urls = text.match(/http(s)?:\/\/[\S]*/gi)
    
    if urls?
      for url in urls
        text = text.replace(url, '<a href="' + url + '">' + url + '</a>')
    
    text
  
  loadTweets: () =>
    parameters = [
      "screen_name=#{@settings.username}",
      "count=#{@settings.count}",
      "trim_user=#{@settings.trimUser}",
      "include_rts=#{@settings.includeRetweets}",
      "include_entities=#{@settings.includeEntities}"
      #,"page=4" #use for testing variety (links, hashes, etc.)
      #,"page=8" #use for testing RT's
    ]
    query = "?" + parameters.join("&");
    
    $.ajax(
      type: "GET"
      dataType: "jsonp"
      url: "http://api.twitter.com/1/statuses/user_timeline.json" + query
      error: (xhr, status, error) =>
        console.log('error')
      ,
      success: (tweets, status, xhr) =>
        console.log('loaded', tweets)
        # default output
        htmlTweets = for tweet in tweets
          isRetweet = tweet.retweeted_status?
          from = if isRetweet then tweet.entities.user_mentions[0].screen_name else tweet.user.id
          tweetId = if isRetweet then tweet.retweeted_status.id_str else tweet.id_str
          permaUrl = "http://twitter.com/" + from + "/status/" + tweetId
          timestamp = new Date()#@getTimestamp(tweet.created_at)
          text = if isRetweet then tweet.retweeted_status.text else tweet.text
          formattedTweet = @formatLinks(text)
          imageUsername = if isRetweet then tweet.retweeted_status.user.id else @settings.username
          '<li><img src="https://api.twitter.com/1/users/profile_image/' + imageUsername + '"> ' + formattedTweet + '<time datetime="' + timestamp + '" pubdate></time></li>'
        @el.html(htmlTweets.join(''))
    )


$.fn.tweetList = (options) ->
  this.each ->
    $el = $(this)
    data = $el.data 'tweetList'
    console.log $el, data
    if !data then $el.data 'tweetList', (data = new TweetList this, options)
    data.loadTweets()

$.fn.tweetList.Constructor = TweetList
