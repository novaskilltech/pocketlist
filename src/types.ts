export interface User {
  id: string;
  email: string;
  first_name?: string;
  is_premium: boolean;
}

export interface List {
  id: string;
  name: string;
  created_at: string;
  is_recurrent: boolean;
}

export interface Item {
  id: string;
  list_id: string;
  name: string;
  quantity?: string;
  price?: number;
  is_checked: boolean;
  created_at: string;
}
