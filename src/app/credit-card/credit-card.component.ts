import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';
import { ToastrService } from 'ngx-toastr';
import { CreditCard } from '../model/creditcard.model';
@Component({
  selector: 'credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css'],
})
export class CreditCardComponent implements OnInit {
  @Output() CreditCardDetail = new EventEmitter<CreditCard>();
  cardNumber = [
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
  constructor(public toastr: ToastrService) {}

  ngOnInit(): void {}
  showError: boolean = false;
  creditCardForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required]),
    cardHolder: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    cardExpirationMonth: new FormControl('', [Validators.required]),
    cardExpirationYear: new FormControl('', [Validators.required]),
    cardCVV: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  SubmitCreditForm(creditForm: FormGroup) {
    if (creditForm.valid) {
      this.toastr.success(
        'Satın alma başarıyla gerçekleşti.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
      this.DetailCreditCard(creditForm.value);
    } else {
      this.showError = true;

      this.toastr.error(
        'Kart bilgilerini doldururken hata meydana geldi.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
    }
  }
  DetailCreditCard(creditCard) {
    this.CreditCardDetail.emit(creditCard);
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
        Adi: 'cardNumber',
        degeri: 'Kart Numara',
      },
      {
        Adi: 'cardHolder',
        degeri: 'Kart Sahibi',
      },
      {
        Adi: 'cardExpirationMonth',
        degeri: 'Kart Yıl',
      },

      {
        Adi: 'cardExpirationMonth',
        degeri: 'Kart Ay',
      },
      {
        Adi: 'cvc',
        degeri: 'Kart CVC',
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
}
