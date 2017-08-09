import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, MenuController, Platform, AlertController } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import DateFormat from "dateformat";
import { AuthUser } from '../../providers/auth-user';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
	selector: 'page-gasto',
	templateUrl: 'gasto.html',
})
export class Gasto {
	user : string = "";
	password : string = "";
	url : string= "";
	OutGo : any;
	constructor(
		public navCtrl: NavController,
		public http : Http ,
		public nav : Nav,
		public menu: MenuController,
		private platform: Platform,
		public alertCtrl : AlertController,
		private authUser : AuthUser,
		private sqlite: SQLite,
	) {
		var admins = ["Carlos Arreguin", "Carlos.Arreguin", "Lizbeth Lopez" , "Lizbeth.Lopez", "luis e lopez", "luis.lopez"];
		for(var i = 0; i < admins.length; i++){
			admins[i] = admins[i].toUpperCase();
		}
		let access;
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
						this.getInformation( this.user, this.password, this.url);
					}
				})
			.catch(e => console.log(e));
		}).catch( e => {
			console.log(e);
		});
	}

	getInformation( user , pass , url){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		headers.append('Cache-Control' , 'no-cache');
		let options = new RequestOptions({ headers: headers });
		let urls =  this.url  + "/api/data/collections/name/" + "PedidosPenSend";
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.OutGo = data ;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Gasto');
	}

	public add_Reg(){
		this.nav.push( "GastoForm" , {user: this.user, pass: this.password , url: this.url } );
	}
}
