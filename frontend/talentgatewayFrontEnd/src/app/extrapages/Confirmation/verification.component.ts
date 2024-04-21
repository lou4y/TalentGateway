import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Confirmation',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  selectValue: string[];
  constructor() { }
  // set the currenr year
  year: number = new Date().getFullYear();
  ngOnInit(): void {
    document.body.classList.remove('auth-body-bg')
    this.selectValue = ["Student", "Teacher","company"];


  }

}
