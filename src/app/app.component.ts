import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';

import { map, startWith } from 'rxjs/operators';

import { DataService } from './services/data.service';
import { CreditsComponent } from './components/credits/credits.component';
import { CountySearchComponent } from './components/county-search/county-search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showAddCountry: boolean = false;
  uniqueStates: Set<any> = new Set();
  statesArr: Array<any> = [];
  stateCountyData: Array<any> = [];
  windowWidth: number = window.innerWidth;
  options: Array<any> = ['Mobile', 'Baldwin'];
  countyForm = new FormControl();

  get currentRoute() {
    return location.href;
  }

  get isMobile() {
    return this.windowWidth < 900;
  }

  constructor(
    public dataService: DataService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public db: AngularFirestore
  ) {}

  filter(value: string): Array<string> {
    const filterValue = value.toLowerCase();
    return this.dataService.countiesData.filter((county) =>
      county.combinedKey.toLowerCase().includes(filterValue)
    );
  }

  showCredits() {
    this.dialog.open(CreditsComponent, { minWidth: '350px' });
  }

  getIsAdded(country) {
    return (
      this.dataService.userPreferences.countries.findIndex(
        (x) => x.country === country.name.toLowerCase()
      ) !== -1
    );
  }

  addNewItem(type, event) {
    if (type === 'country') {
      this.dataService.selectedCountry.next(event);
      this.dataService.userPreferences.countries.push({ country: event.iso2 });
      localStorage.setItem(
        'countries',
        JSON.stringify(this.dataService.userPreferences.countries)
      );
    }
    if (type === 'state') {
      this.dataService.selectedState.next(event);
      this.dataService.userPreferences.states.push({ state: event });
      localStorage.setItem(
        'states',
        JSON.stringify(this.dataService.userPreferences.states)
      );
    }
    if (type === 'county') {
      this.dataService.selectedCounty.next(event);
      this.dataService.userPreferences.counties.push({ county: event.combinedKey });
      localStorage.setItem(
        'counties',
        JSON.stringify(this.dataService.userPreferences.counties)
      );
    }
  }

  openDialog() {
    this.dialog
      .open(CountySearchComponent, { width: '100%' })
      .afterClosed()
      .subscribe((x) => {
        this.addNewItem('county', x);
      });
  }

  ngOnInit() {
    this.dataService.filteredCounties = this.countyForm.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value))
    );
    window.addEventListener('resize', (doc) => {
      this.windowWidth = window.innerWidth;
    });
  }
}
