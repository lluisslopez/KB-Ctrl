import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController , Nav, LoadingController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup , FormControl } from '@angular/forms';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import DateFormat from "dateformat";
import { AuthUser } from '../../providers/auth-user';


@IonicPage()
@Component({
	selector: 'page-gasto-form',
	templateUrl: 'gasto-form.html',
})
export class GastoForm {
	public fields: FormGroup;
	public PROVE: any;
	public PROVE_NAME: any = [];
	user : string = "";
	password : string = "";
	url : string= "";
	public hideCheck: boolean = true;

	public NO_CHEQUE:string = "";
	public T_P: any = [
		{name: "Cheque"},
		{name: "Efectivo"},
		{name: "Tarjeta"},
	];
	public val :any ;
	public maxfecha: string = "";
	public loader: any;
	public PAGOS_2_In:any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public http: Http,
		public nav : Nav,
		private alertCtrl: AlertController,
		public formBuilder: FormBuilder,
		public loadingCtrl : LoadingController,
		private authUser : AuthUser,
	) {
		this.user = navParams.get('user');
		this.password = navParams.get('pass');
		this.url = navParams.get('url');

		var date = new Date();
		this.maxfecha = DateFormat(date, "yyyy-mm-dd");
		this.val =  ['', Validators.required];
		this.fields = this.formBuilder.group({
			'PROVEEDOR': ['', Validators.required],
			'PAGOS': ['', Validators.required],
			'TAX': ['', Validators.required],
			'NO_FACTURA': ['', Validators.required],
			'FECHA_PAG': ['', Validators.required],
			'T_PAGO': ['', Validators.required],
			'NO_CHEQUE': this.val ,
			'COMENTA': [''],
		});

	}

	ionViewWillEnter(){
		this.getInformation( this.user, this.password, this.url, "Supplier_Validate");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GastoForm');
	}


	getInformation( user , pass , url , view){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		let options = new RequestOptions({ headers: headers });
		let urls =  url  + "/" + view + "?readviewentries&outputformat=json";
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.PROVE = data.viewentry ;
			for (var key in this.PROVE) {
				let value = this.PROVE[key];
				this.PROVE_NAME.push({"Suppliers" : value.entrydata[0].text[0]});
			}
		});
	}

	public sigin(){
	this.presentLoading();
		var obj = this.fields["value"];
		var fecha : any  = new Date();
		var fechaString = obj["FECHA_PAG"].replace(/-/g, '\/') ;

		var dateSave = new Date(fechaString);
		dateSave.setHours(fecha.getHours() );
		dateSave.setMinutes(fecha.getMinutes());
		dateSave.setSeconds(fecha.getSeconds());
		obj["T_G"] = "Individual";
		obj["PAGOS"] = Number(obj["PAGOS"]) * 1;
		obj["TAX"] = Number(obj["TAX"]) * 1;
		obj["PAGOS_2"] = Number(this.PAGOS_2_In) * 1;
		obj["FECHA_PAG"] = {"data":DateFormat(dateSave, "yyyy-dd-mmmThh:MM:ssZ") , "type":"datetime"};
		obj["DATE"] = {"data":DateFormat(fecha, "yyyy-dd-mmmThh:MM:ssZ") , "type":"datetime"};
		this.saveDocumentHttp(obj , "Control_Gastos" );
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
			this.loader.dismiss();
			this.presentAlert("SUCCESS" , "Expense document was created");
			this.nav.setRoot("Gasto");
		},error =>{
			this.loader.dismiss();
			this.presentAlert("ERROR" , "Can't create Expenses.");
			return false;
		});

	}

	public SelectedOut(event ) {
		this.hideCheck = ( event == "Cheque") ? false : true;
		if (	this.hideCheck) {
			this.fields.removeControl("NO_CHEQUE");
		}else{
			this.fields.addControl("NO_CHEQUE" , new FormControl("", Validators.required) )
		}
	}

	get PAGOS_2(){
		var obj = this.fields["value"];
		var PAGOS = (+obj.PAGOS*1 > 0 ) ? +obj.PAGOS*1 : 0 ;
		var TAX = (+obj.TAX*1 > 0 ) ? +obj.TAX*1 : 0 ;

		var result = (PAGOS+ TAX).toFixed(2);
		this.PAGOS_2_In = result;
		return (+result >= 0 ) ? result : 0;
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
