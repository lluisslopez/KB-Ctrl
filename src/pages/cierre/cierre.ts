import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController , Nav } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import DateFormat from "dateformat";
import { AuthUser } from '../../providers/auth-user';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

//import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-cierre',
	templateUrl: 'cierre.html',
})
export class Cierre {
	user : string = "";
	password : string = "";
	url : string= "";
	public orders: any;
	public admin: any = true;
	public ban: any = false;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public http: Http ,
		private alertCtrl: AlertController,
		public nav : Nav,
		private authUser : AuthUser,
		private sqlite: SQLite,
	) {
		var admins = ["Carlos Arreguin", "Carlos.Arreguin", "Lizbeth Lopez" , "Lizbeth.Lopez", "luis e lopez", "luis.lopez"];
		for(var i = 0; i < admins.length; i++){
			admins[i] = admins[i].toUpperCase();
		}
		let access;
		/*
		this.user = "luis e lopez";
		this.password = "password";
		this.url = "http://aicdev.com/kb/control.nsf";
		this.getInformation( this.user, this.password, this.url);
		*/
		///*

		this.sqlite.create({name: 'datareg.db',location: 'default'})
		.then((db: SQLiteObject) => {
			db.executeSql("SELECT * FROM reg", {})
				.then((data) => {
					if(data.rows.length > 0) {
						for(var i = 0; i < data.rows.length; i++) {
							this.user = data.rows.item(i).username;//"luis e lopez";
							this.password = data.rows.item(i).password;//"password"
							this.url = data.rows.item(i).url;//"http://aicdev.com/kb/control.nsf"
						}
						access = (admins.indexOf(this.user.toUpperCase()) > -1) ? true : false;
						if (access) {
							this.admin = true;
							this.ban = true;
							this.getInformation( this.user, this.password, this.url);
							//this.authUser.getorders();
						}else{
							this.admin = false;
							this.ban = true;
						}
					}
				})
			.catch(e => console.log(e));
		}).catch( e => {
			console.log(e);
		});
		//*/
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad Cierre');
	}

	getInformation( user , pass , url){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		let options = new RequestOptions({ headers: headers });
		let urls =  this.url + "/api/data/collections/name/" + "Control_Show_Get";
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.orders = data;
			for (var key in this.orders) {
				var date = new Date(this.orders[key].DATE_CLOSE);
				//let value = this.orders[key].DATE_CLOSE;
				this.orders[key].DATE_CLOSE = DateFormat(date, "mmm-dd-yyyy");
			}
		});
	}
	prelogin(){
		this.nav.push( "CierreForm" , {user: this.user, pass: this.password , url: this.url } );
	}

	presentAlert(title, msj) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msj,
			buttons: ['Close']
		});
		alert.present();
	}

	check(id,nombre){
		this.nav.push( "CierreDo" ,  {id : id , nombre : nombre, user: this.user, pass: this.password , url: this.url } );
	}
}
