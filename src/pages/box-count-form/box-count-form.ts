import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController , Nav, LoadingController } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthUser } from '../../providers/auth-user';
import DateFormat from "dateformat";


@IonicPage()
@Component({
	selector: 'page-box-count-form',
	templateUrl: 'box-count-form.html',
})
export class BoxCountForm {
	public fields :any = {};
	public documents: any;
	public products: Array<string> = [];
	/*public fields :any = {};*/
	user : string = "";
	password : string = "";
	url : string= "";
	public userOne :any = [];
	loader : any;
	public filtersOne : any = [];
	public objData : any = {} ;

	public fieldsPro :any = {};
	public fieldsReq :any = {};
	public fieldsMax :any = {};
	public fieldsIn :any = {};
	public fieldsCom:any={};
	public fieldsFactorMult:any={};
	public fieldsDif:any={};
	public total =0;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private authUser : AuthUser,
		public nav : Nav,
		public loadingCtrl : LoadingController,
		private alertCtrl: AlertController,
		public http: Http,
	) {
		this.user = navParams.get('user');
		this.password = navParams.get('pass');
		this.url = navParams.get('url');
	}

	ionViewDidLoad() {
		this.getInformation( this.user, this.password, this.url);
	}

	trackByIndex(index: number, value: number) {
		return index;
	}

	getInformation( user , pass , url){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		headers.append('Cache-Control' , 'no-cache');
		let options = new RequestOptions({ headers: headers });
		let urls =  url + "/api/data/collections/name/C_Count";
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.documents = data[0]["@unid"];
			this.loadProducts(data[0]["@unid"]);
		});
		///*
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

	loadProducts(product){
		var headers = new Headers();
		headers.append('Content-Type','application/json');
		headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
		headers.append('Cache-Control' , 'no-cache');
		let options = new RequestOptions({ headers: headers });
		let urls =  this.url + "/api/data/documents/unid/" + product;
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.products.push(data);
			let stringData = JSON.stringify(this.products[0]) ;
			this.objData = JSON.parse(stringData);
			let count = 0;
			for (let entry of this.objData.Cantidad) {
				this.fields[count] = "";
				this.fieldsPro[count] = this.objData.Productos[count];
				this.fieldsReq[count] = this.objData.UnitsReq[count];
				this.fieldsMax[count] = this.objData.Cantidad[count];
				this.fieldsFactorMult[count]= this.objData.FactorMult[count];
				this.fieldsIn[count] = false;
				this.fieldsDif[count] = 0;
				this.fieldsCom[count] = 0;
				count ++;
			}
		});
	}

	remove(indice){
		this.fields[indice] = "";
		this.updateVal(indice);
	}

	save(){
		this.presentLoading();
		let result:boolean = false;
		result = this.valMultiple();
		if (result) {
			this.loader.dismiss();
			return false;
		}else{
			this.saveDocument();
			return false;
		}
	}

	saveDocument(){
		var today = new Date();
		var comp = this.checkArray();
		let objSave = {
			"Indice_Partes" : this.objtoArray(this.fieldsPro , 1) , // "1" if not required "0" if is required
			"Productos" : this.objtoArray(this.fieldsPro , 0), //List of products name
			"FactorMult" : this.objtoArray(this.fieldsFactorMult , 0) , //List presentation of products
			"Cantidad" : this.objtoArray(this.fieldsMax , 0), // "SI" if required or "NO" if no required product
			"UnitsReq" : this.objtoArray(this.fieldsReq , 0), // "SI" if required or "NO" if no required product
			"Fields" : this.objtoArray(this.fields , 0), // "SI" if required or "NO" if no required product
			"FieldsIn" : this.objtoArray(this.fieldsIn , 2), // "SI" if required or "NO" if no required product
			"Dif" : this.objtoArray(this.fieldsDif , 0), // "SI" if required or "NO" if no required product
			"Mul" : this.objtoArray(this.fieldsCom , 0), // "SI" if required or "NO" if no required product

			"DATE":{"data":DateFormat(today, "yyyy-dd-mmmThh:MM:ssZ"), "type":"datetime"},
			"Notification": comp.toString() ,
			"Status": "Pending",
		};
		this.saveDocumentHttp(objSave , "C_Count_Form", comp);
	}

	saveDocumentHttp(obj , formname , sendVal){
		let body = JSON.stringify(obj);
		var headers = new Headers();
		headers.append('Content-Type','application/json');
		headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
		let options = new RequestOptions({ headers: headers });
		let urlvar =  this.url + "/api/data/documents?form=" + formname;
		this.authUser.putorders(urlvar, body, options)
		.subscribe(data=>{
			if(sendVal){
				if ( this.userOne.length > 0 ) {
					var headersOneSignal = new Headers();
					headersOneSignal.append('Authorization',"Basic OTIyYjdjN2MtODBjMi00Y2YyLWFmYjYtYjkzMmFkZDdkMTE2");
					headersOneSignal.append('Content-Type','application/json');
					let objOneSignal = {
						"app_id": "7925d09a-e64d-404d-8dda-9dc1d4fbffc5",
						//"included_segments": ["Active Users"],
						//"data": {"foo": "bar"},
						"filters": this.userOne,
						"contents": {"en": "*Found* format was created and required complete the minimum quantity." },
						"large_icon" : "message_icon_lg",
						"largeIcon ": "message_icon_lg",
						"smallIcon" : "message_icon",
					};
					let bodyOneSignal = JSON.stringify(objOneSignal);
					let optionsOneSignal = new RequestOptions({ headers: headersOneSignal });
					let urlOneSignal = "https://onesignal.com/api/v1/notifications";
					///*
					this.authUser.putorders(urlOneSignal , bodyOneSignal , optionsOneSignal)
					.subscribe(data=>{
						this.loader.dismiss();
						this.presentAlert("SUCCESS" , "Document was sent");
						this.nav.setRoot("BoxCount");
					},error => {
						this.loader.dismiss();
						this.presentAlert("ERROR" , "Can't send push notification.");
						return false;
					});//*/
				}else{
					this.loader.dismiss();
					this.presentAlert("SUCCESS" , "Found was sent");
					this.nav.setRoot("BoxCount");
				}
				//End One Validation
			}else{
				this.loader.dismiss();
				this.presentAlert("SUCCESS" , "Found was sent");
				this.nav.setRoot("BoxCount");
			}
		},error => {
				this.loader.dismiss();
				this.presentAlert("ERROR" , "Can't send document.");
				return false;
		});
	}

	valMultiple() {
		let result 	= false;
		let result2 	= [];
		console.log(this.fieldsIn);
		console.log(this.fields);
		for (var key in this.fieldsIn) {
			var valField = this.fields[key].toString();

			result = (valField.trim() ===  "" ) ? true  : false ;
			(result) ? this.presentAlert("WARNING" , "Qty is requiered in line " +this.fieldsPro[key]) : "" ;
			if(result){
				break;
			}
		}
		return (result)  ;
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

	checkArray(){
		let result 	= false;
		let result2 	= [];
		for (var key in this.fieldsIn) {
			var value = this.fieldsIn[key];
			result2.push( value );
		}
		var comp = ( result2.indexOf(true) > - 1) ? true : false;
		return comp ;
	}

	updateVal(val){
		this.total = 0;
		this.fieldsDif[val] =  Number(this.fieldsMax[val]) - Number(this.fields[val]) ;
		this.fieldsIn[val] =  ( Number(this.fields[val]) <= Number(this.fieldsReq[val]) ) ?  true : false;
		this.fieldsCom[val] = this.fieldsFactorMult[val] * this.fields[val];
		for(var i in this.fieldsCom) {
			this.total += this.fieldsCom[i];
		}
	}


	objtoArray (obj , type) {
		var arr = [];
		var value = "";
		if( type == 1  ) {
			for (var key in obj) {
				//value = ( type == 1 )  ? ( (obj[key]) ? "SI" : "NO" ) : ( (obj[key]) ? "0" : "1" );
				arr.push( "1" );
			}
		}
		else if(type == 2){
			for (var key in obj) {
				value = obj[key];
				arr.push( value.toString() );
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
