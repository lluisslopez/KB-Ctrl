import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, LoadingController, Events, Content, AlertController   } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { OneSignal } from '@ionic-native/onesignal';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any;// = 'Home';  // first Page
	loader : any;
	pages: Array<{title: string, component: any, icon: string}>; // Variable de menus
	pagesAdmin : Array<{title: string, component: any, icon: string}>; // Variable de menus
	user : string = "";
	password : string = "";
	url : string= "";
	public hideOut: any = true;
	admins : any;
	public regs: Array<Object>;
	db:any;

	constructor(
		public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		public menu: MenuController ,
		public loadingCtrl : LoadingController ,
		public events: Events,
		public alertCtrl: AlertController,
		public oneSignal: OneSignal,
		public sqlite: SQLite
	) {
		//this.presentAlert("Inicio");

		//this.rootPage = "Home";

		this.initializeApp();

		this.pages = [
			{ title: 'Order',  component: "Home" , icon: 'cart'},
			{ title: 'Close Document', component: "Cierre" , icon: 'checkmark-circle'},
			//{ title: 'Expenses', component: "Home" , icon: 'cash'},
		];
		this.pagesAdmin = [
			{ title: 'Order',  component: "Home" , icon: 'cart'},
			{ title: 'Close Document', component: "Cierre" , icon: 'checkmark-circle'},
			{ title: 'Expenses', component: "Gasto" , icon: 'cash'},
		];


		this.admins = ["Carlos Arreguin", "Carlos.Arreguin", "Lizbeth Lopez" , "Lizbeth.Lopez", "luis e lopez", "luis.lopez"];
		for(var i = 0; i < this.admins.length; i++){
			this.admins[i] = this.admins[i].toUpperCase();
		}
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			//this.splashScreen.hide();
			///*
			this.oneSignal.startInit('7925d09a-e64d-404d-8dda-9dc1d4fbffc5', '105975728754');
			this.oneSignal.inFocusDisplaying(2);
			this.oneSignal.endInit();
			//*/
			//Database
			///*
			this.sqlite.create({
				name: 'datareg.db',
				location: 'default'
			}).
			then((db: SQLiteObject) => {
				//this.presentAlert("1");
				db.executeSql('CREATE TABLE IF NOT EXISTS reg (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT , url TEXT)', {})
				.then((data) => {
					//this.presentAlert(data);
					db.executeSql('SELECT * FROM reg', {})
					.then((datas) => {
						this.regs = [];
						if(datas.rows.length > 0) {
							for(var i = 0; i < datas.rows.length; i++) {
								this.regs.push({
														username: datas.rows.item(i).username,
														password: datas.rows.item(i).password,
														url: datas.rows.item(i).url,
								});
								//this.hideOut = (this.admins.indexOf(data.rows.item(i).username.toUpperCase()) > -1) ? true : false;
							}
							this.rootPage = "Home";
						}else{
							this.rootPage = "Login";//"Login";
						}
						//this.presentAlert(this.rootPage);
					}).catch(e => console.log(e));
				}).catch(e => console.log(e));
			}).catch(e => console.log(e));
			//*/
		});

	}

	openPage(page) {
		// close the menu when clicking a link from the menu
		this.menu.close();
		// navigate to the new page if it is not the current page
		this.nav.setRoot(page.component);
	}

	presentAlert(msj:string) {
		let alert = this.alertCtrl.create({
			title: 'Low battery',
			subTitle: msj,
			buttons: ['Dismiss']
		});
		alert.present();
	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		this.loader.present();
	}

	misslogin(){
		this.presentLoading();
		this.sqlite.create({
			name: 'datareg.db',
			location: 'default'
		}).then((db: SQLiteObject) => {
			//this.presentAlert("1");
			//db.executeSql('DROP TABLE IF EXISTS reg', {})
			db.executeSql('Delete from reg', {})
			.then((data) => {
				//window["plugins"].OneSignal.deleteTag("user");
				this.oneSignal.deleteTag("user");
				this.loader.dismiss();
				this.nav.setRoot("Login");
			}).catch(e => console.log(e));
		}).catch(e => console.log(e));
	}
	/*
	this.db = new SQLite();
		this.db.openDatabase({name: "datareg.db",location: "default"}).then(() => {
				this.db.executeSql("DROP TABLE IF EXISTS reg", {}).then((data) => {
					window["plugins"].OneSignal.deleteTag("user");
					this.nav.setRoot(LoginPage).then( data =>{ } );
				},(error) => {

				});
		});*/


}
