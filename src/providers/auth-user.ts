import { Injectable } from '@angular/core';
import { NavController, Nav, MenuController, Platform, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthUser {
	isLoggedIn: boolean = false;
	db:any;
	constructor(
		public http: Http,
		private sqlite: SQLite,
		public alertCtrl : AlertController,
	) {
		//console.log('Hello AuthUser Provider');
	}

	//Loginlogin(obj){
	login(obj){
		return new Promise(( resolve ) =>{
			if (obj.url == "") {
				setTimeout( () => {resolve(false);} , 3000);
			}else{
				var headers = new Headers();
				var encr = obj.user + ":" + obj.password;
				var resp: boolean = false;
				headers.append('Authorization',"Basic " + btoa(encr));
				headers.append('Cache-Control' , 'no-cache');
				let options = new RequestOptions({ headers: headers });
				let url = obj.url +  "/api/data/collections/name/C_Lista_Pedidos_Val";
				this.http.get(url , options).map(res => res.json()).subscribe(data => { resp = true; this.isLoggedIn=true; },error => { resp = false;this.isLoggedIn=false; } )
				setTimeout(() => {resolve(resp)}, 3000);
			 }
		});
	}

	getUser(){
		return new Promise(( resolve ) =>{
			var admins = ["Carlos Arreguin", "Carlos.Arreguin", "Lizbeth Lopez" , "Lizbeth.Lopez", "luis e lopez", "luis.lopez"];
			for(var i = 0; i < admins.length; i++){
				admins[i] = admins[i].toUpperCase();
			}

			let obj: object;
			let user = "--";
			let password = "--";
			let url = "--";
			this.sqlite.create({name: 'datareg.db',location: 'default'})
			.then((db: SQLiteObject) => {
				db.executeSql("SELECT * FROM reg", {})
					.then((data) => {
						if(data.rows.length > 0) {
							for(var i = 0; i < data.rows.length; i++) {
								user = data.rows.item(i).username;//"luis e lopez";//data.rows.item(i).username;
								password = data.rows.item(i).password;//"password"//
								url = data.rows.item(i).url;//"http://aicdev.com/kb/control.nsf"//
								obj["user"] = data.rows.item(i).username;//"luis e lopez";//data.rows.item(i).username;
								obj["password"] = data.rows.item(i).password;//"password"//
								obj["url"] = data.rows.item(i).url;//"http://aicdev.com/kb/control.nsf"//
							}//
						}
						obj["admin"] = (admins.indexOf(obj["user"].toUpperCase()) > -1) ? true : false;
						resolve(obj["admin"]);
					})
				.catch(e => console.log(e));
			}).catch( e => {
				console.log(e);
			});
		});
	}

	getorders( url , options ){
		return this.http.get(url , options)
		.do( res => {
			//console.log(res);
		});
	}

	putorders( url , body, options ){
		return this.http.post(url, body,options)
		.do( res => {
			//console.log(res);
		});
	}
}
