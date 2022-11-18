import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase/firebaseServices.service';

@Component({
  selector: 'product-main',
  templateUrl: './product-main.component.html',
  styleUrls: ['./product-main.component.css'],
})
export class ProductMainComponent implements OnInit {
  constructor(public firebaseSS: FirebaseService) {}

  ngOnInit(): void {}
}
