import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountySearchComponent } from './county-search.component';

describe('CountySearchComponent', () => {
  let component: CountySearchComponent;
  let fixture: ComponentFixture<CountySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
