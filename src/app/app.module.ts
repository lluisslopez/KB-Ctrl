import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthUser }from '../providers/auth-user';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';


@NgModule({
	declarations: [
		MyApp,
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
	],
	providers: [
		StatusBar,
		SplashScreen,
		OneSignal,
		SQLite,
		AuthUser,
		SocialSharing,
		Clipboard,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {}
