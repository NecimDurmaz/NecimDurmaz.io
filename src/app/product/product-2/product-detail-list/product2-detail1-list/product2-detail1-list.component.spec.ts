import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Product2Detail1ListComponent } from './product2-detail1-list.component';

describe('Product2Detail1ListComponent', () => {
  let component: Product2Detail1ListComponent;
  let fixture: ComponentFixture<Product2Detail1ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Product2Detail1ListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Product2Detail1ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
