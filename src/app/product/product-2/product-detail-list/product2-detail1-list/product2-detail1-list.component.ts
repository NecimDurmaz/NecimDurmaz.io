import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'product2-detail1-list',
  templateUrl: './product2-detail1-list.component.html',
  styleUrls: ['./product2-detail1-list.component.css'],
})
export class Product2Detail1ListComponent implements OnInit {
  constructor() {}
  isDetail = false;
  ngOnInit(): void {}
  showDetail() {
    this.isDetail = !this.isDetail;
  }
}
