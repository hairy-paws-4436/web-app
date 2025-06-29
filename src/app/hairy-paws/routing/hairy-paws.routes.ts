import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotificationsPageComponent } from '../pages/notifications-page/notifications-page.component';
import { HairyPawsPageComponent } from '../pages/hairy-paws-page/hairy-paws-page.component';
import { PetsPageComponent } from '../pages/pets-page/pets-page.component';
import { PetsFilterTableComponent } from '../components/pet/pets-filter-table/pets-filter-table.component';
import { MyPetsPageComponent } from '../pages/my-pets-page/my-pets-page.component';
import { OngRegistrationPageComponent } from '../pages/ong-registration-page/ong-registration-page.component';
import { OngsListPageComponent } from '../pages/ongs-list-page/ongs-list-page.component';
import { DonationFormComponent } from '../components/donation/donation-form/donation-form.component';
import { EventFormComponent } from '../components/event/event-form/event-form.component';
import { ProfilePageComponent } from '../pages/profile-page/profile-page.component';
import { RegisterPetComponent } from '../pages/register-pet/register-pet.component';
import { OngDetailsComponent } from '../components/ong/ong-details/ong-details.component';
import { EventsListPagesComponent } from '../pages/events-list-pages/events-list-pages.component';
import { EventDetailsComponent } from '../components/event/event-details/event-details.component';
import { EventEditComponent } from '../components/event/event-edit/event-edit.component';
import { MeOngProfilePageComponent } from '../pages/me-ong-profile-page/me-ong-profile-page.component';
import { EditOngComponent } from '../components/ong/ong-edit/ong-edit.component';
import { UnauthorizedAccessComponent } from '../pages/unauthorized-access/unauthorized-access.component';
import { TwofaSetupComponent } from '../../auth/components/enable2fa/enable2fa.component';
import { RoleEnum } from '../../auth/enums/role-enum';
import { RoleGuard } from '../../guard/hairy-paws-guards/role-guard';
import { EventOwnerGuard } from '../../guard/hairy-paws-guards/event-owner-guard';
import { OngOwnerGuard } from '../../guard/hairy-paws-guards/ong-owner-guard';
import {MatchingPreferencesPageComponent} from '../pages/matching-preferences/matching-preferences.component';
import {RecommendationsPageComponent} from '../pages/recommendations/recommendations.component';
import {FollowupPageComponent} from '../pages/followup/followup.component';
import {
  NotificationPreferencesPageComponent
} from '../pages/notification-preferences/notification-preferences.component';
import {GamificationDashboardComponent} from '../pages/gamification-dashboard/gamification-dashboard.component';
import {MyFollowupsPageComponent} from '../pages/my-followups-page/my-followups-page.component';
import {FollowupDashboardPageComponent} from '../pages/followup-dashboard-page/followup-dashboard-page.component';
import {LeaderboardPageComponent} from '../pages/leaderboard-page/leaderboard-page.component';
import {BadgesPageComponent} from '../pages/badges-page/badges-page.component';


const routes: Routes = [
  {
    path: '',
    component: HairyPawsPageComponent,
    children: [
      { path: '', redirectTo: 'smart-matching/recommendations', pathMatch: 'full' },

      // Core pet functionality
      { path: 'pets', component: PetsPageComponent },
      { path: 'filter-pets', component: PetsFilterTableComponent },
      { path: 'notifications', component: NotificationsPageComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'profile/2fa-setup', component: TwofaSetupComponent },
      { path: 'unauthorized', component: UnauthorizedAccessComponent },

      // Smart Matching System
      {
        path: 'smart-matching',
        children: [
          {
            path: 'preferences',
            component: MatchingPreferencesPageComponent,
            canActivate: [RoleGuard],
            data: { roles: [RoleEnum.ADOPTER, RoleEnum.OWNER] }
          },
          {
            path: 'recommendations',
            component: RecommendationsPageComponent,
            canActivate: [RoleGuard],
            data: { roles: [RoleEnum.ADOPTER, RoleEnum.OWNER] }
          },
          { path: '', redirectTo: 'recommendations', pathMatch: 'full' }
        ]
      },

      // Post-Adoption Follow-up System
      {
        path: 'post-adoption',
        children: [
          {
            path: 'my-followups',
            component: MyFollowupsPageComponent,
            canActivate: [RoleGuard],
            data: { roles: [RoleEnum.ADOPTER, RoleEnum.OWNER] }
          },
          {
            path: 'followup/:id',
            component: FollowupPageComponent,
            canActivate: [RoleGuard],
            data: { roles: [RoleEnum.ADOPTER, RoleEnum.OWNER] }
          },
          {
            path: 'dashboard',
            component: FollowupDashboardPageComponent,
            canActivate: [RoleGuard],
            data: { roles: [RoleEnum.ONG, RoleEnum.ADMIN] }
          },
          { path: '', redirectTo: 'my-followups', pathMatch: 'full' }
        ]
      },

      // Notification Preferences
      {
        path: 'notification-preferences',
        component: NotificationPreferencesPageComponent
      },

      // Gamification System for ONGs
      {
        path: 'gamification',
        children: [
          {
            path: 'dashboard',
            component: GamificationDashboardComponent,
            canActivate: [RoleGuard],
            data: { roles: [RoleEnum.ONG] }
          },
          {
            path: 'leaderboard',
            component: LeaderboardPageComponent
          },
          {
            path: 'badges',
            component: BadgesPageComponent,
            canActivate: [RoleGuard],
            data: { roles: [RoleEnum.ONG] }
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },

      // Pet Management (existing)
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

      // ONG Management (existing)
      { path: 'ongs', component: OngsListPageComponent },
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
        canActivate: [RoleGuard, OngOwnerGuard],
        data: { roles: [RoleEnum.ONG] }
      },
      {
        path: 'ong-details/:id',
        component: OngDetailsComponent
      },

      // Event Management (existing)
      { path: 'events', component: EventsListPagesComponent },
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
      },

      // Donations (existing)
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
