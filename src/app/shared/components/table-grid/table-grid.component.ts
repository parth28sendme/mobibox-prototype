import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,
         Component,
         computed,
         inject,
         input,
         model,
         output,
         signal,
         viewChild,
         ViewEncapsulation,
         contentChild,
         effect,
         ChangeDetectorRef,
         untracked} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { DrawerModule } from 'primeng/drawer';
import { SliderModule } from 'primeng/slider';
import { Table,
         TableModule,
         TableService} from 'primeng/table';
import { ColumnArray, DataColumnArray } from '../../models/columns';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FilterService } from 'primeng/api';
import { CommaSeparatedPipe } from '../../pipes/comma-separated.pipe';

@Component({
    selector: 'app-table-grid',
    standalone: true,
    imports: [CommonModule,
        TableModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        MenuModule,
        FormsModule,
        DrawerModule,
        ToggleSwitchModule,
        MultiSelectModule,
        SliderModule,
        InplaceModule,
        InputNumberModule,
        DatePickerModule,
        RadioButtonModule,
        CheckboxModule,
        CommaSeparatedPipe
    ],
    providers: [TableService, Table],
    templateUrl: './table-grid.component.html',
    styleUrl: './table-grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TableGridComponent {
  value = model.required<unknown[]>();
  dataKey = input<string>("id");
  rows = input<number>(10);
  rowsPerPageOptions = input<number[]>([10, 25, 50]);
  loading = input<boolean>(false);
  columns = input.required<ColumnArray | DataColumnArray>();
  title = input.required<string>();
  rowData = model<unknown>(null);
  buttonOutput = output<unknown>();
  inputChange = output<{row: unknown, field: string, value: unknown}>();
  hasTotal = input<boolean>(false);
  hasSelection = input<boolean>(false);
  selectedRows = model<unknown[]>([]);
  id = input<unknown>();
  hasSearch = input<boolean>(true);
  hasFilters = input<boolean>(true);
  hasClear = input<boolean>(true);
  hasEditColumns = input<boolean>(true);
  filteredvalues = output<unknown[]>();
  onPage = output<number>();
  hasCaption = input<boolean>(true);
  hasExport = input<boolean>(true);
  canReorder = input<boolean>(false);
  expantionColumns = input<ColumnArray | DataColumnArray>([]);
  expantionValue = input<string>();

  searchTerm = signal("");
  toggleEditColumns = signal<boolean>(false);
  toggleFilter = signal<boolean>(false);
  searchCols = signal("");
  selectedCols = signal<Record<string, boolean>>({});
  MultiselectFilterModels = signal<Record<string, unknown[]>>({});
  RangeFilterModels = signal<Record<string, unknown[]>>({});
  DateFilterModels = signal<Record<string, unknown>>({});
  RadioFilterModels = signal<Record<string, unknown>>({});
  CheckboxFilterModels = signal<Record<string, unknown[]>>({});
  TriStateFilterModels = signal<Record<string, boolean>>({});
  TextFilterModels = signal<Record<string, string>>({});
  emptyIcon = signal<string>('assets/images/logos/noimage.png');
  initialValue = signal<unknown[]>([]);

  mobiboxTable = viewChild<Table>('mobiboxTable');
  customHeaderTemplate = contentChild<any>('customHeader');
  customFooterTemplate = contentChild<any>('customFooter');
  customBodyTemplate = contentChild<any>('customBody');
  additionalHeaderTemplate = contentChild<any>('additionalHeader');
  additionalCaptionTemplate = contentChild<any>('additionalCaption');
  newCaptionRow = contentChild<any>('newCaptionRow');
  customEmptyMessageTemplate = contentChild<any>('customEmptyMessage');

  filterService = inject(FilterService);
  cd = inject(ChangeDetectorRef);

  private registeredCustomFilters = new Set<string>();
  private filterOptionsComputed = signal<boolean>(false);
  filterOptionsByColumn = signal<Record<string, unknown[]>>({});

  filteredData = computed(() =>
    this.value()?.filter((item: any) =>
      this.editableCols().some((col: any) =>
        col["selected"] ?
          (item[col.value]?.toString().toLowerCase().includes(this.searchTerm().toLowerCase()) ||
           this.searchInExpansionData(item)) :
          false
  )));

  private searchInExpansionData(item: any): boolean {
    const expansionValue = this.expantionValue();
    if (!expansionValue) return false;
    
    const expansionDataArray = item[expansionValue];

    if (!expansionDataArray || !Array.isArray(expansionDataArray) || !this.expantionColumns()) {
      return false;
    }

    return expansionDataArray.some((val: any) =>
      this.expantionColumns().some((col: any) =>
        val[col['value']]?.toString().toLowerCase().includes(this.searchTerm().toLowerCase())
      )
    );
  }

  editableCols = computed(() => this.columns().filter(x => x != null)
                                              .map((col: any) => ({
    ...col,
    selected: !(col as any)?.frozenType ? this.selectedCols()[(col as any).value] ?? true : undefined
  })));

  filteredEditableCols = computed(() => this.editableCols()?.filter((item: any) =>
    item["field"]?.toLowerCase().includes(this.searchCols().toLocaleLowerCase())
  ));

  selectedEditableCols = computed(() => {
    const filtered = this.filteredEditableCols();
    const selectedColsState = this.selectedCols();

    return filtered?.filter((col: any) => {
      if (col.frozenType) {
        return true;
      }
      return selectedColsState[col.value] !== false;
    });
  });

  constructor() {
    effect(() => {
      this.filteredvalues.emit(this.filteredData());

      if (!this.filterOptionsComputed()
        && this.filteredData()?.length
        && this.editableCols()?.length) {
        const options: Record<string, unknown[]> = {};
        for (const col of this.editableCols()) {
          const colAny = col as any;
          if (colAny['filterType'] === 'multiselect'
           || colAny['filterType'] === 'checkbox'
           || colAny['filterType'] === 'radio') {
            options[colAny.value] = this.getGridValues(colAny?.value,
                                                    colAny?.imgArray || colAny?.iconArray || colAny?.isArray,
                                                    colAny?.objectLabel,
                                                    colAny?.objectValue);
          }
        }
        this.filterOptionsByColumn.set(options);
        this.filterOptionsComputed.set(true);
      }
    });

    effect(() => {
      const currentValue = this.value();
      if (currentValue) {
        this.filterOptionsComputed.set(false);
        this.filterOptionsByColumn.set({});
        untracked(() => {
          this.resetAllFilters();
        });
      }
    });
  }

  customFilter = (filtervalue: string): void => {
    if (this.registeredCustomFilters.has(filtervalue)) {
      return;
    }
    this.filterService.register('custom', (value: any, filter: any): boolean => {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      var res = false;
      for (var i = 0; i < filter.length; i++) {
        for (var j = 0; j < value.length; j++) {
          if (value[j][filtervalue] == filter[i]) {
            res = true;
            break;
          }
        }
      }
      return res;
    });
    this.registeredCustomFilters.add(filtervalue);
  }

  returnRowData = (rowData: unknown) => {
    this.rowData.update(x => x = rowData);
  }

  clearTable = () => {
    this.resetAllFilters();
    this.mobiboxTable()?.reset();
    this.searchTerm.set(" ");
    this.searchTerm.set("");

    const tableElement = this.mobiboxTable()?.el?.nativeElement;
    if (tableElement) {
      const thElements = tableElement.querySelectorAll('th.p-sortable-column');
      thElements.forEach((th: HTMLElement) => {
        th.classList.remove('p-highlight');
      });
    }
  }

  toggleEditColumnsFunc = () => {
    this.toggleEditColumns.update(x => x = !x);
    this.searchCols.set("");
  }

  toggleColumnSelection = (colValue: string, selected: boolean) => {
    this.selectedCols.update(current => ({
      ...current,
      [colValue]: selected
    }));
  }

  isColumnDisabled = (colValue: string): boolean => {
    const currentSelectedCols = this.filteredEditableCols().filter((col: any) => !col['frozen']);
    const selectedCount = currentSelectedCols.filter((col: any) => col['selected'] === true).length;
    const targetColumn = currentSelectedCols.find((col: any) => col['value'] === colValue);
    return selectedCount === 1 && targetColumn && targetColumn['selected'] === true;
  }

  toggleFilterFunc = () => {
    this.toggleFilter.update(x => x = !x);
    const currentRangeModels = { ...this.RangeFilterModels() };
    const newRangeModels = this.initRangeFilterModels();
    Object.keys(newRangeModels).forEach(key => {
      if (!currentRangeModels[key]) {
        currentRangeModels[key] = newRangeModels[key];
      }
    });
    this.RangeFilterModels.set(currentRangeModels);
  }

  resetAllCols = () => {
    this.searchCols.set("");
    const newState: Record<string, boolean> = {};
    for (const col of this.editableCols()) {
      const colAny = col as any;
      if (!colAny.frozen) {
        newState[colAny.value] = true;
      }
    }
    this.selectedCols.set(newState);
  }

  buttonOutputFunc = (rowData: unknown) => {
    this.buttonOutput.emit(rowData);
  }

  getGridValues = (
    value: string,
    isArray: boolean = false,
    objectLabel: string | null = null,
    objectValue: string | null = null
  ) => {
    if (!this.filteredData()) return [];
    if (objectLabel || objectValue) {
      this.customFilter(objectValue!);
    }
    let values;
    if (objectLabel || objectValue) {
      values = this.filteredData().flatMap((x: any) => {
        const val = x[value];
        if (Array.isArray(val)) {
          return val
            .map(v => ({
              label: objectLabel ? v[objectLabel] : v,
              value: objectValue ? v[objectValue] : v
            }))
            .filter(v => v);
        } else if (val && typeof val === 'object') {
          const obj = {
            label: objectLabel ? val[objectLabel] : val,
            value: objectValue ? val[objectValue] : val
          };
          return obj ? [obj] : [];
        } else {
          return val ? [{ label: val, value: val }] : [];
        }
      });
    } else if (isArray) {
      values = this.filteredData().flatMap((x: any) => {
        const val = x[value];
        return Array.isArray(val) ? val.filter(v => v) : (val ? [val] : []);
      });
    } else {
      values = this.filteredData().map((x: any) => x[value]).filter(v => v);
    }
    const seen = new Set();
    const unique = [];
    for (const v of values) {
      const key = (v && typeof v === 'object') ? JSON.stringify(v) : typeof v + ':' + v;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(v);
      }
    }
    return unique;
  }

  resetAllFilters = () => {
    for (const col of this.editableCols()) {
      const colAny = col as any;
      if (!colAny.frozen) {
        this.mobiboxTable()?.reset();
      }
    }
    this.MultiselectFilterModels.set({});
    this.RangeFilterModels.set(this.initRangeFilterModels());
    this.DateFilterModels.set({});
    this.RadioFilterModels.set({});
    this.CheckboxFilterModels.set({});
    this.TriStateFilterModels.set({});
    this.TextFilterModels.set({});
  }

  exportExcel = () => {
    let data: any[] = [];
    const fields = this.editableCols().filter((x: any) => x['selected'] && !x['frozen']).map((x: any) => x['field']);
    const values = this.editableCols().filter((x: any) => x['selected'] && !x['frozen']).map((x: any) => x['value']);

    const table = this.mobiboxTable();
    const exportData = table?.filteredValue ? table.filteredValue : this.filteredData();

    exportData.forEach((x: any) => {
      let row: any[] = [];
      values.forEach(y => {
        row.push(x[y]);
      })
      data.push(row);
    });
    this.generateExcel(this.title(), fields, data);
  }

  private generateExcel(title: string, headers: string[], data: any[][]) {
    const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'export'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  handleImageError = (event: Event) => {
    (event.target as HTMLImageElement).src = this.emptyIcon();
  }

  getMax = (colValue: string): number => {
    return Math.max(...this.filteredData().map((item: any) => item[colValue]));
  }

  private initRangeFilterModels(): Record<string, unknown[]> {
    const ranges = this.editableCols().filter((x: any) => x['filterType'] == 'range');
    const rangeModels: Record<string, unknown[]> = {};
    ranges.forEach((col: any) => {
      const max = this.getMax(col['value']);
      rangeModels[col['value']] = [0, max];
    });
    return rangeModels;
  }

  applyFilters() {
    const multiSelectModels = this.MultiselectFilterModels();
    Object.keys(multiSelectModels).forEach(col => {
      const value = multiSelectModels[col];
      if (value && value.length > 0) {
        this.mobiboxTable()?.filter(value,
                                   col,
                                   this.editableCols().find((x: any) => x['value'] == col
                                                              && (x['objectValue']
                                                               || x['objectLabel'])) ? 'custom' : 'in');
      } else {
        this.mobiboxTable()?.filter(null, col, 'in');
      }
    });

    const rangeModels = this.RangeFilterModels();
    Object.keys(rangeModels).forEach(col => {
      const value = rangeModels[col];
      if (value && value.length === 2) {
        this.mobiboxTable()?.filter(value, col, 'between');
      } else {
        this.mobiboxTable()?.filter(null, col, 'between');
      }
    });

    const dateModels = this.DateFilterModels();
    Object.keys(dateModels).forEach(col => {
      const column = this.columns().find((x: any) => x['value'] == col) as any;
      const filterValue = this.normalizeDateForFilter(dateModels[col], column?.filterType);
      this.mobiboxTable()?.filter(filterValue, col, 'contains');
    });

    const radioModels = this.RadioFilterModels();
    Object.keys(radioModels).forEach(col => {
      const value = radioModels[col];
      this.mobiboxTable()?.filter(value, col, 'equals');
    });

    const checkboxModels = this.CheckboxFilterModels();
    Object.keys(checkboxModels).forEach(col => {
      const value = checkboxModels[col];
      if (value && value.length > 0) {
        this.mobiboxTable()?.filter(value, col, 'in');
      } else {
        this.mobiboxTable()?.filter(null, col, 'in');
      }
    });

    const triStateModels = this.TriStateFilterModels();
    Object.keys(triStateModels).forEach(col => {
      const value = triStateModels[col];
      this.mobiboxTable()?.filter(value, col, 'equals');
    });

    const textModels = this.TextFilterModels();
    Object.keys(textModels).forEach(col => {
      const value = textModels[col];
      this.mobiboxTable()?.filter(value, col, 'equals');
    });
  }

  normalizeDateForFilter(val: any, filterType: string): string {
    if (!val) return '';
    if (val instanceof Date) {
      if (filterType == 'dateTime') {
        return val.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
               ' ' + val.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      } else {
        return val.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      }
    }
    if (typeof val === 'string') {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US');
      }
      return val;
    }
    return '';
  }

  onPageClicked = (event: any) => {
    this.onPage.emit(event);
  }

  isCommaSeparatedString(val: any): boolean {
    return typeof val === 'string' && val.includes(',');
  }

  getSumAndAvg = (type: 'avg' | 'sum', col: string): number => {
    const table = this.mobiboxTable();
    const data = table?.filteredValue ? table.filteredValue : this.filteredData();
    const fil = data?.reduce((sum: number , item: any) => sum + (item[col] as number), 0) as number;
    if (type == 'sum')
      return fil;
    else
      return (data.length > 0 ? (fil / data.length) : 0);
  }
}