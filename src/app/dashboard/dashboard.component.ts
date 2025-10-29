import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  cards = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: 'pi pi-users',
      color: 'primary'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      icon: 'pi pi-dollar',
      color: 'success'
    },
    {
      title: 'Orders',
      value: '567',
      icon: 'pi pi-shopping-cart',
      color: 'warning'
    },
    {
      title: 'Growth',
      value: '+12.5%',
      icon: 'pi pi-chart-line',
      color: 'info'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}