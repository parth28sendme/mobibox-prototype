import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  
  username = 'John Doe';
  roleName = 'Administrator';
  profile = false;

  constructor(public layoutService: LayoutService) { }

  get squeeze(): boolean {
    return this.layoutService.squeeze;
  }

  ngOnInit(): void {
  }

  toggleProfile() {
    this.profile = !this.profile;
  }
}