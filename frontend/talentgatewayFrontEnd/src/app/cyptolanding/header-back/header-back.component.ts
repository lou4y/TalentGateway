import { Component } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {interval} from "rxjs";
import {map} from "rxjs/operators";
import {FileService} from "../../core/services/file.service";
import {AdditionalUserDataService} from "../../core/services/additional-user-data.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../core/services/auth.service";
import {User} from "../../core/models/auth.models";
import {AdditionalUserData} from "../../core/models/additional-user-data.model";

@Component({
  selector: 'app-header-back',
  templateUrl: './header-back.component.html',
  styleUrls: ['./header-back.component.scss']
})
export class HeaderBackComponent {

  user: User;
  Image: string;
  private userData: AdditionalUserData;

  // set the currenr year
  year: number = new Date().getFullYear();
  currentSection:any = 'home';

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 24,
    nav: false,
    dots: false,
    responsive: {
      672: {
        items: 3
      },
      912: {
        items: 4
      },
    }
  }

  timelineCarousel: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: true,
    navText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"],
    dots: false,
    responsive: {
      672: {
        items: 3
      },

      576: {
        items: 2
      },

      936: {
        items: 4
      },
    }
  }

  private _trialEndsAt;

  private _diff: number;
  _days: number;
  _hours: number;
  _minutes: number;
  _seconds: number;

  constructor(private fileService: FileService,
              private userDataService: AdditionalUserDataService,
              private router: Router, private authService: AuthenticationService) {

  }

  async ngOnInit() {
    this._trialEndsAt = "2023-12-31";

    interval(3000).pipe(
      map((x) => {
        this._diff = Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
      })).subscribe((x) => {
      this._days = this.getDays(this._diff);
      this._hours = this.getHours(this._diff);
      this._minutes = this.getMinutes(this._diff);
      this._seconds = this.getSeconds(this._diff);
    });
    this.user = await this.authService.currentUser();
    this.userData = await this.userDataService.getAdditionalUserData(this.user.id).toPromise()
    this.Image=await this.fileService.getImageFromFirestore(this.userData.profilePicture);
  }

  getDays(t) {
    return Math.floor(t / (1000 * 60 * 60 * 24));
  }

  getHours(t) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  getMinutes(t) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  getSeconds(t) {
    return Math.floor((t / 1000) % 60);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  /**
   * Window scroll method
   */
  windowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
      navbar.classList.add('nav-sticky')
    } else {
      navbar.classList.remove('nav-sticky')
    }
  }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    document.getElementById('topnav-menu-content').classList.toggle('show');
  }

  /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  logout() {
    this.authService.logout();
  }

  Login() {
    this.authService.login();
  }
}
