import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountiesListComponent } from './counties-list.component';

describe('CountiesListComponent', () => {
  let component: CountiesListComponent;
  let fixture: ComponentFixture<CountiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
