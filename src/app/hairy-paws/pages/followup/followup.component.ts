import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepsModule } from 'primeng/steps';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

import { PostAdoptionService } from '../../services/post-adoption/post-adoption.service';
import {FollowupInterface, FollowupQuestionnaireInterface} from '../../interfaces/post-adoption/followup-interface';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-followup-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    RadioButtonModule,
    CalendarModule,
    TextareaModule,
    ToastModule,
    ProgressSpinnerModule,
    StepsModule,
    RatingModule,
    TagModule,
    DividerModule,
    BadgeModule,
    Ripple,
    RouterLink
  ],
  providers: [MessageService],
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.css']
})
export class FollowupPageComponent implements OnInit {
  private postAdoptionService = inject(PostAdoptionService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  isSubmitting = false;
  activeIndex = 0;
  followup: FollowupInterface | null = null;
  followupId: string = '';

  steps = [
    { label: 'Adaptation' },
    { label: 'Health & Behavior' },
    { label: 'Feedback' }
  ];

  questionnaire: FollowupQuestionnaireInterface = {
    adaptationLevel: 'good',
    eatingWell: true,
    sleepingWell: true,
    usingBathroomProperly: true,
    showingAffection: true,
    behavioralIssues: [],
    healthConcerns: [],
    vetVisitScheduled: false,
    satisfactionScore: 8,
    wouldRecommend: true,
    additionalComments: '',
    needsSupport: false,
    supportType: []
  };

  // Options arrays
  adaptationLevels = this.postAdoptionService.getAdaptationLevels();
  behavioralIssueOptions = this.postAdoptionService.getBehavioralIssueOptions().map(issue => ({
    label: issue,
    value: issue
  }));
  healthConcernOptions = this.postAdoptionService.getHealthConcernOptions().map(concern => ({
    label: concern,
    value: concern
  }));
  supportTypeOptions = this.postAdoptionService.getSupportTypeOptions().map(type => ({
    label: type,
    value: type
  }));

  ngOnInit(): void {
    this.followupId = this.route.snapshot.params['id'];
    if (this.followupId) {
      this.loadFollowup();
    } else {
      this.router.navigate(['/hairy-paws/post-adoption/my-followups']);
    }
  }

  loadFollowup(): void {
    this.isLoading = true;

    this.postAdoptionService.getFollowupDetails(this.followupId).subscribe({
      next: (followup) => {
        this.followup = followup;
        this.isLoading = false;

        // If already completed, pre-fill form with existing data
        if (followup.status === 'completed' && followup.questionnaire) {
          this.questionnaire = { ...followup.questionnaire };
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error || 'Failed to load follow-up information'
        });
      }
    });
  }

  nextStep(): void {
    if (this.isStepValid()) {
      this.activeIndex++;
    }
  }

  previousStep(): void {
    this.activeIndex--;
  }

  isStepValid(): boolean {
    switch (this.activeIndex) {
      case 0:
        return this.questionnaire.adaptationLevel !== '';
      case 1:
        return true; // All fields in this step are optional
      case 2:
        return this.questionnaire.satisfactionScore > 0;
      default:
        return true;
    }
  }

  submitFollowup(): void {
    if (!this.isStepValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Information',
        detail: 'Please complete all required fields'
      });
      return;
    }

    this.isSubmitting = true;

    // Format date if provided
    if (this.questionnaire.vetVisitDate) {
      this.questionnaire.vetVisitDate = new Date(this.questionnaire.vetVisitDate).toISOString().split('T')[0];
    }

    this.postAdoptionService.completeFollowup(this.followupId, this.questionnaire).subscribe({
      next: (completedFollowup) => {
        this.followup = completedFollowup;
        this.isSubmitting = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Survey Completed',
          detail: 'Thank you for completing the follow-up survey!'
        });

        setTimeout(() => {
          this.router.navigate(['/hairy-paws/post-adoption/my-followups']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Submission Failed',
          detail: error || 'Failed to submit the follow-up survey'
        });
      }
    });
  }

  skipFollowup(): void {
    this.postAdoptionService.skipFollowup(this.followupId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Survey Skipped',
          detail: 'You can complete this survey later from your follow-ups page'
        });

        setTimeout(() => {
          this.router.navigate(['/hairy-paws/post-adoption/my-followups']);
        }, 1500);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error || 'Failed to skip follow-up'
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/hairy-paws/post-adoption/my-followups']);
  }

  getPetName(): string {
    // This would come from the adoption/pet data
    return 'your pet'; // Placeholder
  }

  getFollowupTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'initial': '48 Hour Check-in',
      'week_1': '1 Week Follow-up',
      'month_1': '1 Month Follow-up',
      'month_3': '3 Month Follow-up',
      'month_6': '6 Month Follow-up',
      'annual': 'Annual Check-up'
    };
    return typeMap[type] || type;
  }

  getStatusSeverity(status: string): "success" | "warn" | "danger" | "info" | undefined {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warn';
      case 'overdue': return 'danger';
      case 'skipped': return 'info';
      default: return undefined;
    }
  }


  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}
