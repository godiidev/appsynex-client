// types/sample.ts
export interface SampleProduct {
    id: number;
    sku: string;
    product_name_id: number;
    category_id: number;
    description: string;
    sample_type: string;
    weight: number;
    width: number;
    color: string;
    color_code: string;
    quality: string;
    remaining_quantity: number;
    fiber_content: string;
    source: string;
    sample_location: string;
    barcode: string;
    created_at: string;
    updated_at: string;
    product_name?: ProductName;
    category?: Category;
  }
  
  export interface ProductName {
    id: number;
    product_name_vi: string;
    product_name_en: string;
    sku_parent: string;
  }
  
  export interface Category {
    id: number;
    category_name: string;
    parent_category_id?: number;
    description: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface SampleFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sample_type?: string;
    weight_min?: number;
    weight_max?: number;
    width_min?: number;
    width_max?: number;
    color?: string;
  }