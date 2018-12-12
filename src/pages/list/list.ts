import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { IonicImageLoader } from 'ionic-image-loader';
import { ApodData } from '../../providers/apod-nasa/apod-nasa';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  arrFav: Array<ApodData> = [];
  arrFavDel: Array<ApodData> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public storage:Storage, public spinnerDialog:SpinnerDialog, public events: Events,public imgLoader:IonicImageLoader) {
          this.spinnerDialog.show();
          this.storage.get('fav').then((favData) => {
            this.arrFav = favData;
            this.spinnerDialog.hide();   
          });
  }

  ionViewDidLoad() {
    this.events.subscribe('fav:add', () => {
      this.spinnerDialog.show();
      this.storage.get('fav').then((favData) => {
        this.arrFav = favData;
        this.spinnerDialog.hide();    
      });
    });
  }

  deleteFavourite(itmCliked) {
    let idRm:string;
    
    if (itmCliked.target.parentElement.parentElement.id != '') {
      idRm = itmCliked.target.parentElement.parentElement.id;
    } else {
      idRm = itmCliked.target.parentElement.id;
    }
    
    let arrFavDel: Array<ApodData> = [];
    let arrFavorites = this.arrFav;

    for (let infoFav of arrFavorites) {
      if (infoFav.date !== idRm) {
        arrFavDel.push(infoFav);
      }
    }

    this.arrFav = arrFavDel;
    this.storage.set('fav', this.arrFav);
  }
}
