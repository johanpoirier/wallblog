export interface Item {
  description: string;
  date: string;
  extension: string;
  filename: string;
  ratio: number;
  index: number;
  allocatedWidth: number;
}

export interface ApiItem {
  date: string;
  description: string;
  file: string;
  id: string;
  ratio: number;
}

export interface StoreState {
  items: ReadonlyArray<Item>;
  loading: boolean;
  columnCount: number;
}

export interface ItemsAction {
  type: string;
  payload: any;
}
