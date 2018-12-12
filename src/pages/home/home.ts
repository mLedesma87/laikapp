import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { ApodData,ApodNasaProvider } from '../../providers/apod-nasa/apod-nasa';
import { IonicImageLoader } from 'ionic-image-loader';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { SplashScreen } from '@ionic-native/splash-screen';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  imgUrl;
  title;
  date;
  description;
  dateSelected;
  infoApod;
  dataFav;
  isFavorite = false;
  currentMax:string;
  arrFav: Array<ApodData> = [];
 
  constructor(public navCtrl: NavController, public apodNasaProvider:ApodNasaProvider, public imgLoader:IonicImageLoader, 
  	public spinnerDialog:SpinnerDialog, public splashScreen:SplashScreen, 
  	public storage:Storage, public events: Events) {
      this.currentMax = moment().format('YYYY-MM-DD');
  }

  ionViewDidLoad() {
    this.spinnerDialog.show();
    //this.currentMax = moment().format('YYYY-MM-DD');
    this.apodNasaProvider.getApodData()
    .then(data => {
      this.getApodData(data);
      this.splashScreen.hide();
    });
  }

  getApodData(response) {
  	this.isFavorite = false;
  	if(response.media_type === 'video' ) {
	  	//var iframe = document.createElement('iframe');
	  	//iframe.setAttribute( "width" , "100%");
	  	//iframe.setAttribute( "height" , "300px");
	  	//iframe.setAttribute( "sandbox", "allow-same-origin allow-scripts" );
	  	//iframe.setAttribute( "allowfullscreen", "true" );
	    //iframe.setAttribute( "frameborder", "0" );
	    //var url = response.url + '?autoplay=1&showinfo=0&rel=0';
	    //iframe.setAttribute( "src", url);
	    //document.getElementById('videoContainer').appendChild( iframe );
  	} else {
  	  this.infoApod = response;
	    this.imgUrl = response.url;
      this.title = response.title;
      this.date = response.date;
      this.description = response.explanation;
  	}

  	this.storage.get('fav').then((favData) => {
  	  if (favData !== null) {
  	  	for (let info of favData) {
    			if (info.date === this.infoApod.date) {
    			 this.isFavorite = true;
    			}
  	  	}
  	  }
  	  if (this.arrFav.length > 0) {
    		for (let fav of this.arrFav) {
    		  if (fav.date === this.date) {
    		    this.isFavorite = true;
    		  }
    		}
  	  }
    });
    this.spinnerDialog.hide();
  }

  dateChange(){
    this.imgUrl = '';
    this.title = '';
    this.date = '';
    this.description = '';
    this.spinnerDialog.show();
    this.apodNasaProvider.getApodByDate(this.dateSelected)
    .then(data => {
      this.getApodData(data);
    });
  }

  addToFavorites() {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) this.arrFav.push(this.infoApod);
  }

  ionViewDidLeave() {
  	if (this.arrFav.length > 0) {
  	  	this.storage.get('fav').then((favData) => {
  	  		
          if (favData !== null) {
            for (let fav of favData) {
              this.arrFav.push(fav);
            }
          }
          this.storage.set('fav', this.arrFav).then(()=>{
            this.events.publish('fav:add');
          });
  	  	});
  	}
  }
}
