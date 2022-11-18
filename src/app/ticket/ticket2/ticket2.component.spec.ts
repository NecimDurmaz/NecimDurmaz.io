import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ticket2Component } from './ticket2.component';

describe('Ticket2Component', () => {
  let component: Ticket2Component;
  let fixture: ComponentFixture<Ticket2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ticket2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ticket2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
