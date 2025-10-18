import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Userdetails } from './models/login';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('StockLyteClient');


  token!: string;
  sessionUserDetails = new Userdetails();

  ngOnInit(): void {

    console.log("app component")
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if (token !== null && token !== undefined && userDetails !== null && userDetails !== undefined) {
      this.token = token;
      Object.assign(this.sessionUserDetails, JSON.parse(userDetails));
      console.log("userdetails", this.sessionUserDetails)
    }

  }
}
