import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountyDisplayComponent } from './county-display.component';

describe('CountyDisplayComponent', () => {
  let component: CountyDisplayComponent;
  let fixture: ComponentFixture<CountyDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountyDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
