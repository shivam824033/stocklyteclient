import { Component } from '@angular/core';
import { Owner } from '../owner/owner';
import { Public } from '../public/public';
import { Seller } from '../seller/seller';
import { GlobalService } from '../../service/global-service';
import { Userdetails } from '../../models/login';
import { RouterLink } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-home',
  imports: [RouterLink,Owner, Seller, Public ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private homeService: GlobalService) { }

  token!: string;
  sessionUserDetails = new Userdetails();

  loginFlag!: boolean;
  signupFlag!: boolean;
  ownerFlag!: boolean;
  sellerFlag!: boolean;
  publicFlag!: boolean;

  ngOnInit(): void {

    this.loginFlag = false;
    this.signupFlag = false;
    this.ownerFlag = false;
    this.sellerFlag = false;
    this.publicFlag = false;

    console.log("home")
    const token = localStorage.getItem('token');
     console.log("token : ", token)
    const userDetails = localStorage.getItem('UserDetails');
    if (token !== null && token !== undefined && userDetails !== null && userDetails !== undefined) {
      this.token = token;
      Object.assign(this.sessionUserDetails, JSON.parse(userDetails));
      console.log("userdetails", this.sessionUserDetails)
      if (this.sessionUserDetails.roles === 'OWNER') {
        this.ownerFlag = true;
      } else if (this.sessionUserDetails.roles === 'SELLER') {
        this.sellerFlag = true;
      } else {
        this.publicFlag = true;
      }
    }

  }

  // doLogin(myLoginContent : any) {
  //   this.loginFlag = true;
  //   this.signupFlag = false;
  //   this.modalService.open(myLoginContent);
  // }

  // signUp(mySignUpContent : any) {
  //   this.signupFlag = true;
  //   this.loginFlag = false;
  //   this.modalService.open(mySignUpContent);
  // }

  logoutSession() {

    this.homeService.logoutSession();
    window.location.reload();
  }

}
