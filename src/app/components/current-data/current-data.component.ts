import { Component, Input, AfterViewInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-current-data',
  templateUrl: './current-data.component.html',
  styleUrls: ['./current-data.component.scss'],
})
export class CurrentDataComponent implements AfterViewInit {
  @Input() searchCriteria = {
    country: null,
    state: null,
  };
  currentData: any;
  get currentCountry(): string {
    if (this.searchCriteria.state) {
      return 'state';
    }
    if (this.searchCriteria.country === 'world') {
      return 'World';
    }
    if (
      this.searchCriteria.country !== null &&
      this.dataService.countryList.length > 0
    ) {
      return this.dataService.countryList.find(
        (c) =>
          c.iso2?.toLowerCase() === this.searchCriteria.country.toLowerCase()
      )?.name;
    } else {
      return '';
    }
  }
  constructor(private dataService: DataService) {}

  removeCountry() {
    const idx = this.dataService.userPreferences.countries.findIndex(
      (item) => item.country === this.searchCriteria.country
    );
    this.dataService.userPreferences.countries.splice(idx, 1);
    localStorage.setItem(
      'countries',
      JSON.stringify(this.dataService.userPreferences.countries)
    );
  }

  ngAfterViewInit() {
    if (
      this.searchCriteria.country !== 'world' &&
      this.searchCriteria.country !== undefined
    ) {
      this.dataService
        .getDataViaCountry(this.searchCriteria.country)
        .subscribe((x) => {
          this.currentData = x;
        });
    } else if (this.searchCriteria.country) {
      this.dataService.getWorldData().subscribe((x) => {
        this.currentData = x;
      });
    }
  }
}
