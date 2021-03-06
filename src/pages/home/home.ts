import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { ApodData,ApodNasaProvider } from '../../providers/apod-nasa/apod-nasa';
import { IonicImageLoader } from 'ionic-image-loader';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dateSelected:string;
  infoApod:ApodData;
  isFavorite:boolean = false;
  currentMax:string;
  copyrightInfo:boolean;
  arrFav: Array<ApodData> = [];
  videoId:string;
  isVideo:boolean;
 
  constructor(public navCtrl: NavController, public apodNasaProvider:ApodNasaProvider, public imgLoader:IonicImageLoader, 
  	public spinnerDialog:SpinnerDialog, public splashScreen:SplashScreen, 
  	public storage:Storage, public events: Events, public photoViewer:PhotoViewer, public youtube: YoutubeVideoPlayer) {
      this.currentMax = moment().format('YYYY-MM-DD');
  }

  ionViewDidLoad() {
    this.spinnerDialog.show();
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
      //this.infoApod = response;
      this.isVideo = true;
      let url = response.url;
      this.videoId = url.substr(url.lastIndexOf('/') + 1);
      if (this.videoId.indexOf('?') !== -1) this.videoId = this.videoId.substr(0,this.videoId.indexOf('?'));
      console.log(this.videoId);
      response.url = 'https://img.youtube.com/vi/'+ this.videoId+'/0.jpg';
      this.infoApod = response;
      //this.youtube.openVideo(videoId);      
  	} else {
  	  this.infoApod = response;
      this.copyrightInfo = response.copyright != undefined;
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
    		  if (fav.date === this.infoApod.date) {
    		    this.isFavorite = true;
    		  }
    		}
  	  }
    });
    this.spinnerDialog.hide();
  }

  dateChange(){
    this.infoApod = undefined;
    this.spinnerDialog.show();
    this.apodNasaProvider.setDate(this.dateSelected);
    this.apodNasaProvider.getApodByDate()
    .then(data => {
      this.getApodData(data);
    });
  }

  addToFavorites() {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) this.arrFav.push(this.infoApod);
  }

  showImageFullScreen() {
    if (this.infoApod.media_type === 'video') {
      this.youtube.openVideo(this.videoId);
    } else {
      this.photoViewer.show(this.infoApod.hdurl);  
    }    
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
