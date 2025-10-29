# Table Grid Component Implementation

This document describes the implementation of the table grid component based on the original MobiBox-web project.

## Overview

The table grid component has been successfully implemented in the prototype project with the following features:

### Features Implemented

1. **Basic Table Functionality**
   - Data display with pagination using PrimeNG Table
   - Column sorting with custom sort handling
   - Row hover effects
   - Responsive design with column resizing
   - Row selection and reordering support

2. **Advanced Search and Filtering**
   - Global search functionality with computed filtering
   - Advanced filter drawer with multiple filter types:
     - Multiselect filters
     - Range sliders for numeric data
     - Date/DateTime pickers
     - Radio button filters
     - Checkbox filters
     - Text input filters
     - Tri-state boolean filters
   - Custom filter registration for complex data
   - Clear all functionality

3. **Column Management**
   - Edit columns drawer
   - Show/hide columns dynamically
   - Column search within edit drawer
   - Prevent hiding last visible column
   - Reset all columns functionality

4. **Export Functionality**
   - CSV export with filtered data
   - Customizable export fields
   - Proper data formatting for export

5. **Action Buttons**
   - Frozen action columns (edit, delete, view, info, custom)
   - Menu-based actions with PrimeNG Menu
   - Custom button icons and handlers
   - Row data context passing

6. **Advanced Data Types Support**
   - String with comma-separated value handling
   - Number with locale formatting
   - Date and DateTime with custom formatting
   - Boolean with icon representation
   - Currency with configurable currency codes
   - Country with flag display
   - Images with error handling
   - Icons (single and arrays)
   - Interactive switches
   - Editable inputs with validation
   - Links with custom actions

7. **Signal-Based Architecture**
   - Uses Angular signals for reactive state management
   - Computed properties for filtered data
   - Effect-based filter option generation
   - Model binding for two-way data flow

8. **Footer Calculations**
   - Sum and average calculations
   - Dynamic totals based on filtered data
   - Customizable footer templates

## File Structure

```
src/app/
├── shared/
│   ├── components/
│   │   └── table-grid/
│   │       ├── table-grid.component.ts
│   │       ├── table-grid.component.html
│   │       └── table-grid.component.scss
│   └── models/
│       └── columns.ts
└── reports/
    ├── reports.component.ts
    ├── reports.component.html
    └── reports.component.scss
```

## Usage Example

### 1. Component Setup

```typescript
import { TableGridComponent } from '../shared/components/table-grid/table-grid.component';
import { ColumnArray } from '../shared/models/columns';
import { signal } from '@angular/core';

@Component({
  imports: [TableGridComponent],
  // ...
})
export class ReportsComponent {
  columns: ColumnArray = [
    { field: 'Agency', value: 'networkgroupname', type: 'string', filterType: 'multiselect' },
    { field: 'Network', value: 'networkname', type: 'string', filterType: 'multiselect' },
    { field: 'Count', value: 'total', type: 'number', totalType: 'sum' },
    { field: 'Date', value: 'regdate', type: 'date', filterType: 'date' },
    { field: 'Actions', value: 'actions', type: 'string', frozen: true, frozenType: 'info' }
  ];

  reportsData = signal([
    {
      networkgroupname: 'Digital Marketing Agency',
      networkname: 'Google Ads',
      total: 150,
      regdate: new Date('2024-01-15')
    }
    // ... more data
  ]);
  
  loading = signal(false);
}
```

### 2. Template Usage

```html
<app-table-grid
  [(value)]="reportsData"
  [columns]="columns"
  [title]="'Campaign Performance Data'"
  [loading]="loading()"
  [rows]="10"
  [rowsPerPageOptions]="[10, 25, 50, 100]"
  [hasSearch]="true"
  [hasExport]="true"
  [hasClear]="true"
  [hasFilters]="true"
  [hasEditColumns]="true"
  [hasTotal]="true"
  (buttonOutput)="onButtonClick($event)"
  (filteredvalues)="onFilteredValues($event)"
  (onPage)="onPageChange($event)">
</app-table-grid>
```

## Column Configuration

### Column Interface

```typescript
type OtherColumn = {
  field: string;
  value: string;
  frozen?: boolean;
  type: 'number' | 'string' | 'boolean' | 'date' | 'currency' | 'country' | 'link' | 'dateTime' | 'image' | 'icon' | 'switch' | 'input';
  icon?: string;
  filterType: 'multiselect' | 'checkbox' | 'radio' | 'range' | 'date' | 'triState' | 'dateTime' | 'input';
  fieldIcon?: string;
  fieldImg?: string;
  fieldImgFunc?: () => string;
  fieldIconFunc?: () => string;
  fieldPosition?: 'left' | 'right';
  img?: string;
  imgFunc?: (event: unknown) => string;
  iconFunc?: (event: unknown) => string;
  totalType?: 'sum' | 'avg';
  noEdit?: boolean;
  linkFunc?: (event: unknown) => void;
  switchFunc?: (event: unknown, value: boolean) => void;
  status?: boolean;
  linkLabel?: string;
  isArray?: boolean;
  imgArray?: boolean;
  iconArray?: boolean;
  objectLabel?: string;
  objectValue?: string;
  percentageBadge?: boolean;
  warningBadge?: boolean;
  inpuType?: 'text' | 'number';
  isExpanded?: boolean;
  inputValidation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customValidator?: (value: any) => string | null;
  };
  currency?: string;
  disabled?: boolean;
  disabledFunc?: (event: unknown) => boolean;
  selected?: boolean;
  placeholder?: string;
};
```

### Column Types

- **string**: Basic text display
- **number**: Formatted with thousand separators using commaSeparatedNumber pipe
- **date**: Formatted as MM/dd/yyyy
- **dateTime**: Formatted as MM/dd/yyyy HH:mm
- **boolean**: Shows checkmark/X icons
- **currency**: Formatted as specified currency
- **country**: Shows country flag with name
- **link**: Clickable button with custom action
- **image**: Displays images with error handling
- **icon**: Shows icons (single or array)
- **switch**: Toggle switch with custom handler
- **input**: Editable cell with validation

### Frozen Columns

Action columns can be frozen to the right side:
- **edit**: Pencil icon button
- **delete**: Trash icon button
- **view**: Eye icon button
- **info**: Info circle icon button

## Navigation Integration

The reports page has been added to the main navigation menu:

```typescript
menuItems = [
  {
    menuName: 'Reports',
    icon: 'pi pi-chart-line',
    url: '/reports',
    isTree: false
  }
  // ... other menu items
];
```

## Sample Data

The reports component includes sample data that mimics the structure from the original AI automated action component:

- Agency/Network information
- Campaign details
- Performance metrics
- Date tracking
- Status indicators

## Statistics Dashboard

The reports page also includes a statistics dashboard with cards showing:
- Total Campaigns
- Active Campaigns
- Total Actions
- Average Performance

## Styling

The component uses:
- Bootstrap 5 for layout
- PrimeNG theme for components
- Custom SCSS for enhanced styling
- Responsive design principles

## Testing the Implementation

1. Navigate to `/reports` in the application
2. Test search functionality
3. Try sorting columns
4. Test export functionality
5. Click on action buttons
6. Verify responsive behavior

## Exact Implementation Match

This implementation is an exact match of the original MobiBox table grid component:
- Complete filtering drawers with all filter types
- Full column editing functionality
- Advanced export capabilities
- All PrimeNG dependencies included
- Signal-based reactive architecture
- Comprehensive data type support
- Custom filter registration
- Template content projection support
- Frozen column functionality
- Row expansion capabilities (structure ready)
- Input validation system
- Image and icon handling with error fallbacks

## Future Enhancements

1. Advanced filtering with drawers
2. Column visibility controls
3. Enhanced export options
4. Real-time data updates
5. Custom cell templates
6. Row expansion functionality