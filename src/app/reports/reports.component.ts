import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableGridComponent } from '../shared/components/table-grid/table-grid.component';
import { ColumnArray } from '../shared/models/columns';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, TableGridComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  
  // Sample data similar to the original implementation
  reportsData = signal<any[]>([]);
  loading = signal<boolean>(false);
  
  // Column configuration similar to the original
  columns: ColumnArray = [
    { field: 'Agency', value: 'networkgroupname', type: 'string', filterType: 'multiselect' },
    { field: 'Network', value: 'networkname', type: 'string', filterType: 'multiselect' },
    { field: 'Account', value: 'accountid', type: 'string', filterType: 'multiselect' },
    { field: 'Campaign Name', value: 'campaignname', type: 'string', filterType: 'multiselect' },
    { field: 'Count', value: 'total', type: 'number', filterType: 'input', totalType: 'sum' },
    { field: 'Date', value: 'regdate', type: 'date', filterType: 'date' },
    { field: 'Status', value: 'status', type: 'boolean', filterType: 'triState' },
    { frozen: true, frozenType: 'info' }
  ];

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.loading.set(true);
    
    // Simulate API call with sample data
    setTimeout(() => {
      this.reportsData.set([
        {
          networkgroupname: 'Digital Marketing Agency',
          networkname: 'Google Ads',
          accountid: 'ACC-001',
          campaignname: 'Summer Sale Campaign',
          total: 150,
          regdate: new Date('2024-01-15'),
          status: true
        },
        {
          networkgroupname: 'Creative Solutions',
          networkname: 'Facebook Ads',
          accountid: 'ACC-002',
          campaignname: 'Brand Awareness Drive',
          total: 89,
          regdate: new Date('2024-01-14'),
          status: false
        },
        {
          networkgroupname: 'Performance Marketing',
          networkname: 'Google Ads',
          accountid: 'ACC-003',
          campaignname: 'Holiday Special',
          total: 234,
          regdate: new Date('2024-01-13'),
          status: true
        },
        {
          networkgroupname: 'Digital Marketing Agency',
          networkname: 'Microsoft Ads',
          accountid: 'ACC-004',
          campaignname: 'Product Launch',
          total: 67,
          regdate: new Date('2024-01-12'),
          status: true
        },
        {
          networkgroupname: 'Creative Solutions',
          networkname: 'Facebook Ads',
          accountid: 'ACC-005',
          campaignname: 'Retargeting Campaign',
          total: 123,
          regdate: new Date('2024-01-11'),
          status: false
        },
        {
          networkgroupname: 'Performance Marketing',
          networkname: 'Google Ads',
          accountid: 'ACC-006',
          campaignname: 'Lead Generation',
          total: 198,
          regdate: new Date('2024-01-10'),
          status: true
        },
        {
          networkgroupname: 'Digital Marketing Agency',
          networkname: 'LinkedIn Ads',
          accountid: 'ACC-007',
          campaignname: 'B2B Outreach',
          total: 45,
          regdate: new Date('2024-01-09'),
          status: true
        },
        {
          networkgroupname: 'Creative Solutions',
          networkname: 'Twitter Ads',
          accountid: 'ACC-008',
          campaignname: 'Engagement Boost',
          total: 78,
          regdate: new Date('2024-01-08'),
          status: false
        }
      ]);
      this.loading.set(false);
    }, 1000);
  }

  onButtonClick(rowData: any) {
    console.log('Button clicked for:', rowData);
    // Handle button click - could open edit dialog, show details, etc.
  }

  onFilteredValues(filteredData: any[]) {
    console.log('Filtered data:', filteredData);
  }

  refreshData() {
    this.loadSampleData();
  }

  onPageChange(event: number) {
    console.log('Page changed:', event);
  }

  getActiveCampaigns(): number {
    return this.reportsData().filter(item => item.status === true).length;
  }

  getTotalActions(): number {
    return this.reportsData().reduce((sum, item) => sum + (item.total || 0), 0);
  }

  getAveragePerformance(): string {
    const total = this.getTotalActions();
    const count = this.reportsData().length;
    const average = count > 0 ? total / count : 0;
    return average.toFixed(1);
  }
}