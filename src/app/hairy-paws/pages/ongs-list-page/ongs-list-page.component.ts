import {Component, inject, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {OngService} from '../../services/ong/ong.service';
import {OngInterface} from '../../interfaces/ong/ong-interface';
import {Toast} from 'primeng/toast';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {ProgressSpinner} from 'primeng/progressspinner';
import {NgForOf, NgIf} from '@angular/common';
import {OngCardComponent} from '../../components/ong/ong-card/ong-card.component';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-ongs-list-page',
  imports: [
    Toast,
    ButtonDirective,
    Ripple,
    ProgressSpinner,
    NgIf,
    OngCardComponent,
    NgForOf,
    InputText
  ],
  templateUrl: './ongs-list-page.component.html',
  styleUrl: './ongs-list-page.component.css'
})
export class OngsListPageComponent implements OnInit {
  private ongService = inject(OngService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ongs: OngInterface[] = [];
  filteredOngs: OngInterface[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadOngs();
  }

  loadOngs(): void {
    this.isLoading = true;

    this.ongService.getAllOngs().subscribe({
      next: (ongs) => {
        this.ongs = ongs;
        this.filteredOngs = [...ongs];
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load NGOs'
        });
        this.isLoading = false;
      }
    });
  }

  filterOngs(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();

    if (!this.searchTerm) {
      this.filteredOngs = [...this.ongs];
      return;
    }

    this.filteredOngs = this.ongs.filter(ong =>
      ong.name.toLowerCase().includes(this.searchTerm) ||
      ong.description.toLowerCase().includes(this.searchTerm)
    );
  }

  navigateToRegister(): void {
    this.router.navigate(['/hairy-paws/ong-register']);
  }

  viewOngDetails(ongId: string): void {
    this.router.navigate(['/hairy-paws/ong-details', ongId]);
  }

  donate(ongId: string): void {
    this.router.navigate(['hairy-paws/donations-register'], { queryParams: { ongId } });
  }
}

