import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { Discount } from 'src/app/model/discount.model';
import { EventsGeneral } from 'src/app/model/events.model';
import { FirebaseService } from 'src/app/services/firebase/firebaseServices.service';

@Component({
  selector: 'ticket2',
  templateUrl: './ticket2.component.html',
  styleUrls: ['./ticket2.component.css'],
})
export class Ticket2Component implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public firebaseSS: FirebaseService
  ) {
    this.getAll();
  }
  @Input() selectedEventsGeneralID: any = null;

  ngOnInit() {}
  async getAll() {
    this.firebaseSS.progressBool();

    await this.getAllEventsGeneral()
      .then(async () => await this.getAllDiscount())
      .finally(() => {
        this.firebaseSS.progressBool();
      });
  }
  loadProduct() {
    this.router.navigate(['product'], { relativeTo: this.route });
  }
  EventsGenerals$ = new BehaviorSubject<EventsGeneral[]>([]);

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
        if (this.selectedEventsGeneralID) {
          data = data.filter(
            (x) => x.primaryKey != this.selectedEventsGeneralID
          );
        }
        this.EventsGenerals$.next(data);
      });
  }
  spliceDetail() {
    let i = 0;
    this.EventsGenerals$.value.forEach((eventsGeneral) => {
      if (eventsGeneral.body.eventDetayi!.length > 180) {
        eventsGeneral.body.eventDetayi =
          eventsGeneral.body.eventDetayi!.slice(0, 180) + '(...)';
      }
    });
  }
  Discount$ = new BehaviorSubject<Discount[]>([]);
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
      .subscribe((data) => {
        this.Discount$.next(
          data.filter((x) => {
            return (
              x.body.startDate.seconds * 1000 <= this.DateNow.getTime() &&
              this.DateNow.getTime() <= x.body.endDate.seconds * 1000
            );
          })
        );
      });
  }
  DetailLengthValidation(detail: string) {
    if (detail.length > 240) return detail.slice(0, 235) + '(...)';
    else return detail;
  }
  mappingDiscount(eventsGeneral: EventsGeneral) {
    let discount: number = -1;
    this.Discount$.value.forEach((res) => {
      if (res.body.eventsGeneralName == eventsGeneral.body.eventAdi) {
        discount = res.body.discount;
      }
    });
    return discount;
  }
}
