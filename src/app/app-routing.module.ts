import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatesComponent } from './components/states/states.component';
import { CountriesComponent } from './components/countries/countries.component';
import { CountiesComponent } from './components/counties/counties.component';

const routes: Routes = [
  { path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'states', component: StatesComponent },
  { path: 'countries', component: CountriesComponent },
  { path: 'counties', component: CountiesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
