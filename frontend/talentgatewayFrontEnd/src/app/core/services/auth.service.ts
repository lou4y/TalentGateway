import {Injectable} from '@angular/core';
import {User} from '../models/auth.models';
import {KeycloakService} from "keycloak-angular";
import {ProfileVerificationService} from "./profile-verification.service";
import {UserVerif} from "../models/UserVerificationData.model";
import {UsersService} from "./users.service";

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
  constructor(
    public usersService: UsersService,
    public keycloakService: KeycloakService,
    private userProfileVerificationService: ProfileVerificationService
  ) { }



  /**
   * Returns the current user
   */
  public async currentUser(): Promise<User> {
    const profile = await this.keycloakService.loadUserProfile();

    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      createddate: profile.createdTimestamp,
      token: this.keycloakService.getKeycloakInstance().token,
      role: this.keycloakService.getUserRoles()
    };
  }

  async login() {
    await this.keycloakService.login({ redirectUri: window.location.origin });
  }

  logout() {
    this.keycloakService.logout(window.location.origin);
  }

  async authenticateUser(): Promise<UserVerif> {
    try {
      // Load user profile
      const profile = await this.keycloakService.loadUserProfile();
      const userId = profile.id;

      // Check user verification data
      let userVerificationData: UserVerif = await this.userProfileVerificationService.getUserVerification(userId).toPromise();

      if (!userVerificationData) {
        // If user verification data does not exist, create it
        const userVerificationDataToCreate: UserVerif = {
          id: 0,
          userId: userId,
          roleVerified: false,
          dataVerified: false,
          banned: false // Assuming initially not banned
        };

        // Create user verification data
        userVerificationData = await this.userProfileVerificationService.createUserVerification(userVerificationDataToCreate).toPromise();
      }

      return userVerificationData;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null; // Return null in case of error
    }
  }


}
