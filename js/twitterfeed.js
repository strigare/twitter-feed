$(document).ready(function () {
  var displaylimit = 6;
  var twitterprofile = "ignacio_parada";
  var screenname = "Ignacio Parada";
  var showretweets = true;
  var showtweetlinks = true;
  var showprofilepic = true;
  var id_str = null;

  var headerHTML = '';
  var loadingHTML = '';
	headerHTML += '<a href="https://twitter.com/" >'+
                  '<img id="twitter-bird" src="images/twitter-bird-light.png" width="34"'+ 
                    ' alt="twitter bird" />'+
                '</a>';

	headerHTML += '<h1 id="username">'+screenname+' <span><a href="https://twitter.com/'+
                    twitterprofile+'" >@'+twitterprofile+'</a></span></h1>';
	
  loadingHTML += '<div id="loading-container">'+
                  '<img src="images/ajax-loader.gif" alt="tweet loader" />'+
                 '</div>';
	
  $('#twitter-feed #twitter-header').html(headerHTML);
	$('#twitter-feed #content').html(loadingHTML);

  loadFeed();  

  function loadFeed(){

    $.ajax({
    url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
    type: 'GET',
    dataType: 'jsonp',
    data: {
      screen_name: twitterprofile,
      include_rts: true,
      count: 6,
      include_entities: true
    },
    success: function(feeds) {   
      //console.log(feeds);
      var feedHTML = generateFeedHtml(feeds); 


     $('#twitter-feed #content').html(feedHTML);
   }});
  }

    function generateFeedHtml(feeds){
      var feedHTML = '';
       var displayCounter = 0;         
       for (var i=0; i<feeds.length && displayCounter < displaylimit; i++) {
        var tweetscreenname = feeds[i].user.name;
        var tweetusername = feeds[i].user.screen_name;
        var profileimage = feeds[i].user.profile_image_url_https;
        var status = feeds[i].text; 
        var isaretweet = false;
        var isdirect = false;
        var tweetid = feeds[i].id_str;

        //If the tweet has been retweeted, get the profile pic of the tweeter
        if(typeof feeds[i].retweeted_status != 'undefined'){
         profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
         tweetscreenname = feeds[i].retweeted_status.user.name;
         tweetusername = feeds[i].retweeted_status.user.screen_name;
         tweetid = feeds[i].retweeted_status.id_str
         isaretweet = true;
        };
         
          if (showtweetlinks == true) {
           status = addlinks(status);
         }

            feedHTML += '<div class="twitter-article">';                  
            feedHTML +=   '<div class="twitter-pic">';
            feedHTML +=     '<a href="https://twitter.com/'+tweetusername+'" >';
            feedHTML +=       '<img src="'+profileimage+'"images/twitter-feed-icon.png"' + 
                                  'width="42" height="42" alt="twitter icon" />';
            feedHTML +=     '</a>';
            feedHTML +=   '</div>';
            feedHTML +=   '<div class="twitter-text">';
            feedHTML +=     '<p>';
            feedHTML +=       '<span class="tweetprofilelink">';
            feedHTML +=         '<strong>';
            feedHTML +=           '<a href="https://twitter.com/'+tweetusername+'" >'+tweetscreenname+'</a>';
            feedHTML +=         '</strong>';
            feedHTML +=         '<a class="at_username" href="https://twitter.com/'+tweetusername+'" >@'+tweetusername+'</a>';
            feedHTML +=       '</span>';
            feedHTML +=       '<span class="tweet-time">';
            feedHTML +=         '<a href="https://twitter.com/'+tweetusername+'/status/'+tweetid+'">'+
                                  relative_time(feeds[i].created_at)+'</a>';
            feedHTML +=       '</span>';
            feedHTML +=       '<br/>'+status;
            feedHTML +=     '</p>';
            feedHTML +=   '</div>';
            feedHTML += '</div>';
            displayCounter++;
          //}   
       //}
     }
     return feedHTML;
    }

    //Function modified from Stack Overflow
    function addlinks(data) {
        //Add link to all http:// links within tweets
        data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
          return '<a href="'+url+'" >'+url+'</a>';
        });

        //Add link to @usernames used within tweets
        data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
          return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" >'+reply.charAt(0)+reply.substring(1)+'</a>';
        });
        return data;
      }


      function relative_time(time_value) {
        var values = time_value.split(" ");
        time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
        var parsed_date = Date.parse(time_value);
        var relative_to =  new Date();
        var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
        var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
        delta = delta + (relative_to.getTimezoneOffset() * 60);

        if (delta < 60) {
          return '1m';
        } else if(delta < 120) {
          return '1m';
        } else if(delta < (60*60)) {
          return (parseInt(delta / 60)).toString() + 'm';
        } else if(delta < (120*60)) {
          return '1h';
        } else if(delta < (24*60*60)) {
          return (parseInt(delta / 3600)).toString() + 'h';
        } else if(delta < (48*60*60)) {
        //return '1 day';
        return shortdate;
      } else {
        return shortdate;
      }
    }
  });
