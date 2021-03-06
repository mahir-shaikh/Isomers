export const PRIMARY_OUTLET = 'primary';
export const APP_READY = "app_ready";
export const PROJECT_NAME_REF = "tlInputPlanProjectName";
export const TEAM_NAME_REF = "tlTeamName";
export const RESET_TOOL_PAGE = "resettoolpage";
export const PRINT_DATA = "printdata"
export const SCENARIO = "currentscenario";
export const ROUTES = {
    DEVELOPMENT_PLAN: 'developmentPlan',
    SCENARIO: 'scenario',
    ACTION_PLAN: 'actionPlan',
    REPORTS: 'reports',
    DASHBOARD: 'dashboard'
};

export const EVENTS = {
    RESET_TOOL_PAGE: "resettoolpage",
    PRINT_PAGE: "printpage"
}

export { Utils } from './utils';
export { DataStore } from './datastore';
export { Dictionary } from './dictionary';
export { PersistTabState } from './persisttabstate';
export { FileSaver } from './filesaver';
export { EmailService } from './email.service';
export { Email } from './email';