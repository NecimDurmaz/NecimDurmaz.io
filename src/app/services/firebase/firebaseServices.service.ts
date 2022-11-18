import { Injectable } from '@angular/core';

import 'firebase/firestore';
import 'firebase/auth';
import { BehaviorSubject, map } from 'rxjs';
import { User } from 'src/app/model/users.model';
import { Settings } from 'src/app/model/settings';
import { Comments } from 'src/app/model/comments.model';
import { EventsGeneral } from 'src/app/model/events.model';
import { Product } from 'src/app/model/product.model';
import { Ticket } from 'src/app/model/ticket.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Discount } from 'src/app/model/discount.model';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private dbFireStore: AngularFirestore) {}
  user$ = new BehaviorSubject<User>(null);
  userLoginStatus$ = new BehaviorSubject<boolean>(false);
  Settings$ = new BehaviorSubject<Settings>(null);

  progress = new BehaviorSubject<boolean>(true);
  progressBool() {
    this.progress.next(!this.progress.value);
  }
  async getAll() {
    await Promise.all([
      this.getAllEventsGeneral(),
      // this.getAllTickets(),
      this.getAllReservations(),
      // this.getAllComments(),
      this.getAllSettings(),
      // this.getAllUsers()
    ]);
  }

  //   GET ALL

  // this.EventsGeneralsRef.snapshotChanges()
  //   .pipe(
  //     map((changes) =>
  //       changes.map((x) => ({
  //         primaryKey: x.payload.doc.id,
  //         body: { ...x.payload.doc.data() },
  //       }))
  //     )
  //   )
  //   .subscribe((data) => {
  //     this.EventsGenerals$.next(data);
  //   });

  EventsGeneralsRef: AngularFirestoreCollection<any>;
  //  EventsGenerals$ = new BehaviorSubject<EventsGeneral[]>([]);
  async getAllEventsGeneral() {
    this.EventsGeneralsRef = this.dbFireStore.collection('/eventsGeneral');
    return this.EventsGeneralsRef;
  }

  TicketsRef: AngularFirestoreCollection<any>;
  //Tickets$ = new BehaviorSubject<Ticket[]>([]);
  //
  async getAllTickets() {
    this.TicketsRef = this.dbFireStore.collection('/events');
    return this.TicketsRef;
  }
  reservationsRef: AngularFirestoreCollection<any>;
  reservations$ = new BehaviorSubject<Product[]>([]);
  async getAllReservations() {
    this.reservationsRef = this.dbFireStore.collection('/reservation');
    return this.reservationsRef;
  }
  //

  usersRef: AngularFirestoreCollection<any>;
  users$ = new BehaviorSubject<User[]>([]);
  async getAllUsers() {
    this.usersRef = this.dbFireStore.collection('/users');
    return this.usersRef;
  }
  //
  commentsRef: AngularFirestoreCollection<any>;
  comments$ = new BehaviorSubject<Comments[]>([]);
  async getAllComments() {
    this.commentsRef = this.dbFireStore.collection('/comments');
    return this.commentsRef;
  }
  //
  settingsLogoUrl: any;
  settingsRef: AngularFirestoreCollection<any>;
  // settings$ = new BehaviorSubject<Settings>(null);
  async getAllSettings() {
    this.settingsRef = this.dbFireStore.collection('/settings');
    return this.settingsRef;
  }

  discountRef: AngularFirestoreCollection<any>;
  async getAllDiscount() {
    this.discountRef = this.dbFireStore.collection('/discount');
    return this.discountRef;
  }

  //   ADD

  // try {
  //   const docRef = await addDoc(
  //     collection(this.db, 'eventsGeneral'),
  //     eventGeneral
  //   );
  //   let res = {
  //     primaryKey: docRef.id,
  //     body: eventGeneral,
  //   };
  //   console.log('doc', docRef.id);
  //   this.EventsGenerals$.value.push(res);
  // } catch (e) {
  //   console.error('Error adding document: ', e);
  // }
  async addReservation(reservation) {
    this.reservationsRef.add({ ...reservation.body });
  }

  async addTicket(newTicket: Ticket) {
    this.TicketsRef.add({ ...newTicket.body });
  }
  async addEventGeneral(eventGeneral) {
    this.EventsGeneralsRef.add({ ...eventGeneral });
  }
  async addUser(user) {
    this.usersRef.add({ ...user });
  }
  async addComments(comment) {
    this.commentsRef.add({ ...comment.body });
  }
  async addDiscount(discount: Discount) {
    this.discountRef.add({ ...discount.body });
  }
  // remove

  // await deleteDoc(doc(this.db, 'reservation', primaryKey));
  // let index = this.reservations$.value.findIndex(
  //   (res) => res.primaryKey == primaryKey
  // );
  // console.log(index);
  // this.reservations$.value.splice(index, 1);
  // console.log(this.reservations$);
  async removeReservation(primaryKey: any) {
    return this.reservationsRef.doc(primaryKey).delete();
  }

  async removeTicket(primaryKey: any) {
    return this.TicketsRef.doc(primaryKey).delete();
  }

  async removeEventsGeneral(primaryKey: any) {
    return this.EventsGeneralsRef.doc(primaryKey).delete();
  }
  async removeUser(primaryKey: any) {
    return await this.usersRef.doc(primaryKey).delete();
  }

  // getById
  // getEventsGeneraltoEventsById(id: any) {
  //   return this.Tickets$.value.find((x) => x.body.eventsGeneralId == id);
  // }
  // getEventsById(id: any) {
  //   return this.Tickets$.value.find((x) => x.primaryKey == id);
  // }
  // getCommentsByEventsGeneralId(eventId: any) {
  //   return this.comments$.value.filter((x) => x.body.eventId == eventId);
  // }
  async getReservationByPnrId(PnrId: any) {
    return this.reservations$.value.find((x) => x.body.PnrId == PnrId);
  }
  getReservationByMail(mail: any) {
    return this.reservations$.value.find((x) => x.body.kullaniciEmail == mail);
  }

  // getEventsGeneralById(id: any) {
  //   return this.EventsGenerals$.value.find((x) => x.body.id == id);
  // }
  // Query
  mailQuery(mail: any) {
    return this.users$.value.find((x) => x.body.email == mail);
  }
  userQuery(mail: any, password: any) {
    return this.users$.value.find(
      (x) => x.body.email == mail && x.body.password == password
    );
  }
  //   TODO  BURAYA BAK
  //   getReservationByMailAndCommentsStatus(mail: any, type: any) {
  //     return this.reservations$.find(
  //       (x) => x.body.kullaniciEmail == mail && x.body.degerlendirmeDurum == type
  //     );
  //   }

  //   getReservationByMailandEvents(mail: any, type: any) {
  //     return this.reservations$.find(
  //       (x) => x.body.kullaniciEmail == mail && x.body.biletTURU == type
  //     );

  //   }

  //   getReservationByMailAndDate(mail: any, type: any) {
  //     return this.http.get(
  //       this.apiUrl +
  //         '/reservation?kullaniciEmail=' +
  //         mail +
  //         '&_sort=tarih&_order=' +
  //         type
  //     );
  //   }

  // UPDATE

  // const docRef = await setDoc(
  //   doc(this.db, 'events', event.primaryKey),
  //   event.body,
  //   {
  //     merge: true,
  //   }
  // );
  // let index = this.Tickets$.value.findIndex(
  //   (res) => res.primaryKey == event.primaryKey
  // );
  // this.Tickets$.value[index] = event;
  async updateReservation(reservation) {
    return this.reservationsRef
      .doc(reservation.primaryKey)
      .update(reservation.body);
  }
  async updateTicket(event) {
    return this.TicketsRef.doc(event.primaryKey).update(event.body);
  }
  async updateEventsGeneral(eventsGeneral) {
    return this.EventsGeneralsRef.doc(eventsGeneral.primaryKey).update(
      eventsGeneral.body
    );
  }
  async updateSettings(settings: Settings) {
    return this.settingsRef.doc(settings.primaryKey).update(settings.body);
  }
}
