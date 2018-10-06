import { Injectable } from '@angular/core';

import * as html2canvas from 'html2canvas';

import { forkJoin } from "rxjs";
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  constructor(private http: Http) { }

  getCanvasPromise(elementName) {
    return html2canvas(elementName.nativeElement);
  }

  executeCanvasPromise(arr) {
    return forkJoin(arr);
  }

  uploadCanvasImage(res) {
    console.log('final stage',res, res.length);
    let url = res.length ? '' : '';
    return this.http.post('url', '');
  }
}
