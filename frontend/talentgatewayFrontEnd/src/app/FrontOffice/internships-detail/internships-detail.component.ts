import {Component, OnInit} from '@angular/core';
import {Internship} from "../../core/models/internship.model";
import {ActivatedRoute} from "@angular/router";
import {InternshipsService} from "../../core/services/internships/internships.service";
import {AuthenticationService} from "../../core/services/auth.service";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private internshipsService: InternshipsService,
    private authService: AuthenticationService,
    private http: HttpClient,
  private router: Router
    
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.currentUser();
    this.getInternshipDetails();
    this.getOfferIdFromUrl(); 
    
  }

  getInternshipDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.internshipsService.getInternshipById(id).subscribe(internship => {
      this.internship = internship;
    });
  }

  onRatingChange(rating: number): void {
    // Assuming this.user.id is accessible within the component
    if (!this.user) {
      console.error('User not authenticated');
      return;
    }
    if (!this.internship || !this.internship.intershipId) {
      console.error('Internship details not available');
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