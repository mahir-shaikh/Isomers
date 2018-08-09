import { Injectable, EventEmitter } from '@angular/core';
import { Router, Route, UrlTree, UrlSegment } from '@angular/router';
import { UrlSegmentGroup } from '@angular/router/src/url_tree'; 
import { Dictionary } from './dictionary';
import { PRIMARY_OUTLET } from '../utils';
import { CalcApi, CalcService } from '../calcmodule';
import * as Collections from 'typescript-collections';

@Injectable()
export class Utils {
    private _emitters: Dictionary = {};
    private _defaultModel: CalcApi;
    constructor(private router:Router) {}

    stripOutletFromUrl(url: any, outletName: string): string {
        let tree: UrlTree = (typeof url === "string") ? this.router.parseUrl(url) : url,
            treeFragment = tree.fragment,
            newUrl = '/';

        this.deleteDeepChildOutlet(tree.root, outletName);
        
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
        this.deleteDeepChildRoute(tree.root, childRouteName);
        return this.router.serializeUrl(tree);
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

    stringifyDictionary(dict:Collections.Dictionary<any, any>): string {
        var _dict:Dictionary = new Dictionary();
        dict.forEach((key, value) => {
            _dict[key] = value;
        })
        return JSON.stringify(_dict);
    }

    dictionaryToArray(dict: Collections.Dictionary<any, any>): Array<any> {
        let returnArray: Array<any> = [];
        dict.forEach((key, value) => {
            returnArray.push(value);
        });

        return returnArray;
    }

    resetInputs(arrRefs: Array<string>, calcServiceInstance: CalcService): Promise<any> {

        return new Promise((resolve, reject) => {
            let arrPromises = [];
            this.getPristineModel(calcServiceInstance).then((calcApi: CalcApi) => {
                arrRefs.forEach((ref, refIndex) => {
                    let defaultVal = calcApi.getValue(ref, true);
                    arrPromises.push(calcServiceInstance.setValue(ref, defaultVal));
                });
                Promise.all(arrPromises).then(() => {
                    resolve();
                });
            });
        });
    }

    getPristineModel(calcServiceInstance: CalcService): Promise<CalcApi> {
        if (this._defaultModel) {
            return Promise.resolve(this._defaultModel);
        }
        return calcServiceInstance.buildModel();
    }
}