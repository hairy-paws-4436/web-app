import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {Ripple} from "primeng/ripple";
import {DividerModule} from 'primeng/divider';
import {PaginatorModule} from 'primeng/paginator';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {RoleEnum} from '../../enums/role-enum';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {RegisterRequestInterface} from '../../interfaces/request/register-request-interface';
import {CarouselRegisterComponent} from '../../components/carousel-register/carousel-register.component';
import {AutoComplete} from 'primeng/autocomplete';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ButtonDirective,
    CheckboxModule,
    InputTextModule,
    DropdownModule,
    Ripple,
    DividerModule,
    PaginatorModule,
    RouterLink,
    FormsModule,
    CarouselRegisterComponent,
    AutoComplete,
    Toast,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  protected registerRequest: RegisterRequestInterface = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    identityDocument: '',
    role: '',
    address: ''
  };

  roles: { label: string; value: RoleEnum }[] = [];
  selectedRole: RoleEnum | null = null;

  filteredRoles: { label: string; value: RoleEnum }[] = [];

  filterRoles(event: any) {
    const query = event.query.toLowerCase();
    this.filteredRoles = this.roles.filter(role =>
      role.label.toLowerCase().includes(query)
    );
  }


  ngOnInit() {
    this.roles = [
      {label: 'Adopter', value: RoleEnum.ADOPTER},
      {label: 'Owner', value: RoleEnum.OWNER},
      {label: 'ONG', value: RoleEnum.ONG},
    ];

  }

  register() {
    if (!this.registerRequest.email || !this.registerRequest.password ||
      !this.registerRequest.firstName || !this.registerRequest.lastName ||
      !this.registerRequest.phoneNumber || !this.selectedRole) {
      this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: 'Please complete all fields'
        });
      return;
    }

    this.registerRequest.role = this.selectedRole as RoleEnum;

    this.authService.register(this.registerRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'Your account has been created successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred. Please try again.';
        this.messageService.add({ severity: 'error', summary: 'Registration Error', detail: errorMessage });
      }
    });
  }

}
