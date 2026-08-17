import axios from "axios";
import type {
  ApiResponse,
  FriendRequest,
  Group,
  GroupAnnouncement,
  GroupMemberRole,
  GroupMemberWithRole,
  LoginUser,
  Message,
  Paginated,
  SearchResponse,
  User,
} from "../types";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
export const WS_BASE = import.meta.env.VITE_WS_BASE || "ws://127.0.0.1:8000";

const http = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("im_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("im_token", token);
  } else {
    localStorage.removeItem("im_token");
  }
}

export function getStoredToken() {
  return localStorage.getItem("im_token") || "";
}

export function getStoredUser() {
  const raw = localStorage.getItem("im_user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem("im_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("im_user");
  }
}

async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>) {
  const res = await promise;
  return res.data.data;
}

export function login(payload: { email: string; password: string }) {
  return unwrap<LoginUser>(http.post("/api/auth/login", payload));
}

export function register(payload: {
  username: string;
  email: string;
  password: string;
  verification_code: string;
  phone?: string;
}) {
  return unwrap<User>(http.post("/api/auth/register", payload));
}

export function sendEmailCode(payload: { email: string }) {
  return unwrap(http.post("/api/auth/register/send-email-code", payload));
}

export function sendPhoneCode(payload: { phone: string }) {
  return unwrap(http.post("/api/auth/send-phone-code", payload));
}

export function resetPassword(payload: {
  email: string;
  verification_code: string;
  new_password: string;
}) {
  return unwrap(http.post("/api/auth/password/reset", payload));
}

export function resetPasswordCode(payload: { email: string }) {
  return unwrap(http.post("/api/auth/password/send-code", payload));
}

export function getGroups(page = 1, pageSize = 50) {
  return unwrap<Paginated<Group>>(http.post("/api/group/list", { page, page_size: pageSize }));
}

export function getGroupMessages(payload: {
  id: string;
  page?: number;
  page_size?: number;
  start_index?: string | null;
}) {
  return unwrap<Paginated<Message>>(http.post("/api/group/messages", payload));
}

export function createGroup(payload: {
  name: string;
  member_ids: string[];
  owner_id?: string;
  type: "group" | "private";
}) {
  return unwrap<Group>(http.post("/api/group/create", payload));
}

export function addUsersToGroup(payload: { group_id: string; user_ids: string[] }) {
  return unwrap(http.post("/api/group/add_user_to_group", payload));
}

export function removeUsersFromGroup(payload: { group_id: string; user_ids: string[] }) {
  return unwrap(http.post("/api/group/dele_user_from_group", payload));
}

export function leaveGroup(groupId: string) {
  return unwrap(http.post(`/api/group/${groupId}/leave`));
}

export function dissolveGroup(groupId: string) {
  return unwrap(http.delete(`/api/group/${groupId}`));
}

export function markAllRead(groupId: string) {
  return unwrap(http.get(`/api/group/all_read/${groupId}`));
}

export function markRead(payload: { group_id: string; message_ids: string[] }) {
  return unwrap(http.post("/api/group/read", payload));
}

export function getGroupDetail(groupId: string) {
  return unwrap<Group>(http.get(`/api/group/${groupId}`));
}

export function searchUsers(payload: { id?: string; username?: string; phone?: string; email?: string }) {
  return unwrap<User[]>(http.post("/api/user/search", payload));
}

export function queryUsers(payload: { query_str: string }) {
  return unwrap<User[]>(http.post("/api/user/query", payload));
}

export function updateUser(userId: string, payload: { username: string; phone?: string }) {
  return unwrap(http.put(`/api/user/${userId}`, payload));
}

export function getFriends(search?: string) {
  return unwrap<User[]>(http.get("/api/user/friends", { params: search ? { search } : undefined }));
}

export function sendFriendRequest(friendId: string) {
  return unwrap(http.get(`/api/user/friend/request/${friendId}`));
}

export function getFriendRequestList(payload: { search?: string; page?: number; page_size?: number }) {
  return unwrap<Paginated<FriendRequest>>(http.post("/api/user/friend/request_list/list", payload));
}

export function handleFriendRequest(payload: { friend_id: string; action: "accept" | "reject" }) {
  return unwrap(http.post("/api/user/friend/handle", payload));
}

export function deleteFriend(friendId: string) {
  return unwrap(http.delete(`/api/user/friend/${friendId}`));
}

export function friendRequestCount() {
  return unwrap<{ count: number }>(http.get("/api/user/friend_requests/count"));
}

export function uploadAvatar(file: File) {
  const form = new FormData();
  form.append("file", file);
  return unwrap<{ file_id?: string; avatar?: string; file_path?: string }>(
    http.post("/api/files/head/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
}

export function uploadGroupFile(groupId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  form.append("group_id", groupId);
  return unwrap(http.post("/api/files/group/upload/file", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }));
}

export function uploadGroupMedia(groupId: string, file: File, duration?: number) {
  const form = new FormData();
  form.append("file", file);
  form.append("group_id", groupId);
  if (typeof duration === "number") {
    form.append("duration", String(duration));
  }
  return unwrap(http.post("/api/files/group/upload/media", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }));
}

export function downloadFileUrl(fileId: string, token: string) {
  return `${API_BASE}/api/files/download/${fileId}/${token}`;
}

export function avatarUrl(userId?: string | null) {
  if (!userId) {
    return `${API_BASE}/static/default_avatar.png`;
  }
  return `${API_BASE}/api/files/head/${userId}`;
}

export function revokeToken() {
  return unwrap(http.post("/api/user/invalidate-token"));
}

export function pingConfirm() {
  return unwrap(http.get("/api/auth/confirm"));
}

// 新增：会话置顶接口
/**
 * 设置或取消会话置顶
 * @param groupId 群组ID
 * @param isPinned true=置顶, false=取消置顶
 * @returns 置顶设置结果
 */
export function toggleGroupPin(groupId: string, isPinned: boolean) {
  return unwrap<{ group_id: string; is_pinned: boolean; pinned_at: string | null }>(
    http.post(`/api/group/${groupId}/pin`, { is_pinned: isPinned })
  );
}

// 新增：清空会话消息接口
/**
 * 清空会话消息（只影响当前用户视角）
 * @param groupId 群组ID
 * @returns 清空结果，包含清空时间点
 */
export function clearGroupMessages(groupId: string) {
  return unwrap<{ group_id: string; cleared_at: string }>(
    http.post(`/api/group/${groupId}/clear`)
  );
}

export function getGroupAnnouncements(groupId: string) {
  return unwrap<GroupAnnouncement[]>(http.get(`/api/group/${groupId}/announcements`));
}

export function createGroupAnnouncement(groupId: string, content: string) {
  return unwrap<GroupAnnouncement>(
    http.post(`/api/group/${groupId}/announcements`, { content })
  );
}

export function updateGroupAnnouncement(groupId: string, announcementId: string, content: string) {
  return unwrap<GroupAnnouncement>(
    http.put(`/api/group/${groupId}/announcements/${announcementId}`, { content })
  );
}

export function deleteGroupAnnouncement(groupId: string, announcementId: string) {
  return unwrap<{ group_id: string; announcement_id: string }>(
    http.delete(`/api/group/${groupId}/announcements/${announcementId}`)
  );
}

export function getGroupMembers(groupId: string) {
  return unwrap<{ group_id: string; members: GroupMemberWithRole[] }>(
    http.get(`/api/group/${groupId}/members`)
  );
}

export function setGroupAdmin(groupId: string, userId: string) {
  return unwrap<{ group_id: string; user_id: string; role: GroupMemberRole }>(
    http.post(`/api/group/${groupId}/admins/${userId}`)
  );
}

export function unsetGroupAdmin(groupId: string, userId: string) {
  return unwrap<{ group_id: string; user_id: string; role: GroupMemberRole }>(
    http.delete(`/api/group/${groupId}/admins/${userId}`)
  );
}

export function muteGroupMember(groupId: string, userId: string, minutes = 10) {
  return unwrap<{ group_id: string; user_id: string; muted_by: string; muted_at: string; muted_until: string }>(
    http.post(`/api/group/${groupId}/mute/${userId}`, { minutes })
  );
}

export function unmuteGroupMember(groupId: string, userId: string) {
  return unwrap<{ group_id: string; user_id: string }>(
    http.delete(`/api/group/${groupId}/mute/${userId}`)
  );
}

export function muteAllGroupMembers(groupId: string, minutes = 10) {
  return unwrap<{ group_id: string; muted_by: string; muted_at: string; muted_until: string }>(
    http.post(`/api/group/${groupId}/mute-all`, { minutes })
  );
}

export function unmuteAllGroupMembers(groupId: string) {
  return unwrap<{ group_id: string }>(
    http.delete(`/api/group/${groupId}/mute-all`)
  );
}

export function searchMessages(params: { group_id: string; keyword: string; page?: number; page_size?: number }) {
  return unwrap<SearchResponse>(
    http.get("/api/chat/search", { params })
  );
}
