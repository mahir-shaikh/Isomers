export const PRIMARY_OUTLET = 'primary';
export const APP_READY = "app_ready";
export const PROJECT_NAME_REF = "tlInputPlanProjectName";
export const TEAM_NAME_REF = "tlTeamName";
export const RESET_TOOL_PAGE = "resettoolpage";
export const PRINT_DATA = "printdata"
export const SCENARIO = "currentscenario";
export const ROUTES = {
    INTRO: 'intro',
    DASHBOARD: 'dashboard',
    INPUTS: 'inputs'
};

export const LANGUAGES = {
    'English': 'en',
    'Italian': 'it',
    'German': 'de',
    'French': 'fr',
    'Korean': 'ko',
    'Japanese': 'ja',
    'Chinese (Traditional)': 'zhTW',
    'Chinese (Simplified)': 'zhCN',
    'Russian': 'ru',
    'Spanish': 'es',
    'Portuguese': 'ptBR'
}

export const EVENTS = {
    RESET_TOOL_PAGE: "resettoolpage",
    PRINT_PAGE: "printpage",
    START_VIDEO: "startvideo",
    CONTINUE: "continue",
    INTRO_COMPLETE: 'intro-complete',
    ER_COMPLETE: 'er-complete',
    ROUND_COMPLETE: 'round-complete',
    HIDE_CONTINUE:"hide-continue"
}

export { Utils } from './utils';
export { DataStore } from './datastore';
export { Dictionary } from './dictionary';
export { PersistTabState } from './persisttabstate';
export { FileSaver } from './filesaver';
export { CsvFileReaderService } from './csvfilereader';