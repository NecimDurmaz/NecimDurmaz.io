import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ticket } from 'src/app/model/ticket.model';

@Component({
  selector: 'product2-detail2-list',
  templateUrl: './product2-detail2-list.component.html',
  styleUrls: ['./product2-detail2-list.component.css'],
})
export class Product2Detail2ListComponent implements OnInit {
  constructor() {}
  @Input() Ticket: Ticket;
  @Output() SelectedTicket = new EventEmitter<Ticket>();
  ngOnInit(): void {}

  eventDetayiLengthValidation() {
    if (this.Ticket.body.eventDetayi.length > 190)
      return this.Ticket.body.eventDetayi.slice(0, 185) + '(...)';
    else return this.Ticket.body.eventDetayi;
  }

  DetailTicket() {
    this.SelectedTicket.emit(this.Ticket);
  }
}
