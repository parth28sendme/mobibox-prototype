import { MenuItem } from "primeng/api";

type MenuColumn = {
  frozenType: 'menu';
  frozen: true;
  items: MenuItem[];
};

type EditDeleteColumn = {
  frozenType: 'edit' | 'delete' | 'view' | 'info';
  frozen: true;
};

type customButtomColumn = {
  frozenType: 'custom';
  frozen: true;
  icon: string;
};

type OtherColumn = {
  field: string;
  value: string;
  frozen?: boolean;
  items?: never;
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

export type ColumnArray =
  | [...OtherColumn[], ...[EditDeleteColumn]]
  | [...OtherColumn[], ...[MenuColumn]]
  | [...OtherColumn[], ...[customButtomColumn], ...[MenuColumn]];

export type DataColumnArray = [...OtherColumn[]];

export interface TableColumn extends OtherColumn {}