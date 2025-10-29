import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LayoutService } from '../../services/layout.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NavBarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  searchInput = '';
  clickedIndex = -1;
  
  menuItems = [
    {
      menuName: 'Dashboard',
      icon: 'pi pi-home',
      url: '/dashboard',
      isTree: false
    },
    {
      menuName: 'Reports',
      icon: 'pi pi-chart-line',
      url: '/reports',
      isTree: false
    },
    {
      menuName: 'Analytics',
      icon: 'pi pi-chart-bar',
      isTree: true,
      childrens: [
        { menuName: 'Performance', url: '/analytics/performance' },
        { menuName: 'Statistics', url: '/analytics/statistics' }
      ]
    },
    {
      menuName: 'Users',
      icon: 'pi pi-users',
      isTree: true,
      childrens: [
        { menuName: 'User Management', url: '/users/management' },
        { menuName: 'Roles', url: '/users/roles' }
      ]
    },
    {
      menuName: 'Settings',
      icon: 'pi pi-cog',
      url: '/settings',
      isTree: false
    }
  ];

  constructor(public layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  get squeeze(): boolean {
    return this.layoutService.squeeze;
  }

  onParentClick(index: number) {
    if (!this.squeeze) {
      this.clickedIndex = this.clickedIndex === index ? -1 : index;
    }
  }

  toggleSqueeze() {
    this.layoutService.toggleSqueeze();
    this.clickedIndex = -1;
  }
}