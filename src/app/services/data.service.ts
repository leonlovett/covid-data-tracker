import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  urlUs = 'https://covid19.mathdro.id/api/countries/us';
  urlWorld = 'https://covid19.mathdro.id/api';
  byCountryUrl = 'https://covid19.mathdro.id/api/countries/';
  countyLevelUrl = 'https://covid19.mathdro.id/api/countries/us/confirmed';

  countryList: Array<any> = [];
  selectedCountry: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedState: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedCounty: BehaviorSubject<any> = new BehaviorSubject(null);
  userPreferences: any = {
    countries: [{ country: 'world' }, { country: 'us' }],
    states: [],
    counties: []
  };

  dashboardItems: Array<any> = [];

  stateData: Array<any> = [];
  statesArr: Array<any> = [];
  countiesData: Array<any> = [];
  filteredCounties: Observable<string[]>;
  newItemWatcher: BehaviorSubject<any> = new BehaviorSubject(null);
  
  get isWorldActive() {
    return this.dashboardItems.find(item => item.name === 'world');
  }

  constructor(private http: HttpClient) {}

  getCountyLevel() {
    return this.http.get(`${this.countyLevelUrl}?random=${Math.random()}`);
  }

  getDataViaCountry(countryCode: string) {
    return this.http.get(
      `${this.byCountryUrl}${countryCode}?random=${Math.random()}`
    );
  }

  getCountries() {
    return this.http.get(`${this.byCountryUrl}?random=${Math.random()}`);
  }
  getUsData() {
    return this.http.get(`${this.urlUs}?random=${Math.random()}`);
  }

  getWorldData() {
    return this.http.get(`${this.urlWorld}?random=${Math.random()}`);
  }

  getStateInfo(state: string) {
    if (this.stateData.length > 0) {
      return this.parseStateData(state);
    } else {
      this.getCountyLevel().subscribe((data) => {
        return this.parseStateData(state);
      });
    }
  }
  async parseStateData(state) {
    const temp = this.stateData.filter((x) => {
      return x.provinceState === state;
    });

    const tempObj = {
      confirmed: {
        value: 0,
      },
      recovered: {
        value: 0,
      },
      deaths: {
        value: 0,
      },
      lastUpdate: Date.parse('1/1/1970'),
    };
    temp.forEach((item) => {
      tempObj.confirmed.value = tempObj.confirmed.value + item.confirmed;
      tempObj.recovered.value = tempObj.recovered.value + item.recovered;
      tempObj.deaths.value = tempObj.deaths.value + item.deaths;
      tempObj.lastUpdate =
        tempObj.lastUpdate > item.lastUpdate
          ? tempObj.lastUpdate
          : item.lastUpdate;
    });
    console.log(tempObj);
    return tempObj;
  }
}
