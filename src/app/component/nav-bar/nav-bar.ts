import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service.ts';
import { User } from '../../interface/user';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  
  @Input() user: User;

  constructor(private router: Router, private userService: UserService) {}

  logOut(): void {
   this.userService.logOut();
   this.router.navigate(['/login']);
  }

}
