(function(global) {
  'use strict'

  var _jsCalcApi, _promise
  function bootstrap() {
    // Requires a Promise.js spec compatible promise library
    return function JsCalcConnector(jsCalcApi, promise) {
      _jsCalcApi = jsCalcApi
      _promise = promise || Promise

      return {
        readValues: readValues,
        writeValues: writeValues
      }
    }
  }

  function readValues(state) {
    return _promise.resolve().then(function() {
      for(var i in state.config.questionsToSend) {
        var q = state.config.questionsToSend[i]
        q.responseText = _jsCalcApi.getValue(q.rangeName)
        if(typeof q.responseText == "undefined") {
          return _promise.reject(new Error("jsCalc did not return a suitable response for question " + q.questionName + "with range " + q.rangeName))
        }
      }

      return state
    })
  }

  function writeValues(state) {
    return _promise.resolve().then(function() {
      if(!state.votes) {
        return _promise.reject(new Error("State should contain a votes array with questionIds and responseText"))
      }

      var lookup = {}
      // Transform server return object to an object more easily mapped
      for(var i in state.votes) {
        lookup[state.votes[i].QuestionId] = state.votes[i].ResponseText
      }
      var promises = [], question

      for(var i in state.config.questionsToReceive) {
        question = state.config.questionsToReceive[i]
        question.responseText = lookup[question.questionId]

        // Only write values actually returned in the votes array.
        if(typeof question.responseText !== "undefined") {
          var valuePromise = _jsCalcApi.setValue(question.rangeName, question.responseText)
          promises.push(valuePromise)
        }
      }

      return _promise.all(promises).then(function() {
        return state
      })
    })
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = bootstrap();
  } else if (typeof global.define == 'function' && global.define.amd) {
    define('connect/jsCalcConnector', [], bootstrap)
  } else {
    return bootstrap
  }
})(typeof window !== 'undefined' ? window : this)
