import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/product.model';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Ticket } from '../../model/ticket.model';

import * as moment from 'moment';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import { ActivatedRoute, Router } from '@angular/router';

// import { DISABLED } from '@angular/forms/src/model';
import { EventsGeneral } from '../../model/events.model';
import { FirebaseService } from '../../services/firebase/firebaseServices.service';
import { BehaviorSubject, map, pipe } from 'rxjs';
import { ProductService } from '../product.service';
import { Reservation } from 'src/app/model/reservation.model';
@Component({
  selector: 'product1',
  templateUrl: 'product.component.html',
  styleUrls: ['product.component.css'],
})
export class ProductComponent {
  tcMask = [
    /[1-9]/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  telMask = [
    '(',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ')',

    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  kartMask = [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  yearMask = [/\d/, /\d/];
  monthMask = [/\d/, /\d/];
  cvcMask = [/\d/, /\d/, /\d/];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    public firebaseSS: FirebaseService
  ) {
    this.selectedEventsGeneralID = this.route.snapshot.paramMap.get('id');
    this.getAllTickets();
    this.productService.getAllDiscount(this.selectedEventsGeneralID);
  }
  selectedEventName: any | undefined;
  selectedEventsGeneral: EventsGeneral;
  Tickets$ = new BehaviorSubject<Ticket[]>([]);
  async getAllTickets() {
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
        this.getEventsGeneraltoEventsById();
      });
  }
  selectedEventsGeneralID: any | undefined;
  titleQR = 'extraqrcode';
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  biletBilgiOnay: any | undefined;

  selectedTicket: Ticket = new Ticket();
  get jsonProduct() {
    return JSON.stringify(this.newProduct);
  }
  get jsonEvent() {
    return JSON.stringify(this.selectedTicket);
  }

  biletForm = new FormGroup({
    biletAdiForm: new FormControl('', [Validators.required]),
    tarih: new FormControl('', [Validators.required]),
    tcVatandaslikForm: new FormControl(false),
    tcKimlikKontrolForm: new FormControl(''),
    yetiskinSayisi: new FormControl({ value: 0, disabled: true }, [
      Validators.required,
    ]),
    cocukSayisi: new FormControl({ value: 0, disabled: true }, [
      Validators.required,
    ]),
    toplamFiyat: new FormControl(0, [Validators.min(1)]),
    tcDurumForm: new FormControl(true, [Validators.min(1)]),
  });

  iletisimForm = new FormGroup({
    isim: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefon: new FormControl('', [
      Validators.required,
      Validators.minLength(14),
      Validators.maxLength(14),
    ]),
  });
  kartForm = new FormGroup({
    numara: new FormControl('', [
      Validators.required,
      Validators.minLength(19),
      Validators.maxLength(19),
    ]),
    ay: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
    ]),
    yıl: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
    ]),
    cvc: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    sozlesme: new FormControl(false, [Validators.requiredTrue]),
  });

  TarihDuzelt() {
    this.biletForm.patchValue({
      tarih: moment(this.biletForm.get('tarih')?.value).format('DD/MM/YYYY'),
    });
  }
  DateNow = moment().format();
  getTarih() {
    return moment(this.biletForm.get('tarih')?.value).format('DD/MM/YYYY');
  }
  // biletAdi = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Değer girilmedi veya hatalı değer girildi.';
    }

    return this.email.hasError('email') ? 'Dogru email formatı girilmedi' : '';
  }

  changeUpdateForm() {
    this.getEventsById();
    this.biletForm.patchValue({
      tcDurumForm: this.biletForm.get('tcDurumForm')?.value,
      tcKimlikKontrolForm: '',
      tcVatandaslikForm: false,
      tarih: this.DateNow,
    });
    this.Price();
  }
  biletfalse() {
    this.biletBilgiOnay = false;
  }
  formSubmitted: boolean = false;
  clicked: boolean = false;

  TicketInformationSubmitForm(form: FormGroup) {
    this.clicked = true;
    this.formSubmitted = true;
    this.biletBilgiOnay = false;
    if (form.valid) {
      this.biletBilgiOnay = true;
      this.formSubmitted = false;
    }
  }

  getFormValidationErrors(form: FormGroup): string[] {
    let messages: string[] = [];

    Object.keys(form.controls).forEach((k) => {
      this.getValidationErrors(form.controls[k], k).forEach((message) =>
        messages.push(message)
      );
    });

    return messages;
  }

  //özelleştirilmiş hata mesajları
  getValidationErrors(state: any, key: string) {
    let ctrlName: string = state.name || key;
    let messages: string[] = [];

    const isimler = [
      {
        Adi: 'biletAdiForm',
        degeri: 'Bilet Adi',
      },
      {
        Adi: 'tarih',
        degeri: 'Tarih',
      },
      {
        Adi: 'toplamFiyat',
        degeri: 'Toplam Fiyat',
      },
      {
        Adi: 'yetiskinSayisi',
        degeri: 'as',
      },
      {
        Adi: 'numara',
        degeri: 'Kart Numara',
      },
      {
        Adi: 'ay',
        degeri: 'Kart Ay',
      },
      {
        Adi: 'yıl',
        degeri: 'Kart Yıl',
      },
      {
        Adi: 'cvc',
        degeri: 'Kart CVC',
      },
      {
        Adi: 'sozlesme',
        degeri: 'Kullanım Kosulları Sözlesme',
      },
      {
        Adi: 'isim',
        degeri: 'İsim Soyisim',
      },
      {
        Adi: 'email',
        degeri: 'Email',
      },
      {
        Adi: 'telefon',
        degeri: 'Telefon',
      },
    ];
    try {
      ctrlName = isimler.find((urun) => urun.Adi == ctrlName)?.degeri as string;
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

  // tc vatandası checkbox
  checkboxTcCitizen(checkbox: any) {
    this.selectedTicket.body.VatandaslikZorunlulugu = checkbox.checked;
    console.log(this.selectedTicket.body.VatandaslikZorunlulugu);
    if (this.selectedTicket.body.VatandaslikZorunlulugu == false) {
      this.biletForm.patchValue({
        tcKimlikKontrolForm: '',
      });

      // YANLIS
      this.biletForm.patchValue({
        tcDurumForm: true,
      });
      this.selectedTicket.body.cocukUcret =
        this.selectedTicket.body.cocukUcretForeign;
      this.selectedTicket.body.yetiskinUcret =
        this.selectedTicket.body.yetiskinUcretForeign;

      this.adultTicketPrice = this.selectedTicket.body.yetiskinUcretForeign;
      this.childrenTicketPrice = this.selectedTicket.body.cocukUcretForeign;
    }
  }
  // bilet sayısı azaltma butonu
  adultCount = 0;
  childrenCount = 0;
  decrement(type: string) {
    if (type === 'yetiskin') {
      var x = this.biletForm.get('yetiskinSayisi')?.value;
      if (x != 0) {
        x!--;
        this.adultCount--;
        this.biletForm.patchValue({
          yetiskinSayisi: x,
        });
        this.Price();
      }
    } else if (type === 'cocuk') {
      var x = this.biletForm.get('cocukSayisi')?.value;
      if (x != 0) {
        x!--;
        this.childrenCount--;

        this.biletForm.patchValue({
          cocukSayisi: x,
        });
        this.Price();
      }
    }
  }
  // bilet sayısı arttırma butonu
  increment(type: string) {
    if (this.selectedTicket.body.biletTuru != undefined) {
      if (type === 'yetiskin') {
        var x = this.biletForm.get('yetiskinSayisi')?.value;
        x!++;
        this.adultCount++;

        this.biletForm.patchValue({
          yetiskinSayisi: x,
        });
      } else if (type === 'cocuk') {
        var x = this.biletForm.get('cocukSayisi')?.value;
        x!++;
        this.childrenCount++;

        this.biletForm.patchValue({
          cocukSayisi: x,
        });
      }
      this.Price();
    }
  }
  adultTicketPrice: number = 0;
  childrenTicketPrice: number = 0;
  Price() {
    var adult = this.biletForm.get('yetiskinSayisi')?.value;
    var children = this.biletForm.get('cocukSayisi')?.value;
    if (this.productService.Discount$.value != null) {
      let price =
        adult! * this.adultTicketPrice + children! * this.childrenTicketPrice;
      let discount =
        (price * this.productService.Discount$.value.body.discount) / 100;
      let totalprice = price - discount;
      this.biletForm.patchValue({
        toplamFiyat: totalprice,
      });
    } else
      this.biletForm.patchValue({
        toplamFiyat:
          adult! * this.selectedTicket.body.yetiskinUcret +
          children! * this.selectedTicket.body.cocukUcret,
      });
  }

  TCKimlikKontrolu(tcno: any) {
    if (this.productService.TcNumberValidation(tcno)) {
      // DOGRU
      this.biletForm.patchValue({
        tcDurumForm: false,
      });
      this.adultTicketPrice = this.selectedTicket.body.yetiskinUcretTC;
      this.childrenTicketPrice = this.selectedTicket.body.cocukUcretTC;

      this.selectedTicket.body.cocukUcret =
        this.selectedTicket.body.cocukUcretTC;
      this.selectedTicket.body.yetiskinUcret =
        this.selectedTicket.body.yetiskinUcretTC;
    } else {
      // YANLIS
      this.biletForm.patchValue({
        tcDurumForm: true,
      });
      this.adultTicketPrice = this.selectedTicket.body.yetiskinUcretForeign;
      this.childrenTicketPrice = this.selectedTicket.body.cocukUcretForeign;

      this.selectedTicket.body.cocukUcret =
        this.selectedTicket.body.cocukUcretForeign;
      this.selectedTicket.body.yetiskinUcret =
        this.selectedTicket.body.yetiskinUcretForeign;
    }
    this.Price();
  }

  onayButonBoolean: boolean = false;
  biletSatisDurum: boolean = false;

  BuyProduct() {
    this.onayButonBoolean = true;
    if (
      this.kartForm.valid &&
      this.iletisimForm.valid &&
      this.onayButonBoolean
    ) {
      this.reservationFiiling();
      this.productService.addReservation(this.newReservation);
      const host: string = location.origin;
      const url: string =
        host +
        String(
          this.router.createUrlTree([
            '/reservation',
            this.newReservation.body.PnrId,
          ])
        );
      window.open(url, '_blank');
      this.biletSatisDurum = true;
      this.iletisimForm.disable();
      this.kartForm.disable();
      this.biletForm.disable();
    }
  }

  onayButonFalse() {
    this.onayButonBoolean = false;
  }

  newProduct: Product;
  newReservation: Reservation;
  reservationFiiling() {
    let yetiskinUcret;
    let cocukUcret;
    if (this.productService.Discount$.value != null) {
      yetiskinUcret =
        this.adultTicketPrice -
        (this.adultTicketPrice *
          this.productService.Discount$.value.body.discount) /
          100;
      cocukUcret =
        this.childrenTicketPrice -
        (this.childrenTicketPrice *
          this.productService.Discount$.value.body.discount) /
          100;
    } else {
      yetiskinUcret = this.adultTicketPrice;
      cocukUcret = this.adultTicketPrice;
    }
    this.newReservation = {
      body: {
        kullaniciTelefon: this.iletisimForm.value.telefon,
        kullaniciEmail: this.iletisimForm.value.email,
        biletID: this.selectedTicket.primaryKey,
        biletAdi: this.selectedTicket.body.eventAdi,
        biletTuru: this.selectedTicket.body.biletTuru,
        tarih: new Date(this.biletForm.value.tarih),
        yetiskinSayisi: this.adultCount,
        cocukSayisi: this.childrenCount,
        price: this.biletForm.value.toplamFiyat,
        eventId: this.selectedEventsGeneralID,
        degerlendirmeDurum: false,
        eventUrl: this.selectedTicket.body.urlLink,
        paymentType: 'Card',
        cardNumber: '****-****-****-' + this.kartForm.value.numara.slice(-4),
        yetiskinUcret: yetiskinUcret,
        cocukUcret: cocukUcret,
        kullaniciAdSoyad: this.iletisimForm.value.isim,
        PnrId: this.productService.PnrIdGenerator(),
      },
    };
  }
  async productFilling() {
    this.newProduct = {
      body: {
        eventId: this.selectedEventsGeneralID,
        degerlendirmeDurum: false,
        biletAdi: this.selectedTicket.body.eventAdi,
        eventUrl: this.selectedTicket.body.urlLink,
        cocukSayisi: this.biletForm.value.cocukSayisi,
        yetiskinSayisi: this.biletForm.value.yetiskinSayisi,
        price: this.biletForm.value.toplamFiyat as number,
        tarih: this.getTarih(),
        biletTuru: this.selectedTicket.body.biletTuru,
        kullaniciAdSoyad: this.iletisimForm.value.isim as string,
        kullaniciEmail: this.iletisimForm.value.email as string,
        kullaniciTelefon: this.iletisimForm.value.telefon as string,
        PnrId: this.productService.PnrIdGenerator(),
        paymentType: 'Card',
        cardNumber: '****-****-****-' + this.kartForm.value.numara.slice(-4),
        cocukUcret: this.selectedTicket.body.cocukUcret,
        yetiskinUcret: this.selectedTicket.body.yetiskinUcret,
      },
    };
  }

  //services
  data = {};

  tickets: Ticket[] | undefined;
  getEventsGeneraltoEventsById(): any {
    this.Tickets$.subscribe((res) => {
      this.tickets = res.filter(
        (x) => x.body.eventsGeneralId == this.selectedEventsGeneralID
      );
    });

    this.tickets.forEach((x) => {
      x.body.VatandaslikZorunlulugu = false;
    });
    this.selectedEventName = this.tickets[0]?.body?.eventAdi;
  }

  getEventsById(): any {
    this.Tickets$.subscribe((res) => {
      this.selectedTicket = res.find(
        (x) => x.primaryKey == this.biletForm.get('biletAdiForm').value
      );
    });
    this.selectedTicket.body.cocukUcret =
      this.selectedTicket.body.cocukUcretForeign;
    this.selectedTicket.body.yetiskinUcret =
      this.selectedTicket.body.yetiskinUcretForeign;
    this.adultTicketPrice = this.selectedTicket.body.yetiskinUcretForeign;
    this.childrenTicketPrice = this.selectedTicket.body.cocukUcretForeign;
  }
}
