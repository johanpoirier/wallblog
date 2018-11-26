export interface Item {
    description: string;
    extension: string;
    filename: string;
};

export interface StoreState {
    items: ReadonlyArray<Item>;
}
