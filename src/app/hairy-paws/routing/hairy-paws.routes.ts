import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {NotificationsPageComponent} from '../pages/notifications-page/notifications-page.component';
import {HairyPawsPageComponent} from '../pages/hairy-paws-page/hairy-paws-page.component';
import {PetsPageComponent} from '../pages/pets-page/pets-page.component';
import {PetsFilterTableComponent} from '../components/pets-filter-table/pets-filter-table.component';
import {MyPetsPageComponent} from '../pages/my-pets-page/my-pets-page.component';
import {OngRegistrationPageComponent} from '../pages/ong-registration-page/ong-registration-page.component';
import {OngsListPageComponent} from '../pages/ongs-list-page/ongs-list-page.component';
import {DonationFormComponent} from '../components/donation-form/donation-form.component';
import {EventFormComponent} from '../components/event-form/event-form.component';
import {ProfilePageComponent} from '../pages/profile-page/profile-page.component';
import {RegisterPetComponent} from '../pages/register-pet/register-pet.component';
import {OngDetailsComponent} from '../components/ong-details/ong-details.component';
import {EventsListPagesComponent} from '../pages/events-list-pages/events-list-pages.component';


const routes: Routes = [
  {
    path: '',
    component: HairyPawsPageComponent,
    children: [
      {path: 'pets', component: PetsPageComponent},
      {path: 'my-pets', component: MyPetsPageComponent},
      {path: 'filter-pets', component: PetsFilterTableComponent},
      {path: 'pet-register', component: RegisterPetComponent},

      {path: 'notifications', component: NotificationsPageComponent},

      {path: 'ong-register', component: OngRegistrationPageComponent},
      {path: 'ongs', component: OngsListPageComponent},
      {path: 'ong-details/:id', component: OngDetailsComponent},

      {path: 'events', component: EventsListPagesComponent},
      {path: 'event-register', component: EventFormComponent},

      {path: 'donations-register', component: DonationFormComponent},

      {path: 'profile', component: ProfilePageComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HairyPawsRoutingModule {
}
