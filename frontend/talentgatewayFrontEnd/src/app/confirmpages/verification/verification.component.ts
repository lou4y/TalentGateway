import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../core/services/auth.service";
import {User} from "../../core/models/auth.models";
import {RolesService} from "../../core/services/roles.service";
import {ProfileVerificationService} from "../../core/services/profile-verification.service";
import {UserVerif} from "../../core/models/UserVerificationData.model";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  profileservice:ProfileVerificationService
  authservice: AuthenticationService;
  roleservice:RolesService
  selectValue: string[];
  Affiliation: any;
  user:User;
  constructor(private authService: AuthenticationService,private roleService:RolesService,ps :ProfileVerificationService, private router: Router) {
    this.profileservice = ps
    this.authservice = authService;
    this.roleservice = roleService;
  }

  async ngOnInit(): Promise<void> {
    this.selectValue = ["student", "teacher", "company"];
    this.user = await this.authservice.currentUser()
  }


  async save() {
    try {
      // Get user verification data
      let userVerificationData: UserVerif = await this.profileservice.getUserVerification(this.user.id.toString()).toPromise();

      // Assign role and update user verification data
      this.roleservice.assignRole(this.user.id.toString(), this.Affiliation).pipe(
        tap(() => {
          // Update user verification data
          userVerificationData.roleVerified = true;
          this.profileservice.updateUserVerification(userVerificationData).subscribe(() => {
            this.router.navigate(['/']);
          });
        })
      ).subscribe();
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle error
    }
  }
}
