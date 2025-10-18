import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css'
})
export class Unauthorized  {

  errorMessage: string = 'You do not have permission to access this page.';
  sessionexpired: boolean = false;
  constructor(private route : ActivatedRoute) {
    this.sessionexpired = false;
    this.route.queryParams.subscribe(params => {
     let message = params['message'];
     if(message =='session expired'){
        this.sessionexpired = true;
        this.errorMessage = "Your session has expired. Please log in again.";
        localStorage.removeItem('token');
        localStorage.removeItem('UserDetails');
     }
      console.log('Unauthorized message:', this.errorMessage);
    });
  }
}
