import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController , Nav, LoadingController } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthUser } from '../../providers/auth-user';
import DateFormat from "dateformat";

@IonicPage()
@Component({
	selector: 'page-orderform',
	templateUrl: 'orderform.html',
})
export class Orderform {
	public user : string = "";
	public password : string = "";
	public url : string= "";

	public providers: any;
	public products: Array<string> = [];
	public fields :any = {};
	public fieldsPro :any = {};
	public fieldsIn :any = {};
	public fieldsReq :any = {};
	public fieldsOrder :any = [];
	public shouldHide : any= true;
	public shouldHideMin : any= true;
	public objData : any = {} ;
	public valFields : any = {} ;
	public nameSelected = "";
	public typeSelected = "";
	public userOne :any = [];
	loader : any;
	public filtersOne : any = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private authUser : AuthUser,
		public nav : Nav,
		public loadingCtrl : LoadingController,
		private alertCtrl: AlertController,

	) {
		this.user = navParams.get('user');
		this.password = navParams.get('pass');
		this.url = navParams.get('url');
	}

	ionViewDidLoad() {
		this.getInformation( this.user, this.password, this.url);
	}

	getInformation( user , pass , url){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		let options = new RequestOptions({ headers: headers });
		let urls =  url + "/api/data/collections/name/C_Lista_Pedidos_Val";
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.providers = data;
		});
		let urlOne =  url + "/api/data/collections/name/C_Notification";
		this.authUser.getorders(urlOne , options )
		.map(res => res.json())
		.subscribe(data => {
			for (let entry of data) {
				for (var key in entry.webaddress) {
					let value = entry.webaddress[key];
					this.userOne.push( {"field": "tag", "key": "user", "relation": "=", "value": value.toUpperCase()}) ;
					this.userOne.push( {"operator": "OR"} );
				}
			}
			this.userOne.pop();
			this.filtersOne = this.userOne;
		});
	}

	Selected(event , festId) {
		this.products = [];
		this.fields = [];
		this.fieldsPro = [];
		this.fieldsReq = [];
		this.fieldsIn = [];
		this.nameSelected = "";
		this.typeSelected = "";
		this.loadProducts(event);
	}

	loadProducts(product){

		var headers = new Headers();
		headers.append('Content-Type','application/json');
		headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
		let options = new RequestOptions({ headers: headers });
		let urls =  this.url + "/api/data/documents/unid/" + product ;
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.products.push(data);
			let stringData = JSON.stringify(this.products[0]) ;
			this.objData = JSON.parse(stringData);

			let count = 0;
			for (let entry of this.objData.Cantidad) {
				this.fields[count] = ( this.objData.Type == "Normal" ) ? entry : "0";//this.objData.UnitsReq[count]; //QTY or INV
				this.fieldsPro[count] = this.objData.Productos[count];
				this.fieldsReq[count] 	= this.objData.UnitsReq[count];
				this.fieldsIn[count] 	  = false;
				this.nameSelected 	   = this.objData.Nombre;
				this.typeSelected 		= this.objData["Type"];
				//this.fieldsOr[count]	= 0;
				count ++;
			}
			this.shouldHide = ( this.objData.Type == "Normal" )  ? false : true ;
			this.shouldHideMin = ( this.objData.Type != "Normal" )  ? false : true ;
		});
	}

	//Unale input in toggle event
	toggleDis(event, festId2){
		this.fieldsIn[festId2] = ( this.fieldsIn[festId2]  ) ? false : true ;
		if (  this.fieldsIn[festId2]  == false) {
			this.fields[festId2] = ( this.objData.Type  == "Normal") ? this.objData.Cantidad[festId2] : "0";//this.objData.UnitsReq[festId2] ;
		}
	}

	//calculate res
	get fieldsOr(){
		var arr = [];
		var value;
		this.fieldsOrder = [];
		var n = 0;
			for (var key in this.fields) {
				value =  Math.ceil ( ( this.fieldsReq[n] - this.fields[n]  ) / this.objData.Cantidad[n] );
				arr.push( value );
				this.fieldsOrder.push( value );
				n++;
			}
		return arr;
	}

	//Submint
	logForm() {
		this.presentLoading();
		let result = false;
		let val = Object.getOwnPropertyNames(this.fields).length === 0;
		result = ( val ) ? this.presentAlert("WARNING", "Provider is required.") : result ;
		if (result) {
			this.loader.dismiss();
			return false;
		}else{
				result = this.valMultiple();
				if (result ) {
					this.loader.dismiss();
					return false;
				} else { this.saveDocument() ; }
		}
	}

	//save document
	saveDocument(){
		var today = new Date();
		let objSave = {
			"Nombre" : this.nameSelected, // Provider
			"Type" : this.typeSelected, // Provider
			"Productos" : this.objtoArray(this.fieldsPro , 0), //List of products name
			"Unidad" : this.objtoArray(this.objData.Unidad , 0) , //List presentation of products
			"Pedido" : this.objtoArray(this.fieldsIn , 1), // "SI" if required or "NO" if no required product
			"Indice_Partes" : this.objtoArray(this.fieldsIn , 2) , // "1" if not required "0" if is required
			"Cantidad" : (( this.objData.Type == "Normal" )  ? this.objtoArray(this.fields , 0) : this.fieldsOrder) ,//this.objtoArray(this.fields , 0) , //Qty of required,( this.objData.Type == "Normal" )  ? false : true ;
			"DATE":{"data":DateFormat(today, "yyyy-dd-mmmThh:MM:ssZ"), "type":"datetime"},
			"App": "Pending",
		};
		this.saveDocumentHttp(objSave , "Pedidos" );
	}

	saveDocumentHttp(obj , formname){
		let body = JSON.stringify(obj);
		var headers = new Headers();
		headers.append('Content-Type','application/json');
		headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
		let options = new RequestOptions({ headers: headers });
		let urlvar =  this.url + "/api/data/documents?form=" + formname;
		this.authUser.putorders(urlvar, body, options)
		.subscribe(data=>{
			console.log(data);
			if ( this.userOne.length > 0 ) {
				var headersOneSignal = new Headers();
				headersOneSignal.append('Authorization',"Basic OTIyYjdjN2MtODBjMi00Y2YyLWFmYjYtYjkzMmFkZDdkMTE2");
				headersOneSignal.append('Content-Type','application/json');
				let objOneSignal = {
					"app_id": "7925d09a-e64d-404d-8dda-9dc1d4fbffc5",
					//"included_segments": ["Active Users"],
					//"data": {"foo": "bar"},
					"filters": this.userOne,
					"contents": {"en": "Order was created: "  + obj.Nombre + "." },
					"large_icon" : "message_icon_lg",
					"largeIcon ": "message_icon_lg",
					"smallIcon" : "message_icon",
				};
				let bodyOneSignal = JSON.stringify(objOneSignal);
				let optionsOneSignal = new RequestOptions({ headers: headersOneSignal });
				let urlOneSignal = "https://onesignal.com/api/v1/notifications";
				this.authUser.putorders(urlOneSignal , bodyOneSignal , optionsOneSignal)
				.subscribe(data=>{
					this.loader.dismiss();
					this.presentAlert("SUCCESS" , "Order was sent");
					this.nav.setRoot("Home");
				},error => {
					this.loader.dismiss();
					this.presentAlert("ERROR" , "Can't send push notification.");
					return false;
				});
			}else{
				this.loader.dismiss();
				this.presentAlert("SUCCESS" , "Order was sent");
				this.nav.setRoot("Home");
			}
		},error => {
				this.loader.dismiss();
				this.presentAlert("ERROR" , "Can't send order.");
				return false;
		});
	}

	//validate multiples values
	valMultiple() {
		let result 	= false;
		let result2 	= [];
		for (var key in this.fieldsIn) {
			var value = this.fieldsIn[key];
			var valField = this.fields[key];
			var pro = this.fieldsPro[key];
			result = (value && valField.trim() ===  "" ) ? true  : result ;
			result2.push( value );
			(value && valField.trim() ===  "" ) ? this.presentAlert("WARNING" , "Qty in producto " + pro + " is requiered.") : "" ;
 		}

		( result2.indexOf(true) > - 1) ? "" :   this.presentAlert( "WARNING" , "You need to select least one product." )  ;
		var comp = ( result2.indexOf(true) > - 1) ? true : false;
		return (result || !comp )  ;


	}
	//Function to show alerts
	presentAlert(title, msj) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msj,
			buttons: ['Close']
		});
		alert.present();
		return true;
	}
	//Multiples Values binding in ngfor
	trackByIndex(index: number, value: number) {
		return index;
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
}
