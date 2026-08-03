export type AuthMode = "login" | "register";
export type GroupType = "group" | "private";

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface Paginated<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
  start_index?: string | null;
  total_unread?: number;
  group_name?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  is_active?: boolean;
  created_at?: string | null;
  is_friend?: boolean;
}

export interface LoginUser extends User {
  access_token: string;
  token_type: string;
}

export interface Group {
  id: string;
  name: string;
  owner_id: string;
  member_ids: string[];
  last_message?: Record<string, unknown> | null;
  is_dissolved: boolean;
  created_at: string;
  type: GroupType;
  unread_count?: number;
  members?: User[];
  total_unread?: number;
}

export interface Message {
  id: string;
  type: string;
  content: unknown;
  sender_id: string;
  sender_username: string;
  sender_avatar?: string | null;
  group_id: string;
  cite?: Record<string, unknown> | null;
  at_list: string[];
  read_list: string[];
  is_revoke: boolean;
  is_deleted: boolean;
  created_at: string;
  duration?: number | null;
  revoke_at?: string | null;
  deleted_at?: string | null;
  is_read?: boolean;
}

export interface FriendRequest {
  request_type: "from" | "to";
  user_id: string;
  username: string;
  avatar?: string | null;
  status: string;
  created_at: string;
  handled_at?: string | null;
}
