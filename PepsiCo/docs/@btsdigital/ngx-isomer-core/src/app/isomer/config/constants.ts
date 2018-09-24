/**
 * List of constants to be used across the app
 *
 */
/* tslint:disable */
export const Constants = {
  "APP_READY": "app_ready",                        // SplashComponent
  "MODEL_LOADED": "model_loaded",                  // CalcService
  "MODEL_LOAD_PROGRESS": "model_load_progress",    // CalcService
  "MODEL_CALC_COMPLETE": "model_calc_complete",    // CalcService
  "CONNECTION_MODE": {                             // SyncService
    "POLL": "POLL",
    "PUSH": "PUSH"
  },
  "STORAGE_MODES": {                               // StorageService
    "PULSE": "pulse",
    "LOCAL": "local",
    "MIXED": "mixed"
  },
  "PULSE_API": {                                       // Pulse APIs
    "CALCBINDER": {                                    // CalcBinderCache
      "SET_VALUE": "/Wizer/CloudFront/SetCacheValue",
      "GET_VALUE": "/Wizer/CloudFront/GetCacheValue",
      "CLEAR_KEY": "/Wizer/CloudFront/ClearCacheKey",
      "CLEAR_CACHE": "/Wizer/CloudFront/ClearCache"
    },
    "PARTICIPANT": "/Wizer/CloudFront/Participant"    // Participant Details
  },
  "RETURN_URL": "return_url",
  "CALC_SERVICE": {
    "EMIT_CHANGE_DELAY": 300,
    "SAVE_STATE_TO_STORAGE_DELAY": 5000,
    "CALC_COMPLETE": "calc_complete",
    "MODEL_STATE": "model_state:"
  },
  "TEXT_ENGINE": {
    "GENERAL": "GEN",
    "FILE_PATH": "./assets/content/",
    "FILE_NAME": "EventContent",
    "FILE_EXT": ".json",
    "DEFAULT_LANG": "en",
    "LANGUAGE_LOADED": "language_loaded"
  }
};
