import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase/firebaseServices.service';
import { Ticket } from '../model/ticket.model';
import { Discount } from '../model/discount.model';
import { Reservation } from '../model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private firebaseSS: FirebaseService) {}
  Tickets$ = new BehaviorSubject<Ticket[]>([]);
  Discount$ = new BehaviorSubject<Discount>(null);
  DateNow = new Date();

  progressBool() {
    this.firebaseSS.progressBool();
  }
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
      });
    this.progressBool();
  }
  async getAllDiscount(eventsGeneralId) {
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
          data.find((x) => {
            return (
              x.body.startDate.seconds * 1000 <= this.DateNow.getTime() &&
              this.DateNow.getTime() <= x.body.endDate.seconds * 1000 &&
              x.body.eventsGeneralId == eventsGeneralId
            );
          })
        );
      });
  }

  async getAllTicketByEventsGeneralId(EventsGeneralId) {
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
        this.Tickets$.next(
          data.filter((res) => res.body.eventsGeneralId == EventsGeneralId)
        );
        this.getAllDiscount(EventsGeneralId);
      });
    this.progressBool();
  }

  PnrIdGenerator() {
    let PnrId;

    PnrId = Math.floor(Math.random() * (999999 - 100001)) + 100000;

    // await this.firebaseSS.getReservationByPnrId(PnrId);

    return PnrId;
  }
  addReservation(newReservation) {
    this.firebaseSS.addReservation(newReservation);
  }

  async getEventsGeneraltoEventsById(selectedEventsGeneralID) {
    await this.Tickets$.subscribe((res) => {
      return res.filter(
        (x) => x.body.eventsGeneralId == selectedEventsGeneralID
      );
    });
  }

  TcNumberValidation(tcno: any) {
    var toplam;

    toplam =
      Number(tcno.substring(0, 1)) +
      Number(tcno.substring(1, 2)) +
      Number(tcno.substring(2, 3)) +
      Number(tcno.substring(3, 4)) +
      Number(tcno.substring(4, 5)) +
      Number(tcno.substring(5, 6)) +
      Number(tcno.substring(6, 7)) +
      Number(tcno.substring(7, 8)) +
      Number(tcno.substring(8, 9)) +
      Number(tcno.substring(9, 10));
    var strtoplam = String(toplam);
    var onunbirlerbas = strtoplam.substring(
      strtoplam.length,
      strtoplam.length - 1
    );

    if (onunbirlerbas == tcno.substring(10, 11)) {
      // DOGRU
      return true;
    } else {
      // YANLIS
      return false;
    }
  }
}
