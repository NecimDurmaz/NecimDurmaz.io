import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { EventsGeneral } from '../model/events.model';
import { FirebaseService } from '../services/firebase/firebaseServices.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(private firebaseSS: FirebaseService) {
    this.getAllEventsGenerals();
  }

  EventsGenerals$ = new BehaviorSubject<EventsGeneral[]>([]);
  async getAllEventsGenerals() {
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
        this.EventsGenerals$.next(data);
      });
  }
}
