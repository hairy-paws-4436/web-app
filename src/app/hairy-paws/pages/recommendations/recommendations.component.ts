import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { MatchingService } from '../../services/matching/matching.service';
import {
  CompatibilityAnalysisInterface,
  PetRecommendationInterface
} from '../../interfaces/matching/matching-preferences-interface';
import {Ripple} from 'primeng/ripple';
import {FormsModule} from '@angular/forms';
import {StyleClass} from 'primeng/styleclass';

@Component({
  selector: 'app-recommendations-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    BadgeModule,
    ToastModule,
    ProgressSpinnerModule,
    SkeletonModule,
    TagModule,
    RatingModule,
    CarouselModule,
    DialogModule,
    DividerModule,
    Ripple,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.css',
})
export class RecommendationsPageComponent implements OnInit {
  private matchingService = inject(MatchingService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  isLoading = false;
  hasPreferences = false;
  recommendations: PetRecommendationInterface[] = [];
  showCompatibilityDialog = false;
  compatibilityAnalysis: CompatibilityAnalysisInterface | null = null;

  ngOnInit(): void {
    this.checkPreferencesAndLoadRecommendations();
  }

  checkPreferencesAndLoadRecommendations(): void {
    this.isLoading = true;

    this.matchingService.getPreferencesStatus().subscribe({
      next: (status) => {

        this.hasPreferences = status.hasCompletedPreferences;

        if (this.hasPreferences) {
          this.loadRecommendations();
        } else {
          this.isLoading = false;

          if (status.needsOnboarding) {
            this.messageService.add({
              severity: 'info',
              summary: 'Welcome!',
              detail: 'Complete your preferences to get personalized pet recommendations'
            });
          }
        }
      },
      error: (error) => {
        this.hasPreferences = false;
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to check preferences status'
        });
      }
    });
  }

  loadRecommendations(): void {
    this.isLoading = true;

    this.matchingService.getPersonalizedRecommendations().subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations;
        this.isLoading = false;

        if (recommendations.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No Matches',
            detail: 'No pets match your current preferences. Try adjusting your criteria.'
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Loading Failed',
          detail: error || 'Failed to load recommendations'
        });
      }
    });
  }




  getRecommendationLevelClass(level: string): string {
    return level;
  }

  getRecommendationLevelLabel(level: string): string {
    switch (level) {
      case 'high': return 'Perfect Match';
      case 'medium': return 'Good Match';
      case 'low': return 'Consider';
      default: return level;
    }
  }



  getSuccessProbabilitySeverity(probability: number): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (probability >= 80) return 'success';
    if (probability >= 60) return 'warn';
    return 'danger';
  }

  getStarRating(recommendation: PetRecommendationInterface): number {
    // Tu API devuelve score de 0-1, convertir a 1-5 estrellas
    return Math.round(recommendation.score * 5);
  }

// Actualizar getMatchScoreClass para usar compatibility.overall
  getMatchScoreClass(overall: number): string {
    if (overall >= 80) return 'high-score';
    if (overall >= 60) return 'medium-score';
    return 'low-score';
  }

// Método helper para obtener el nivel de recomendación basado en el score
  getRecommendationLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }

// Actualizar showCompatibilityAnalysis para usar los datos reales
  showCompatibilityAnalysis(recommendation: PetRecommendationInterface): void {
    // Crear análisis mock basado en los datos reales del API
    const mockAnalysis: CompatibilityAnalysisInterface = {
      overall_score: recommendation.compatibility.overall,
      lifestyle_compatibility: recommendation.compatibility.lifestyle,
      experience_match: recommendation.compatibility.experience,
      space_suitability: recommendation.compatibility.practical,
      care_requirements: recommendation.compatibility.personality,
      detailed_analysis: {
        strengths: recommendation.matchReasons,
        concerns: recommendation.concerns,
        recommendations: [
          'Consider visiting the pet before making a decision',
          'Ensure you have time for proper training and care',
          'Consult with the shelter about the pet\'s specific needs'
        ]
      },
      prediction: {
        success_probability: Math.round(recommendation.score * 100),
        adaptation_timeline: recommendation.score > 0.7 ? '2-4 weeks' : '4-8 weeks',
        support_needs: recommendation.concerns.length > 0 ? ['Training support', 'Veterinary guidance'] : ['Basic care guidance']
      }
    };

    this.compatibilityAnalysis = mockAnalysis;
    this.showCompatibilityDialog = true;
  }

}
