import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColPickerComponent } from './col-picker.component';

describe('ColPickerComponent', () => {
  let component: ColPickerComponent;
  let fixture: ComponentFixture<ColPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
