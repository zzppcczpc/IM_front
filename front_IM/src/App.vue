<template>
  <div v-if="!authed" class="auth-shell">
    <div class="auth-card">
      <div class="brand" style="margin-bottom: 18px">
        <span class="brand-badge">IM</span>
        <div>
          <div style="font-size: 18px">Pure IM</div>
          <div class="muted">Vue3 前端 · 对接当前后端版本</div>
        </div>
      </div>

      <div class="auth-tabs">
        <button class="btn" :class="{ primary: authMode === 'login' }" @click="authMode = 'login'">登录</button>
        <button class="btn" :class="{ primary: authMode === 'register' }" @click="authMode = 'register'">注册</button>
        <button class="btn" :class="{ primary: authMode === 'reset' }" @click="authMode = 'reset'">重置密码</button>
      </div>

      <div v-if="authMode === 'login'" class="auth-grid">
        <div class="field-grid">
          <div class="field">
            <label>邮箱</label>
            <input v-model.trim="loginForm.email" placeholder="name@example.com" />
          </div>
          <div class="field">
            <label>密码</label>
            <input v-model.trim="loginForm.password" type="password" placeholder="请输入密码" />
          </div>
        </div>
        <div class="toolbar">
          <button class="btn primary" @click="handleLogin">登录</button>
          <button class="btn ghost" @click="refreshBackend">检测后端</button>
        </div>
      </div>

      <div v-else-if="authMode === 'register'" class="auth-grid">
        <div class="field-grid">
          <div class="field">
            <label>用户名</label>
            <input v-model.trim="registerForm.username" placeholder="你的昵称" />
          </div>
          <div class="field">
            <label>邮箱</label>
            <input v-model.trim="registerForm.email" placeholder="name@example.com" />
          </div>
          <div class="field">
            <label>密码</label>
            <input v-model.trim="registerForm.password" type="password" placeholder="不少于 6 位" />
          </div>
          <div class="field">
            <label>验证码</label>
            <input v-model.trim="registerForm.verification_code" placeholder="后端日志里拿验证码" />
          </div>
        </div>
        <div class="toolbar">
          <button class="btn ghost" @click="sendRegisterCode">发送验证码</button>
          <button class="btn primary" @click="handleRegister">注册</button>
        </div>
      </div>

      <div v-else class="auth-grid">
        <div class="field-grid">
          <div class="field">
            <label>邮箱</label>
            <input v-model.trim="resetForm.email" placeholder="name@example.com" />
          </div>
          <div class="field">
            <label>验证码</label>
            <input v-model.trim="resetForm.verification_code" placeholder="验证码" />
          </div>
          <div class="field">
            <label>新密码</label>
            <input v-model.trim="resetForm.new_password" type="password" placeholder="新密码" />
          </div>
        </div>
        <div class="toolbar">
          <button class="btn ghost" @click="sendResetCode">发送重置验证码</button>
          <button class="btn primary" @click="handleReset">提交重置</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="brand-badge">IM</span>
        <div>
          <div>Pure IM</div>
          <div class="muted">Vue3 客户端</div>
        </div>
      </div>
      <div class="toolbar">
        <button class="btn ghost" @click="refreshAll">刷新</button>
        <button class="btn danger" @click="handleLogout">退出</button>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-tabs">
          <button class="tab-btn" :class="{ active: activeSidebar === 'groups' }" @click="activeSidebar = 'groups'">
            <MessageSquareMore :size="16" /> 聊天
          </button>
          <button class="tab-btn" :class="{ active: activeSidebar === 'friends' }" @click="activeSidebar = 'friends'">
            <Users :size="16" /> 好友
          </button>
          <button class="tab-btn" :class="{ active: activeSidebar === 'profile' }" @click="activeSidebar = 'profile'">
            <UserRound :size="16" /> 个人
          </button>
        </div>

        <div class="panel">
          <div v-if="activeSidebar === 'groups'" class="small-grid">
            <div class="panel-card">
              <div class="panel-title">
                <span>群组</span>
                <button class="btn ghost" @click="loadGroups">同步</button>
              </div>
              <div class="toolbar" style="margin-bottom: 10px">
                <button class="btn primary" @click="showCreateGroup = !showCreateGroup">新建群/私聊</button>
              </div>
              <div v-if="showCreateGroup" class="small-grid" style="margin-bottom: 12px">
                <div class="field">
                  <label>类型</label>
                  <select v-model="createGroupForm.type">
                    <option value="group">群聊</option>
                    <option value="private">私聊</option>
                  </select>
                </div>
                <div class="field">
                  <label>名称</label>
                  <input v-model.trim="createGroupForm.name" placeholder="群名称" />
                </div>
                <div class="field">
                  <label>成员ID</label>
                  <textarea :value="selectedMemberIds.join('\n')" readonly placeholder="从好友/搜索结果里点选"></textarea>
                </div>
                <div class="toolbar">
                  <button class="btn primary" @click="createChatGroup">创建</button>
                  <button class="btn ghost" @click="clearSelectedMembers">清空成员</button>
                </div>
              </div>
              <div class="field">
                <label>搜索用户</label>
                <input v-model.trim="userSearchQuery" placeholder="输入用户名/邮箱/手机号" @keyup.enter="searchUsersAction" />
              </div>
              <div class="toolbar" style="margin: 10px 0">
                <button class="btn ghost" @click="searchUsersAction">搜索</button>
              </div>
              <div class="list">
                <div
                  v-for="user in userSearchResults"
                  :key="user.id"
                  class="list-item"
                >
                  <div class="list-item-head">
                    <strong>{{ user.username }}</strong>
                    <span class="muted">{{ user.id }}</span>
                  </div>
                  <div class="toolbar">
                    <button class="btn ghost" @click="toggleSelectedMember(user.id)">
                      {{ selectedMemberIds.includes(user.id) ? '已选中' : '加入群成员' }}
                    </button>
                    <button class="btn ghost" @click="startPrivateChat(user)">私聊</button>
                    <button class="btn ghost" @click="sendFriend(user.id)">加好友</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="list">
              <button
                v-for="group in groups"
                :key="group.id"
                class="list-item"
                :class="{ active: selectedGroupId === group.id }"
                @click="openGroup(group.id)"
              >
                <div class="list-item-head">
                  <strong>{{ group.name || '未命名群' }}</strong>
                  <span v-if="group.unread_count" class="badge">{{ group.unread_count }}</span>
                </div>
                <div class="muted">
                  {{ group.type === 'private' ? '私聊' : '群聊' }} · {{ group.id }}
                </div>
              </button>
            </div>
          </div>

          <div v-else-if="activeSidebar === 'friends'" class="small-grid">
            <div class="panel-card">
              <div class="panel-title">
                <span>好友</span>
                <button class="btn ghost" @click="loadFriends">同步</button>
              </div>
              <div class="field">
                <label>好友搜索</label>
                <input v-model.trim="friendSearchQuery" placeholder="输入用户名或邮箱" @keyup.enter="loadFriends" />
              </div>
              <div class="toolbar" style="margin: 10px 0">
                <button class="btn ghost" @click="loadFriends">查询</button>
              </div>
              <div class="list">
                <div v-for="friend in friends" :key="friend.id" class="list-item">
                  <div class="list-item-head">
                    <strong>{{ friend.username }}</strong>
                    <span class="muted">{{ friend.id }}</span>
                  </div>
                  <div class="toolbar">
                    <button class="btn ghost" @click="startPrivateChat(friend)">发起私聊</button>
                    <button class="btn ghost" @click="sendFriend(friend.id)">加好友</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-title">
                <span>好友请求</span>
                <span class="badge" v-if="friendRequestUnread">{{ friendRequestUnread }}</span>
              </div>
              <div class="toolbar" style="margin-bottom: 10px">
                <button class="btn ghost" @click="loadFriendRequests">刷新请求</button>
              </div>
              <div class="list">
                <div v-for="req in friendRequests" :key="req.user_id + req.request_type" class="list-item">
                  <div class="list-item-head">
                    <strong>{{ req.username }}</strong>
                    <span class="muted">{{ req.status }}</span>
                  </div>
                  <div class="muted">{{ req.request_type }} · {{ req.created_at }}</div>
                  <div class="toolbar">
                    <button class="btn primary" @click="handleFriend(req.user_id, 'accept')">接受</button>
                    <button class="btn ghost" @click="handleFriend(req.user_id, 'reject')">拒绝</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="small-grid">
            <div class="panel-card">
              <div class="panel-title">
                <span>个人信息</span>
                <span class="muted">{{ currentUser?.id }}</span>
              </div>
              <div class="field-grid">
                <div class="field">
                  <label>用户名</label>
                  <input v-model.trim="profileForm.username" />
                </div>
                <div class="field">
                  <label>手机号</label>
                  <input v-model.trim="profileForm.phone" />
                </div>
              </div>
              <div class="toolbar" style="margin-top: 10px">
                <button class="btn primary" @click="saveProfile">保存资料</button>
                <label class="btn ghost">
                  上传头像
                  <input type="file" accept="image/*" hidden @change="onAvatarChange" />
                </label>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-title">
                <span>快捷信息</span>
              </div>
              <div class="small-grid">
                <div>好友数：{{ friends.length }}</div>
                <div>群组数：{{ groups.length }}</div>
                <div>在线 WebSocket：{{ wsReady ? '已连接' : '未连接' }}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="content">
        <div v-if="selectedGroup" class="chat-card">
          <section class="chat-main">
            <div class="chat-head">
              <div class="chat-title">
                <strong>{{ selectedGroup.name || '未命名群' }}</strong>
                <span class="muted">
                  {{ selectedGroup.type === 'private' ? '私聊' : '群聊' }} · {{ selectedGroup.id }}
                </span>
              </div>
              <div class="toolbar">
                <button class="btn ghost" @click="loadGroupMessages(selectedGroup.id)">历史</button>
                <button class="btn ghost" @click="loadOnlineUsers(selectedGroup.id)">在线成员</button>
                <button class="btn ghost" @click="readCurrentGroup">已读</button>
                <button v-if="selectedGroup.owner_id === currentUser?.id" class="btn danger" @click="dissolveCurrentGroup">解散</button>
                <button v-else class="btn danger" @click="leaveCurrentGroup">退出</button>
              </div>
            </div>

            <div ref="messageScrollRef" class="chat-body">
              <div class="message-list">
                <div
                  v-for="msg in currentMessages"
                  :key="msg.id"
                  class="message-row"
                  :class="{ self: msg.sender_id === currentUser?.id }"
                >
                  <div class="message-bubble">
                    <div class="message-meta">
                      <img :src="avatarUrl(msg.sender_id)" alt="" width="20" height="20" style="border-radius: 50%" />
                      <strong>{{ msg.sender_username }}</strong>
                      <span>{{ formatTime(msg.created_at) }}</span>
                      <span v-if="msg.is_revoke">已撤回</span>
                      <span v-if="msg.is_deleted">已删除</span>
                    </div>
                    <div class="message-content">
                      <template v-if="isImageMessage(msg)">
                        <a :href="downloadUrlForMessage(msg)" target="_blank" rel="noreferrer">
                          <img :src="downloadUrlForMessage(msg)" alt="image" />
                        </a>
                      </template>
                      <template v-else-if="isAudioMessage(msg)">
                        <audio controls :src="downloadUrlForMessage(msg)" />
                      </template>
                      <template v-else-if="isFileMessage(msg)">
                        <a :href="downloadUrlForMessage(msg)" target="_blank" rel="noreferrer">
                          {{ fileNameOf(msg) }}
                        </a>
                      </template>
                      <template v-else>
                        {{ renderContent(msg.content) }}
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="composer">
              <div class="composer-actions">
                <div class="toolbar">
                  <label class="btn ghost">
                    上传文件
                    <input type="file" hidden @change="onGroupFileChange" />
                  </label>
                  <button class="btn ghost" @click="loadGroupMessages(selectedGroup.id)">刷新历史</button>
                </div>
                <div class="muted">回车发送，Shift+回车换行</div>
              </div>
              <div class="composer-row">
                <textarea
                  v-model="draftMessage"
                  placeholder="输入消息..."
                  @keydown.enter.exact.prevent="sendTextMessage"
                  @keydown.enter.shift.stop
                />
                <button class="btn primary" @click="sendTextMessage">
                  <SendHorizontal :size="16" /> 发送
                </button>
              </div>
            </div>
          </section>

          <aside class="right-rail">
            <div class="hint-card">
              <div class="panel-title">
                <span>状态</span>
              </div>
              <div class="small-grid">
                <div>群内在线：{{ onlineUsers.length }}</div>
                <div>未读：{{ selectedGroup.unread_count || 0 }}</div>
                <div>消息数：{{ currentMessages.length }}</div>
              </div>
            </div>

            <div class="hint-card scroll">
              <div class="panel-title">
                <span>在线用户</span>
                <button class="btn ghost" @click="loadOnlineUsers(selectedGroup.id)">更新</button>
              </div>
              <div class="list">
                <div v-for="u in onlineUsers" :key="u.user_id" class="list-item">
                  <div class="list-item-head">
                    <strong>{{ u.username }}</strong>
                    <span class="muted">{{ u.device_count }} 台设备</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="empty-state">
          <div class="panel-card" style="max-width: 520px">
            <div class="panel-title">
              <span>还没有打开会话</span>
            </div>
            <p class="muted">从左侧选择一个群聊，或者先创建一个私聊/群聊。</p>
          </div>
        </div>
      </main>
    </div>
  </div>

  <div v-if="toast" class="toast">{{ toast }}</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import {
  MessageSquareMore,
  SendHorizontal,
  UserRound,
  Users,
} from "lucide-vue-next";
import {
  API_BASE,
  WS_BASE,
  avatarUrl,
  createGroup,
  deleteFriend,
  dissolveGroup,
  downloadFileUrl,
  friendRequestCount,
  getFriendRequestList,
  getFriends,
  getGroupMessages,
  getGroups,
  getStoredToken,
  getStoredUser,
  handleFriendRequest,
  leaveGroup,
  login,
  markAllRead,
  queryUsers,
  register,
  resetPassword,
  resetPasswordCode,
  revokeToken,
  searchUsers,
  sendEmailCode,
  sendFriendRequest,
  setAuthToken,
  setStoredUser,
  updateUser,
  uploadAvatar,
  uploadGroupFile,
  uploadGroupMedia,
  pingConfirm,
  getGroupDetail,
  markRead,
} from "./services/api";
import type { AuthMode, FriendRequest, Group, LoginUser, Message, User } from "./types";

const authed = ref(false);
const authMode = ref<AuthMode | "reset">("login");
const currentUser = ref<User | null>(getStoredUser());
const token = ref(getStoredToken());
const wsReady = ref(false);
const ws = ref<WebSocket | null>(null);
const activeSidebar = ref<"groups" | "friends" | "profile">("groups");
const groups = ref<Group[]>([]);
const friends = ref<User[]>([]);
const friendRequests = ref<FriendRequest[]>([]);
const friendRequestUnread = ref(0);
const userSearchResults = ref<User[]>([]);
const selectedMemberIds = ref<string[]>([]);
const selectedGroupId = ref("");
const selectedGroup = ref<Group | null>(null);
const currentMessages = ref<Message[]>([]);
const onlineUsers = ref<Array<{ user_id: string; username: string; device_count: number }>>([]);
const draftMessage = ref("");
const userSearchQuery = ref("");
const friendSearchQuery = ref("");
const showCreateGroup = ref(false);
const toast = ref("");
const messageScrollRef = ref<HTMLElement | null>(null);

const loginForm = reactive({ email: "", password: "" });
const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  verification_code: "",
});
const resetForm = reactive({
  email: "",
  verification_code: "",
  new_password: "",
});
const createGroupForm = reactive({
  name: "",
  type: "group" as "group" | "private",
});
const profileForm = reactive({
  username: "",
  phone: "",
});

function notify(message: string) {
  toast.value = message;
  window.clearTimeout((notify as unknown as { t?: number }).t);
  (notify as unknown as { t?: number }).t = window.setTimeout(() => {
    toast.value = "";
  }, 2600);
}

function formatTime(input?: string | null) {
  if (!input) return "";
  return new Date(input).toLocaleString("zh-CN", { hour12: false });
}

function safeParseContent(content: unknown) {
  if (typeof content !== "string") return content;
  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}

function renderContent(content: unknown) {
  const parsed = safeParseContent(content);
  if (typeof parsed === "string") return parsed;
  if (parsed && typeof parsed === "object") {
    if ("filename" in parsed) return `${String((parsed as Record<string, unknown>).filename)} `;
    return JSON.stringify(parsed);
  }
  return String(parsed ?? "");
}

function isImageMessage(msg: Message) {
  return msg.type.startsWith("image/") || (typeof msg.content === "object" && msg.content !== null && "filename" in msg.content && /image/i.test(msg.type));
}

function isAudioMessage(msg: Message) {
  return msg.type.startsWith("audio/") || msg.type.includes("audio");
}

function isFileMessage(msg: Message) {
  return /file|application|pdf|word|excel|octet-stream/i.test(msg.type);
}

function fileNameOf(msg: Message) {
  const parsed = safeParseContent(msg.content);
  if (typeof parsed === "string") return parsed;
  if (parsed && typeof parsed === "object" && "filename" in parsed) {
    return String((parsed as Record<string, unknown>).filename);
  }
  return "附件";
}

function downloadUrlForMessage(msg: Message) {
  const parsed = safeParseContent(msg.content);
  const id =
    typeof parsed === "string"
      ? parsed
      : parsed && typeof parsed === "object" && "id" in parsed
        ? String((parsed as Record<string, unknown>).id)
        : msg.id;
  return downloadFileUrl(id, token.value);
}

function scrollToBottom() {
  nextTick(() => {
    if (messageScrollRef.value) {
      messageScrollRef.value.scrollTop = messageScrollRef.value.scrollHeight;
    }
  });
}

function normalizeMessage(raw: Message): Message {
  return {
    ...raw,
    content: safeParseContent(raw.content),
  };
}

async function refreshBackend() {
  try {
    await pingConfirm();
    notify("后端可用");
  } catch {
    notify("后端暂时不可用");
  }
}

async function loadGroups() {
  const payload = await getGroups();
  groups.value = payload.items || [];
  if (!selectedGroupId.value && groups.value.length) {
    await openGroup(groups.value[0].id);
  } else {
    const current = groups.value.find((g) => g.id === selectedGroupId.value) || null;
    selectedGroup.value = current;
  }
}

async function loadFriends() {
  const data = await getFriends(friendSearchQuery.value || undefined);
  friends.value = data.filter((friend) => friend.id !== currentUser.value?.id);
}

async function loadFriendRequests() {
  const payload = await getFriendRequestList({ page: 1, page_size: 50 });
  friendRequests.value = payload.items || [];
  friendRequestUnread.value = friendRequests.value.filter((item) => item.status === "pending").length;
}

async function searchUsersAction() {
  if (!userSearchQuery.value.trim()) {
    userSearchResults.value = [];
    return;
  }
  const data = await searchUsers({ username: userSearchQuery.value.trim() });
  userSearchResults.value = data.filter((user) => user.id !== currentUser.value?.id);
}

function toggleSelectedMember(userId: string) {
  if (selectedMemberIds.value.includes(userId)) {
    selectedMemberIds.value = selectedMemberIds.value.filter((id) => id !== userId);
    return;
  }
  selectedMemberIds.value = [...selectedMemberIds.value, userId];
}

function clearSelectedMembers() {
  selectedMemberIds.value = [];
}

async function createChatGroup() {
  const memberIds = [...selectedMemberIds.value];
  if (createGroupForm.type === "private" && memberIds.length !== 1) {
    notify("私聊只需要选 1 个成员");
    return;
  }
  if (createGroupForm.type === "group" && !createGroupForm.name.trim()) {
    notify("请输入群名称");
    return;
  }
  const group = await createGroup({
    name: createGroupForm.type === "private" ? "" : createGroupForm.name.trim(),
    member_ids: memberIds,
    type: createGroupForm.type,
  });
  notify("创建成功");
  showCreateGroup.value = false;
  createGroupForm.name = "";
  createGroupForm.type = "group";
  clearSelectedMembers();
  await loadGroups();
  await openGroup(group.id);
}

async function openGroup(groupId: string) {
  selectedGroupId.value = groupId;
  selectedGroup.value = groups.value.find((g) => g.id === groupId) || (await getGroupDetail(groupId));
  try {
    const payload = await getGroupMessages({ id: groupId, page: 1, page_size: 50 });
    currentMessages.value = (payload.items || []).map(normalizeMessage);
    onlineUsers.value = [];
  } catch {
    currentMessages.value = [];
  }
  try {
    await markAllRead(groupId);
  } catch {
    // ignore
  }
  await loadGroups();
  await loadOnlineUsers(groupId);
  scrollToBottom();
}

async function loadGroupMessages(groupId: string) {
  const payload = await getGroupMessages({ id: groupId, page: 1, page_size: 50 });
  currentMessages.value = (payload.items || []).map(normalizeMessage);
  scrollToBottom();
}

async function loadOnlineUsers(groupId: string) {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    return;
  }
  ws.value.send(JSON.stringify({ type: "get_online_users", group_id: groupId }));
}

async function readCurrentGroup() {
  if (!selectedGroupId.value || !currentMessages.value.length) return;
  await markRead({
    group_id: selectedGroupId.value,
    message_ids: currentMessages.value.map((item) => item.id),
  });
  await loadGroups();
}

function applyIncomingMessage(message: Message) {
  const normalized = normalizeMessage(message);
  const list = groups.value.find((item) => item.id === normalized.group_id);
  if (!currentMessages.value.some((item) => item.id === normalized.id)) {
    currentMessages.value = [...currentMessages.value, normalized];
  }
  if (list && list.id !== selectedGroupId.value) {
    list.unread_count = (list.unread_count || 0) + 1;
  }
  if (list) {
    list.last_message = normalized as unknown as Record<string, unknown>;
  }
  scrollToBottom();
}

function connectWs() {
  if (!token.value) return;
  ws.value?.close();
  ws.value = new WebSocket(`${WS_BASE}/api/chat/ws/${token.value}`);
  wsReady.value = false;

  ws.value.onopen = () => {
    wsReady.value = true;
    notify("WebSocket 已连接");
  };

  ws.value.onclose = () => {
    wsReady.value = false;
  };

  ws.value.onerror = () => {
    notify("WebSocket 连接异常");
  };

  ws.value.onmessage = async (event) => {
    const data = JSON.parse(event.data) as Record<string, unknown>;
    const type = String(data.type || "");
    if (type === "connected") {
      if (data.content && typeof data.content === "object" && "groups" in data.content) {
        const incoming = (data.content as { groups?: Group[] }).groups || [];
        if (incoming.length && !groups.value.length) {
          groups.value = incoming;
          if (incoming[0]) {
            await openGroup(incoming[0].id);
          }
        }
      }
      return;
    }
    if (type === "group_history" && typeof data.group_id === "string") {
      currentMessages.value = ((data.content as Message[]) || []).map(normalizeMessage);
      if (selectedGroupId.value === data.group_id) {
        scrollToBottom();
      }
      return;
    }
    if (type === "message" && data.data) {
      applyIncomingMessage(data.data as Message);
      return;
    }
    if (type === "message_sent") {
      return;
    }
    if (type === "message_revoke" && data.content && typeof data.content === "object") {
      const targetId = String((data.content as Record<string, unknown>).message_id || "");
      currentMessages.value = currentMessages.value.map((item) =>
        item.id === targetId ? { ...item, is_revoke: true } : item,
      );
      return;
    }
    if (type === "online_users" && data.content) {
      onlineUsers.value = (data.content as Array<{ user_id: string; username: string; device_count: number }>) || [];
      return;
    }
    if (type === "groups_updated") {
      await loadGroups();
      return;
    }
    if (type === "refresh_friend_request_count") {
      await loadFriendRequests();
      return;
    }
    if (type === "error") {
      notify(String((data.content as { message?: string })?.message || "发生错误"));
    }
  };
}

function sendWs(payload: Record<string, unknown>) {
  if (ws.value?.readyState !== WebSocket.OPEN) {
    notify("WebSocket 未连接");
    return;
  }
  ws.value.send(JSON.stringify(payload));
}

function sendTextMessage() {
  if (!selectedGroupId.value || !draftMessage.value.trim()) return;
  sendWs({
    type: "text",
    group_id: selectedGroupId.value,
    content: draftMessage.value.trim(),
    at_list: [],
  });
  draftMessage.value = "";
}

async function onGroupFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !selectedGroupId.value) return;
  if (/audio/i.test(file.type)) {
    await uploadGroupMedia(selectedGroupId.value, file);
  } else {
    await uploadGroupFile(selectedGroupId.value, file);
  }
  notify("文件已上传");
  await loadGroupMessages(selectedGroupId.value);
}

async function onAvatarChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !currentUser.value) return;
  const result = await uploadAvatar(file);
  currentUser.value.avatar = result.avatar || result.file_id || currentUser.value.avatar;
  setStoredUser(currentUser.value);
  profileForm.username = currentUser.value.username;
  notify("头像已更新");
}

async function handleLogin() {
  const data = await login(loginForm);
  token.value = data.access_token;
  currentUser.value = data;
  authed.value = true;
  setAuthToken(data.access_token);
  setStoredUser(data);
  profileForm.username = data.username;
  profileForm.phone = data.phone || "";
  notify("登录成功");
  await initSession();
}

async function sendRegisterCode() {
  await sendEmailCode({ email: registerForm.email });
  notify("验证码已发送");
}

async function handleRegister() {
  const data = await register(registerForm);
  notify(`注册成功：${data.username}`);
  authMode.value = "login";
  loginForm.email = registerForm.email;
  loginForm.password = registerForm.password;
}

async function sendResetCode() {
  await resetPasswordCode({ email: resetForm.email });
  notify("重置验证码已发送");
}

async function handleReset() {
  await resetPassword(resetForm);
  notify("密码已重置");
  authMode.value = "login";
}

async function sendFriend(userId: string) {
  await sendFriendRequest(userId);
  notify("好友请求已发送");
  await loadFriendRequests();
}

async function handleFriend(userId: string, action: "accept" | "reject") {
  await handleFriendRequest({ friend_id: userId, action });
  notify(action === "accept" ? "已接受好友请求" : "已拒绝好友请求");
  await Promise.all([loadFriendRequests(), loadFriends()]);
}

async function saveProfile() {
  if (!currentUser.value) return;
  await updateUser(currentUser.value.id, {
    username: profileForm.username.trim() || currentUser.value.username,
    phone: profileForm.phone.trim() || undefined,
  });
  currentUser.value.username = profileForm.username.trim() || currentUser.value.username;
  currentUser.value.phone = profileForm.phone.trim() || null;
  setStoredUser(currentUser.value);
  notify("资料已保存");
}

async function handleLogout() {
  try {
    await revokeToken();
  } catch {
    // ignore
  }
  ws.value?.close();
  ws.value = null;
  wsReady.value = false;
  authed.value = false;
  token.value = "";
  currentUser.value = null;
  setAuthToken(null);
  setStoredUser(null);
  groups.value = [];
  friends.value = [];
  friendRequests.value = [];
  currentMessages.value = [];
}

async function refreshAll() {
  await Promise.all([loadGroups(), loadFriends(), loadFriendRequests()]);
  notify("已刷新");
}

async function leaveCurrentGroup() {
  if (!selectedGroupId.value) return;
  await leaveGroup(selectedGroupId.value);
  notify("已退出群聊");
  selectedGroupId.value = "";
  selectedGroup.value = null;
  await loadGroups();
}

async function dissolveCurrentGroup() {
  if (!selectedGroupId.value) return;
  await dissolveGroup(selectedGroupId.value);
  notify("已解散群聊");
  selectedGroupId.value = "";
  selectedGroup.value = null;
  await loadGroups();
}

async function startPrivateChat(user: User) {
  if (user.id === currentUser.value?.id) {
    notify("不能和自己发起私聊");
    return;
  }

  const group = await createGroup({
    name: "",
    member_ids: [user.id],
    type: "private",
  });

  activeSidebar.value = "groups";
  showCreateGroup.value = false;
  clearSelectedMembers();
  notify("私聊已打开");
  await loadGroups();
  await openGroup(group.id);
}

async function initSession() {
  await Promise.all([loadGroups(), loadFriends(), loadFriendRequests()]);
  connectWs();
}

onMounted(async () => {
  if (token.value && currentUser.value) {
    authed.value = true;
    profileForm.username = currentUser.value.username;
    profileForm.phone = currentUser.value.phone || "";
    await initSession();
  }
});

onBeforeUnmount(() => {
  ws.value?.close();
});
</script>
