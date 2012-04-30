# TweetList

A CoffeeScript based jQuery plugin that retrieves a list of tweets 
that its HTML output is fully customizable. Plugin formats hashes, 
mention, and URLs in anchor tags.

Original JS source by Daniel Lacy and used with permission.

## Basic Usage

The plugin options available can be seen below. The values applied 
are the defaults.

        $('#my-tweets').tweetList(
          username: 'javierjulio',
          count: 5,
          timeout: 5000,
          error: function(el, username) {
            el.html('<div>Twitter might be down at the moment. You can try following @<a href="http://twitter.com/9mmedia">9mmedia</a>.</div>');
          },
          success: function(el, data) {
            // custom output
          }
        );

To implement multiple instances of the TweetList plugin on a page 
define the options you want to customize using data attributes.

        <div class="tweets" data-username="javierjulio" data-count="10" data-timeout="2000">
        </div>
        
        $('.tweets').tweetList();
