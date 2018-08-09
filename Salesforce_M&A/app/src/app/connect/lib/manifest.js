(function(global) {
  "use strict"
  var hostName = (process.env.CDN0LOCAL1LOCALHOST2 == 0) ? "https://" + process.env.PULSE_CLOUD_HOSTNAME + "/" : (process.env.CDN0LOCAL1LOCALHOST2 == 1) ? window.location.protocol + "//" + window.location.hostname : "http://localhost/";

  var manifest = {
    config: {
      hostName: "https://isomer.btspulse.com/",
      eventTitle: 'Salesforce_MA_Pulse',
      questionsToSend: [
        { "questionName": "tlInputRound", "rangeName": "tlInputRound" },
        { "questionName": "xxRound", "rangeName": "xxRound" },
        { "questionName": "tlInputTeamNumber", "rangeName": "tlInputTeamNumber" },
        { "questionName": "tlInputTeamName", "rangeName": "tlInputTeamName" },
        { "questionName": "TlInputV2MOMVision", "rangeName": "TlInputV2MOMVision" },
        { "questionName": "tlInputV2MOMValue2Rank", "rangeName": "tlInputV2MOMValue2Rank" },
        { "questionName": "tlInputV2MOMValue3Rank", "rangeName": "tlInputV2MOMValue3Rank" },
        { "questionName": "tlInputV2MOMValue1Rank", "rangeName": "tlInputV2MOMValue1Rank" },
        { "questionName": "tlInputV2MOMValue4Rank", "rangeName": "tlInputV2MOMValue4Rank" },
        { "questionName": "tlInputV2MOMValue5Rank", "rangeName": "tlInputV2MOMValue5Rank" },
        { "questionName": "TLInputV2MOMValue2Desc", "rangeName": "TLInputV2MOMValue2Desc" },
        { "questionName": "TLInputV2MOMValue3Desc", "rangeName": "TLInputV2MOMValue3Desc" },
        { "questionName": "TLInputV2MOMValue1Desc", "rangeName": "TLInputV2MOMValue1Desc" },
        { "questionName": "TLInputV2MOMValue4Desc", "rangeName": "TLInputV2MOMValue4Desc" },
        { "questionName": "TLInputV2MOMValue5Desc", "rangeName": "TLInputV2MOMValue5Desc" },
        { "questionName": "tlInputV2MOMRisk1", "rangeName": "tlInputV2MOMRisk1" },
        { "questionName": "tlInputV2MOMRisk2", "rangeName": "tlInputV2MOMRisk2" },
        { "questionName": "tlInputV2MOMRisk3", "rangeName": "tlInputV2MOMRisk3" },
        { "questionName": "tlInputPeopleTimeline", "rangeName": "tlInputPeopleTimeline" },
        { "questionName": "tlInputPeopleHarmonizationLevel", "rangeName": "tlInputPeopleHarmonizationLevel" },
        { "questionName": "tlInputPeopleNonKeyHarmonizationLevel", "rangeName": "tlInputPeopleNonKeyHarmonizationLevel" },
        { "questionName": "tlInputITTimeline", "rangeName": "tlInputITTimeline" },
        { "questionName": "tlInputITIntegrationLevel", "rangeName": "tlInputITIntegrationLevel" },
        { "questionName": "tlInputSecurityTimeline", "rangeName": "tlInputSecurityTimeline" },
        { "questionName": "tlInputSecurityP0RiskMitigation", "rangeName": "tlInputSecurityP0RiskMitigation" },
        { "questionName": "tlInputSecurityP1RiskMitigation", "rangeName": "tlInputSecurityP1RiskMitigation" },
        { "questionName": "tlInputSecurityP2RiskMitigation", "rangeName": "tlInputSecurityP2RiskMitigation" },
        { "questionName": "tlInputITOfficePlan", "rangeName": "tlInputITOfficePlan" },
        { "questionName": "tlInputSecurityBuildSiteInfrastructure", "rangeName": "tlInputSecurityBuildSiteInfrastructure" },
        { "questionName": "tlInputSecurityProductRestrictions", "rangeName": "tlInputSecurityProductRestrictions" },
        { "questionName": "tlInputGTMOrg62Timeline", "rangeName": "tlInputGTMOrg62Timeline" },
        { "questionName": "tlInputGTMCSGPostSales", "rangeName": "tlInputGTMCSGPostSales" },
        { "questionName": "tlInputGTMBrandIntegration", "rangeName": "tlInputGTMBrandIntegration" },
        { "questionName": "tlInputGTMExternalSales", "rangeName": "tlInputGTMExternalSales" },
        { "questionName": "tlInputGTMLeadPass", "rangeName": "tlInputGTMLeadPass" },
        { "questionName": "tlInputProductTimeline", "rangeName": "tlInputProductTimeline" },
        { "questionName": "tlInputProductStackFocus", "rangeName": "tlInputProductStackFocus" }
      ],
      questionsToReceive: [
      ]
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
