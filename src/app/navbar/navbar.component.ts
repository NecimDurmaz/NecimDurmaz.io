import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Route, Router } from '@angular/router';

import { BehaviorSubject, empty, EMPTY, map, Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase/firebaseServices.service';
import { Settings } from '../model/settings';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(public firebaseSS: FirebaseService) {}
  settings$ = new BehaviorSubject<Settings>(null);
  @Input() SettingsPrimaryColor;
  @Input() SettingsSecondaryColor;
  ngOnInit() {
    this.getAllSettings();
  }
  async getAllSettings() {
    //this.firebaseSS.progressFunction();
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
        this.settings$.next(data[0]);
        //this.firebaseSS.progressFunction();
      });
  }
  goster() {
    console.log(this.firebaseSS.progress.value);
  }
  LogOut() {
    this.firebaseSS.user$.next(null);
    this.firebaseSS.userLoginStatus$.next(false);
    window.localStorage.clear();
  }

  openNav() {
    document.getElementById('mySidebar')!.style.width = '250px';
    document.getElementById('main')!.style.marginLeft = '250px';
  }

  closeNav() {
    document.getElementById('mySidebar')!.style.width = '0';
    document.getElementById('main')!.style.marginLeft = '0';
  }

  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  colorPalet(primaryColor, secondaryColor) {
    console.log(primaryColor);
    console.log(secondaryColor);
    const htmlElStyle = document.documentElement.style;
    htmlElStyle.setProperty('--primaryColor', primaryColor);
    htmlElStyle.setProperty('--secondaryColor', secondaryColor);
  }
}
