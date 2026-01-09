
export interface UserItem {
  id: number;
  name: string;
  email: string;
  notelp: string | null;
}

export interface ApiUsersResponse {
  data: {
    items: UserItem[];
  };
}

export interface ApiBaseResponse {
  message: string;
}
