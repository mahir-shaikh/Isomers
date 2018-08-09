(function(global) {


  global.auth = function(user, pass, token) {
    
    var url = 'https://isomer.btspulse.com/Wizer/Authentication/CloudFrontLogin';
    if(!user)
      user = global.$('#email').val();
    if(!pass)
      pass = global.$('#pass').val()
    
   
    var user = {
      email: user,
      password: pass,
      eventTitle: 'Chevron_BA2_Pulse'
    }
    
    if(token)
    {
      user.token = token;
    }
   
    var settings = {
      data: user,
      type: 'POST',
      url: url,
      xhrFields: {
        withCredentials: true
      }
    }

    global.$.ajax(settings)
    .then(function(resp) {
      if(resp.success) {
        for(var key in resp.cookies) {
          // .NET doesn't allow - in keynames, so _ are used instead.
          global.Cookies.set(key.replace(/_/g, '-'), resp.cookies[key])
        }
        global.$("#success").text("Authentication Success. You may proceed to the app");
        if(token)
        {
          location.href = location.origin;
        }
        else
        {
           location.reload(true);
        }
      } else {
        console.log(resp);
        global.$("#loginErrorMessage").text("Error: " + resp.errMsg);
        global.$('#loginBox').show();
      }
    })
    .catch(function(err) {
      global.$("#loginErrorMessage").text("Execution error");
    global.$('#loginBox').show();
    })
  }
  
  
  function getRequests() {
  global.$('#loginBox').hide();
    var s1 = location.href.substring(1, location.href.length).split('&'),
        r = [], s2, i;
    for (i = 0; i < s1.length; i += 1) {
        s2 = s1[i].split('=');
    var key = decodeURIComponent(s2[0]);
    if(key.indexOf('?')>0)
    {
      key = key.substring(key.indexOf('?')+1, key.length);
    }
        r.push(decodeURIComponent(s2[1]));
    }
    return r;
};

var QueryString = getRequests();
console.log(QueryString[0]); 
var found = QueryString[0];
  if(found && found!="undefined" && found != undefined)
  {
    console.log('recieved call from LTI/LMS');
    auth('', '' ,QueryString[0]);
    
    console.log('finished the re-route process');
    
  }
  else
  {
    global.$('#loginBox').show();
  }
}(window))
