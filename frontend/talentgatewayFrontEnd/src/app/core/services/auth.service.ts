import { Injectable } from '@angular/core';
import { User } from '../models/auth.models';
import {KeycloakService} from "keycloak-angular";

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    constructor( public KeycloakService: KeycloakService) {
    }

    /**
     * Returns the current user
     */
    public currentUser(): Promise<User> {
      return this.KeycloakService.loadUserProfile().then((profile) => {
        const user: User = {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          token: this.KeycloakService.getKeycloakInstance().token,

        };
        return user;
      });
    }
    async login() {
      await this.KeycloakService.login(
        {
          redirectUri: window.location.origin
        }
      );

    }

    /**
     * Performs the register
     */
    register(email: string, password: string) {

    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {

    }

    /**
     * Logout the user
     */
    logout() {
      this.KeycloakService.logout(window.location.origin);

    }
}

