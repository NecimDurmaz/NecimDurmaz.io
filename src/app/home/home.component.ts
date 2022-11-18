import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { startAfter } from 'firebase/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Settings } from '../model/settings';
import { FirebaseService } from '../services/firebase/firebaseServices.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public firebaseSS: FirebaseService) {}
  SettingsPrimaryColor;
  SettingsSecondaryColor;
  Settings$ = new BehaviorSubject<Settings>(null);

  ngOnInit() {
    this.getAllData().then().finally();
    this.getAllSettings();

    try {
      if (localStorage.getItem('users')) {
        this.firebaseSS.user$.next(JSON.parse(localStorage.getItem('users')));
        this.firebaseSS.userLoginStatus$.next(true);
      }
    } catch (error) {}
  }
  async getAllData() {
    // await this.firebaseSS.getAll().then(() => this.SettingsFiiling());
    await this.firebaseSS.getAll();
  }
  async getAllSettings() {
    this.firebaseSS.progressBool();
    (await this.firebaseSS.getAllSettings())
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((x) => ({
            primaryKey: x.payload.doc.id,
            body: { ...x.payload.doc.data() },
          }))
        )
      )
      .subscribe((data) => {
        //  let body = document.body;
        //let bodyStyle = getComputedStyle(body);
        this.Settings$.next(data[0]);
        this.firebaseSS.Settings$.next(data[0]);
        this.SettingsPrimaryColor = data[0].body.primaryColor;
        this.SettingsSecondaryColor = data[0].body.secondaryColor;
        const htmlElStyle = document.documentElement.style;
        htmlElStyle.setProperty('--primaryColor', data[0].body.primaryColor);
        htmlElStyle.setProperty('--dbPrimaryColor', data[0].body.primaryColor);
        htmlElStyle.setProperty(
          '--secondaryColor',
          data[0].body.secondaryColor
        );
        htmlElStyle.setProperty('--commentsColor', data[0].body.commentsColor);
        this.firebaseSS.progressBool();
      });
  }
  deneme() {
    console.log(this.firebaseSS.Settings$.value);
  }
  // async SettingsFiiling() {
  //   let body = document.body;

  //   const htmlElStyle = document.documentElement.style;
  //   htmlElStyle.setProperty(
  //     '--primaryColor',
  //     this.firebaseSS.settings$.value.body.primaryColor
  //       ? this.firebaseSS.settings$.value.body.primaryColor
  //       : '#17a2b8'
  //   );

  //   htmlElStyle.setProperty(
  //     '--secondaryColor',
  //     this.firebaseSS.settings$.value.body.secondaryColor
  //       ? this.firebaseSS.settings$.value.body.secondaryColor
  //       : '#e9dac1'
  //   );
  //   htmlElStyle.setProperty(
  //     '--commentsColor',
  //     this.firebaseSS.settings$.value.body.commentsColor
  //       ? this.firebaseSS.settings$.value.body.commentsColor
  //       : '#e9dac1'
  //   );
  // }
}
