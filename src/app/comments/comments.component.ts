import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { Comments } from '../model/comments.model';

import { EventsGeneral } from '../model/events.model';
import { FirebaseService } from '../services/firebase/firebaseServices.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  isDestroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    public firebaseSS: FirebaseService
  ) {}
  ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  ngOnInit() {
    this.eventsGeneralId = this.route.snapshot.paramMap.get('id');
    this.getCommentsByEventsGeneralId();
    this.getEventsGeneralById();
  }

  // AfterViewInit() {
  //   this.getCommentsByEventsGeneralId();
  //   this.getEventsGeneralById();
  // }
  eventsGeneralId: any | undefined;
  SelectedComments: Comments[] | undefined;

  async getCommentsByEventsGeneralId() {
    (await this.firebaseSS.getAllComments())
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
        this.SelectedComments = data.filter(
          (x) => x.body.eventId == this.eventsGeneralId
        );
        console.log(this.SelectedComments);
      });
  }

  eventsGeneral: any = {};
  async getEventsGeneralById() {
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
        this.eventsGeneral = data.filter(
          (x) => x.primaryKey == this.eventsGeneralId
        );
      });
  }
}
