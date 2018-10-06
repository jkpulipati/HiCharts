import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

import * as html2canvas from 'html2canvas';

import { UtilServiceService } from './util-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'sample';
  elementRefMap;
  @ViewChild('doughnutChart') doughnutChartContainer;
  @ViewChild('barChart') barChartContainer;

  constructor(private utilService: UtilServiceService) {
    this.elementRefMap = new Map();
    this.elementRefMap.set(1, 'doughnutChartContainer');
    this.elementRefMap.set(2, 'barChartContainer');
  };

  //const mySubject = new Rx.Subject();

  /**
   *
   * Subjects are both Observables and observers
   * It means that subjects can emit data, on top of having the 
   * capability of subscription.
   * 
   * A regular observable does not have next() method as regular observables
   * are not observers
   * 
   * Subjects are multicast (support multiple subscriptions) 
   * As a result, We can use a subject in a service to fetch some data, and send the
   * result to all the components that subscribed to that subject
   * 
   * Behaviour Subjects
   * When you subscribe to a behaviout subject, It will give you the last emitted value
   * It doesn't matter when you subscribe, you always get the 
   * last emitted value(latest value)
   * 
   * What if we want more than just lastest emitted value
   * Replay Subjects
   * Will pass the hitory length
   * For ex: If we pass 2 it get's the last two values as well as any new value
   * that comes up later on
   * 
   */

  ngOnInit() {
    let subject = new Subject<String>();
    
    // We subscribe to the subject
    subject.subscribe( data => console.log('Subscriber got data >>>>> ', data));
    
    // We use the subject to emit data
    subject.next('Hello');

    // Console result: Subscriber got data >>>>> Hello

    //multicast example
    let subject1 = new Subject<String>();

    subject1.subscribe( (data) => console.log('Subscriber 1 got data >>>>> ', data));

    subject1.subscribe( (data) => console.log('Subscriber 2 got data >>>>> ', data));

    subject1.next('JK');

    // Console result:
    // Subscriber 1 got data >>>>> JK
    // Subscriber 2 got data >>>>> JK


    let behaviourSubject = new BehaviorSubject<string>('JK');

    //behaviourSubject.next('AngularJS');

    behaviourSubject.subscribe( data => console.log('Subscriber data ', data));

    behaviourSubject.next('Angular');

    // Cosnole result
    // Subscriber data JK
    // Subscriber data AngularJS
    // Subscriber data Angular

    let replaySubject = new ReplaySubject<string>(2);

    replaySubject.next('JS');
    replaySubject.next('Hello');
    replaySubject.next('Angular');

    replaySubject.subscribe( data => console.log('Replay Subscribed value ', data));

    replaySubject.next('JK');

    // Cosnole result
    // Subscriber data Hello
    // Subscriber data Angular
    // Subscriber data JK
  }

  


  /**
   * 
   * @param elementName 
   * first get the html2canvas promise
   * if single elementName
   * get the html2canvas promise execute it, get the result
   */
  takeSnapShot(elementName) {
    if (elementName) {
      this.utilService.executeCanvasPromise(this.utilService.getCanvasPromise(this[this.elementRefMap.get(elementName)])).subscribe((canvas : any) => {
        let res = canvas[0].toDataURL('image/png');
        this.utilService.uploadCanvasImage([res]).subscribe(response => {
          console.log(response);
        })

      });
    } else {
      let arr = [];
      this.elementRefMap.forEach( (value, key) => {
        arr.push(this.utilService.getCanvasPromise(this[value]));
      });

      this.utilService.executeCanvasPromise(arr).subscribe((canvas: any) => {
        let res = canvas.map(canvasElem => {
          return canvasElem.toDataURL('image/png');
        });

        this.utilService.uploadCanvasImage(res).subscribe(response => {
          console.log(response);
        });
      });
    }

    // html2canvas(this.doughnutChartContainer.nativeElement).then(canvas => {
    //   console.log(canvas.toDataURL('image/png'));
    // });
  }


}
