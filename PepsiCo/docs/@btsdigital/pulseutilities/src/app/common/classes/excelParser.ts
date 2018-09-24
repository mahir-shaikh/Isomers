import { Injectable, ChangeDetectionStrategy, Output, EventEmitter, Component, OnDestroy, OnInit } from '@angular/core';
import { read, WorkBook, WorkSheet, utils } from "xlsx";
import { Observable, Subject, Subscription } from "rxjs/Rx";

export interface UploadResult {
  result: "failure" | "success";
  payload: any;
}

@Injectable()
export class XLSXParser implements OnInit, OnDestroy {
  private subscription: Subscription;
  public filesSubject: Subject<File>;
  private _uploadedXls: Observable<{ result: string, payload: any }>;

  @Output()
  public uploadedXls: EventEmitter<UploadResult> = new EventEmitter();

  constructor() {
    
  }

  ngOnInit() {
    
  }

  XLSXParser() {
      this.filesSubject = new Subject();
      this._uploadedXls = this.filesSubject.asObservable()
      .switchMap((file: File) => {
        return new Observable<any>((observer) => {
          let reader: any = new FileReader();
          reader.onload = (e) => {
            if (!e) {
                observer.next(reader.content);
            }
            else {
                observer.next((e.target as any).result);
            }
          };

          if (reader.readAsBinaryString === undefined) {
              FileReader.prototype.readAsBinaryString = function (fileData) {
                  var binary = "";
                  var pt = this;
                  var reader = new FileReader();
                  reader.onload = function (e) {
                      var bytes = new Uint8Array(reader.result);
                      var length = bytes.byteLength;
                      for (var i = 0; i < length; i++) {
                          binary += String.fromCharCode(bytes[i]);
                      }
                      //pt.result  - readonly so assign content to another property
                      pt.content = binary;
                      pt.onload();
                  }
                  reader.readAsArrayBuffer(fileData);
              }
          }

          reader.readAsBinaryString(file);
          return () => {
            reader.abort();
          };
        })
        .map((value: string) => {
          return read(value, {type: 'binary'});
        }).map((wb: WorkBook) => {
          return wb.SheetNames.map((sheetName: string) => {
            let sheet: WorkSheet = wb.Sheets[sheetName];
            let utils1 = utils.sheet_to_json(sheet, {header:1});
            
            return utils1;
          });
        }).map((results: Array<any>) => {
            
          return {result: 'success', payload: results};
        })
        .catch(e => Observable.of({result: 'failure', payload: e}));
      });

      this.subscription = this._uploadedXls.subscribe(this.uploadedXls);
  }

  ngOnDestroy() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
  }
}