export type AuthMode = "login" | "register";
export type GroupType = "group" | "private";
export type GroupMemberRole = "owner" | "admin" | "member";

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

export interface GroupAnnouncement {
  id: string;
  group_id: string;
  content: string;
  created_by: string;
  created_by_username?: string | null;
  created_at: string;
  updated_by: string;
  updated_by_username?: string | null;
  updated_at: string;
}

export interface GroupMemberWithRole extends User {
  user_id?: string;
  role: GroupMemberRole;
}

export interface MutedMember {
  user_id: string;
  muted_by: string;
  muted_at: string;
  muted_until: string;
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
  members?: GroupMemberWithRole[];
  total_unread?: number;
  // 新增：用户维度的置顶设置
  is_pinned?: boolean;       // 是否置顶
  pinned_at?: string | null; // 置顶时间
  admin_ids?: string[];
  announcements?: GroupAnnouncement[];
  announcement_editor_ids?: string[];
  muted_members?: MutedMember[];
  all_muted_until?: string | null;
  all_muted_by?: string | null;
  all_muted_at?: string | null;
}

export interface MessageCite {
  id: string;
  sender_id: string;
  sender_username: string;
  content: unknown;
}

export interface Message {
  id: string;
  type: string;
  content: unknown;
  sender_id: string;
  sender_username: string;
  sender_avatar?: string | null;
  group_id: string;
  cite?: MessageCite | null;
  at_list: string[];
  read_list: string[];
  is_revoke: boolean;
  is_deleted: boolean;
  is_AI?: boolean;
  is_streaming?: boolean;
  stop?: boolean;
  model_id?: string | null;
  model_name?: string | null;
  ai_parent_message_id?: string | null;
  recommend_questions?: string[];
  citations?: Record<string, unknown>[];
  error_message?: string | null;
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

export interface SearchResult {
  id: string;
  content: string;
  type: string;
  sender_id: string;
  sender_username: string;
  sender_avatar?: string | null;
  created_at: string;
}

export interface SearchResponse {
  group_id: string;
  keyword: string;
  items: SearchResult[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}

export interface AIChatResponse {
  source?: "system" | "user";
  model: string;
  content: string;
  usage?: Record<string, unknown> | null;
}

export interface AIProviderConfig {
  provider: string;
  base_url: string;
  api_key_masked: string;
  key_configured: boolean;
  selected_model?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIModelConfig {
  id: string;
  name: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  member_ids: string[];
  file_count: number;
  created_at: string;
  updated_at: string;
}
