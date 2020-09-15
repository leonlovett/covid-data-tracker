import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { DataService } from '../../services/data.service';
import { stateIcons } from '../../constants/constants';
import {
  countryPopulations,
  statePopulations,
} from '../../constants/populations';
import { DecimalPipe } from '@angular/common';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss'],
  providers: [DecimalPipe],
})
export class DashboardItemComponent implements OnInit {
  displayedColumns: string[] = ['metric', 'total', 'percapita'];
  dataSource = ELEMENT_DATA;

  @Input() currentItem;
  currentData: any;
  stateIcons: Array<any> = stateIcons;
  tableData: Array<any> = [];
  countryPopulations: Array<any> = countryPopulations;
  statePopulations: Array<any> = statePopulations;
  currentPopulation: number = 0;

  get ratioTooltipText(): string {
    return `In ${this.currentData.name}, there are ${this.decimalPipe.transform(
      this.currentPopulation / this.confirmed,
      '0.0-0'
    )} people without the virus for every person who has tested positive.`;
  }
  get confirmed(): number {
    if (
      (this.currentItem.type === 'country' ||
        this.currentItem.type === 'world') &&
      this.currentData
    ) {
      return this.currentData.data.confirmed.value;
    }
    if (
      (this.currentItem.type === 'state' ||
        this.currentItem.type === 'county') &&
      this.currentData
    ) {
      return this.currentData.confirmed;
    }
  }

  get deaths(): number {
    if (
      (this.currentItem.type === 'country' ||
        this.currentItem.type === 'world') &&
      this.currentData
    ) {
      return this.currentData.data.deaths.value;
    }
    if (
      (this.currentItem.type === 'state' ||
        this.currentItem.type === 'county') &&
      this.currentData
    ) {
      return this.currentData.deaths;
    }
  }

  get recovered(): number {
    if (
      (this.currentItem.type === 'country' ||
        this.currentItem.type === 'world') &&
      this.currentData
    ) {
      return this.currentData.data.recovered.value;
    }
    if (
      (this.currentItem.type === 'state' ||
        this.currentItem.type === 'county') &&
      this.currentData
    ) {
      return this.currentData.recovered;
    }
  }

  get countryFlag() {
    return `https://www.countryflags.io/${this.currentItem.name}/flat/32.png`;
  }

  get stateIcon() {
    if (this.stateIcons.includes(this.currentItem.name.toLowerCase())) {
      return `${
        location.origin
      }/assets/state-icons/${this.currentItem.name.toLowerCase()}.svg`;
    } else {
      return `${location.origin}/assets/state-icons/USA.svg`;
    }
  }

  get worldIcon() {
    return `${location.origin}/assets/globe.png`;
  }

  constructor(
    public db: AngularFirestore,
    public dataService: DataService,
    public router: Router,
    public decimalPipe: DecimalPipe
  ) {}

  removeLocation() {
    const idx = this.dataService.dashboardItems.findIndex(
      (item) => item.name === this.currentItem.name
    );
    this.dataService.dashboardItems.splice(idx, 1);
    localStorage.setItem(
      'dashboardItems',
      JSON.stringify(this.dataService.dashboardItems)
    );
  }

  goToCounty() {
    this.router.navigate(['counties', this.currentItem.name.toLowerCase()]);
  }

  transformForTable() {
    const confirmed = {
      metric: 'Confirmed',
      total: this.confirmed.toLocaleString(),
      percapita:
        (this.confirmed / this.currentPopulation)?.toFixed(7) === 'NaN'
          ? 'Coming Soon'
          : `${((this.confirmed / this.currentPopulation) * 100).toFixed(3)}%`,
    };
    this.tableData.push(confirmed);
    const deaths = {
      metric: 'Deaths',
      total: this.deaths.toLocaleString(),
      percapita:
        (this.deaths / this.currentPopulation)?.toFixed(7) === 'NaN'
          ? 'Coming Soon'
          : `${((this.deaths / this.currentPopulation) * 100).toFixed(3)}%`,
    };
    this.tableData.push(deaths);
  }

  getCurrentPopulation() {
    if (this.currentItem.type === 'world' && this.currentData) {
      this.currentPopulation = this.currentData.population;
    }
    if (this.currentItem.type === 'country' && this.currentData) {
      const a = this.countryPopulations.find((c) => {
        return c.country === this.currentData.name;
      });
      const regex = /,+/g;
      const b = a.value.replace(regex, '');
      this.currentPopulation = parseInt(b, 10);
    }
    if (this.currentItem.type === 'state' && this.currentData) {
      const a = this.statePopulations.find((state) => {
        return state.state === this.currentData.name;
      });
      const b = a.value;
      this.currentPopulation = parseInt(b, 10);
    }
  }

  ngOnInit(): void {
    if (this.currentItem.type === 'world') {
      this.db
        .collection('countries')
        .doc('world')
        .valueChanges()
        .subscribe((x) => {
          this.currentData = x;
          this.getCurrentPopulation();
          const idx = this.dataService.dashboardItems.findIndex(
            (a) => a.name === 'world'
          );
          const item = this.dataService.dashboardItems.find(
            (a) => a.name === 'world'
          );
          item['confirmed'] = this.currentData.data.confirmed.value;
          item['deaths'] = this.currentData.data.deaths.value;
          item['recovered'] = this.currentData.data.recovered.value;
          item['rdratio'] =
            this.currentData.data.recovered.value /
            this.currentData.data.deaths.value;
          item['dcpercent'] =
            this.currentData.data.deaths.value /
            this.currentData.data.confirmed.value;
          item['sortIdx'] = 0;
          item['population'] = this.currentData.population;
          this.dataService.dashboardItems.splice(idx, item);
          this.dataService.newItemWatcher.next(true);
          this.transformForTable();
        });
    }
    if (this.currentItem.type === 'country') {
      this.db
        .collection('countries', (ref) =>
          ref.where('iso2', '==', this.currentItem.name.toUpperCase())
        )
        .valueChanges()
        .subscribe((x) => {
          this.currentData = x[0];
          this.getCurrentPopulation();
          if (this.currentData) {
            this.currentData['type'] = 'country';
          }
          const idx = this.dataService.dashboardItems.findIndex(
            (a) => a.name === this.currentItem.name.toUpperCase()
          );
          const item = this.dataService.dashboardItems.find(
            (a) => a.name === this.currentItem.name.toUpperCase()
          );
          item['confirmed'] = this.currentData.data.confirmed.value;
          item['deaths'] = this.currentData.data.deaths.value;
          item['recovered'] = this.currentData.data.recovered.value;
          item['rdratio'] =
            this.currentData.data.recovered.value /
            this.currentData.data.deaths.value;
          item['dcpercent'] =
            this.currentData.data.deaths.value /
            this.currentData.data.confirmed.value;
          item['sortIdx'] = 1;
          this.dataService.dashboardItems.splice(idx, item);
          this.dataService.newItemWatcher.next(true);
          this.transformForTable();
        });
    }
    if (this.currentItem.type === 'state') {
      this.db
        .collection('states')
        .doc(this.currentItem.name)
        .valueChanges()
        .subscribe((x: any) => {
          const temp = x;
          temp['data'] = {};
          temp.data.lastUpdate = x['lastUpdate'];
          this.currentData = temp;
          this.getCurrentPopulation();
          const idx = this.dataService.dashboardItems.findIndex(
            (a) => a.name === this.currentItem.name
          );
          const item = this.dataService.dashboardItems.find(
            (a) => a.name === this.currentItem.name
          );
          item['confirmed'] = this.currentData.confirmed;
          item['deaths'] = this.currentData.deaths;
          item['recovered'] = this.currentData.recovered;
          item['rdratio'] =
            this.currentData.recovered / this.currentData.deaths;
          item['dcpercent'] =
            this.currentData.deaths / this.currentData.confirmed;
          item['sortIdx'] = 2;
          this.dataService.dashboardItems.splice(idx, item);
          this.dataService.newItemWatcher.next(true);
          this.transformForTable();
        });
    }
    if (this.currentItem.type === 'county') {
      this.db
        .collection('counties', (ref) =>
          ref.where('combinedKey', '==', `${this.currentItem.name}, US`)
        )
        .valueChanges()
        .subscribe((x: any) => {
          const temp = x[0];
          temp['data'] = {};
          temp.name = x[0].combinedKey.replace(', US', '');
          temp.data.lastUpdate = x[0]['lastUpdate'];
          this.currentData = temp;
          this.currentPopulation = this.currentData.population.value;
          const idx = this.dataService.dashboardItems.findIndex(
            (a) => a.name === `${this.currentItem.name}`
          );
          const item = this.dataService.dashboardItems.find(
            (a) => a.name === `${this.currentItem.name}`
          );
          item['confirmed'] = this.currentData.confirmed;
          item['deaths'] = this.currentData.deaths;
          item['recovered'] = this.currentData.recovered;
          item['rdratio'] =
            this.currentData.recovered / this.currentData.deaths;
          item['dcpercent'] =
            this.currentData.deaths / this.currentData.confirmed;
          item['sortIdx'] = 3;
          this.dataService.dashboardItems.splice(idx, item);
          this.dataService.newItemWatcher.next(true);
          this.transformForTable();
        });
    }
  }
}
