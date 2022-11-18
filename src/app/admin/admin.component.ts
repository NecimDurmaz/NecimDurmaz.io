import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, map, observable, Observable, Observer } from 'rxjs';

import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Product } from '../model/product.model';
import { Router } from '@angular/router';
import { EventsGeneral } from '../model/events.model';
import { FirebaseService } from '../services/firebase/firebaseServices.service';
import { User } from '../model/users.model';
import { Ticket } from '../model/ticket.model';
import { Settings } from '../model/settings';
import { ToastrService } from 'ngx-toastr';
import { Discount } from '../model/discount.model';
import * as moment from 'moment';

type NewType = number;

// const ELEMENT_DATA: Reservation[] = this.reservation;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(
    public firebaseSS: FirebaseService,
    private route: Router,
    private toastr: ToastrService
  ) {}
  DateNow = moment().format();

  ngOnInit() {
    if (
      this.firebaseSS.userLoginStatus$.value == false ||
      this.firebaseSS.user$.value == null ||
      this.firebaseSS.user$.value.body.UsersTypeId != 3
    ) {
      alert('Giriş Yapılmadi.Giriş yapınız.');
      this.route.navigate(['']);
    } else {
      //  GİRİS YAPILDI

      this.getAllReservations();
    }
  }
  reservations$ = new BehaviorSubject<Product[]>([]);
  async getAllReservations() {
    (await this.firebaseSS.getAllReservations())
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
        this.reservations$.next(data);
      });
  }
  users$ = new BehaviorSubject<User[]>([]);
  async getAllUsers() {
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
        this.users$.next(data);
      });
  }

  Tickets$ = new BehaviorSubject<Ticket[]>([]);
  EventsGenerals$ = new BehaviorSubject<EventsGeneral[]>([]);

  async getAllTicketsAndEventsGeneral() {
    (await this.firebaseSS.getAllTickets())
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
        this.Tickets$.next(data);
      });
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
        this.EventsGenerals$.next(data);
      });
  }

  newEventsGeneralForm = new FormGroup({
    eventAdi: new FormControl('', [Validators.required]),
    urlLink: new FormControl('', [Validators.required]),
    eventDetayi: new FormControl('', [Validators.required]),
    primaryKey: new FormControl(0, [Validators.required]),
  });
  newEventsForm = new FormGroup({
    // id: new FormControl('', [Validators.required]),
    eventDetayi: new FormControl('', [Validators.required]),
    biletTuru: new FormControl('', [Validators.required]),
    yetiskinUcretTC: new FormControl('', [Validators.required]),
    yetiskinUcretForeign: new FormControl('', [Validators.required]),
    cocukUcretTC: new FormControl('', [Validators.required]),
    cocukUcretForeign: new FormControl('', [Validators.required]),
    eventsGeneral: new FormControl({ primaryKey: '', eventAdi: '' }, [
      Validators.required,
    ]),
    urlLink: new FormControl('', [Validators.required]),
    eventInformationShow: new FormControl(false),
    eventInformation: new FormControl(''),
  });
  updEventsGeneralForm = new FormGroup({
    eventAdi: new FormControl('', [Validators.required]),
    urlLink: new FormControl('', [Validators.required]),
    eventDetayi: new FormControl('', [Validators.required]),
    primaryKey: new FormControl(0, [Validators.required]),
  });
  updEventsForm = new FormGroup({
    primaryKey: new FormControl(0, [Validators.required]),
    eventAdi: new FormControl('', [Validators.required]),
    eventDetayi: new FormControl('', [Validators.required]),
    biletTuru: new FormControl('', [Validators.required]),
    yetiskinUcretTC: new FormControl('', [Validators.required]),
    yetiskinUcretForeign: new FormControl('', [Validators.required]),
    cocukUcretTC: new FormControl('', [Validators.required]),
    cocukUcretForeign: new FormControl('', [Validators.required]),
    eventsGeneral: new FormControl({ primaryKey: '', eventAdi: '' }, [
      Validators.required,
    ]),
    urlLink: new FormControl('', [Validators.required]),
    //  eventsGeneralId: new FormControl('', [Validators.required]),
    eventInformationShow: new FormControl(false),
    eventInformation: new FormControl(''),
  });

  // MODAL SUBMİT
  newEventsGeneral(form: FormGroup, btnClose: any) {
    if (form.valid == true) {
      this.addEventsGeneral();
      alert('Yeni EventsGeneral Oluşturuldu.');
      form.reset();
      btnClose.click();
    } else {
      alert('Boş alanları doldurunuz');
    }
  }
  UpdateEventsGeneralForm(form: FormGroup, btnClose: any) {
    if (form.valid == true) {
      this.updateEventsGeneral();
      form.reset();
      btnClose.click();
    } else {
      alert('Boş alanları doldurunuz');
    }
  }
  UpdateTicketsForm(form: FormGroup, btnClose: any) {
    if (
      form.valid == true &&
      form.get('eventsGeneral').value.primaryKey != ''
    ) {
      this.updateTickets();
      form.reset();
      btnClose.click();
    } else {
      alert('Boş alanları doldurunuz');
    }
  }
  addFormEvent(formEvent: FormGroup, btnClose: any) {
    if (
      formEvent.valid == true &&
      formEvent.get('eventsGeneral')?.value?.primaryKey
    ) {
      // this.addTicket();
      formEvent.reset();
      btnClose.click();
    } else {
      alert('Boş alanları doldurunuz');
    }
  }

  //remove
  removeEvents(primaryKey: string) {
    this.firebaseSS
      .removeTicket(primaryKey)
      .then(() => {
        alert('Bilet başarıyla silindi.');
      })
      .catch((err) => alert(err));
  }
  removeEventsGeneral(primaryKey: string) {
    this.firebaseSS
      .removeEventsGeneral(primaryKey)
      .then(() => {
        alert('EventsGeneral başarıyla silindi.');
      })
      .catch((err) => alert(err));
  }
  removeReservation(primaryKey: any) {
    this.firebaseSS
      .removeReservation(primaryKey)
      .then(() => {
        alert('Rezervasyon başarıyla silindi.');
      })
      .catch((err) => alert(err));
    // this.servicesService.removeReservation(id).subscribe({
    //   next: (res) => alert('Rezervasyon başarıyla silindi.'),
    //   error: (e) => console.error(e),
    //   complete: () => console.info('complete'),
    // });
    // this.res$ = this.servicesService.getAllReservation();
  }
  removeUser(primaryKey: string) {
    this.firebaseSS
      .removeUser(primaryKey)
      .then(() => {
        alert('Kullanıcı başarıyla silindi.');
      })
      .catch((err) => alert(err));
  }

  // ADD
  addTicket($event) {
    let newTicket: Ticket = $event;
    // const newTicket = {
    //   eventAdi: this.newEventsForm.get('eventsGeneral')?.value?.eventAdi,
    //   biletTuru: this.newEventsForm.get('biletTuru')?.value,
    //   eventDetayi: this.newEventsForm.get('eventDetayi')?.value,
    //   yetiskinUcretTC: this.newEventsForm.get('yetiskinUcretTC')?.value,
    //   yetiskinUcretForeign: this.newEventsForm.get('yetiskinUcretForeign')
    //     ?.value,
    //   cocukUcretTC: this.newEventsForm.get('cocukUcretTC')?.value,
    //   cocukUcretForeign: this.newEventsForm.get('cocukUcretForeign')?.value,
    //   urlLink: this.newEventsForm.get('urlLink')?.value,
    //   eventsGeneralId:
    //     this.newEventsForm.get('eventsGeneral')?.value?.primaryKey,
    //   eventInformation: this.newEventsForm.get('eventInformation')?.value,
    //   eventInformationShow: this.newEventsForm.get('eventInformationShow')
    //     ?.value,
    // };

    this.firebaseSS.addTicket(newTicket);
    this.toastr.success(
      'Bilet   başarıyla veritabanına eklendi.',
      'Bilgilendirme',
      {
        timeOut: 3000,
      }
    );
  }

  addEventsGeneral() {
    const eventsGeneral = {
      eventAdi: this.newEventsGeneralForm.get('eventAdi')?.value,
      urlLink: this.newEventsGeneralForm.get('urlLink')?.value,
      eventDetayi: this.newEventsGeneralForm.get('eventDetayi')?.value,
    };

    this.firebaseSS.addEventGeneral(eventsGeneral);
  }

  //update
  updateEventsGeneral() {
    const updEventsGeneral = {
      primaryKey: this.updEventsGeneralForm.get('primaryKey')?.value,
      body: {
        eventAdi: this.updEventsGeneralForm.get('eventAdi')?.value,
        urlLink: this.updEventsGeneralForm.get('urlLink')?.value,
        eventDetayi: this.updEventsGeneralForm.get('eventDetayi')?.value,
      },
    };
    this.firebaseSS
      .updateEventsGeneral(updEventsGeneral)
      .then(() => {
        alert('EventsGeneral güncellendi.');
      })
      .catch((err) => alert(err));
  }
  updEventsGeneralFilling(EventsGeneral: any) {
    this.updEventsGeneralForm.patchValue({
      primaryKey: EventsGeneral.primaryKey,
      eventAdi: EventsGeneral.body.eventAdi,
      urlLink: EventsGeneral.body.urlLink,
      eventDetayi: EventsGeneral.body.eventDetayi,
    });
  }

  updateTickets() {
    const updEvent = {
      primaryKey: this.updEventsForm.get('primaryKey')?.value,
      body: {
        eventAdi: this.updEventsForm.get('eventsGeneral')?.value?.eventAdi,
        biletTuru: this.updEventsForm.get('biletTuru')?.value,
        eventDetayi: this.updEventsForm.get('eventDetayi')?.value,
        yetiskinUcretTC: this.updEventsForm.get('yetiskinUcretTC')?.value,
        yetiskinUcretForeign: this.updEventsForm.get('yetiskinUcretForeign')
          ?.value,
        cocukUcretTC: this.updEventsForm.get('cocukUcretTC')?.value,
        cocukUcretForeign: this.updEventsForm.get('cocukUcretForeign')?.value,
        urlLink: this.updEventsForm.get('urlLink')?.value,
        eventsGeneralId:
          this.updEventsForm.get('eventsGeneral')?.value?.primaryKey,
        eventInformation: this.updEventsForm.get('eventInformation')?.value,
        eventInformationShow: this.updEventsForm.get('eventInformationShow')
          ?.value,
      },
    };
    this.firebaseSS
      .updateTicket(updEvent)
      .then(() => {
        alert('Biletler güncellendi.');
      })
      .catch((err) => alert(err));
  }

  updateTicket = new BehaviorSubject<Ticket>(null);
  updEventsFiiling(ticket: Ticket) {
    this.updateTicket.next(ticket);

    // this.updEventsForm.patchValue({
    //   primaryKey: primaryKey,
    //   eventAdi: obj.body.eventAdi,
    //   biletTuru: obj.body.biletTuru,
    //   eventDetayi: obj.body.eventDetayi,
    //   yetiskinUcretTC: obj.body.yetiskinUcretTC,
    //   yetiskinUcretForeign: obj.body.yetiskinUcretForeign,
    //   cocukUcretTC: obj.body.cocukUcretTC,
    //   cocukUcretForeign: obj.body.cocukUcretForeign,
    //   urlLink: obj.body.urlLink,
    //   //  eventsGeneralId: obj.body.eventsGeneralId,
    //   eventInformation: obj.body.eventInformation,
    //   eventInformationShow: obj.body.eventInformationShow,
    // });
  }

  // SETTİNGS
  settingsForm = new FormGroup({
    logoUrl: new FormControl('', [Validators.required]),
    logoTopPadding: new FormControl(0, [Validators.required]),
    logoBottomPadding: new FormControl(0, [Validators.required]),
    primaryColor: new FormControl('', [Validators.required]),
    secondaryColor: new FormControl('', [Validators.required]),
    commentsColor: new FormControl('', [Validators.required]),
    loadingDesign: new FormControl('', [Validators.required]),
    ticketDesign: new FormControl('', [Validators.required]),
    eventsGeneralDesign: new FormControl('', [Validators.required]),
  });

  // submitFormSettings(form: FormGroup) {
  //   if (form.valid == true) {
  //     this.updateSettings();
  //   }
  // }
  settings$ = new BehaviorSubject<Settings>(null);
  async getAllSetting() {
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
        this.settingsForm.patchValue({
          logoUrl: this.settings$.value.body.logoUrl,
          logoTopPadding: this.settings$.value.body.logoTopPadding,
          logoBottomPadding: this.settings$.value.body.logoBottomPadding,
          primaryColor: this.settings$.value.body.primaryColor,
          secondaryColor: this.settings$.value.body.secondaryColor,
          commentsColor: this.settings$.value.body.commentsColor,
          loadingDesign: this.settings$.value.body.loadingDesign,
          ticketDesign: this.settings$.value.body.ticketDesign,
          eventsGeneralDesign: this.settings$.value.body.eventsGeneralDesign,
        });
      });
  }

  submitSettings() {
    if (this.settingsForm.valid) {
      let settings: Settings = {
        primaryKey: this.settings$.value.primaryKey,
        body: this.settingsForm.value,
      };
      this.updateSettings(settings);
    } else {
      this.toastr.error(
        'Boş alan bırakıldı. Kontrol edip tekrar deneyiniz.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
    }
  }
  updateSettings(settings: Settings) {
    this.firebaseSS
      .updateSettings(settings)
      .then(() => {
        this.toastr.success('Ayarlar Güncellendi.', 'Bilgilendirme', {
          timeOut: 3000,
        });
      })
      .catch((err) => alert(err));
  }

  ColorSwitch(color: any) {
    if (color.type == 'text') color.type = 'color';
    else if (color.type == 'color') color.type = 'text';
  }
  // settings

  // loading
  changeLoadingAnimation(loading: string) {
    this.settingsForm.patchValue({ loadingDesign: loading });
  }

  //ticket
  choseTicketDesign(ticket: string) {
    this.settingsForm.patchValue({ ticketDesign: ticket });
  }
  //eventsGeneral
  choseEventsGeneralDesign(eventsGeneral: string) {
    this.settingsForm.patchValue({ eventsGeneralDesign: eventsGeneral });
  }
  // Discount
  discount$ = new BehaviorSubject<Discount[]>([]);
  discountEventsGeneralForm = new FormGroup({
    eventsGeneral: new FormControl({ primaryKey: '', eventAdi: '' }, [
      Validators.required,
    ]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    discount: new FormControl(0, [Validators.required]),
  });
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
      .subscribe((res) => {
        this.discount$.next(res);
      });
  }
  async getAllEventsGeneral() {
    if (this.EventsGenerals$.value.length == 0) {
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
          this.EventsGenerals$.next(data);
        });
    }
  }
  isDiscountEventsGeneralSubmit: boolean = false;
  submitDiscountEventsGeneral() {
    this.isDiscountEventsGeneralSubmit = true;
    if (this.discountEventsGeneralForm.valid) {
      let discount: Discount = {
        body: {
          eventsGeneralId:
            this.discountEventsGeneralForm.value.eventsGeneral.primaryKey,
          eventsGeneralName:
            this.discountEventsGeneralForm.value.eventsGeneral.eventAdi,
          startDate: this.discountEventsGeneralForm.value.startDate,
          endDate: this.discountEventsGeneralForm.value.endDate,
          discount: this.discountEventsGeneralForm.value.discount,
        },
      };

      this.firebaseSS.addDiscount(discount).finally(() => {
        this.toastr.success(
          'İndirim başarıyla veritabanına eklendi.',
          'Bilgilendirme',
          {
            timeOut: 3000,
          }
        );
      });
    } else {
      this.toastr.error(
        'Eksik ve ya hatalı alan var.Kontrol edip tekrar deniyiniz.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
    }
  }
  timeStampToDate(timestamp) {
    let date = new Date(timestamp.seconds * 1000);
    moment.locale('tr');
    return moment(date).format('LL');
  }
}
