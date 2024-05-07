import {Component, OnInit} from '@angular/core';
import {Internship} from "../../core/models/internship.model";
import {ActivatedRoute} from "@angular/router";
import {InternshipsService} from "../../core/services/internships/internships.service";
import {AuthenticationService} from "../../core/services/auth.service";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {User} from "../../core/models/auth.models";
import {LinkedInService} from "../../core/services/internships/linked-in.service";

@Component({
  selector: 'app-internships-detail',
  templateUrl: './internships-detail.component.html',
  styleUrls: ['./internships-detail.component.scss']
})
export class InternshipsDetailComponent implements OnInit {
  internship: Internship | undefined;
  rating: number = 0; // Variable to store the rating
  user: any; // Assuming you have an AuthService to get user info
  offerId: string | null = null; // Variable to store the offer ID

  breadCrumbItems: Array<{}>;
  internshipId: string = '';
  message: string = '';
  shareUrl: string; // Define shareUrl variable


isCompany: boolean = false;
  isStudent: boolean = false;


  readonly: boolean = false;
  currentRate: number = 0;
  stepRate: number = 0;
  readRate: number = 0;
  hoverSelect: number = 0;
  customColor: number = 0;
  clearRate: number = 0;
  stepHeart: number = 0;
  x: number = 0;
  y: number = 0;

  intership: Internship | null = null; // Initialize internship as null

  intershipId: string = '';
  internshipUrl: string = ''; // Initialize the property with an empty string


  constructor(
    private route: ActivatedRoute,
    private internshipsService: InternshipsService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private router: Router,

  ) {}


 async ngOnInit(): Promise<void> {
  this.user = await this.authService.currentUser();
  if (this.user) {
    if (this.user.role.includes('student')) {
      this.isStudent = true;
    } else if (this.user.role.includes('company')) {
      this.isCompany = true;
    }
  }

  console.log("isStudent:", this.isStudent);
  console.log("isCompany:", this.isCompany);



  // Continuer avec le reste du code...
  this.breadCrumbItems = [{label: 'Jobs'}, {label: 'Job Details', active: true}];

  this.route.params.subscribe(params => {
    this.internshipId = params['id'];
    this.internshipUrl = `http://localhost:4200/internship-details/${this.internshipId}`;
    this.getInternshipDetails(); // Call method to fetch internship details
  });

  this.route.queryParams.subscribe(params => {
    this.message = params['message'];
  });

  this.getOfferIdFromUrl();
}


  consultMySchedule() {
    this.router.navigateByUrl('/calendar');
  }


  getInternshipDetails(): void {
    this.internshipsService.getInternshipById(+this.internshipId).subscribe(
      (internship: Internship) => {
        this.internship = internship; // Assign fetched internship data to variable
        // Set Open Graph meta tags dynamically based on internship details
        this.setOpenGraphMetaTags();
      },
      (error) => {
        console.error('Error fetching internship details:', error);
      }
    );
  }
consultMySchedule() {
  this.router.navigateByUrl('/calendar');
}

  setOpenGraphMetaTags(): void {
    if (this.internship) {
      const title = this.internship.intershipTitle;
      const description = this.internship.intershipDescription;
      const imageUrl = this.internship.intershipResponsibilities;

      // Remove existing Open Graph meta tags
      const head = document.getElementsByTagName('head')[0];
      const existingTags = head.querySelectorAll('meta[property^="og:"]');
      existingTags.forEach(tag => head.removeChild(tag));

      // Create and append new Open Graph meta tags
      const metaTitle = document.createElement('meta');
      metaTitle.setAttribute('property', 'og:title');
      metaTitle.content = title;
      head.appendChild(metaTitle);

      const metaDescription = document.createElement('meta');
      metaDescription.setAttribute('property', 'og:description');
      metaDescription.content = description;
      head.appendChild(metaDescription);

      const metaImageUrl = document.createElement('meta');
      metaImageUrl.setAttribute('property', 'og:image');
      metaImageUrl.content = imageUrl;
      head.appendChild(metaImageUrl);
    }
  }

  openGoogleMaps(): void {
    const location = encodeURIComponent(this.internship.intershipLocation);
    window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
  }


  rateInternship(): void {
    // Make sure the user is authenticated before allowing to rate
    if (!this.user) {
      console.error('User not authenticated');
      return;
    }
    // Assuming this.internshipId and this.rating are accessible within the component
    // @ts-ignore
    this.internshipsService.rateInternship(this.internshipId, this.rating, this.user.id).subscribe(
      (response) => {
        console.log('Rating submitted successfully:', response);
        // Reload the internship details after rating
        this.getInternshipDetails();
      },
      (error) => {
        console.error('Error submitting rating:', error);
      }
    );
  }

  // TypeScript (TS)
  isStartDatePassed(): boolean {
    if (!this.internship || !this.internship.intershipStartDate) {
      return false; // Assume not passed if data is unavailable
    }
    const today = new Date();
    const startDate = new Date(this.internship.intershipStartDate);
    return startDate < today;
  }



  updateRating(): void {
    // Make sure the user is authenticated before allowing to rate
    if (!this.user) {
      console.error('User not authenticated');
      return;
    }

    // Call the rateInternship method when the rating changes
    this.internshipsService.rateInternship(this.internshipId.toString(), this.rating, this.user.id.toString()).subscribe(
      (response) => {
        console.log('Rating updated successfully:', response);
        // Reload the internship details after updating the rating
        this.getInternshipDetails();
      },
      (error) => {
        console.error('Error updating rating:', error);
      }
    );
  }

  getOfferIdFromUrl(): void {
    this.route.paramMap.subscribe(params => {
      this.offerId = params.get('id');
    });
  }



  applyForInternship() {
    // Assurez-vous que l'utilisateur est connecté
    if (!this.user) {
      console.error('Utilisateur non authentifié');
      return;
    }

    // Assurez-vous que les détails du stage sont disponibles
    if (!this.internship || !this.internship.intershipId) {
      console.error('Détails du stage non disponibles');
      return;
    }

    // Afficher les IDs dans la console
    console.log('userid:', this.user.id);
    console.log('offreid:', this.offerId);

    // Envoyer la requête HTTP avec les ID de l'utilisateur et de l'offre
    this.http.post('http://localhost:8081/api/application/create', {
      userid: this.user.id,
      offreid: this.offerId
    }).subscribe(
      response => {
        console.log('Demande de stage créée avec succès :', response);

        // Une fois que la demande de stage est créée avec succès, générer le PDF
        this.generatePDF();
      },
      error => {
        console.error('Erreur lors de la création de la demande de stage :', error);
      }
    );
}


generatePDF() {
    if (this.user) {
        this.http.get('http://localhost:8081/pdf/generate', {
            params: {
                lastName: this.user.lastName,
                firstName: this.user.firstName
            },
            responseType: 'blob'
        }).subscribe(
            (response: Blob) => {
                const file = new Blob([response], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL); // Ouvrir le PDF dans une nouvelle fenêtre
            },
            error => {
                console.error('Erreur lors de la génération du PDF :', error);
            }
        );
    } else {
        console.error('Utilisateur non authentifié');
    }
}








viewCandidates(): void {
  if (!this.offerId) {
    console.error('Offer ID not available');
    return;
  }
  console.log('Offer ID:', this.offerId);

    this.router.navigateByUrl('/jobs/myapplication');

}



navigateToMyApplication(): void {
  if (!this.offerId) {
    console.error('Offer ID is null or undefined');
    return;
  }

  console.log('Navigating to myapplication with offer ID:', this.offerId);

  this.router.navigate(['/jobs/myapplication',this.offerId]);
  console.log("11111111111111111111111",this.offerId);
}





}
