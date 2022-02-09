import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInputTestComponent } from './number-input-test.component';

describe('NumberInputTestComponent', () => {
  let component: NumberInputTestComponent;
  let fixture: ComponentFixture<NumberInputTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberInputTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberInputTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
