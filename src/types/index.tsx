export interface Item {
  description: string;
  extension: string;
  filename: string;
  ratio: number;
  index: number;
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
}

export interface ItemsAction {
  type: string;
  payload: any;
}
