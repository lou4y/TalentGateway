import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { UserVerif } from '../models/UserVerificationData.model';

@Injectable({
  providedIn: 'root'
})
export class UserVerificationGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.authService.authenticateUser()
      .then((userVerif: UserVerif) => {
        console.log('User verification data:', userVerif);
        if (userVerif.roleVerified && userVerif.dataVerified && !userVerif.banned) {
          // User is authenticated, data is verified, and not banned
          return true;
        } else if (!userVerif.roleVerified) {
          // User is not authenticated or role is not verified, redirect to unauthorized role page
          if (state.url !== '/confirmation') {

            this.router.navigate(['/confirmation']);
          }
          return false;
        } else if (!userVerif.dataVerified) {
          // User data is not verified, redirect to unverified data page
          if (state.url !== '/confirm-profile-details') {
            this.router.navigate(['/confirm-profile-details']);
          }
          return false;
        } else {
          // User is banned, redirect to banned page
          if (state.url !== '/banned') {
            this.router.navigate(['/banned']);
          }
          return false;
        }
      })
      .catch((error) => {
        console.error('Error authenticating user:', error);
        // Handle error
        if (state.url !== '/error') {
          this.router.navigate(['/error']);
        }
        return false;
      });
  }
}
