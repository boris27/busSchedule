import { Component } from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {isUndefined} from "util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  result;
  isAdmin: boolean;
  checkedObj;
  constructor(private http: Http) {
      this.isAdmin = false;
  }
  update(target):void {
    this.http.post('/db/update', [ this.checkedObj._id, this.validateSendData(target) ])
      .subscribe(data => {this.checkedObj = null; this.load(null)});
  }
  checkedForUpdate(target):void {
    this.checkedObj = this.result[target.parentElement.querySelector('td').innerHTML];
    this.result = [this.checkedObj];
  }
  remove(event):void {
    event.stopPropagation();
    this.http.post('/db/remove', { id: this.result[event.target.parentElement.parentElement.querySelector('td').innerHTML]._id } )
      .subscribe(data=> this.load(null));
  }
  login(target): void {
    let tempData = target.querySelectorAll('input');
    this.http.post('/login', { login: tempData[0].value, password: tempData[1].value })
      .subscribe(data=> {this.isAdmin=data.json()});
  }
  load(target):void {
    this.http.post('/db/load', this.validateSendData(target)).map(data=> {
       return data = data.json().map((current)=> {
          current.departTime = new Date(current.departTime);
          current.arriveTime = new Date(current.arriveTime);
          return current;
       });
    })
      .subscribe(data=> this.result = data);
  }
  add(target): void {
    this.http.post('/db/add', this.validateSendData(target)).subscribe(data=> this.load(null) )
  }
  parseDate(time1, time2): Array<number> {
    let tempArr = [];
    if(time1.length == 5 && time1.search(/:/)==2 && time1.match(/\d/g).length == 4
      && +(time1[0]+time1[1])<23  && +(time1[3]+time1[4])<59) {
      tempArr = tempArr.concat(time1.split(/:/));
    } else {
      tempArr.push(undefined, undefined);
    }
    if (time2.length == 5 && time2.search(/:/)==2 && time2.match(/\d/g).length == 4
      && +(time2[0]+time2[1])<23  && +(time2[3]+time2[4])<59){
      tempArr = tempArr.concat(time2.split(/:/));
    } else {
      tempArr.push(undefined, undefined);
    }
    return tempArr
  }
  validateSendData(target): Object {
    let tempData;
    if (target) {
      let temp = target.parentElement.querySelectorAll('input');
      let tempArr = [];
      for(let i=0; i < temp.length; i++){
        tempArr.push(isUndefined(temp[i].value) ? null : temp[i].value);
      }
      let dateArr = this.parseDate(tempArr[2], tempArr[3]);
      if (tempArr.length == 4){
        tempData = {
          departPoint: tempArr[0],
          arrivePoint: tempArr[1],
          departTime: new Date(2017, 9, 1, dateArr[0], dateArr[1], 0),
          arriveTime: new Date(2017, 9, 1, dateArr[2], dateArr[3], 0)
        };
      } else {
        tempData = {
          departPoint: tempArr[0],
          arrivePoint: tempArr[1],
          departTime: new Date(2017, 9, 1, dateArr[0], dateArr[1], 0),
          arriveTime: new Date(2017, 9, 1, dateArr[2], dateArr[3], 0),
          cost: tempArr[4],
          freeSits: tempArr[5]
        };
      }
    }
    for (let key in tempData) {
      if(tempData[key] instanceof Date) {
        if (isNaN(+tempData[key])) {
          delete tempData[key]
        }
      } else {
        if(!tempData[key].length)
          delete tempData[key]
      }
    }
    return tempData
  }
}
