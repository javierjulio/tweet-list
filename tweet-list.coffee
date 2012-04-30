$ = window.jQuery

class TweetList
  
  formatLinks: (text) =>
    text = @linkURLs(text)
    text = @linkHashes(text)
    text = @linkMentions(text)
    text
  
  linkHashes: (text) =>
    for hash in text.match(/\#[\w]*/gi)
      url = '<a href="http://twitter.com/#search/%23' + hash.replace("#", "") + '">' + hash + '</a>'
      text = text.replace(hash, url)
    
    text
  
  linkMentions: (text) =>
    for mention in text.match(/@[\w]*/gi)
      username = mention.replace("@", "")
      url = '@<a href="http://twitter.com/' + username + '">' + username + '</a>'
      text = text.replace(mention, url)
    
    text
  
  linkURLs: (text) =>
    for url in text.match(/http(s)?:\/\/[\S]*/gi)
      text = text.replace(url, '<a href="' + url + '">' + url + '</a>')
    
    text
  
  loadTweets: () =>
    parameters = [
      "screen_name=javierjulio",
      "count=5",
      "trim_user=1",
      "include_rts=1",
      "include_entities=1"
    ]
    query = "?" + parameters.join("&");
    console.log(query)
    $.ajax(
      type: "GET"
      dataType: "jsonp"
      url: "http://api.twitter.com/1/statuses/user_timeline.json" + query
      error: (xhr, status, error) =>
        console.log('error handler')
      ,
      success: (data, status, xhr) =>
        console.log('success handler')
    )
    
$.fn.tweetList = ( option ) ->
  this.each ->
    $this = $(@)
    data = $this.data 'tweetList'
    console.log $this, data
    if !data then $this.data 'tweetList', (data = new TweetList @)
    data.loadTweets()
    if typeof option is 'string' then data[option].call $this

$.fn.tweetList.Constructor = TweetList