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
}

@Injectable()
export class ApodNasaProvider {

	apiKey = '9OnoQD9of0VPbNmGrCdMGGCLP1ADpx1GIqfSZ2R6';
	url:string;
  apodData;

  constructor(public http: HttpClient) {
    console.log('Hello ApodNasaProvider Provider');
    this.url = 'https://api.nasa.gov/planetary/apod?api_key=' + this.apiKey;
  }

  getApodByDate(date) {
    return new Promise(resolve => {
      this.http.get(this.url + '&date=' +date).subscribe(data => {
        this.apodData = data;
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
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
}
