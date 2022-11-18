import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Comments } from '../model/comments.model';

import { Product } from '../model/product.model';

import { FirebaseService } from '../services/firebase/firebaseServices.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor(private route: Router, public firebaseSS: FirebaseService) {}

  ngOnInit() {
    if (
      this.firebaseSS.userLoginStatus$.value == false ||
      this.firebaseSS.user$ == null ||
      this.firebaseSS.user$.value.body.UsersTypeId != 2
    ) {
      alert('Giriş Yapılmadi.Giriş yapınız.');
      this.route.navigate(['']);
    } else {
      this.getAllReservations();

      this.getReservationByMail();
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
        this.reservations$.next(
          data.filter(
            (reservations) =>
              reservations?.body.kullaniciEmail ==
              this.firebaseSS.user$.value.body.email
          )
        );
      });
  }

  description: any;
  reservations: Product[] | undefined;
  getReservationByMail() {
    this.firebaseSS.reservations$.subscribe((res) => {
      this.reservations = res.filter(
        (x) => x.body.kullaniciEmail == this.firebaseSS.user$.value.body.email
      );
    });
  }
  // asc artan
  // desc azalan
  MailAndCommentsStatus: boolean = false;
  getReservationByMailAndCommentsStatus(type: Boolean) {
    console.log(this.reservations$.value);
    console.log(type);
    this.reservations$.pipe(
      map((res) => {
        res.map((res) => res.body.degerlendirmeDurum == type);
      })
    );
    this.reservations$.value.forEach((x) => {
      console.log('xd', x.body.degerlendirmeDurum);
    });
    this.MailAndCommentsStatus = !type;
    console.log('mail', this.MailAndCommentsStatus);

    // })
    // this.servicesService
    //   .getReservationByMailAndCommentsStatus(
    //     this.firebaseSS.user$.value.body.email,
    //     type
    //   )
    //   .subscribe((res) => {
    //     this.reservations = res as any[];
    //   });
  }
  MailandEvents: boolean = true;

  SortReservationsByName(type: boolean) {
    this.reservations$.pipe(
      map((res) => {
        res.sort((a, b) => {
          if (a.body.biletTuru > b.body.biletTuru) {
            return -1;
          }
          if (b.body.biletTuru > a.body.biletTuru) {
            return 1;
          }
          return 0;
        });
      })
    );
    console.log(this.reservations$.value);
    this.reservations$.value.forEach((x) => {
      console.log('xd', x.body.biletTuru);
    });
    // (x) => x.body.kullaniciEmail == mail && x.body.biletTURU == type
    // this.servicesService
    //   .getReservationByMailandEvents(
    //     this.firebaseSS.user$.value.body.email,
    //     type
    //   )
    //   .subscribe((res) => {
    //     this.reservations = res as [];
    //   });
    // if (type == 'desc') this.MailandEvents = 'asc';
    // else this.MailandEvents = 'desc';
  }
  MailAndDate = 'desc';
  getReservationByMailAndDate(type: string) {
    // this.servicesService
    //   .getReservationByMailAndDate(this.firebaseSS.user$.value.body.email, type)
    //   .subscribe((res) => {
    //     this.reservations = res as any[];
    //   });
    // if (type == 'desc') this.MailAndDate = 'asc';
    // else this.MailAndDate = 'desc';
  }

  TarihHesaplama(tarih: string) {
    moment.locale('tr'); // tr

    var donus = moment(tarih, 'L').fromNow();

    if (donus.indexOf('önce') != -1) {
      return true;
    } else {
      return false;
    }
  }

  selectedReservationRating: Product | undefined;
  ratingFilling(obj: Product) {
    console.log('gelen', obj);

    this.selectedReservationRating = obj;
  }
  totalRating = 1;
  changeRating(value: number) {
    this.totalRating = value;
  }
  // TO DO
  updateReservation() {
    this.selectedReservationRating.body.degerlendirmeDurum = true;
    this.firebaseSS.updateReservation(this.selectedReservationRating);
  }
  selectedReservationDetail: Product | undefined;

  selectedReservationFiiling(reservation: Product) {
    this.selectedReservationDetail = reservation;
  }
  addComments() {
    const newComment: Comments = new Comments({
      reservationId: this.selectedReservationRating.primaryKey,
      description: this.description,
      totalRating: this.totalRating,
      UserName: this.selectedReservationRating.body.kullaniciAdSoyad,
      biletAdi: this.selectedReservationRating.body.biletAdi,
      biletTuru: this.selectedReservationRating.body.biletTuru,
      eventId: this.selectedReservationRating.body.eventId,
      tarih: this.selectedReservationRating.body.tarih,
      yorumTarihi: moment().format('DD/MM/YYYY'),
      kullaniciEmail: this.selectedReservationRating.body.kullaniciEmail,
    });
    console.log('des', this.description);
    console.log('selectedrat', newComment);
    console.log('selectedrat', newComment);

    this.firebaseSS.addComments(newComment);
  }
  submitComment() {
    this.updateReservation();
    this.addComments();
    alert('yorumunuz onaylandı.');
    this.getReservationByMail();
  }
}
