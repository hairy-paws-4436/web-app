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
import {EventDetailsComponent} from '../components/event-details/event-details.component';
import {EventEditComponent} from '../components/event-edit/event-edit.component';
import {MeOngProfilePageComponent} from '../pages/me-ong-profile-page/me-ong-profile-page.component';
import {EditOngComponent} from '../components/ong-edit/ong-edit.component';
import {RoleEnum} from '../../auth/enums/role-enum';
import {RoleGuard} from '../../guard/hairy-paws-guards/role-guard';
import {EventOwnerGuard} from '../../guard/hairy-paws-guards/event-owner-guard';
import {OngOwnerGuard} from '../../guard/hairy-paws-guards/ong-owner-guard';
import {UnauthorizedAccessComponent} from '../pages/unauthorized-access/unauthorized-access.component';


const routes: Routes = [
  {
    path: '',
    component: HairyPawsPageComponent,
    children: [
      // Public routes (available to all authenticated users)
      {path: '', redirectTo: 'pets', pathMatch: 'full'},
      {path: 'pets', component: PetsPageComponent},
      {path: 'filter-pets', component: PetsFilterTableComponent},
      {path: 'notifications', component: NotificationsPageComponent},
      {path: 'ongs', component: OngsListPageComponent},
      {path: 'events', component: EventsListPagesComponent},
      {path: 'profile', component: ProfilePageComponent},
      {path: 'unauthorized', component: UnauthorizedAccessComponent},

      // Pet routes (available to specific roles)
      {
        path: 'my-pets',
        component: MyPetsPageComponent,
        canActivate: [RoleGuard],
        data: { roles: [RoleEnum.ONG, RoleEnum.OWNER] }
      },
      {
        path: 'pet-register',
        component: RegisterPetComponent,
        canActivate: [RoleGuard],
        data: { roles: [RoleEnum.OWNER, RoleEnum.ONG] }
      },

      // ONG routes (ONG role required)
      {
        path: 'my-ong',
        component: MeOngProfilePageComponent,
        canActivate: [RoleGuard],
        data: { roles: [RoleEnum.ONG] }
      },
      {
        path: 'ong-register',
        component: OngRegistrationPageComponent,
        canActivate: [RoleGuard],
        data: { roles: [RoleEnum.ONG] }
      },
      {
        path: 'ong-edit/:id',
        component: EditOngComponent,
        canActivate: [RoleGuard],
        data: { roles: [RoleEnum.ONG] }
      },
      {
        path: 'ong-details/:id',
        component: OngDetailsComponent
        // Public, no guard needed
      },

      // Event routes (ONG role required + ownership verification)
      {
        path: 'event-register',
        component: EventFormComponent,
        canActivate: [RoleGuard, EventOwnerGuard],
        data: { roles: [RoleEnum.ONG] }
      },
      {
        path: 'event-edit/:id',
        component: EventEditComponent,
        canActivate: [RoleGuard, EventOwnerGuard],
        data: { roles: [RoleEnum.ONG] }
      },
      {
        path: 'event-details/:id',
        component: EventDetailsComponent
        // Public, no guard needed
      },

      // Donation routes
      {
        path: 'donations-register',
        component: DonationFormComponent,
        canActivate: [RoleGuard],
          data: { roles: [RoleEnum.ADOPTER, RoleEnum.OWNER, RoleEnum.ONG] }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HairyPawsRoutingModule {
}
