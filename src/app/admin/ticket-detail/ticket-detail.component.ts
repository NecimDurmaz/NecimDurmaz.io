import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { EventsGeneral } from 'src/app/model/events.model';
import { Ticket } from 'src/app/model/ticket.model';
import { Timeline } from 'src/app/model/timeline.model';

@Component({
  selector: 'ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
})
export class TicketDetailComponent implements OnInit {
  @Input() EventsGenerals: EventsGeneral[];
  @Input() updateTicket = new BehaviorSubject<Ticket>(null);
  // this.ticketDetailForm.patchValue({
  //   eventDetayi: this.updateTicket.value.body.eventDetayi,
  //   biletTuru: this.updateTicket.value.body.biletTuru,
  //   yetiskinUcretTC: this.updateTicket.value.body.yetiskinUcretTC,
  //   yetiskinUcretForeign: this.updateTicket.value.body.yetiskinUcretForeign,
  //   cocukUcretTC: this.updateTicket.value.body.cocukUcretTC,
  //   cocukUcretForeign: this.updateTicket.value.body.cocukUcretForeign,
  //   eventsGeneral: {
  //     primaryKey: this.updateTicket.value.body.eventsGeneralId,
  //     eventAdi: this.updateTicket.value.body.eventAdi,
  //   },
  //   urlLink: this.updateTicket.value.body.urlLink,
  //   eventInformationShow: this.updateTicket.value.body.eventInformationShow,
  //   eventInformation: this.updateTicket.value.body.eventInformation,
  // });
  // this.TimelineShow = this.updateTicket.value.body.timeLineShow;
  // this.TimelineDetail = this.updateTicket.value.body.timeLineDetail;
  // this.stageCount = this.updateTicket.value.body.timeLineDetail?.length;

  @Output()
  newTicket = new EventEmitter<Ticket>();

  constructor(private toastr: ToastrService) {}
  ngOnInit(): void {
    if (this.updateTicket.value != null) {
      this.ticketDetailForm.patchValue({
        eventDetayi: this.updateTicket.value.body.eventDetayi,
        biletTuru: this.updateTicket.value.body.biletTuru,
        yetiskinUcretTC: this.updateTicket.value.body.yetiskinUcretTC,
        yetiskinUcretForeign: this.updateTicket.value.body.yetiskinUcretForeign,
        cocukUcretTC: this.updateTicket.value.body.cocukUcretTC,
        cocukUcretForeign: this.updateTicket.value.body.cocukUcretForeign,
        eventsGeneral: {
          primaryKey: this.updateTicket.value.body.eventsGeneralId,
          eventAdi: this.updateTicket.value.body.eventAdi,
        },
        urlLink: this.updateTicket.value.body.urlLink,
        eventInformationShow: this.updateTicket.value.body.eventInformationShow,
        eventInformation: this.updateTicket.value.body.eventInformation,
      });
      this.TimelineShow = this.updateTicket.value.body.timeLineShow;
      this.TimelineDetail = this.updateTicket.value.body.timeLineDetail || [];
      this.stageCount =
        this.updateTicket.value.body.timeLineDetail?.length || 0;
    }
  }
  @ViewChild('titleContainer', { static: true }) public titleContainer: any;
  stageCount = 1;
  TimelineDetail: Timeline[] = [{}];
  TimelineShow: boolean = false;
  showTemplate$ = new BehaviorSubject<String>('detail');
  googleMapSrc: string =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204203.91479233315!2d30.578020565177265!3d36.897855327118855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39aaeddadadc1%3A0x95c69f73f9e32e33!2sAntalya!5e0!3m2!1str!2str!4v1668202624690!5m2!1str!2str';

  ticketDetailForm = new FormGroup({
    eventDetayi: new FormControl('', [Validators.required]),
    biletTuru: new FormControl('', [Validators.required]),
    yetiskinUcretTC: new FormControl(null, [Validators.required]),
    yetiskinUcretForeign: new FormControl(null, [Validators.required]),
    cocukUcretTC: new FormControl(null, [Validators.required]),
    cocukUcretForeign: new FormControl(null, [Validators.required]),
    eventsGeneral: new FormControl({ primaryKey: '', eventAdi: '' }, [
      Validators.required,
    ]),
    urlLink: new FormControl('', [Validators.required]),
    eventInformationShow: new FormControl(false),
    eventInformation: new FormControl(''),
  });

  decrement() {
    if (this.stageCount != 0) {
      this.stageCount--;
      this.TimelineDetail.pop();
    }
  }
  increment() {
    this.stageCount++;
    this.TimelineDetail.push({});
  }
  TimelineFiiling(event, stage) {
    this.TimelineDetail[stage] = event;
  }

  showTemplateChange(template) {
    this.showTemplate$.next(template);
  }
  // mapChange(value) {
  //   this.googleMapSrc = value.value;
  // }
  ticketDetailSubmit() {
    if (this.ticketDetailForm.valid) {
      this.showError = false;
    } else {
      this.showError = true;
    }
  }
  showError: boolean = false;
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
        Adi: 'eventAdi',
        degeri: 'Event Adi',
      },
      {
        Adi: 'eventDetayi',
        degeri: 'Event Detayi',
      },
      {
        Adi: 'biletTuru',
        degeri: 'Bilet Türü',
      },
      {
        Adi: 'yetiskinUcretTC',
        degeri: 'Yetişkin Ücret Tc',
      },
      {
        Adi: 'yetiskinUcretForeign',
        degeri: 'Yetişkin Ücret Yabancı',
      },
      {
        Adi: 'urlLink',
        degeri: 'Bilet Linki',
      },
      {
        Adi: 'eventDetayi',
        degeri: 'Event Detayi',
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

  addTicket() {
    this.ticketDetailSubmit();
    if (!this.showError) {
      let newTicket: Ticket = {
        body: {
          eventAdi: this.ticketDetailForm.get('eventsGeneral').value.eventAdi,
          eventDetayi: this.ticketDetailForm.get('eventDetayi').value,
          biletTuru: this.ticketDetailForm.get('biletTuru').value,
          yetiskinUcretTC: this.ticketDetailForm.get('yetiskinUcretTC').value,
          yetiskinUcretForeign: this.ticketDetailForm.get(
            'yetiskinUcretForeign'
          ).value,
          cocukUcretTC: this.ticketDetailForm.get('cocukUcretTC').value,
          cocukUcretForeign:
            this.ticketDetailForm.get('cocukUcretForeign').value,
          eventsGeneralId:
            this.ticketDetailForm.get('eventsGeneral').value.primaryKey,
          urlLink: this.ticketDetailForm.get('urlLink').value,
          eventInformation: this.ticketDetailForm.get('eventInformation').value,
          eventInformationShow: this.ticketDetailForm.get(
            'eventInformationShow'
          ).value,
          timeLineDetail: this.TimelineDetail,
          timeLineShow: this.TimelineShow,
        },
      };
      console.log(newTicket);
      this.toastr.success(
        'Bilet bilgileri başarıyla eklendi.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
      this.newTicket.emit(newTicket);
    } else {
      this.toastr.error(
        'Bilet içeriğinde hata meydana geldi bilgileri kontrol ediniz.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
    }
  }

  deleteTimelineStage($event) {
    delete this.TimelineDetail[$event - 1];
    this.stageCount--;
    console.log(this.TimelineDetail);
  }
}
