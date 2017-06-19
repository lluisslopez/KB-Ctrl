import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, NavParams, AlertController , Nav, LoadingController } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthUser } from '../../providers/auth-user';
import { SocialSharing } from '@ionic-native/social-sharing';
import DateFormat from "dateformat";
import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
	selector: 'page-orderdo',
	templateUrl: 'orderdo.html',
})
export class Orderdo {
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
	without= true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public http : Http ,
		public alertCtrl: AlertController,
		public nav : Nav,
		private authUser : AuthUser,
		public loadingCtrl : LoadingController,
		private socialSharing: SocialSharing,
		private clipboard: Clipboard,
	)
		{
			this.id = navParams.get('id');
			this.nombre = navParams.get('nombre');
			this.user = navParams.get('user');
			this.password = navParams.get('pass');
			this.url = navParams.get('url');
			//console.log(this.url);
		}

	ionViewDidLoad() {
		this.getInformation( this.user, this.password, this.url);
	}

	getInformation( user , pass , url){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		let options = new RequestOptions({ headers: headers });
		let urls =  url + "/api/data/documents/unid/" + this.id ;

		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.products = [];
			this.list = [];
			this.listhide = [];
			this.products.push(data);
			let stringData = JSON.stringify(this.products[0]) ;
			this.objData = JSON.parse(stringData);
			let count = 0;
			for (let entry of this.objData.Productos) {
				this.list[count] = false;
				this.listhide[count] = (this.objData.Pedido[count] === "SI") ? false : true ;
				count ++;
			}
			console.log(this.listhide);
		});
	}

	trackByIndex(index: number, value: number) {
		return index;
	}

	logForm() {
		this.presentLoading();
		let result = false;
		//console.log(this.list);
		var val = this.valMultiple();
		result = ( val ) ? true: result ;
		if (result) {
			this.saveDocument(this.id);
		}
		else{
			this.loader.dismiss();
			return false;
		}
	}

	saveDocument(id){
		let objSave = {
			//"Buy" : this.objtoArray(this.list , 0),
			"App" : "bought",
		};
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
		this.http.post(urlvar , body , options)
		.subscribe(data=>{
			this.loader.dismiss();
			this.presentAlert("SUCCESS" , "Order was bought");
			//this.nav.pop("Home");
			this.nav.setRoot("Home");
		},error => {
				this.loader.dismiss();
				this.presentAlert("ERROR" , "Can't buy order.");
				return false;
		});

	}

	valMultiple() {
		let result 	= false;
		( this.list.indexOf(true) > - 1) ? "" :   this.presentAlert( "WARNING" , "You need to select least one product." )  ;
		result = (  this.list.indexOf(true) > - 1) ? true : false;
		return (result )  ;
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

	objtoArray (obj , type) {
		var arr = [];
		var value = "";
		if( type >= 1  ) {
			for (var key in obj) {
				value = ( type == 1 )  ? ( (obj[key]) ? "SI" : "NO" ) : ( (obj[key]) ? "0" : "1" );
				arr.push( value );
			}
		}
		else {
			for (var key in obj) {
				value = obj[key];
				arr.push( value );
			}
		}
		return arr;
	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();
	}

	//Social Share
	socialShare( app ){
		let message = "";//this.nombre + '\n';
		let appName = "Messenger";
		let prod = this.products[0];
			let count = 0;
			for (let entry of prod["Productos"]) {
				if( prod["Pedido"][count] == "SI" ){
						//console.log( entry );
						let cantidad = prod["Cantidad"][count];
						let unidad = prod["Unidad"][count];
						let cadena = (this.without) ? "," + cantidad +" "+ unidad  :  "" ; 
						message += "- "+entry + cadena + '\n';
				}
				count ++;
			}
			//arr.push( value );
			//console.log(message);

		//}
		switch(app) {
			case "whatsapp": {
				this.socialSharing.shareViaWhatsApp(message, null, null).then(() => {
					// Sharing via email is possible
				}).catch(() => {
					// Sharing via email is not possible
				});
			break;
			}
			case "msj": {
				//this.socialSharing.shareViaTwitter(message, null, null).then(() => {
				this.socialSharing.shareViaSMS(message, "").then(() => {
				//this.socialSharing.shareVia(appName, message , null, null, null).then(() => {
					// Sharing via email is possible
				}).catch(() => {
					// Sharing via email is not possible
				});
			break;
			}
			case "Clipboard": {
				this.clipboard.copy(message);
			break;
			}
			default: {
				this.socialSharing.shareViaWhatsApp(message, null, null).then(() => {
					// Sharing via email is possible
				}).catch(() => {
					// Sharing via email is not possible
				});
			break;
		}
		}//*/
	}
}
