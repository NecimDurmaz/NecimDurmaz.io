import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import * as moment from 'moment';
import { filter, map } from 'rxjs';
import { FirebaseService } from '../services/firebase/firebaseServices.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,

    public firebaseSS: FirebaseService
  ) {}

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  PnrId: any | undefined;
  reservation: any | undefined;
  ngOnInit() {
    this.PnrId = this.route.snapshot.paramMap.get('id');
    this.getReservationByPnrId();
  }

  async getReservationByPnrId() {
    (await this.firebaseSS.getAllReservations())
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes
            .map((x) => ({
              primaryKey: x.payload.doc.id,
              body: { ...x.payload.doc.data() },
            }))
            .find((x) => x.body.PnrId == this.PnrId)
        )
      )
      .subscribe((data) => {
        this.reservation = data;
      });
  }
  // async getReservationByPnrId() {
  //   this.firebaseSS.getReservationByPnrId(this.PnrId).then((x) => {
  //     if (x) {
  //       this.reservation = x;
  //     }
  //   });
  // }
  timeStampToDate(timestamp) {
    let date = new Date(timestamp.seconds * 1000);
    moment.locale('tr');
    return moment(date).format('LL');
  }
}
