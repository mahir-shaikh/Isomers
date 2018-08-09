import { Injectable, EventEmitter } from '@angular/core';
import { Router, Route, UrlTree, UrlSegment } from '@angular/router';
import { UrlSegmentGroup } from '@angular/router/src/url_tree'; 
import { Dictionary } from './dictionary';

export const PRIMARY_OUTLET = 'primary';
export const DASHBOARD_PATH = "/dashboard";
export const MEETINGS_OUTLET = "messages";
export const MESSAGES_OUTLET = "messages";
export const FEEDBACK_OUTLET = "messages";
export const PLANNING_OUTLET = "planning";
export const TUTORIALS_ROUTE = "tutorials";
export const RESOURCES_ROUTE = "resources";
export const SWOT_ROUTE = "swot";
export const EOR_FEEDBACK = "endofroundfeedback";
export const YEAR_OUTLET = "year";
export const ANALYSIS_ROUTE = "analysis";
export const STEPPER_CHANGE = "stepper_change";


export const APP_READY = "app_ready";
export const INTRO_COMPLETE = "intro_complete";
export const END_OF_ROUND = "end_of_round";
export const DISABLE_DASH = "disable_dash";
export const CURRENT_YEAR = "current_year";
export const FEEDBACK_VIEWED = "feedback_viewed";
export const LOCATION = "location";


export const PASSWORD_VISIBLE_AFTERINTRO = "tlInputPasswordAfterIntro";
export const PASSWORD_VISIBLE_AFTERSUBMIT_R1 = "tlInputPasswordAfterSubmit_R1";
export const PASSWORD_VISIBLE_AFTERFEEDBACK_R1 = "tlInputPasswordAfterFeedback_R1";
export const PASSWORD_VISIBLE_AFTERSUBMIT_R2 = "tlInputPasswordAfterSubmit_R2";
export const PASSWORD_VISIBLE_AFTERFEEDBACK_R2 = "tlInputPasswordAfterFeedback_R2";
export const PASSWORD_VISIBLE_AFTERSUBMIT_R3 = "tlInputPasswordAfterSubmit_R3";

export const SCENARIO = "currentscenario";
export const ROUTES = {
    DEVELOPMENT_PLAN: 'consumer',
    SCENARIO: 'commercial',
    ACTION_PLAN: 'actionPlan',
    REPORTS: 'operations',
    DASHBOARD: 'dashboard',
    PASSWORD: 'password'
};

export const EVENTS = {
    RESET_TOOL_PAGE: "resettoolpage",
}

export const TUTORIALS_IMAGES = {
    "guideImages": ['assets/images/guide_01.jpg', 'assets/images/guide_02.jpg', 'assets/images/guide_03.jpg', 'assets/images/guide_04.jpg', 'assets/images/guide_05.jpg', 'assets/images/guide_06.jpg'],
    "pnvImages": ['assets/images/priceandvolume_01.jpg', 'assets/images/priceandvolume_02.jpg', 'assets/images/priceandvolume_03.jpg', 'assets/images/priceandvolume_04.jpg', 'assets/images/priceandvolume_05.jpg', 'assets/images/priceandvolume_06.jpg', 'assets/images/priceandvolume_07.jpg'],
    "fvcImages": ['assets/images/fixedvsvariablecosts_01.jpg', 'assets/images/fixedvsvariablecosts_02.jpg', 'assets/images/fixedvsvariablecosts_03.jpg', 'assets/images/fixedvsvariablecosts_04.jpg', 'assets/images/fixedvsvariablecosts_05.jpg', 'assets/images/fixedvsvariablecosts_06.jpg', 'assets/images/fixedvsvariablecosts_07.jpg', 'assets/images/fixedvsvariablecosts_08.jpg', 'assets/images/fixedvsvariablecosts_09.jpg', 'assets/images/fixedvsvariablecosts_10.jpg', 'assets/images/fixedvsvariablecosts_11.jpg', 'assets/images/fixedvsvariablecosts_12.jpg'],
    "aswotImages": ['assets/images/advancedswot_01.jpg', 'assets/images/advancedswot_02.jpg', 'assets/images/advancedswot_03.jpg', 'assets/images/advancedswot_04.jpg', 'assets/images/advancedswot_05.jpg', 'assets/images/advancedswot_06.jpg', 'assets/images/advancedswot_07.jpg', 'assets/images/advancedswot_08.jpg', 'assets/images/advancedswot_09.jpg', 'assets/images/advancedswot_10.jpg'],
    "lvocImages": ['assets/images/customerlifetimevalue_01.jpg', 'assets/images/customerlifetimevalue_02.jpg', 'assets/images/customerlifetimevalue_03.jpg', 'assets/images/customerlifetimevalue_04.jpg', 'assets/images/customerlifetimevalue_05.jpg', 'assets/images/customerlifetimevalue_06.jpg', 'assets/images/customerlifetimevalue_07.jpg', 'assets/images/customerlifetimevalue_08.jpg'],
    "cedImages": ['assets/images/enablersvsdifferentiators_01.jpg', 'assets/images/enablersvsdifferentiators_02.jpg', 'assets/images/enablersvsdifferentiators_03.jpg', 'assets/images/enablersvsdifferentiators_04.jpg', 'assets/images/enablersvsdifferentiators_05.jpg', 'assets/images/enablersvsdifferentiators_06.jpg', 'assets/images/enablersvsdifferentiators_07.jpg', 'assets/images/enablersvsdifferentiators_08.jpg'],
    "roaImages": ['assets/images/returnonassets_01.jpg', 'assets/images/returnonassets_02.jpg', 'assets/images/returnonassets_03.jpg', 'assets/images/returnonassets_04.jpg', 'assets/images/returnonassets_05.jpg', 'assets/images/returnonassets_06.jpg'],
    "hiqroaImages": ['assets/images/highimpactquestionsroa_01.jpg', 'assets/images/highimpactquestionsroa_02.jpg', 'assets/images/highimpactquestionsroa_03.jpg', 'assets/images/highimpactquestionsroa_04.jpg', 'assets/images/highimpactquestionsroa_05.jpg', 'assets/images/highimpactquestionsroa_06.jpg']
}

export const TUTORIALS_MAP = {
        "tutorialPriceAndVolume": "pnvImages",
        "tutorialLifetimeCustomerValue": "lvocImages",
        "tutorialFixedVsVariableCosts": "fvcImages",
        "tutorialCriticalEnablersVsDifferentiators": "cedImages",
        "guideIntroductionWiB": "guideImages",
        "tutorialHighImpactQuestions": "hiqroaImages",
        "tutorialROA": "roaImages"
    }

@Injectable()
export class Utils {
    private _emitters: Dictionary = {};

    constructor(private router:Router) {}

    stripOutletFromUrl(url: any, outletName: string): string {
        let tree: UrlTree = (typeof url === "string") ? this.router.parseUrl(url) : url,
            treeFragment = tree.fragment,
            newUrl = '/';

        this.deleteDeepChildOutlet(tree.root, outletName);
        // get root children
        // if (tree.root !== undefined) {
        //     let children = tree.root.children,
        //         childrenRoutes = Object.keys(children),
        //         isDeleted = false;

        //     childrenRoutes.forEach((childRoute) => {
        //         isDeleted = this.deleteDeepChildOutlet(childrenRoutes[childRoute], outletName);
        //         if (isDeleted) {
        //             return false
        //         }
        //     })
        //     // delete rootChildren[outletName];
        return this.router.serializeUrl(tree);
    }

    deleteDeepChildOutlet(urlSegment: UrlSegmentGroup, outletName: string) {
        let children = urlSegment.children,
            childOutlets = Object.keys(children),
            isRouteFoundDeleted = false;

        if (childOutlets && childOutlets.length) {
            childOutlets.forEach((childOutlet) => {
                if (childOutlet === outletName) {
                    delete children[childOutlet];
                    isRouteFoundDeleted = true;
                    return false;
                }
            })
            if (isRouteFoundDeleted === false) {
                // process children
                childOutlets.forEach((childOutlet) => {
                    isRouteFoundDeleted = this.deleteDeepChildOutlet(children[childOutlet], outletName);
                    if (isRouteFoundDeleted) {
                        return false;
                    }
                })
            }
        }
        return isRouteFoundDeleted;
    }

    stripChildRouteFromUrl(url: string, childRouteName: string): string {
        let tree: UrlTree = this.router.parseUrl(url),
            treeFragment = tree.fragment,
            newUrl = '/',
            foundMatch: boolean = false;
        // if  (tree.root !== undefined) {
        //     let root = tree.root.children[PRIMARY_OUTLET],
        //     rootSegments = root.segments,
        //     index = 0;

        //     rootSegments.forEach(segment => {
        //         if (segment.path === childRouteName) {
        //             rootSegments.splice(index, 1);
        //             foundMatch = true;
        //         }
        //         index++;
        //     });
        //     newUrl = this.router.serializeUrl(tree);
        // }
        // if (foundMatch) {
        //     return newUrl;
        // }

        this.deleteDeepChildRoute(tree.root, childRouteName);
        return this.router.serializeUrl(tree);
        /* try and remove the child route from url using a pattern match */
        /* TODO: make search above recursive so it searches deep children as well */

        // let regex = new RegExp("(/)?" + childRouteName + "(//)?");
        // return this.router.url.replace(regex, '');
        
    }

    deleteDeepChildRoute(urlSegments: UrlSegmentGroup, childRouteName: string) {
        let segments = urlSegments.segments, index = 0, isSegmentFound = false;

        // check each segment path first
        // then check each childoutlet and their segment paths
        segments.forEach((segment) => {
            if (segment.path === childRouteName) {
                segments.splice(index, 1);
                isSegmentFound = true;

                return false;
            }
            ++index;
        })
        if (!isSegmentFound) {
            let children = urlSegments.children,
                childOutlets = Object.keys(children);

            childOutlets.forEach((outlet) => {
                isSegmentFound = this.deleteDeepChildRoute(children[outlet], childRouteName);
                if (isSegmentFound) {
                    // delete the outlet if it does not have any children or segments left
                    if (children[outlet].segments.length === 0 && children[outlet].numberOfChildren === 0) {
                        delete children[outlet];
                    }
                    return false;
                }
            });

        }
        return isSegmentFound;
    }
    
    generateFeedbackUrl(id: string): string {
        let url: string = DASHBOARD_PATH + "/(" + FEEDBACK_OUTLET + ":feedback/" + id + ")";
        return url;
    }

    getCharFromCode(code:number, base:number): string {
        if (base) {
            code += base;
        }
        return String.fromCharCode(code);
    }


    isOutletRouteActive(outletName: string, url: string): boolean {
        let urlTree = this.router.parseUrl(url),
            treeFragment = urlTree.fragment,
            rootChildren = (urlTree.root && urlTree.root.children) ? urlTree.root.children : null;
        // check if routeroutlet is present in rootchildren list
        if (rootChildren && rootChildren[PRIMARY_OUTLET] 
            && rootChildren[PRIMARY_OUTLET].children 
            && rootChildren[PRIMARY_OUTLET].children[outletName] !== undefined) 
            return true;

        return false;
    }

    isChildRouteActive(routeName:string, url: string, checkAllChildren?: boolean): boolean {
        let tree: UrlTree = this.router.parseUrl(url),
            treeFragment = tree.fragment,
            newUrl = '/',
            isActive = false;
        if (tree.root !== undefined) {
            let root = tree.root.children[PRIMARY_OUTLET],
                rootSegments = root.segments;

            rootSegments.forEach(segment => {
                if (segment.path === routeName) {
                    isActive = true;
                    return false;
                }
            });
        }
        if (isActive) {
            return isActive;
        }

        // if not found on primary route - check other child routes
        if (checkAllChildren) {
            let root = tree.root.children[PRIMARY_OUTLET],
                rootSegments = root.segments;
            let pathFound: boolean = false;
            let children = Object.keys(root.children);
            children.forEach(child => {
                let childRoute = root.children[child];
                childRoute.segments.forEach(segment => {
                    if (segment.path === routeName) {
                        isActive = true;
                        return false;
                    }
                })
            });
            // tree.root.children.forEach((childRoute) => {

            // });
        }
        return isActive;
    }

    private createObservableFor(key: string, isSynchronous:boolean): EventEmitter<any> {
        let emitter: EventEmitter<any> = new EventEmitter(!isSynchronous);
        this._emitters[key] = emitter;
        return emitter;
    }

    getObservable(key:string, isSynchronous:boolean = false): EventEmitter<any> {
        if (this.hasEmitter(key)) {
            return this._emitters[key];
        }
        return this.createObservableFor(key, isSynchronous);
    }


    hasEmitter(key: string): boolean {
        if (this._emitters[key] !== undefined) {
            return true;
        }
        return false;
    }
}


export { DataStore } from './datastore';
export { Dictionary } from './dictionary';
export { PersistTabState } from './persisttabstate';
export { FileSaver } from './filesaver';