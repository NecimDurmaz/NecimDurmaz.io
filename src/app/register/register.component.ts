import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase/firebaseServices.service';

import { User } from '../model/users.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(public firebaseSS: FirebaseService) {}

  ngOnInit() {
    this.firebaseSS.users$.subscribe((res) => {
      if (res.length == 0) this.firebaseSS.getAllUsers();
    });
  }
  phoneMask = [
    '(',
    /[1-9]/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  registerForm = new FormGroup({
    kullaniciAd: new FormControl('', [Validators.required]),
    Isim: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    SoyIsim: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),

    sifre: new FormControl('', [Validators.required]),
    iletisimMesaj: new FormControl(false),
  });
  formSubmitted = false;
  kullaniciEklemeDurumuBoolean = false;
  submitForm(form: any) {
    this.formSubmitted = true;
    // this.mailQuery();

    if (form.valid && this.mailQueryDurum) {
      this.addUsers();

      this.kullaniciEklemeDurumuBoolean = true;
    }
  }
  users: User = new User();
  addUsers() {
    this.users.body = {
      UserName: this.registerForm.get('kullaniciAd')?.value as string,
      Name: this.registerForm.get('Isim')?.value as string,
      SurName: this.registerForm.get('SoyIsim')?.value as string,
      email: this.registerForm.get('email')?.value as string,
      password: this.registerForm.get('sifre')?.value as string,
      contactMessage: this.registerForm.get('iletisimMesaj')?.value as boolean,
      UsersTypeId: 2,
      UsersType: 'Kullanici',
    };

    this.firebaseSS.addUser(this.users);
  }
  mailQueryDurum = true;

  // mailQuery() {
  //   this.servicesService
  //     .mailQuery(this.registerForm.get('email')?.value)
  //     .subscribe(
  //       (res: any) => {
  //         if (res.length != 0) {
  //           this.mailQueryDurum = false;
  //         }
  //         return res;
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  // }

  // ERROR

  getFormValidationErrors(form: FormGroup): string[] {
    let messages: string[] = [];

    Object.keys(form.controls).forEach((k) => {
      this.getValidationErrors(form.controls[k], k).forEach((message) =>
        messages.push(message)
      );
    });

    return messages;
  }

  getValidationErrors(state: any, key: string) {
    let ctrlName: string = state.name || key;
    let messages: string[] = [];

    const isimler = [
      {
        Adi: 'kullaniciAd',
        degeri: 'Kullanici Adi',
      },
      {
        Adi: 'Isim',
        degeri: 'Isim',
      },
      {
        Adi: 'SoyIsim',
        degeri: 'Soy isim',
      },
      {
        Adi: 'Sifre',
        degeri: 'Sifre',
      },
      {
        Adi: 'email',
        degeri: 'E-mail',
      },
    ];
    try {
      ctrlName = isimler.find((urun) => urun.Adi == ctrlName)!.degeri;
    } catch (error) {}

    if (state.errors) {
      for (let errorName in state.errors) {
        switch (errorName) {
          case 'required':
            messages.push(` ${ctrlName} bilgisini doldurmadınız.`);
            break;
          case 'minlength':
            messages.push(`  ${ctrlName} minimum karakteri doldurmadınız. `);
            break;
          case 'maxlength':
            messages.push(` ${ctrlName} maksimum karakteri aştınız.`);
            break;
          case 'pattern':
            messages.push(`${ctrlName} geçerli olmayan bir karakter girdiniz.`);
            break;
          case 'min':
            messages.push(`${ctrlName} minimum değerin altında kaldı.`);
            break;
          case 'min':
            messages.push(`${ctrlName} maksimum değerin üstünde kaldı.`);
            break;
          case 'email':
            messages.push(`${ctrlName} hatalı mail formatı girildi.`);
            break;
        }
      }
    }
    return messages;
  }
}
