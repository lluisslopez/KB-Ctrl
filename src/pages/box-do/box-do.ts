import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController , Nav, LoadingController } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthUser } from '../../providers/auth-user';
import DateFormat from "dateformat";


@IonicPage()
@Component({
	selector: 'page-box-do',
	templateUrl: 'box-do.html',
})
export class BoxDo {
	user : string = "";
	password : string = "";
	url : string= "";
	id : string= "";
	date : string= "";

	loader : any;
	public fields :any = {};
	public filtersOne : any = [];
	public objData : any = {} ;
	public products: Array<string> = [];
	public fieldsPro :any = {};
	public fieldsReq :any = {};
	public fieldsMax :any = {};
	public fieldsIn :any = {};
	public fieldsCom:any={};
	public fieldsFactorMult:any={};
	public fieldsDif:any={};
	public fieldsTotal:any={};
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
		this.id = navParams.get('id');
		this.date = navParams.get('date');
	}

	ionViewDidLoad() {
		this.loadProducts(this.id);
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
				this.fields[count] = this.objData.Fields[count];
				this.fieldsPro[count] = this.objData.Productos[count];
				this.fieldsReq[count] = this.objData.UnitsReq[count];
				this.fieldsMax[count] = this.objData.Cantidad[count];
				this.fieldsFactorMult[count] = this.objData.FactorMult[count];
				this.fieldsIn[count] = this.objData.FieldsIn[count];
				this.fieldsDif[count] = this.objData.Dif[count];
				this.fieldsCom[count] = this.objData.Mul[count];
				let valor = (Number(this.fieldsDif[count]) >0 ) ? Number(this.fieldsDif[count])  : 0;
				this.fieldsTotal[count] = Number(this.fieldsFactorMult[count]) *  valor;
				this.total += this.fieldsTotal[count];
				count ++;
			}
		});
		/*
		for(var i in this.fieldsCom) {
			this.total += this.fieldsCom[i];
		}*/
	}

}
