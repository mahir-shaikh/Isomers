(function(global) {
  "use strict"

  var manifest = {
    config: {
      hostName: "https://isomer.btspulse.com/",
      eventTitle: 'SantenBa2',
      questionsToSend: [],
      questionsToReceive: []
    }
  }

  function bootstrap() {
    validateManifest()

    return manifest
  }

  function validateManifest() {
    if(manifest.config.questionsToSend && manifest.config.questionsToSend) {
      loopQuestions("questionsToSend")
      loopQuestions("questionsToReceive")
    } else {
      throw "Both config.questionsToSend and config.questionsToReceive must be present in manifest"
    }
    if(!manifest.config.hostName || !manifest.config.eventTitle) {
      throw "config.hostName and config.eventTitle must both be present in the manifest"
    }
  }

  function loopQuestions(listName) {
    for(var i in manifest.config[listName]) {
      var q = manifest.config[listName][i]
      if(!q.questionName || !q.rangeName) {
        throw "Manifest inconsistency found at config."+listName+" at index: " + i + " (Missing rangeName or questionName)"
      }
    }
  }

  // Determine which kind of module to expose
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = bootstrap();
  } else if (typeof global.define == 'function' && global.define.amd) {
    // Wireup with RequireJS
    define('connect/manifest', [], bootstrap);
  } else {
    // ...or as browser global
    global.Manifest = bootstrap();
    return bootstrap();
  }

})(typeof window !== 'undefined' ? window : this)
