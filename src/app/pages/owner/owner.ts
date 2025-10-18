import { Component } from '@angular/core';
import { SecretKeyResponse } from '../../models/login';
import { GlobalService } from '../../service/global-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner',
  imports: [FormsModule, CommonModule],
  templateUrl: './owner.html',
  styleUrl: './owner.css'
})
export class Owner {
 secretKeyRes = new SecretKeyResponse();
  users: any[] = [];
  selectedRole: string = '';
  selectedUser: any = null;
  constructor(private globalService: GlobalService, private route: Router) { }

  ngOnInit(): void {
        this.fetchUsers();

  }

  generateKey(){

    this.globalService.generateKey().subscribe(data =>{

      Object.assign(this.secretKeyRes, data);


    })


  }

   fetchUsers() {
    this.globalService.getAllUsers(this.selectedRole).subscribe((data: any) => {
      this.users = data.response || [];
    });
  }

  viewUser(user: any) {
    this.selectedUser = user;
    // Show Bootstrap modal
    const modal = new (window as any).bootstrap.Modal(document.getElementById('userDetailModal'));
    modal.show();
  }

  deactivateUser(user: any) {
    if (confirm(`Are you sure you want to deactivate ${user.fullName}'s account?`)) {
      this.globalService.accountAction(user.userId, "deactivate").subscribe(() => {
        user.accountStatus = 'BLOCKED';
      });
    }
  }

    activateUser(user: any) {
    if (confirm(`Are you sure you want to activate ${user.fullName}'s account?`)) {
      this.globalService.accountAction(user.userId, "activate").subscribe(() => {
        user.accountStatus = 'ACTIVE';
      });
    }
  }

}
