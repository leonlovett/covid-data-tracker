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
  newLocalData: string = null;
  currentSort: string;

  get currentRoute() {
    return location.href;
  }

  get isMobile() {
    return this.windowWidth < 700;
  }

  get sortDirection() {
    return this.currentSort.includes('ascending')
      ? 'arrow_drop_up'
      : 'arrow_drop_down';
  }

  get currentSortName() {
    const temp = this.currentSort.split(' ')[0];
    if (temp === 'confirmed') {
      return 'Confirmed';
    }
    if (temp === 'deaths') {
      return 'Deaths';
    }
    if (temp === 'recovered') {
      return 'Recovered';
    }
    if (temp === 'rdratio') {
      return 'Recovered/Death Ratio';
    }
    if (temp === 'dcpercent') {
      return 'Death/Confirmed %';
    }
    if (temp === 'alpha') {
      return 'Alphabetical';
    }
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
    if (this.newLocalData) {
      let name;
      if (type === 'country') {
        name = event.iso2;
      }
      if (type === 'state') {
        name = event;
      }
      if (type === 'county') {
        name = event.combinedKey;
      }
      this.dataService.dashboardItems.push({
        type: type,
        name: name,
      });
      localStorage.setItem(
        'dashboardItems',
        JSON.stringify(this.dataService.dashboardItems)
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

  convertLocalData() {
    const localCountries = JSON.parse(localStorage.getItem('countries'));
    const localStates = JSON.parse(localStorage.getItem('states'));
    const localCounties = JSON.parse(localStorage.getItem('counties'));
    const localItems = [];
    if (localCountries) {
      localCountries.forEach((c) => {
        if (c.country === 'world') {
          localItems.push({
            type: 'world',
            name: 'world',
            sortIdx: 0,
          });
        } else {
          localItems.push({
            type: 'country',
            name: c.country,
            sortIdx: 1,
          });
        }
      });
      localStorage.removeItem('countries');
    }
    if (localStates) {
      localStates.forEach((c) =>
        localItems.push({
          type: 'state',
          name: c.state,
          sortIdx: 2,
        })
      );
      localStorage.removeItem('states');
    }
    if (localCounties) {
      localCounties.forEach((c) =>
        localItems.push({
          type: 'county',
          name: c.county,
          sortIdx: 3,
        })
      );
      localStorage.removeItem('counties');
    }
    localStorage.setItem('dashboardItems', JSON.stringify(localItems));
  }

  addWorldData() {
    this.dataService.getWorldData().subscribe((x) => {
      this.dataService.dashboardItems.unshift({
        type: 'world',
        name: 'world',
        sortIdx: 0,
      });
      localStorage.setItem(
        'dashboardItems',
        JSON.stringify(this.dataService.dashboardItems)
      );
    });
  }

  sortData(criteria: string) {
    this.currentSort = criteria;
    const property = criteria.split(' ')[0];
    const direction = criteria.split(' ')[1];
    if (direction === 'ascending') {
      this.dataService.dashboardItems.sort((a, b) => {
        if (a[property] < b[property]) {
          return -1;
        }
        if (a[property] > b[property]) {
          return 1;
        }
        return 0;
      });
    }
    if (direction === 'descending') {
      this.dataService.dashboardItems.sort((a, b) => {
        if (a[property] > b[property]) {
          return -1;
        }
        if (a[property] < b[property]) {
          return 1;
        }
        return 0;
      });
    }
  }

  sortAlpha() {
    this.dataService.dashboardItems.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    this.currentSort = 'alpha ascending';
  }

  sortByDefault() {
    this.dataService.dashboardItems.sort((a, b) => {
      if (a.sortIdx < b.sortIdx) {
        return -1;
      }
      if (a.sortIdx > b.sortIdx) {
        return 1;
      }
      return 0;
    });
    this.currentSort = null;
  }

  ngOnInit() {
    this.dataService.newItemWatcher.subscribe((x) => {
      if (x === true && !this.currentSort) {
        return this.sortByDefault();
      }
      if (x === true && this.currentSort.includes('alpha')) {
        return this.sortAlpha();
      }
      if (x === true && this.currentSort) {
        this.sortData(this.currentSort);
      }
    });
    this.newLocalData = localStorage.getItem('dashboardItems');
    if (!this.newLocalData) {
      this.convertLocalData();
    }
    this.dataService.filteredCounties = this.countyForm.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value))
    );
    window.addEventListener('resize', (doc) => {
      this.windowWidth = window.innerWidth;
    });
  }
}
