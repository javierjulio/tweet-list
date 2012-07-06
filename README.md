# TweetList

A CoffeeScript based jQuery plugin that retrieves a list of tweets 
that its HTML output is fully customizable. Plugin formats hashes, 
mention, and URLs in anchor tags.

Original JavaScript by [Daniel Lacy](http://daniellacy.com/). 
Expanded on with permission.

## Basic Usage

The plugin options available can be seen below. The values applied 
are the defaults.

    <script>
    $('#my-tweets').tweetList(
      username: 'javierjulio',
      count: 5,
      includeRetweets: true,
      timeout: 5000,
      error: function(el, username) {
        el.html('<div>Twitter might be down at the moment. You can try following @<a href="http://twitter.com/9mmedia">9mmedia</a>.</div>');
      },
      success: function(el, data) {
        // custom output
      }
    );
    </script>

To implement multiple instances of the TweetList plugin on a page 
define the options you want to customize using data attributes.

    <div class="tweets" data-username="javierjulio" data-count="10" data-timeout="3000" data-include-retweets="false">
    </div>
    
    <script>
    $('.tweets').tweetList();
    </script>


## Resources

* Static URL for profile images based on screen_name (and other tricks) http://blog.abrah.am/2010/04/little-known-twitter-and-twitterapi.html
* https://gist.github.com/2470244
* http://lewissobotkiewicz.com/coffeescript-jquery-plugin-with-api/
* https://github.com/twitter/bootstrap/blob/master/js/
* http://www.onemoretake.com/2009/03/04/jquery-plugin-callbacks-and-events/
