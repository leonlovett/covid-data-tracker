import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  get currentUrl() {
    return location.href;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
