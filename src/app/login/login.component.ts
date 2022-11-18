import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase/firebaseServices.service';

import { User } from '../model/users.model';
import { Discount } from '../model/discount.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private route: Router, public firebaseSS: FirebaseService) {}
  RememberMe: boolean = false;

  ngOnInit() {
    this.getAllDiscount();
  }
  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  formSubmitted = false;
  submitForm(form: any) {
    this.formSubmitted = true;

    if (form.valid) {
      this.userQuery();
    }
    this.firebaseSS.users$.subscribe((res) => {
      if (res.length == 0) this.firebaseSS.getAllUsers();
    });
  }

  async userQuery() {
    (await this.firebaseSS.getAllUsers())
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
        let user = data.find(
          (x) =>
            x.body.email == this.formLogin.get('email')?.value &&
            x.body.password == this.formLogin.get('password')?.value
        );
        if (user) {
          this.firebaseSS.userLoginStatus$.next(true);
          this.firebaseSS.user$.next(user);
          if (this.RememberMe == true)
            localStorage.setItem('users', JSON.stringify(user));
          this.route.navigate(['/ticket']);
        }
      });
  }

  async getAllEventsGeneral() {
    (await this.firebaseSS.getAllEventsGeneral())
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
        this.discountEventsGeneral = data.find(
          (x) => x.primaryKey == this.Discount$.value.body.eventsGeneralId
        );
      });
  }
  ////
  Discount$ = new BehaviorSubject<Discount>(null);
  DateNow = new Date();
  async getAllDiscount() {
    (await this.firebaseSS.getAllDiscount())
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((x) => ({
            primaryKey: x.payload.doc.id,
            body: { ...x.payload.doc.data() },
          }))
        )
      )
      .subscribe(async (data) => {
        if (data.length > 0) {
          let arr: Discount[] = data.filter((x) => {
            return (
              x.body.startDate.seconds * 1000 <= this.DateNow.getTime() &&
              this.DateNow.getTime() <= x.body.endDate.seconds * 1000
            );
          });
          arr.sort(function (a, b) {
            var x = a.body.discount;
            var y = b.body.discount;
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          });

          this.Discount$.next(arr[arr.length - 1]);
          (await this.firebaseSS.getAllEventsGeneral())
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
              this.discountEventsGeneral = data.find(
                (x) => x.primaryKey == this.Discount$.value.body.eventsGeneralId
              );
            });
        } else {
          (await this.firebaseSS.getAllEventsGeneral())
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
              this.lastEventsGeneral = data[data.length - 1];
            });
        }
      });
  }

  lastEventsGeneral;
  discountEventsGeneral;
  // async getLastEventsGeneral() {
  //   (await this.firebaseSS.getAllEventsGeneral())
  //     .snapshotChanges()
  //     .pipe(
  //       map((changes) =>
  //         changes.map((x) => ({
  //           primaryKey: x.payload.doc.id,
  //           body: { ...x.payload.doc.data() },
  //         }))
  //       )
  //     )
  //     .subscribe((data) => {
  //       this.lastEventsGeneral = data[data.length - 1];
  //     });
  // }

  changeRememberMe() {
    if (this.RememberMe == false) this.RememberMe = true;
    else this.RememberMe = false;
  }
}
