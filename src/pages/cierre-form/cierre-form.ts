import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController , Nav, LoadingController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup , FormControl } from '@angular/forms';
import { Http , Headers, RequestOptions } from '@angular/http';
import { AuthUser } from '../../providers/auth-user';
import DateFormat from "dateformat";

@IonicPage()
@Component({
	selector: 'page-cierre-form',
	templateUrl: 'cierre-form.html',
})
export class CierreForm {
	public nameSelected: any = "";
	public employee: any;
	//public fields :any = {};
	public fields: FormGroup;
	public shouldHide : any= true;
	public result : any = [];
	public objData : any = {};
	public VENTA_EFECTIVO_In : any ;
	public VENTAS_2_In : any ;
	public ONLINE : any ;
	public Chef_Shuttle : any ;
	public GIFT_CARD : any ;
	public DATE_CLOSE : any ;
	public VENTA : any ;
	public TAX : any ;

	public TIP_TAR : any ;
	public TIP_CASH : any ;
	public VENTA_CAR : any ;
	public VENTA_EFECTIVO2 : any ;

	public Cooler : any ;
	public Freezer : any ;
	user : string = "";
	password : string = "";
	url : string= "";
	loader : any;
	public filtersOne : any = [];
	public userOne :any = [];
	sharePass : string = "";

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public http: Http ,
		private alertCtrl: AlertController,
		public nav : Nav,
		private formBuilder: FormBuilder,
		private authUser : AuthUser,
		public loadingCtrl : LoadingController ,
	) {
		this.fields = this.formBuilder.group({
			'employee': ['', Validators.required],
			'DATE_CLOSE': ['', Validators.required],
			'TIP_CASH': ['', Validators.required],

			'VENTA_EFECTIVO2': ['', Validators.required],
			'Cooler': ['', Validators.required],
			'Freezer': ['', Validators.required],
		});
		this.user = navParams.get('user');
		this.password = navParams.get('pass');
		this.url = navParams.get('url');
		console.log(this.user , this.password, this.url);
	}
	ionViewWillEnter(){
		this.getInformation( this.user, this.password, this.url, "Nombre_Empleado_Pass");
		this.getInformation( this.user, this.password, this.url, "C_Notification");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CierreForm');
	}

	getInformation( user , pass , url , view){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		let options = new RequestOptions({ headers: headers });
		let urls =  url + "/api/data/collections/name/"+view;
		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			if( view == "C_Notification" ){
				for (let entry of data) {
					this.sharePass = data[0]['Pass'];
					//console.log(pass);
					for (var key in entry.webaddress) {
						let value = entry.webaddress[key];
						this.userOne.push( {"field": "tag", "key": "user", "relation": "=", "value": value.toUpperCase()}) ;
						this.userOne.push( {"operator": "OR"} );
					}

				}
				this.userOne.pop();
				this.filtersOne = this.userOne;
			}else{
				this.employee = data;
			}
		});
	}

	Selected( event ) {
		this.nameSelected = "";
		console.log(this.userOne);
		if(this.fields.value['employee']){
			setTimeout(()=>{
					this.loadEmployee(event);
			},500);
		}
	}

	loadEmployee(event){
		let prompt = this.alertCtrl.create({
			title: 'Log In',
			message: "Enter password",
			inputs: [
				{name: 'Password',placeholder: 'Password', type:"password"}
			],
			buttons: [
				{text: 'Cancel',handler: data => {
					this.fields = this.formBuilder.group({
						'employee': ['', Validators.required],
						'DATE_CLOSE': ['', Validators.required],
						'TIP_CASH': ['', Validators.required],

						'VENTA_EFECTIVO2': ['', Validators.required],
						'Cooler': ['', Validators.required],
						'Freezer': ['', Validators.required],
					});
					this.shouldHide = true ;
					console.log("Cancel Clicked");
				} },
				{text: 'OK',handler: datas => {
						//Compare User and password
						var headers = new Headers();
						headers.append('Content-Type','application/json');
						headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
						let options = new RequestOptions({ headers: headers });
						let url =  this.url + "/api/data/documents/unid/" + event ;
						this.authUser.getorders(url , options )
						.map(res => res.json())
						.subscribe(data => {
							this.result.push(data);
							let stringData = JSON.stringify(this.result[0]) ;
							this.objData = JSON.parse(stringData);
							this.shouldHide = ( datas.Password == this.objData.Pass ||  datas.Password == this.sharePass ) ? false : true ;
							if ( datas.Password == this.objData.Pass ||  datas.Password == this.sharePass) {
								this.nameSelected = this.objData.ID;
								this.DATE_CLOSE = "";

								this.TIP_CASH = "";
								this.VENTA_EFECTIVO2 = "";

								this.Cooler = "";
								this.Freezer = "";
								return false;
							}else{
								this.fields = this.formBuilder.group({
									'employee': ['', Validators.required],
									'DATE_CLOSE': ['', Validators.required],
									'TIP_CASH': ['', Validators.required],

									'VENTA_EFECTIVO2': ['', Validators.required],
									'Cooler': ['', Validators.required],
									'Freezer': ['', Validators.required],
								});
								this.presentAlert("ERROR" , "Pls check your password.");
								this.shouldHide = true;
							};
						},error =>{
							this.fields = this.formBuilder.group({
								'employee': ['', Validators.required],
								'DATE_CLOSE': ['', Validators.required],
								'TIP_CASH': ['', Validators.required],

								'VENTA_EFECTIVO2': ['', Validators.required],
								'Cooler': ['', Validators.required],
								'Freezer': ['', Validators.required],
							});
							this.presentAlert("ERROR" , "Can't load user.");
							this.shouldHide = true ;
						});
					}
				},
			]
		});
		prompt.present();
		//*/
	}

	sigin(){
		this.presentLoading();
		var obj = this.fields["value"];

		var fecha = obj["DATE_CLOSE"].replace(/-/g, '\/') ;
		var fechaEnMiliseg : any  = new Date();

		var date = new Date(fecha);
		date.setHours(fechaEnMiliseg.getHours() );
		date.setMinutes(fechaEnMiliseg.getMinutes());
		date.setSeconds(fechaEnMiliseg.getSeconds());

		obj["DATE_CLOSE"] = {"data":DateFormat(date, "yyyy-dd-mmmThh:MM:ssZ") , "type":"datetime"};
		obj["DATE"] = {"data":DateFormat(fechaEnMiliseg, "yyyy-dd-mmmThh:MM:ssZ") , "type":"datetime"};
		obj["employee"] = this.nameSelected;
		obj["App"] = "Pending";
		obj["Status"] = "Approved";
		obj["Get"] = "Pending";

		obj["TIP_TAR"] = 0;
		obj["Chef_Shuttle"] = 0;
		obj["GIFT_CARD"] = 0;
		obj["GRAL_TOTAL_EFECTIVO"] = "0";
		obj["ONLINE"] = 0 ;
		obj["TAX"] = 0 ;
		obj["TOTAL_EFE"] = 0 ;
		obj["VENTA"] = 0 ;
		obj["VENTAS_2"] = 0 ;
		obj["VENTA_CAR"] = 0 ;
		obj["VENTA_EFECTIVO"] = 0 ;
		this.saveDocumentHttp(obj , "Control" );
	}

	saveDocumentHttp(obj , formname){
		let body = JSON.stringify(obj);
		let sendPush : boolean = false;
		sendPush = ( Number(obj.Cooler) >= 40 ||  Number(obj.Freezer) > 0 ) ? true : false ;
		var headers = new Headers();
		headers.append('Content-Type','application/json');
		headers.append('Authorization',"Basic " + btoa(this.user+":"+ this.password));
		let options = new RequestOptions({ headers: headers });
		let urlvar =  this.url + "/api/data/documents?form=" + formname;
		this.authUser.putorders(urlvar, body, options)
		.subscribe(data=>{
			if ( sendPush && this.userOne.length > 0 ) {
				var headersOneSignal = new Headers();
				headersOneSignal.append('Authorization',"Basic OTIyYjdjN2MtODBjMi00Y2YyLWFmYjYtYjkzMmFkZDdkMTE2");
				headersOneSignal.append('Content-Type','application/json');
				let objOneSignal = {
					"app_id": "7925d09a-e64d-404d-8dda-9dc1d4fbffc5",
					//"included_segments": ["Active Users"],
					"filters": this.userOne,
					"contents": {"en": "Close was created 🔥:  Cooler("  + obj.Cooler + "°) and Freezer("+  obj.Freezer +"°)." },
					"large_icon" : "message_icon_lg",
					"largeIcon ": "message_icon_lg",
					"smallIcon" : "message_icon",
				};
				let bodyOneSignal = JSON.stringify(objOneSignal);
				let optionsOneSignal = new RequestOptions({ headers: headersOneSignal });
				let urlOneSignal = "https://onesignal.com/api/v1/notifications";
				this.authUser.putorders(urlOneSignal, bodyOneSignal, optionsOneSignal)
				.subscribe(data=>{
					this.loader.dismiss();
					this.presentAlert("SUCCESS" , "Close document was created");
					this.nav.setRoot("Cierre");
				},error => {
					this.loader.dismiss();
					this.presentAlert("ERROR" , "Can't send push notification.");
					return false;
				});
			}else{
				this.loader.dismiss();
				this.presentAlert("SUCCESS" , "Close document was created");
				this.nav.setRoot("Cierre");
			}
		},error => {
				this.loader.dismiss();
				this.presentAlert("ERROR" , "Can't send order.");
				return false;
		});
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

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();
	}
}
