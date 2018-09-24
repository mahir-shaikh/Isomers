import { Injectable, EventEmitter } from '@angular/core';
import { Router, Route, UrlTree, UrlSegment } from '@angular/router';
import { UrlSegmentGroup } from '@angular/router/src/url_tree';
import { Dictionary } from './dictionary';
import { PRIMARY_OUTLET } from '../utils';
import { CalcApi } from '../shared/external-module';
import { CalcService } from '@btsdigital/ngx-isomer-core';
import * as Collections from 'typescript-collections';

@Injectable()
export class Utils {
    private _emitters: Dictionary = {};
    private _defaultModel: CalcApi;
    constructor(private router: Router) { }

    stripOutletFromUrl(url: any, outletName: string): string {
        const tree: UrlTree = (typeof url === 'string') ? this.router.parseUrl(url) : url,
            treeFragment = tree.fragment,
            newUrl = '/';

        this.deleteDeepChildOutlet(tree.root, outletName);

        return this.router.serializeUrl(tree);
    }

    deleteDeepChildOutlet(urlSegment: UrlSegmentGroup, outletName: string) {
        const children = urlSegment.children,
            childOutlets = Object.keys(children);
        let isRouteFoundDeleted = false;

        if (childOutlets && childOutlets.length) {
            childOutlets.forEach((childOutlet) => {
                if (childOutlet === outletName) {
                    delete children[childOutlet];
                    isRouteFoundDeleted = true;
                    return false;
                }
            });
            if (isRouteFoundDeleted === false) {
                // process children
                childOutlets.forEach((childOutlet) => {
                    isRouteFoundDeleted = this.deleteDeepChildOutlet(children[childOutlet], outletName);
                    if (isRouteFoundDeleted) {
                        return false;
                    }
                });
            }
        }
        return isRouteFoundDeleted;
    }

    stripChildRouteFromUrl(url: string, childRouteName: string): string {
        const tree: UrlTree = this.router.parseUrl(url),
            treeFragment = tree.fragment,
            newUrl = '/',
            foundMatch: boolean = false;
        this.deleteDeepChildRoute(tree.root, childRouteName);
        return this.router.serializeUrl(tree);
    }

    deleteDeepChildRoute(urlSegments: UrlSegmentGroup, childRouteName: string) {
        const segments = urlSegments.segments;
        let index = 0, isSegmentFound = false;

        // check each segment path first
        // then check each childoutlet and their segment paths
        segments.forEach((segment) => {
            if (segment.path === childRouteName) {
                segments.splice(index, 1);
                isSegmentFound = true;

                return false;
            }
            ++index;
        });
        if (!isSegmentFound) {
            const children = urlSegments.children;
            const childOutlets = Object.keys(children);

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

    getCharFromCode(code: number, base: number): string {
        if (base) {
            code += base;
        }
        return String.fromCharCode(code);
    }

    isOutletRouteActive(outletName: string, url: string): boolean {
        const urlTree = this.router.parseUrl(url),
            treeFragment = urlTree.fragment,
            rootChildren = (urlTree.root && urlTree.root.children) ? urlTree.root.children : null;
        // check if routeroutlet is present in rootchildren list
        if (rootChildren && rootChildren[PRIMARY_OUTLET]
            && rootChildren[PRIMARY_OUTLET].children
            && rootChildren[PRIMARY_OUTLET].children[outletName] !== undefined) {
            return true;
        }

        return false;
    }

    isChildRouteActive(routeName: string, url: string, checkAllChildren?: boolean): boolean {
        const tree: UrlTree = this.router.parseUrl(url),
            treeFragment = tree.fragment,
            newUrl = '/';
        let isActive = false;
        if (tree.root !== undefined) {
            const root = tree.root.children[PRIMARY_OUTLET],
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
            const root = tree.root.children[PRIMARY_OUTLET],
                rootSegments = root.segments;
            const pathFound: boolean = false;
            const children = Object.keys(root.children);
            children.forEach(child => {
                const childRoute = root.children[child];
                childRoute.segments.forEach(segment => {
                    if (segment.path === routeName) {
                        isActive = true;
                        return false;
                    }
                });
            });
        }
        return isActive;
    }

    private createObservableFor(key: string, isSynchronous: boolean): EventEmitter<any> {
        const emitter: EventEmitter<any> = new EventEmitter(!isSynchronous);
        this._emitters[key] = emitter;
        return emitter;
    }

    getObservable(key: string, isSynchronous: boolean = false): EventEmitter<any> {
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

    stringifyDictionary(dict: Collections.Dictionary<any, any>): string {
        const _dict: Dictionary = new Dictionary();
        dict.forEach((key, value) => {
            _dict[key] = value;
        });
        return JSON.stringify(_dict);
    }

    dictionaryToArray(dict: Collections.Dictionary<any, any>): Array<any> {
        const returnArray: Array<any> = [];
        dict.forEach((key, value) => {
            returnArray.push(value);
        });

        return returnArray;
    }

    resetInputs(arrRefs: Array<string>, calcServiceInstance: CalcService, useRawValue?: boolean): Promise<any> {
        let USE_RAW_VALUE = (typeof useRawValue !== "undefined" && useRawValue) ? useRawValue : false;
        return new Promise((resolve, reject) => {
            const arrPromises = [];
            this.getPristineModel(calcServiceInstance).then((calcApi: CalcApi) => {
                arrRefs.forEach((ref, refIndex) => {
                    const defaultVal = calcApi.getValue(ref, USE_RAW_VALUE);
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
        return calcServiceInstance.buildModel().then((calcApi: CalcApi) => {
            this._defaultModel = calcApi;
            return calcApi;
        });
    }
}
