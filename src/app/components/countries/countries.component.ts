import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getCountries().subscribe((x) => {
      this.dataService.countryList = x['countries'];
    });
    if (localStorage.getItem('countries')) {
      this.dataService.userPreferences.countries = JSON.parse(
        localStorage.getItem('countries')
      );
    }
    localStorage.setItem(
      'countries',
      JSON.stringify(this.dataService.userPreferences.countries)
    );
  }
}
