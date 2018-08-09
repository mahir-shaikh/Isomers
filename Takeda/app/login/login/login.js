(function(global) {

  global.auth = function() {
    var username = global.$('#email').val()
    var pass = global.$('#pass').val()

    var user = {
      email: username,
      password: pass,
      eventTitle: 'TakedaBa2',
      remember: 'true'
    }
    var settings = {
      data: user,
      type: 'POST',
      url: 'https://isomer.btspulse.com/Wizer/Authentication/CloudFrontLogin',
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
        global.$("#success").text("Authentication Success. You may proceed to the app")
	      location.reload(true)
      } else {
        console.log(resp);
        global.$("#loginErrorMessage").text("Error: " + resp.errMsg)
      }
    })
    .catch(function(err) {
      global.$("#loginErrorMessage").text("Execution error")
    })
  }
}(window))
