export interface Asset {
  id: number;
  barcode: string;
  name: string;
  purchase_date: string;
  depreciation_rate: string;
  quantity: number;
  price: string;
  sub_category: SubCategory;
}

export interface SubCategory {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}
