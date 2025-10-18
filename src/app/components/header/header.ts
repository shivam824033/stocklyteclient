import { Component, OnDestroy, OnInit } from '@angular/core';
import { Userdetails } from '../../models/login';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../service/global-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header  implements OnInit, OnDestroy{

  token!: string;
  sessionUserDetails = new Userdetails();
  private routerSubscription!: Subscription;

  constructor(private navService: GlobalService, private router: Router) { }

  ngOnInit(): void {
    this.readToken();

    // Subscribe to router events to update token on every navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.readToken();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  readToken() {
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if (token && userDetails) {
      this.token = token;
      Object.assign(this.sessionUserDetails, JSON.parse(userDetails));
    } else {
      // this.token = '';
      // this.sessionUserDetails = new Userdetails();
    }
  }

  logoutSession() {
    this.navService.logoutSession();
    localStorage.removeItem('token');
    localStorage.removeItem('UserDetails');
    window.location.href = "/index.html";
   // this.router.navigate(['']);

  }

}
