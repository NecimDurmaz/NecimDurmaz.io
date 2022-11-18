import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/product/product.service';
import { Ticket } from 'src/app/model/ticket.model';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreditCard } from 'src/app/model/creditcard.model';
import { ToastrService } from 'ngx-toastr';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/model/reservation.model';

@Component({
  selector: 'product2',
  templateUrl: './product2.component.html',
  styleUrls: ['./product2.component.css'],
})
export class Product2Component implements OnInit {
  DateNow = moment().format();
  CreditCardDetail: CreditCard;
  isBuyButtonHover: boolean = false;
  isMobile: boolean = false;
  isLargeDesktop: boolean = false;
  TcValid: boolean = true;
  constructor(
    public productService: ProductService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastrService
  ) {
    this.productService.progressBool();
    this.selectedEventsGeneralId = this.route.snapshot.paramMap.get('id');
    this.getAllTicketByEventsGeneralId();

    this.breakpointObserver
      .observe(['(max-width: 599px)', '(min-width: 959px)'])
      .subscribe((value) => {
        this.isLargeDesktop = value.breakpoints['(min-width: 959px)'];
        this.isMobile = value.breakpoints['(max-width: 599px)'];
      });
  }
  ngOnInit(): void {}

  async getAllTickets() {
    // this.productService.getAllTickets();
    await this.productService.getAllTickets();
  }
  async getAllTicketByEventsGeneralId() {
    // this.productService.getAllTickets();
    await this.productService.getAllTicketByEventsGeneralId(
      this.selectedEventsGeneralId
    );
  }

  getTotalPrice() {
    return this.ticketForm.get('totalPrice').value;
  }
  ticketForm = new FormGroup({
    ticketDate: new FormControl(new Date(), [Validators.required]),
    tcValidation: new FormControl(false),
    tcNumber: new FormControl(''),
    adultCount: new FormControl(0),
    childrenCount: new FormControl(0),
    totalPrice: new FormControl(0, [Validators.min(1)]),
    nameAndLastName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telephone: new FormControl('', [Validators.required]),
  });
  adultTicketPrice: number = 0;
  childrenTicketPrice: number = 0;
  selectedEventsGeneralId;
  Tickets$ = new BehaviorSubject<Ticket[]>([]);
  SelectedEvent$ = new BehaviorSubject<Ticket>(null);

  // form işlemleri

  SubmitTicketForm() {
    this.isBuyButtonHover = true;
    if (!this.ticketForm.valid && this.TcValid) {
      this.toastr.error('Eksik ve ya hatalı alanı düzeltiniz.', 'Hata Mesajı', {
        timeOut: 3000,
      });
    }
  }
  // error
  getFormValidationErrors(form: FormGroup): string[] {
    let messages: string[] = [];

    Object.keys(form.controls).forEach((k) => {
      this.getValidationErrors(form.controls[k], k).forEach((message) =>
        messages.push(message)
      );
    });

    return messages;
  }
  // özelleştirilmiş mesajlar
  getValidationErrors(state: any, key: string) {
    let ctrlName: string = state.name || key;
    let messages: string[] = [];

    const isimler = [
      {
        Adi: 'ticketDate',
        degeri: 'Bilet Tarih',
      },
      {
        Adi: 'nameAndLastName',
        degeri: 'Isim ve Soyisim',
      },
      {
        Adi: 'email',
        degeri: 'E-mail',
      },
      {
        Adi: 'telephone',
        degeri: 'Telefon',
      },

      {
        Adi: 'totalPrice',
        degeri: 'Toplam Fiyat',
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

  // bilet sayısı azaltma butonu
  decrement(type: string) {
    if (type === 'adult') {
      var x = this.ticketForm.get('adultCount')?.value;
      if (x != 0 && x < 100) {
        x!--;
        this.ticketForm.patchValue({
          adultCount: x,
        });
        this.Price();
      }
    } else if (type === 'children') {
      var x = this.ticketForm.get('childrenCount')?.value;
      if (x != 0 && x < 100) {
        x!--;
        this.ticketForm.patchValue({
          childrenCount: x,
        });
        this.Price();
      }
    }
  }
  // bilet sayısı arttırma butonu
  increment(type: string) {
    if (type === 'adult') {
      var x = this.ticketForm.get('adultCount')?.value;
      x!++;
      this.ticketForm.patchValue({
        adultCount: x,
      });
    } else if (type === 'children') {
      var x = this.ticketForm.get('childrenCount')?.value;
      x!++;
      this.ticketForm.patchValue({
        childrenCount: x,
      });
    }
    this.Price();
  }

  Price() {
    var adult = this.ticketForm.get('adultCount')?.value;
    var children = this.ticketForm.get('childrenCount')?.value;
    if (this.productService.Discount$.value != null) {
      let price =
        adult! * this.adultTicketPrice + children! * this.childrenTicketPrice;
      let discount =
        (price * this.productService.Discount$.value.body.discount) / 100;
      let totalprice = price - discount;
      this.ticketForm.patchValue({
        totalPrice: totalprice,
      });
    } else
      this.ticketForm.patchValue({
        totalPrice:
          adult! * this.adultTicketPrice + children! * this.childrenTicketPrice,
      });
  }
  TcValidationCheckBox() {
    if (this.ticketForm.get('tcValidation').value) {
      this.ticketForm.patchValue({
        tcNumber: '',
      });
      this.TcValid = true;
      this.adultTicketPrice =
        this.SelectedEvent$.value.body.yetiskinUcretForeign;
      this.childrenTicketPrice =
        this.SelectedEvent$.value.body.cocukUcretForeign;
      this.Price();
    } else {
      this.TcValid = false;
    }
  }
  TcNumberValidation() {
    if (this.ticketForm.get('tcNumber').value.length == 11) {
      if (
        this.productService.TcNumberValidation(
          this.ticketForm.get('tcNumber').value
        )
      ) {
        // DOGRU
        this.TcValid = true;
        this.adultTicketPrice = this.SelectedEvent$.value.body.yetiskinUcretTC;
        this.childrenTicketPrice = this.SelectedEvent$.value.body.cocukUcretTC;
      } else {
        // YANLIS
        this.TcValid = false;
        this.adultTicketPrice =
          this.SelectedEvent$.value.body.yetiskinUcretForeign;
        this.childrenTicketPrice =
          this.SelectedEvent$.value.body.cocukUcretForeign;
      }
      this.Price();
    }
  }

  // bilet türünü seçince çalışan fonk
  SelectedTicket(event: Ticket) {
    this.SelectedEvent$.next(event);
    this.adultTicketPrice = event.body.yetiskinUcretForeign;
    this.childrenTicketPrice = event.body.cocukUcretForeign;
  }
  // Card componentinde ödeme yaptıktan sonra çalışan fonk
  CreditCard(event: CreditCard) {
    this.CreditCardDetail = event;
    this.addTicket();
  }
  newReservation: Reservation;
  addTicket() {
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
  }
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
        kullaniciTelefon: this.ticketForm.value.telephone,
        kullaniciEmail: this.ticketForm.value.email,
        biletID: this.SelectedEvent$.value.primaryKey,
        biletAdi: this.SelectedEvent$.value.body.eventAdi,
        biletTuru: this.SelectedEvent$.value.body.biletTuru,
        tarih: this.ticketForm.value.ticketDate,
        yetiskinSayisi: this.ticketForm.value.adultCount,
        cocukSayisi: this.ticketForm.value.childrenCount,
        price: this.ticketForm.value.totalPrice,
        eventId: this.selectedEventsGeneralId,
        degerlendirmeDurum: false,
        eventUrl: this.SelectedEvent$.value.body.urlLink,
        paymentType: 'Card',
        cardNumber:
          '****-****-****-' + this.CreditCardDetail.cardNumber.slice(-4),
        PnrId: this.productService.PnrIdGenerator(),
        yetiskinUcret: yetiskinUcret,
        cocukUcret: cocukUcret,
        kullaniciAdSoyad: this.ticketForm.value.nameAndLastName,
      },
    };
  }
}
