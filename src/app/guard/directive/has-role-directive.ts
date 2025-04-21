import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, OnDestroy, effect } from '@angular/core';
import {RoleEnum} from '../../auth/enums/role-enum';
import {AuthService} from '../../auth/services/auth.service';


@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appHasRole(roles: RoleEnum | RoleEnum[]) {
    this.roles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  private roles: RoleEnum[] = [];

  constructor() {
    effect(() => {
      const status = this.authService.authStatus();
      this.updateView();
    });
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const hasRole = this.checkRole();

    this.viewContainer.clear();
    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkRole(): boolean {
    return this.authService.hasAnyRole(this.roles);
  }
}
