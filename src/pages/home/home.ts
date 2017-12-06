import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, MenuController, Platform, AlertController } from 'ionic-angular';
import { Http , Headers, RequestOptions } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthUser } from '../../providers/auth-user';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import DateFormat from 'dateformat';


@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class Home {
	public orders: any;
	user : string = "";
	password : string = "";
	url : string= "";
	public admin: any = false;
	public hideOut: any = true;
	db:any;
	public ban: any = false;

	test:object;
	constructor(
						public navCtrl: NavController,
						public navParams: NavParams,
						public http : Http ,
						public nav : Nav,
						public menu: MenuController,
						private platform: Platform,
						public alertCtrl : AlertController,
						public splashScreen: SplashScreen,
						private authUser : AuthUser,
						private sqlite: SQLite,
					)
	{
		var admins = ["Carlos Arreguin", "Carlos.Arreguin", "Lizbeth Lopez" , "Lizbeth.Lopez", "luis e lopez", "luis.lopez"];
		for(var i = 0; i < admins.length; i++){
			admins[i] = admins[i].toUpperCase();
		}
		let access;

		/*
		this.user = "luis e lopez";
		this.password = "password";
		this.url = "http://aicdev.com/kb/control.nsf";
		this.getInformation( "luis e lopez" , "password" , "http://aicdev.com/kb/control.nsf");
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
							//this.presentAlert("Msj dentro", data.rows.item(i).username);
						}
						//*/
						access = (admins.indexOf(this.user.toUpperCase()) > -1) ? true : false;
						if (access) {
							this.menu.enable(false, 'menu1');
							this.menu.enable(true, 'menu2');
							this.admin = true;
							this.ban = true;
							this.getInformation( this.user, this.password, this.url);
							//this.authUser.getorders();
						}else{
							this.menu.enable(true, 'menu1');
							this.menu.enable(false, 'menu2');
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
		this.platform.ready().then(() => {
			this.splashScreen.hide();
		});
	}

	getInformation( user , pass , url){
		var headers = new Headers();
		headers.append('Authorization',"Basic " + btoa( user+":"+ pass));
		let options = new RequestOptions({ headers: headers });
		let urls =  url + "/api/data/collections/name/" + "PedidosPenSend";

		this.authUser.getorders(urls , options )
		.map(res => res.json())
		.subscribe(data => {
			this.orders = data;
			for (var key in this.orders) {
				//console.log(key);
				var date = new Date(this.orders[key].DATE);
				let value = this.orders[key].DATE;
				this.orders[key].DATE = DateFormat(date, "mmm-dd-yyyy");
			}
		});
	}

	check(id,nombre){
		this.nav.push( "Orderdo" ,  {id : id , nombre : nombre, user: this.user, pass: this.password , url: this.url } );
		//this.nav.push( "Orderdo" ,  {id : id , nombre : nombre, user: "luis e lopez" , pass: "password" , url: "http://aicdev.com/kb/control.nsf" } );
	}

	//New Reg
	public add_Reg (  ) {
		this.nav.push( 'Orderform' , { user: this.user, pass: this.password , url: this.url } );
		//this.nav.push( "Orderform" ,  {user: "luis e lopez" , pass: "password" , url: "http://aicdev.com/kb/control.nsf" } );
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
