import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App, Nav ,LoadingController, AlertController, MenuController, Platform } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthUser } from '../../providers/auth-user';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class Login {
	public fields = {};
	loader : any;
	public typeinput : any = "password";
	public typeinputBol : any = true;
	public regs: Array<Object>;
	public hideOut: any = true;
	db:any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private formBuilder: FormBuilder,
		public nav : Nav,
		public appCtrl: App,
		public loadingCtrl : LoadingController,
		public alertCtrl : AlertController,
		public menu: MenuController,
		private platform: Platform,
		public splashScreen: SplashScreen,
		private authUser : AuthUser,
		private sqlite: SQLite,
		public oneSignal: OneSignal,
	) {
		this.menu.swipeEnable(false);
		this.fields = this.formBuilder.group({
			'user': ['', Validators.required],
			'password': ['', Validators.required],
			'url': ['', Validators.required],
		});
	}

	ionViewDidLoad() {
		this.platform.ready().then(() => {
			this.splashScreen.hide();
		});
	}
	//Login
	public sigin(){
		this.presentLoading();
		var obj = this.fields["value"];
		var user =  obj["user"];
		var pass =  obj["password"];
		var url = obj["url"];
		this.authUser.login(obj).then((isLoggedIn) => {
			if( isLoggedIn ) {
				this.sqlite.create({
					name: 'datareg.db',
					location: 'default'
				})
				.then((db: SQLiteObject) => {
					db.executeSql("INSERT INTO reg (username, password, url) VALUES ('"+ user +"','"+ pass +"','"+ url +"')", {})
						.then((data) => {
							//window["plugins"].OneSignal.deleteTag("user");
							this.oneSignal.deleteTag("user");
							this.oneSignal.sendTag("user" ,user.toUpperCase());
							//window["plugins"].OneSignal.sendTag("user",user.toUpperCase());
							this.nav.setRoot("Home");
							this.loader.dismiss();
						})
						.catch(e => console.log(e));
					})
				.catch(e => console.log(e));
			}else{
				this.oneSignal.deleteTag("user");
				this.loader.dismiss();
				this.presentAlert("Warning", "Something in your credentials are wrong!");
			}
		});
	}

	//Loading AlertController
	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Authenticating..."
		});
		this.loader.present();
	}
	//AlertController
	presentAlert(title, msj) {
	let alert = this.alertCtrl.create({
			title: title,
			subTitle: msj,
			buttons: ['Close']
		});
		alert.present();
	}

}
