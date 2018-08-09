(function(global) {
  'use strict'
  function bootstrap() {
    var _http, _promise

    // Requires a Promise.js spec compatible promise library
    return function Connect(http, promise) {
      var self = {}
      _http = http
      _promise = promise || Promise

      function authenticateUser(state) {
        return authenticate(state)
          .then(getParticipations)
          .then(selectParticipation)
      }

      self.authenticateUser = authenticateUser
      self.getQuestionIds = getAllQuestions
      self.voteManyQuestionsFromJson = voteManyQuestionsFromJson
      self.getMyVotes = getMyVotes
      self.authenticateToEvent = authenticateToEvent

      return self
    }

    function authenticateToEvent(state) {
      return _http.postJson('/Wizer/Authentication/Authenticate', {
        email: state.user.email,
        pass: state.user.pass,
        eventTitle: state.config.eventTitle
      })
      .then(function(resp) {
        if(resp.success) {
          state.user = {}
          return state
        } else {
         return _promise.reject(toError(resp))
        }
      })
    }

    function authenticate(state) {
      var url = '/Wizer/Authentication/Authenticate'
      return _http.postJson(url, {
        email: state.user.email,
        pass: state.user.pass
      })
      .then(function(res) {
        // Note: We are mutating the state object passed in.
        if(res.success) {
          state.user = {
            id: res.id
          }
          return state
        }
        return _promise.reject(toError(res))
      })
    }

    function getParticipations(state) {
      return _http.postJson('/Wizer/Authentication/GetParticipations', {})
      .then(function getCurrentParticipation(participationList) {
          var eventToFind = state.config.eventTitle

          if(participationList.length > 0) {
            var participation = findMatchingParticipation(participationList, eventToFind)
            if(!participation) {
              return _promise.reject(strToError("No participation found matching " + eventToFind))
            } else {
              // Note: We are mutating the state object passed in.
              state.participation = participation
            }

            return state
          } else {
            return _promise.reject(toError(res))
          }
      })
    }

    function selectParticipation(state) {
      var options = {
        participationId: state.participation.ParticipationId,
        application: 'Vote',
        language: 'en'
      };

      return _http.postJson('/Wizer/Authentication/SelectParticipation', options).then(function(res) {
        return state
      });
    }

    function getAllQuestions(state) {
      var options = {
        questionNames: getAllQuestionNames(state)
      }
      return _http.postJson('/Wizer/CloudFront/GetAllQuestions', options)
      .then(handleAuthenticationError)
      .then(function(questions) {
        // We always expect an array of questions
        if(Array.isArray(questions)) {
          var questionIds = {}
          for(var i in questions) {
            var q = questions[i]
            questionIds[q.ShortName] = q.Id
          }

          return mapAndValidateQuestionIds(state, questionIds)
        }
        //Otherwise, try logging in again if no other error is readily detactable
        else {
          if(typeof questions.success !== 'undefined' && !questions.success) {
            return _promise.reject(toError(questions))
          }
          return _promise.reject({unauthenticated: true, originalObj: questions})
        }
      })
    }

    function voteManyQuestionsFromJson(state) {
      var responses = [], q

      // Detect if questionIds have been fetched at all
      if(!state.questionIds) return _promise.reject(strToError("Question Ids not fetched"))

      for(var i in state.config.questionsToSend) {
        q = state.config.questionsToSend[i]
        responses.push({
          questionId: parseInt(q.questionId),
          responseText: q.responseText
        })
      }

      var payload = {
        votes: responses
      }

      return _http.postJson(
        '/Wizer/CloudFront/VoteManyQuestionsFromJson',
        { votesJson: JSON.stringify(payload) }
      )
      .then(handleAuthenticationError)
      .then(function(res) {
        if(!res.success) {
          return _promise.reject(toError(res))
        }
        return state
      })
    }

    function getMyVotes(state) {
      var questionIds = {
        questionIds: getQuestionIdsToReceive(state)
      }
      return _http.postJson(
        '/Wizer/CloudFront/GetMyVotes',
        questionIds
      )
      .then(handleAuthenticationError)
      .then(function(res) {
        if(res.success) {
          state.votes = res.votes
          return state
        } else {
          return _promise.reject(toError(res))
        }
      })
    }

    function findMatchingParticipation(list, eventTitle) {
      for(var participation in list) {
        if(list[participation].EventTitle == eventTitle) {
          return list[participation]
        }
      }
    }

    function getAllQuestionNames(state) {
      var names = []
      for(var i in state.config.questionsToSend) {
        names.push(state.config.questionsToSend[i].questionName)
      }
      for(var i in state.config.questionsToReceive) {
        names.push(state.config.questionsToReceive[i].questionName)
      }
      return names
    }

    function mapAndValidateQuestionIds(state, questionIds) {
      // Note: We are mutating the state object passed in.
      // Attach id to questions for convenience and later use
      // All names should exist, otherwise reject as some questions are invalid
      for(var i in state.config.questionsToSend) {
        var id = questionIds[state.config.questionsToSend[i].questionName]

        if(typeof id === "undefined" || id === null) {
          return _promise.reject(strToError("No question id received for " + state.config.questionsToSend[i].questionName))
        }

        state.config.questionsToSend[i].questionId = id
      }
      for(var i in state.config.questionsToReceive) {
        var id = questionIds[state.config.questionsToReceive[i].questionName]
        if(typeof id === "undefined" || id === null) {
          return _promise.reject(strToError("No question id received for " + state.config.questionsToReceive[i].questionName))
        }

        state.config.questionsToReceive[i].questionId = id
      }
      //Redundant assignment to keep complete list of questions
      //+ be able to quickly see if they have been fetched
      state.questionIds = questionIds

      return _promise.resolve(state)
    }

    function getQuestionIdsToReceive(state) {
      var ids = []
      // Detect if questionIds have been fetched at all
      if(!state.questionIds) return ids

      for(var i in state.config.questionsToReceive) {
        ids.push(state.config.questionsToReceive[i].questionId)
      }
      return ids
    }

    function handleAuthenticationError(response) {
      if(response.success === false && isAuthenticationMessage(response.message)) {
        return _promise.reject({unauthenticated:true})
      }
      return _promise.resolve(response)
    }

    function isAuthenticationMessage(message) {
      return message === "Authentication fails or insufficient privileges." || message === "Not authenticated." || message === "You must be authorized first."
    }

    function toError(res) {
      return new Error(res.errCode+":"+ (res.errMsg || res.message) + " - " + res)
    }

    function strToError(str) {
      return new Error(str)
    }
  }

  // Determine which kind of module to expose
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = bootstrap();
  } else if (typeof global.define == 'function' && global.define.amd) {
    // Wireup with RequireJS
    define('connect/connect', [], bootstrap);
  } else {
    // ...or as browser global
    global.Connect = bootstrap();
    return bootstrap
  }
})(typeof window !== 'undefined' ? window : this)
