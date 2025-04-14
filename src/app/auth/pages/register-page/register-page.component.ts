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
import Swal from 'sweetalert2';
import {RegisterRequestInterface} from '../../interfaces/request/register-request-interface';
import {Carousel} from 'primeng/carousel';
import {CarouselRegisterComponent} from '../../components/carousel-register/carousel-register.component';
import {AutoComplete} from 'primeng/autocomplete';

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
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected registerRequest: RegisterRequestInterface = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
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
    ];

  }

  register() {
    if (!this.registerRequest.email || !this.registerRequest.password ||
      !this.registerRequest.firstName || !this.registerRequest.lastName ||
      !this.registerRequest.phoneNumber || !this.selectedRole) {
      Swal.fire('Error', 'Please complete all fields', 'warning');
      return;
    }

    this.registerRequest.role = this.selectedRole as RoleEnum;


    this.authService.register(this.registerRequest).subscribe({
      next: () => {
        Swal.fire('Registration successful', 'Your account has been created successfully', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        console.log('Error en registro:', error);
        const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred. Please try again.';
        Swal.fire('Registration Error', errorMessage, 'error');
      }

    });
  }
}
