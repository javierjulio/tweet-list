$ = window.jQuery

class TweetList
  
  constructor: (element, options) ->
    @el = $(element)
    @settings = $.extend {}, $.fn.tweetList.defaults, options, @el.data()
    console.log('settings', @settings)
    @loadTweets()
  
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
  
  zeroPad: (value) ->
    if value < 10 then "0" + value else value
  
  timestamp: (date) =>
    d = new Date(date)
    year = @zeroPad d.getUTCFullYear()
    month = @zeroPad d.getUTCMonth()
    day = @zeroPad d.getUTCDate()
    hour = @zeroPad d.getUTCHours()
    minute = @zeroPad d.getUTCMinutes()
    offset = d.getTimezoneOffset() / 60
    "#{year}-#{month}-#{day}T#{hour}:#{minute}-0#{offset}:00"
  
  buildApiUrl: () =>
    parameters = [
      "screen_name=#{@settings.username}",
      "count=#{@settings.count}",
      "trim_user=#{@settings.trimUser}",
      "include_rts=#{@settings.includeRetweets}",
      "include_entities=#{@settings.includeEntities}"
      #,"page=4" #use for testing variety (links, hashes, etc.)
      #,"page=8" #use for testing RT's
    ]
    query = "?" + parameters.join("&")
    protocol = if window.location.protocol == 'https:' then 'https:' else 'http:'
    "#{protocol}//api.twitter.com/1/statuses/user_timeline.json#{query}"
  
  loadTweets: () =>
    $.ajax(
      type: "GET"
      dataType: "jsonp"
      url: @buildApiUrl()
      error: (xhr, status, error) =>
        console.log('error')
      ,
      success: (tweets, status, xhr) =>
        console.log('loaded', tweets)
        
        @el.trigger('loaded')
        
        htmlTweets = for tweet in tweets
          username = @settings.username
          isRetweet = tweet.retweeted_status?
          retweet = tweet.retweeted_status if isRetweet
          userId = if isRetweet then retweet.user.id else tweet.user.id
          tweetId = if isRetweet then retweet.id_str else tweet.id_str
          permaUrl = "http://twitter.com/" + userId + "/status/" + tweetId
          timestamp = @timestamp(tweet.created_at)
          text = if isRetweet then retweet.text else tweet.text
          formattedTweet = @formatLinks(text)
          retweetedBy = if isRetweet then '<div class="retweet-by">Retweeted by <a href="http://twitter.com/' + username + '">' + username + '</a></div>' else ''
          
          """
          <li>
          <a href=\"http://twitter.com/account/redirect_by_id?id=#{userId}\">
          <img src=\"https://api.twitter.com/1/users/profile_image/#{userId}\">
          </a>
          #{formattedTweet}
          #{retweetedBy}
          <time datetime=\"#{timestamp}\" pubdate></time>
          </li>
          """
        
        renderedEvent = $.Event('rendered')
        
        @el.html(htmlTweets.join('')).trigger(renderedEvent)
        
        return if renderedEvent.isDefaultPrevented()
        
        @el.animate({height:"show", opacity:"show"}, 400)
    )


$.fn.tweetList = (options) ->
  this.each ->
    $el = $(this)
    data = $el.data 'tweetList'
    if !data then $el.data 'tweetList', (data = new TweetList this, options)

$.fn.tweetList.Constructor = TweetList

$.fn.tweetList.defaults =
  count: 5
  includeEntities: true
  includeRetweets: true
  timeout: 5000
  trimUser: true
  username: 'javierjulio'
