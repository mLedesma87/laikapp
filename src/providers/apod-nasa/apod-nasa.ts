import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ApodData {
  date: string;
  explanation: string;
  hdurl: string;
  media_type:string;
  service_version:string;
  title:string;
  url:string;
  copyright:string;
}

@Injectable()
export class ApodNasaProvider {

	apiKey:string = '9OnoQD9of0VPbNmGrCdMGGCLP1ADpx1GIqfSZ2R6';
	url:string;
  apodData;
  lastDate:string;

  constructor(public http: HttpClient) {
    this.url = 'https://api.nasa.gov/planetary/apod?api_key=' + this.apiKey;
  }

  getApodData() {
    if (this.apodData === undefined) {
      return new Promise(resolve => {
        this.http.get(this.url).subscribe(data => {
          this.apodData = data;
          resolve(data);
        }, err => {
          console.log(err);
        });
      });
    } else {
      return new Promise(resolve => {resolve(this.apodData)});
    }
  }

  getApodByDate() {
    return new Promise(resolve => {
      this.http.get(this.url + '&date=' +this.lastDate).subscribe(data => {
        this.apodData = data;
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  setDate(date:string) {
    this.lastDate = date;
  }

}
