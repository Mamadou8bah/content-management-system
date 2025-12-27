import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const userRole = localStorage.getItem('cms_role');
    if (!userRole) {
      return this.router.createUrlTree(['/login']);
    }
    const allowedRoles: string[] = route.data['allowedRoles'] || [];
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return true;
    }
    // Otherwise, redirect to articles page
    return this.router.createUrlTree(['/articles']);
  }
}
