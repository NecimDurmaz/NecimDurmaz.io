import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-webpage',
  templateUrl: './webpage.component.html',
  styleUrls: ['./webpage.component.css'],
})
export class WebpageComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    let type = this.route.snapshot.paramMap.get('ad');

    let btnAydinlatma: any = document.querySelector('.aydinlatma');
    let btnGizlilik: any = document.querySelector('.gizlilik');
    if (type == 'gizlilik-sozlesmesi') {
      btnGizlilik.click();
    } else if (type == 'aydınlanma-metni') {
      btnAydinlatma.click();
    }
  }
}
