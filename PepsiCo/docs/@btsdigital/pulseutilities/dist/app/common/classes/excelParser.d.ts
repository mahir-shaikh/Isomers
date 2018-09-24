import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs/Rx";
export interface UploadResult {
    result: "failure" | "success";
    payload: any;
}
export declare class XLSXParser implements OnInit, OnDestroy {
    private subscription;
    filesSubject: Subject<File>;
    private _uploadedXls;
    uploadedXls: EventEmitter<UploadResult>;
    constructor();
    ngOnInit(): void;
    XLSXParser(): void;
    ngOnDestroy(): void;
}
