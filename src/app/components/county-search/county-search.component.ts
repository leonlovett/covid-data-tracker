import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-county-search',
  templateUrl: './county-search.component.html',
  styleUrls: ['./county-search.component.scss'],
})
export class CountySearchComponent implements OnInit {
  counties: Array<any> = [];
  filteredCounties: Observable<Array<any>>;
  constructor(public db: AngularFirestore) {}
  searchForm = new FormControl();

  searchCounties(term: string) {
    const filterValue = term.toLowerCase();
    return this.counties.filter((value) => {
      return value.combinedKey.toLowerCase().includes(filterValue);
    });
  }

  ngOnInit(): void {
    this.db
      .collection('counties', (ref) => ref.orderBy('combinedKey'))
      .valueChanges()
      .subscribe((x: Array<any>) => {
        x.forEach((county) => {
          county.combinedKey = county.combinedKey.replace(', US', '');
          this.counties.push(county);
        });
        this.filteredCounties = this.searchForm.valueChanges.pipe(
          startWith(''),
          map((value) => this.searchCounties(value))
        );
      });
  }
}
