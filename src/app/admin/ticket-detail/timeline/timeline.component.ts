import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Timeline } from 'src/app/model/timeline.model';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
  constructor(private toastr: ToastrService) {}
  @Output() TimeLaneStage = new EventEmitter<Timeline>();
  @Output() deleteStage = new EventEmitter<number>();
  @Input() Stage: number;
  @Input() Timeline: Timeline;
  TimelineForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    hour: new FormControl('', [Validators.required]),
    detail: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
    this.TimelineForm.patchValue({
      title: this.Timeline.title,
      hour: this.Timeline.hour,
      detail: this.Timeline.detail,
    });
  }

  DetailTimeline() {
    if (this.TimelineForm.valid) {
      this.toastr.success(
        'Zaman çizelgesine aşama başarıyla eklendi.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
      this.showError = true;
      this.TimeLaneStage.emit(this.TimelineForm.value);
    } else {
      this.toastr.error(
        'Zaman çizelgesine ' + this.Stage + '. aşamayı eklerken hata oluştu.',
        'Bilgilendirme',
        {
          timeOut: 3000,
        }
      );
      this.showError = true;
    }
  }
  deleteTimelineStage() {
    this.deleteStage.emit(this.Stage);
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
        Adi: 'detail',
        degeri: 'Detay',
      },
      {
        Adi: 'hour',
        degeri: 'Saat',
      },
      {
        Adi: 'title',
        degeri: 'Başlık',
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
