import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController , Nav } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import DateFormat from "dateformat";
import { AuthUser } from '../../providers/auth-user';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
	selector: 'page-box',
	templateUrl: 'box.html',
})
export class Box {
	orders:any;
	user : string = "";
	password : string = "";
	url : string= "";
	public admin: any = true;
	public ban: any = false;
	loader : any;
	constructor(
			public navCtrl: NavController,
			public navParams: NavParams,
			public http: Http ,
			private alertCtrl: AlertController,
			public nav : Nav,
			private authUser : AuthUser,
			private sqlite: SQLite,
			public loadingCtrl : LoadingController,
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
		//this.getInformation( this.user, this.password, this.url);
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
						}//*/
						access = (admins.indexOf(this.user.toUpperCase()) > -1) ? true : false;
						if (access) {
							this.admin = true;
							this.ban = true;
							this.getInformation( this.user, this.password, this.url);
						}else{
							this.admin = false;
							this.ban = true;
						}
						///*
					}
				})
			.catch(e => console.log(e));
		}).catch( e => {
			console.log(e);
		});
		//*/
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Box');
	}

	getInformation( user , pass , url){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		headers.append('Cache-Control' , 'no-cache');
		let options = new RequestOptions({ headers: headers });
		let urls =  this.url + "/api/data/collections/name/" + "C_Coins_Form";
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.orders = data;
			//console.log(data);
			for (var key in this.orders) {
				var date = new Date(this.orders[key].DATE);
				let value = this.orders[key].DATE;
				this.orders[key].DATE = DateFormat(date, "mmm-dd-yyyy");
			}
			//console.log(this.orders);
		});
	}

	prelogin(){
		this.nav.push( "BoxForm" , {user: this.user, pass: this.password , url: this.url } );
	}

	view(id, date){
		console.log(id);
		this.nav.push( "BoxDo" ,  {id : id , date : date, user: this.user, pass: this.password , url: this.url } );
	}

	done(id){
		this.presentLoading();
		let objSave = {
			"status" : "done",
		};
		this.saveDocumentHttp(objSave , id , "Pedidos");
	}

	trash(id){
		this.presentLoading();
		this.deleteDocumentHttp(id);
	}



	saveDocumentHttp(obj , id , formname){
		let body = JSON.stringify(obj);
		var headers = new Headers();
		headers.append('Content-Type','application/json');
		headers.append('Accept','application/json');
		headers.append('X-HTTP-Method-Override','PATCH');
		headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
		let options = new RequestOptions({ headers: headers });
		let urlvar =  this.url + "/api/data/documents/unid/"+ id ;
		this.http.post(urlvar , body , options)
		.subscribe(data=>{
			this.loader.dismiss();
			this.presentAlert("SUCCESS" , "Document was done");
			this.nav.setRoot("Box");
		},error => {
				this.loader.dismiss();
				this.presentAlert("ERROR" , "Can't do document.");
				return false;
		});

	}

	deleteDocumentHttp(id){
		var headers = new Headers();
		headers.append('Content-Type','application/json');
		headers.append('Accept','application/json');
		headers.append('X-HTTP-Method-Override','PATCH');
		headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
		let options = new RequestOptions({ headers: headers });
		let urlvar =  this.url + "/api/data/documents/unid/"+ id ;
		this.http.delete(urlvar , options)
		.subscribe(data=>{
			this.loader.dismiss();
			this.presentAlert("SUCCESS" , "Document was deleted");
			this.nav.setRoot("Box");
		},error => {
				this.loader.dismiss();
				this.presentAlert("ERROR" , "Can't delete document.");
				return false;
		});

	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();
	}

	presentAlert(title, msj) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msj,
			buttons: ['Close']
		});
		alert.present();
	}

}
