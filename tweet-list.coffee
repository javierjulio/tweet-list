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

window.TweetList = TweetList