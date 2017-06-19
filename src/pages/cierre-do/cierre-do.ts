import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController , Nav, LoadingController } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import { AuthUser } from '../../providers/auth-user';
import DateFormat from "dateformat";

@IonicPage()
@Component({
	selector: 'page-cierre-do',
	templateUrl: 'cierre-do.html',
})
export class CierreDo {
	public id : string= "";
	public nombre : string= "";
	public user : string = "";
	public password : string = "";
	public url : string= "";
	public products: Array<string> = [];
	public objData : any = {} ;
	public list :any = [];
	public listhide :any = [];
	loader : any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public http : Http ,
		public alertCtrl: AlertController,
		public nav : Nav,
		private authUser : AuthUser,
		public loadingCtrl : LoadingController,
	) {
		this.id = navParams.get('id');
		this.nombre = navParams.get('nombre');
		this.user = navParams.get('user');
		this.password = navParams.get('pass');
		this.url = navParams.get('url');
	}

	ionViewDidLoad() {
		this.getInformation( this.user, this.password, this.url, this.id);
	}

	getInformation( user , pass , url, id){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		let options = new RequestOptions({ headers: headers });
		let urls =  url + "/api/data/documents/unid/" + id ;
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.products = [];
			this.list = [];
			this.listhide = [];

			var date = new Date(data["DATE_CLOSE"]);
			data["DATE_CLOSE"] = DateFormat(date, "mmm-dd-yyyy HH:MM");
			this.products.push(data);
			let stringData = JSON.stringify(this.products[0]) ;
			this.objData = JSON.parse(stringData);
			let count = 0;
		});
	}

	logForm() {
		this.presentLoading();
		this.saveDocument(this.id);
	}

	saveDocument(id){
		let objSave = {"Get" : "Take",};
		this.saveDocumentHttp(objSave , id , "Pedidos");
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
		this.authUser.putorders(urlvar, body, options)
		.subscribe(data=>{
			this.loader.dismiss();
			this.presentAlert("SUCCESS" , "Order was bought");
			this.nav.setRoot("Cierre");
		},error => {
			this.loader.dismiss();
			this.presentAlert("ERROR" , "Can't send order.");
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
		return true;
	}
}
