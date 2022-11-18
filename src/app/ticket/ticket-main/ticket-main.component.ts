import { Component, OnInit } from '@angular/core';
import { Settings } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase/firebaseServices.service';

@Component({
  selector: 'ticket-main',
  templateUrl: './ticket-main.component.html',
  styleUrls: ['./ticket-main.component.css'],
})
export class TicketMainComponent implements OnInit {
  firebaseSS: any;

  constructor(public firebaseService: FirebaseService) {}

  ngOnInit(): void {}
  // Settings$ = new BehaviorSubject<Settings>(null);

  // async getAllSettings() {
  //   this.firebaseSS.progressBool();
  //   (await this.firebaseSS.getAllSettings())
  //     .snapshotChanges()
  //     .pipe(
  //       map((changes) =>
  //         changes.map((x) => ({
  //           primaryKey: x.payload.doc.id,
  //           body: { ...x.payload.doc.data() },
  //         }))
  //       )
  //     )
  //     .subscribe((data) => {
  //       //  let body = document.body;
  //       //let bodyStyle = getComputedStyle(body);
  //       this.Settings$.next(data[0]);
  //       this.firebaseSS.Settings$.next(data[0]);

  //     });
  // }
}
