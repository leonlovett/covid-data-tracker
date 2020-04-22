import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from "@angular/fire";
import { HttpClientModule } from "@angular/common/http";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { AngularFireAnalyticsModule } from "@angular/fire/analytics";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { CurrentDataComponent } from './components/current-data/current-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeagoModule } from "ngx-timeago";
import { CreditsComponent } from './components/credits/credits.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StatesComponent } from './components/states/states.component';
import { CountriesComponent } from './components/countries/countries.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CountiesComponent } from './components/counties/counties.component';
import { StateDisplayComponent } from './components/state-display/state-display.component';
import { CountySearchComponent } from './components/county-search/county-search.component';
import { CountyDisplayComponent } from './components/county-display/county-display.component';

const matModules = [
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatExpansionModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatDialogModule,
  MatMenuModule,
  MatBadgeModule,
  MatTooltipModule,
  MatInputModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [
    AppComponent,
    CurrentDataComponent,
    CreditsComponent,
    StatesComponent,
    CountriesComponent,
    NavigationComponent,
    CountiesComponent,
    StateDisplayComponent,
    CountySearchComponent,
    CountyDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ...matModules,
    TimeagoModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
