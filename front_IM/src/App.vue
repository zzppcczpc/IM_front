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
                <!-- 修改：用可视化成员列表替代原来的 readonly textarea，每个成员显示用户名和删除按钮，更直观 -->
                <div class="field">
                  <label>已选成员（{{ selectedMembers.length }}）</label>
                  <div v-if="selectedMembers.length === 0" class="muted" style="padding: 8px 0">从下方搜索结果中点选</div>
                  <div v-else style="display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 0">
                    <span v-for="m in selectedMembers" :key="m.id" style="display: inline-flex; align-items: center; gap: 4px; background: #e8f0fe; border-radius: 12px; padding: 4px 10px; font-size: 13px">
                      {{ m.username }}
                      <button class="btn ghost" style="padding: 0 4px; font-size: 12px; line-height: 1" @click="toggleSelectedMember(m.id)">✕</button>
                    </span>
                  </div>
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
                @contextmenu="handleGroupContextMenu($event, group)"
              >
                <div class="list-item-head">
                  <strong>{{ group.name || '未命名群' }}</strong>
                  <span v-if="group.unread_count" class="badge">{{ group.unread_count }}</span>
                  <!-- 新增：置顶标识 -->
                  <span v-if="group.is_pinned" class="pin-badge" title="已置顶">📌</span>
                </div>
                <div class="muted">
                  {{ group.type === 'private' ? '私聊' : '群聊' }} · {{ group.id }}
                </div>
              </button>
            </div>

            <!-- 新增：群组右键菜单 -->
            <div
              v-if="groupContextMenu.visible"
              class="context-menu"
              :style="{ left: groupContextMenu.x + 'px', top: groupContextMenu.y + 'px' }"
            >
              <div v-if="groupContextMenu.group?.is_pinned" class="context-menu-item" @click="togglePin(false)">
                取消置顶
              </div>
              <div v-else class="context-menu-item" @click="togglePin(true)">
                置顶会话
              </div>
              <div class="context-menu-item danger" @click="handleClearGroupMessages">
                清空聊天记录
              </div>
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
                    <button class="btn ghost" style="color: #e74c3c" @click="deleteFriend(friend.id)">删除好友</button>
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
                <div v-for="req in pendingFriendRequests" :key="req.user_id + req.request_type" class="list-item">
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
              <div style="text-align: center; margin-bottom: 12px">
                <img :src="avatarUrl(currentUser?.id) + '?v=' + avatarVersion" alt="头像" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover" />
              </div>
              <div class="field-grid">
                <div class="field">
                  <label>用户名</label>
                  <input v-model.trim="profileForm.username" />
                </div>
                <div class="field">
                  <label>邮箱</label>
                  <input :value="currentUser?.email || ''" readonly />
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
                <!-- 输入中提示 -->
                <span v-if="typingUsers.size > 0" class="typing-indicator">
                  {{ Array.from(typingUsers.values()).map(t => t.username).join('、') }} 正在输入...
                </span>
              </div>
              <div class="toolbar">
                <button class="btn ghost" @click="loadGroupMessages(selectedGroup.id)" :disabled="loadingHistory">
                  {{ loadingHistory ? '加载中...' : '历史' }}
                </button>
                <button class="btn ghost" @click="loadOnlineUsers(selectedGroup.id)">在线成员</button>
                <button class="btn ghost" @click="readCurrentGroup">已读</button>
                <button class="btn ghost" @click="handleClearCurrentGroupMessages">清空记录</button>
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
                  :class="{ self: msg.sender_id === currentUser?.id && !msg.is_revoke }"
                  @contextmenu.prevent="showMessageContextMenu($event, msg)"
                >
                  <!-- 撤回消息：居中显示 -->
                  <div v-if="msg.is_revoke" class="message-revoked">
                    {{ msg.sender_id === currentUser?.id ? '你撤回了一条消息' : `${msg.sender_username}撤回了一条消息` }}
                  </div>
                  <!-- 正常消息 -->
                  <div v-else class="message-bubble">
                    <div class="message-meta">
                      <img :src="avatarUrl(msg.sender_id)" alt="" width="20" height="20" style="border-radius: 50%" />
                      <strong>{{ msg.sender_username }}</strong>
                      <span>{{ formatTime(msg.created_at) }}</span>
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
                    <!-- 已读状态显示 -->
                    <div v-if="isMessageRead(msg) !== null" class="message-read-status">
                      <span v-if="isMessageRead(msg)" class="read">已读</span>
                      <span v-else class="unread">未读</span>
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
                  <button v-if="citeMessage" class="btn ghost" @click="citeMessage = null">取消引用</button>
                </div>
                <div class="muted">回车发送，Shift+回车换行</div>
              </div>
              <!-- 引用消息提示 -->
              <div v-if="citeMessage" class="cite-preview">
                <span class="muted">引用：</span>
                <span>{{ citeMessage.sender_username }}: {{ renderContent(citeMessage.content) }}</span>
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

  <!-- 消息右键菜单 -->
  <div
    v-if="contextMenu.visible"
    class="context-menu"
    :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
  >
    <button class="context-menu-item" @click="handleContextAction('copy')">
      复制
    </button>
    <button class="context-menu-item" @click="handleContextAction('quote')">
      引用
    </button>
    <!-- 撤回按钮：仅自己发送且未超时的消息可撤回 -->
    <button
      v-if="contextMenu.message?.sender_id === currentUser?.id && !isMessageTimeout(contextMenu.message)"
      class="context-menu-item"
      @click="handleContextAction('revoke')"
    >
      撤回
    </button>
    <!-- 超时消息：显示禁用的撤回按钮 -->
    <button
      v-if="contextMenu.message?.sender_id === currentUser?.id && isMessageTimeout(contextMenu.message)"
      class="context-menu-item disabled"
      disabled
    >
      撤回(超时)
    </button>
    <button class="context-menu-item danger" @click="handleContextAction('delete')">
      删除
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
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
  deleteFriend as apiDeleteFriend,
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
  toggleGroupPin,  // 新增：置顶接口
  clearGroupMessages,  // 新增：清空会话消息接口
} from "./services/api";
import type { AuthMode, FriendRequest, Group, LoginUser, Message, User } from "./types";

const authed = ref(false);
const authMode = ref<AuthMode | "reset">("login");
const currentUser = ref<User | null>(getStoredUser());
const token = ref(getStoredToken());
const wsReady = ref(false);
const loadingHistory = ref(false); // 新增：加载历史消息的状态
const hasMoreHistory = ref(false); // 新增：是否还有更多历史消息
const nextCursor = ref<string | null>(null); // 新增：下一页游标
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

// 输入中状态管理
const typingUsers = ref<Map<string, { userId: string; username: string }>>(new Map());
let typingSendTimer: ReturnType<typeof setTimeout> | null = null;
let lastTypingSendTime = 0;
const TYPING_THROTTLE_MS = 3000; // 3秒节流
const TYPING_STOP_DELAY_MS = 5000; // 5秒无输入发送停止
const showCreateGroup = ref(false);
const toast = ref("");
const messageScrollRef = ref<HTMLElement | null>(null);

// 消息右键菜单相关
const contextMenu = ref<{
  visible: boolean;
  x: number;
  y: number;
  message: Message | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  message: null,
});
const citeMessage = ref<Message | null>(null); // 引用的消息

// 新增：群组右键菜单相关（用于置顶功能）
const groupContextMenu = ref<{
  visible: boolean;
  x: number;
  y: number;
  group: Group | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  group: null,
});

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

// 新增（根据选中的 member ID 从搜索结果和好友列表中匹配出完整用户信息，用于在创建群表单中显示成员名称，之前只有 ID 列表没有名称，用户不知道选了谁）
const selectedMembers = computed(() => {
  const allUsers = [...userSearchResults.value, ...friends.value];
  return selectedMemberIds.value
    .map((id) => allUsers.find((u) => u.id === id))
    .filter(Boolean) as User[];
});

// 新增（只显示状态为 pending 的好友请求，已接受/已拒绝的不再显示在列表里）
const pendingFriendRequests = computed(() => {
  return friendRequests.value.filter((req) => req.status === "pending");
});

function notify(message: string) {
  toast.value = message;
  window.clearTimeout((notify as unknown as { t?: number }).t);
  (notify as unknown as { t?: number }).t = window.setTimeout(() => {
    toast.value = "";
  }, 2600);
}

// 监听输入框变化，发送输入中状态
watch(draftMessage, (newValue) => {
  if (!selectedGroupId.value || selectedGroup.value?.type !== "private") return;
  if (!currentUser.value) return;

  // 输入框有内容
  if (newValue.trim()) {
    const now = Date.now();
    // 节流：距离上次发送超过3秒才发送
    if (now - lastTypingSendTime > TYPING_THROTTLE_MS) {
      sendWs({
        type: "typing",
        group_id: selectedGroupId.value,
        is_typing: true,
      });
      lastTypingSendTime = now;
    }

    // 重置停止输入定时器
    if (typingSendTimer) clearTimeout(typingSendTimer);
    typingSendTimer = setTimeout(() => {
      if (selectedGroupId.value) {
        sendWs({
          type: "typing",
          group_id: selectedGroupId.value,
          is_typing: false,
        });
      }
    }, TYPING_STOP_DELAY_MS);
  } else {
    // 输入框清空，立即发送停止
    if (typingSendTimer) clearTimeout(typingSendTimer);
    sendWs({
      type: "typing",
      group_id: selectedGroupId.value,
      is_typing: false,
    });
  }
});

function formatTime(input?: string | null) {
  if (!input) return "";
  return new Date(input).toLocaleString("zh-CN", { hour12: false });
}

/**
 * 判断私聊消息是否已读
 * @param msg 消息对象
 * @returns true=已读, false=未读, null=非私聊或不适用
 */
function isMessageRead(msg: Message): boolean | null {
  // 只在私聊中显示已读状态
  if (selectedGroup.value?.type !== "private") {
    return null;
  }

  // 只判断自己发的消息
  if (msg.sender_id !== currentUser.value?.id) {
    return null;
  }

  // read_list 包含对方ID则已读
  const otherMemberId = selectedGroup.value.member_ids.find(id => id !== currentUser.value?.id);
  if (!otherMemberId) {
    return null;
  }

  return msg.read_list.includes(otherMemberId);
}

/**
 * 自动标记私聊消息为已读
 * 场景：打开私聊窗口、收到新消息
 */
async function autoMarkReadInPrivateChat() {
  // 只在私聊中自动标记
  if (selectedGroup.value?.type !== "private") {
    return;
  }

  // 只标记对方发的、自己未读的消息
  const otherUserId = selectedGroup.value.member_ids.find(id => id !== currentUser.value?.id);
  if (!otherUserId) {
    return;
  }

  // 筛选需要标记已读的消息ID
  const unreadMessageIds = currentMessages.value
    .filter(msg =>
      msg.sender_id === otherUserId &&  // 对方发的
      !msg.read_list.includes(currentUser.value!.id)  // 自己未读
    )
    .map(msg => msg.id);

  if (unreadMessageIds.length === 0) {
    return;
  }

  // 发送已读标记
  sendWs({
    type: "mark_read",
    group_id: selectedGroupId.value,
    message_ids: unreadMessageIds,
  });
}

/**
 * 判断消息是否超过撤回时限（2分钟）
 * @param msg 消息对象
 * @returns true: 已超时，不可撤回; false: 未超时，可以撤回
 */
function isMessageTimeout(msg: Message | null): boolean {
  if (!msg || !msg.created_at) return false;
  const createdTime = new Date(msg.created_at).getTime();
  const now = Date.now();
  return now - createdTime > 2 * 60 * 1000; // 超过2分钟
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

// 新增：统一按消息创建时间升序排序，保证聊天区始终是旧消息在上、新消息在下。
function messageTime(message: Message) {
  const time = new Date(message.created_at || "").getTime();
  return Number.isFinite(time) ? time : 0;
}

// 新增：统一的消息去重 + 排序入口，避免历史消息、离线消息、实时消息各自追加导致乱序。
function mergeMessagesByTime(baseMessages: Message[], incomingMessages: Message[]) {
  const merged = new Map<string, Message>();
  for (const message of [...baseMessages, ...incomingMessages].map(normalizeMessage)) {
    merged.set(message.id, message);
  }
  return [...merged.values()].sort((a, b) => messageTime(a) - messageTime(b));
}

// 新增：替换当前会话消息时也强制排序，用于打开群聊和手动刷新历史。
function setCurrentMessages(messages: Message[]) {
  currentMessages.value = mergeMessagesByTime([], messages);
}

// 新增：追加当前会话消息时统一去重排序，用于 WebSocket 实时消息和离线消息。
function mergeCurrentMessages(messages: Message[]) {
  currentMessages.value = mergeMessagesByTime(currentMessages.value, messages);
}

// 新增：群列表里的最后一条消息也按时间取最新，避免离线消息数组不是最新在最后时显示错。
function updateGroupLastMessage(groupId: string, messages: Message[]) {
  const group = groups.value.find((item) => item.id === groupId);
  if (!group || !messages.length) return;
  const sorted = mergeMessagesByTime([], messages);
  const last = sorted[sorted.length - 1];
  if (last) {
    group.last_message = last as unknown as Record<string, unknown>;
  }
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
  const query = userSearchQuery.value.trim();
  // 修改：之前只传 username 字段，现在根据输入内容判断传 email 还是 username，否则输入邮箱搜不到人
  const searchParams = query.includes("@") ? { email: query } : { username: query };
  const data = await searchUsers(searchParams);
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
  sendWs({ type: "refresh_groups" }); // 新增：刷新 WebSocket 群订阅，让后端知道用户加入了新群，否则发消息会报"你不在该群组中"
  await loadGroups();
  await openGroup(group.id);
}

async function openGroup(groupId: string) {
  // 清除之前的输入中状态
  typingUsers.value.clear();
  if (typingSendTimer) {
    clearTimeout(typingSendTimer);
    typingSendTimer = null;
  }

  selectedGroupId.value = groupId;
  selectedGroup.value = groups.value.find((g) => g.id === groupId) || (await getGroupDetail(groupId));
  try {
    const payload = await getGroupMessages({ id: groupId, page: 1, page_size: 50 });
    // 修改：打开群聊时走统一排序入口；删除原来的直接赋值，避免接口顺序影响页面顺序。
    setCurrentMessages(payload.items || []);
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

  // 私聊自动标记已读
  await autoMarkReadInPrivateChat();

  scrollToBottom();
}

async function loadGroupMessages(groupId: string) {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    notify("WebSocket 未连接，无法加载历史消息");
    return;
  }
  loadingHistory.value = true;

  // 构建请求参数
  const payload: { type: string; group_id: string; limit: number; before_id?: string } = {
    type: "get_history",
    group_id: groupId,
    limit: 10,
  };

  // 如果有下一页游标，传递 before_id 继续往前查
  if (hasMoreHistory.value && nextCursor.value) {
    payload.before_id = nextCursor.value;
  }

  ws.value.send(JSON.stringify(payload));
}

async function loadOnlineUsers(groupId: string) {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    notify("WebSocket 未连接，无法获取在线成员"); // 修改：未连接时给用户提示，而不是静默返回
    return;
  }
  ws.value.send(JSON.stringify({ type: "get_online_users", group_id: groupId }));
  notify("正在获取在线成员，请看右侧面板"); // 新增：提示用户去右侧面板查看结果
}

async function readCurrentGroup() {
  if (!selectedGroupId.value || !currentMessages.value.length) return;
  try {
    await markRead({
      group_id: selectedGroupId.value,
      message_ids: currentMessages.value.map((item) => item.id),
    });
    notify("已标记已读"); // 新增：成功后给用户提示
  } catch {
    notify("标记已读失败"); // 新增：失败时给用户提示
  }
  await loadGroups();
}

function applyIncomingMessage(message: Message) {
  const normalized = normalizeMessage(message);
  const list = groups.value.find((item) => item.id === normalized.group_id);
  if (normalized.group_id === selectedGroupId.value) {
    // 修改：实时消息走统一去重排序；删除原来的直接追加，避免晚到的消息插错位置。
    mergeCurrentMessages([normalized]);

    // 私聊收到新消息时自动标记已读
    if (selectedGroup.value?.type === "private" &&
        normalized.sender_id !== currentUser.value?.id) {
      // 异步发送，不阻塞UI
      setTimeout(() => {
        sendWs({
          type: "mark_read",
          group_id: normalized.group_id,
          message_ids: [normalized.id],
        });
      }, 100);
    }
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
  // 后端路由：/api/chat/ws/{token}（main.py 中 chat.router 的 prefix 是 /api/chat）
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
    // 处理 WebSocket get_history 响应
    if (type === "history" && typeof data.group_id === "string") {
      if (selectedGroupId.value === data.group_id) {
        const items = (data.items as Message[]) || [];
        hasMoreHistory.value = data.has_more === true;
        nextCursor.value = data.next_cursor as string | null;

        // 判断是首次加载还是加载更多
        // 如果 before_id 存在，说明是加载更多（往前翻页），需要插入到现有消息前面
        if (data.before_id) {
          // 加载更多：将更早的消息插入到前面
          currentMessages.value = mergeMessagesByTime(items, currentMessages.value);
        } else {
          // 首次加载：直接替换
          setCurrentMessages(items);
        }

        scrollToBottom();
        loadingHistory.value = false;
        notify(`已加载 ${items.length} 条消息${hasMoreHistory.value ? "，还有更多" : ""}`);
      }
      return;
    }
    if (type === "group_history" && typeof data.group_id === "string") {
      if (selectedGroupId.value === data.group_id) {
        // 修改：只合并当前打开群聊的历史消息；删除原来收到任意群历史就覆盖当前聊天区的逻辑。
        mergeCurrentMessages((data.content as Message[]) || []);
        scrollToBottom();
      }
      return;
    }
    if (type === "offline_messages" && Array.isArray(data.content)) {
      const offlineGroups = data.content as Array<{ group_id: string; messages: Message[] }>;
      for (const group of offlineGroups) {
        const normalizedMessages = (group.messages || []).map(normalizeMessage);
        if (group.group_id === selectedGroupId.value) {
          // 修改：离线消息走统一去重排序；删除原来的手写 filter + sort，避免和历史消息重复/乱序。
          mergeCurrentMessages(normalizedMessages);
          scrollToBottom();
        }
        // 更新群列表的未读数和最新消息
        const g = groups.value.find((item) => item.id === group.group_id);
        if (g) {
          // 修改：未读数按本次离线消息增加，最后一条消息按 created_at 取最新。
          g.unread_count = (g.unread_count || 0) + normalizedMessages.length;
          updateGroupLastMessage(group.group_id, normalizedMessages);
        }
      }
      notify(`收到 ${offlineGroups.reduce((sum, g) => sum + g.messages.length, 0)} 条离线消息`);
      return;
    }
    if (type === "message" && data.data) {
      applyIncomingMessage(data.data as Message);
      return;
    }
    if (type === "message_sent") {
      return;
    }
    // 处理输入中状态
    if (type === "typing" && data.content && typeof data.content === "object") {
      const { user_id, username, is_typing } = data.content as {
        user_id: string;
        username: string;
        is_typing: boolean;
      };

      if (is_typing) {
        typingUsers.value.set(user_id, { userId: user_id, username });
      } else {
        typingUsers.value.delete(user_id);
      }
      return;
    }
    // 处理已读通知
    if (type === "message_read" && data.content && typeof data.content === "object") {
      const groupId = String(data.group_id || "");
      const readerId = String((data.content as { reader_id?: string }).reader_id || "");
      const messageIds = (data.content as { message_ids?: string[] }).message_ids || [];

      // 只处理当前打开的私聊
      if (groupId === selectedGroupId.value) {
        // 更新消息列表中对应消息的 read_list
        for (const msgId of messageIds) {
          const msgIndex = currentMessages.value.findIndex(m => m.id === msgId);
          if (msgIndex !== -1) {
            const msg = currentMessages.value[msgIndex];
            if (!msg.read_list.includes(readerId)) {
              msg.read_list = [...msg.read_list, readerId];
            }
          }
        }
        notify("对方已读消息");
      }
      return;
    }
    if (type === "message_revoke" && data.content && typeof data.content === "object") {
      const targetId = String((data.content as Record<string, unknown>).message_id || "");
      currentMessages.value = currentMessages.value.map((item) =>
        item.id === targetId ? { ...item, is_revoke: true } : item,
      );
      return;
    }
    if (type === "message_deleted" && data.content && typeof data.content === "object") {
      // 收到删除消息响应，从当前消息列表中移除
      const targetId = String((data.content as Record<string, unknown>).message_id || "");
      currentMessages.value = currentMessages.value.filter((item) => item.id !== targetId);
      notify("消息已删除");
      return;
    }
    if (type === "revoke_success") {
      // 撤回成功响应
      notify("消息已撤回");
      return;
    }
    if (type === "online_users" && data.content) {
      onlineUsers.value = (data.content as Array<{ user_id: string; username: string; device_count: number }>) || [];
      notify(`已获取 ${onlineUsers.value.length} 位在线成员，请看右侧面板`); // 新增：收到在线成员数据后提示用户看右侧面板
      return;
    }
    if (type === "groups_updated") {
      sendWs({ type: "refresh_groups" }); // 修改：刷新后端 WebSocket 群订阅，否则发消息会报"你不在该群组中"
      await loadGroups();
      return;
    }
    if (type === "private_chat_opened") {
      // 新增：收到私聊邀请通知，自动打开聊天窗口（解决"第一次聊天要点一下私聊才能继续对话"的问题）
      const gid = String(data.group_id || "");
      const inviterName = String(data.inviter_name || "");
      notify(`${inviterName} 发起了私聊`);
      await loadGroups();
      // 等群列表加载完再打开聊天
      if (groups.value.find((g) => g.id === gid)) {
        await openGroup(gid);
      }
      return;
    }
    if (type === "refresh_friend_request_count") {
      console.log("[WebSocket] 收到好友请求通知，准备刷新好友请求列表");
      await loadFriendRequests();
      return;
    }
    if (type === "group_dissolved") {
      // 收到群解散通知，自动移除该群
      const gid = String(data.group_id || "");
      groups.value = groups.value.filter((g) => g.id !== gid);
      if (selectedGroupId.value === gid) {
        selectedGroupId.value = "";
        selectedGroup.value = null;
        currentMessages.value = [];
      }
      notify("该群已被解散");
      await loadGroups();
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

// 消息右键菜单相关函数
function showMessageContextMenu(event: MouseEvent, msg: Message) {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    message: msg,
  };
}

function hideContextMenu() {
  contextMenu.value.visible = false;
  contextMenu.value.message = null;
}

function handleContextAction(action: "copy" | "quote" | "revoke" | "delete") {
  const msg = contextMenu.value.message;
  if (!msg) {
    hideContextMenu();
    return;
  }

  switch (action) {
    case "copy":
      // 复制消息内容
      const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
      navigator.clipboard.writeText(content).then(() => {
        notify("已复制到剪贴板");
      }).catch(() => {
        notify("复制失败");
      });
      break;

    case "quote":
      // 引用消息
      citeMessage.value = msg;
      notify("已引用消息，请在输入框中输入回复内容");
      break;

    case "revoke":
      // 撤回消息（只能撤回自己的消息）
      if (msg.sender_id !== currentUser.value?.id) {
        notify("只能撤回自己的消息");
        break;
      }
      // 前端时间校验：超过2分钟不允许撤回
      if (isMessageTimeout(msg)) {
        notify("消息超过两分钟，不可撤回");
        break;
      }
      // 发送撤回请求到后端
      sendWs({
        type: "revoke",
        group_id: selectedGroupId.value,
        message_id: msg.id,
      });
      break;

    case "delete":
      // 删除消息（仅影响当前用户）
      sendWs({
        type: "delete_message",
        group_id: selectedGroupId.value,
        message_id: msg.id,
      });
      notify("消息已删除");
      break;
  }

  hideContextMenu();
}

function sendTextMessage() {
  if (!selectedGroupId.value || !draftMessage.value.trim()) return;
  const payload: Record<string, unknown> = {
    type: "text",
    group_id: selectedGroupId.value,
    content: draftMessage.value.trim(),
    at_list: [],
  };
  // 如果有引用消息，添加 cite 字段
  if (citeMessage.value) {
    payload.cite = citeMessage.value.id;
    citeMessage.value = null; // 发送后清除引用
  }
  sendWs(payload);
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

const avatarVersion = ref(0); // 新增：头像版本号，用于刷新头像缓存

async function onAvatarChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !currentUser.value) return;
  const result = await uploadAvatar(file);
  currentUser.value.avatar = result.avatar || result.file_id || currentUser.value.avatar;
  setStoredUser(currentUser.value);
  profileForm.username = currentUser.value.username;
  avatarVersion.value++; // 新增：版本号+1，强制刷新头像显示（浏览器会缓存同URL的图片）
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

async function deleteFriend(userId: string) {
  await apiDeleteFriend(userId); // 调用后端删除好友接口（双向删除）
  notify("已删除好友");
  await loadFriends();
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

// ==================== 新增：会话置顶功能 ====================

/**
 * 处理群组右键菜单
 * @param event 鼠标事件
 * @param group 群组数据
 */
function handleGroupContextMenu(event: MouseEvent, group: Group) {
  event.preventDefault();
  groupContextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    group: group,
  };
}

/**
 * 隐藏群组右键菜单
 */
function hideGroupContextMenu() {
  groupContextMenu.value.visible = false;
}

/**
 * 切换群组置顶状态
 * @param isPinned true=置顶, false=取消置顶
 */
async function togglePin(isPinned: boolean) {
  const group = groupContextMenu.value.group;
  if (!group) return;

  try {
    await toggleGroupPin(group.id, isPinned);
    notify(isPinned ? "已置顶" : "已取消置顶");
    await loadGroups();  // 刷新群组列表
  } catch (error) {
    notify(isPinned ? "置顶失败" : "取消置顶失败");
  }

  hideGroupContextMenu();
}

/**
 * 清空会话聊天记录（只影响当前用户视角）
 */
async function handleClearGroupMessages() {
  const group = groupContextMenu.value.group;
  if (!group) return;

  // 二次确认
  if (!confirm(`确定要清空"${group.name || '该会话'}"的聊天记录吗？\n\n清空后，您将看不到清空时间之前的消息，但其他用户的聊天记录不受影响。`)) {
    hideGroupContextMenu();
    return;
  }

  try {
    const result = await clearGroupMessages(group.id);
    notify(`会话已清空（${result.cleared_at}）`);

    // 清空当前显示的消息列表
    if (selectedGroupId.value === group.id) {
      currentMessages.value = [];
    }

    // 刷新群组列表
    await loadGroups();
  } catch (error) {
    notify("清空会话失败");
  }

  hideGroupContextMenu();
}

/**
 * 清空当前打开会话的聊天记录（工具栏按钮入口）
 */
async function handleClearCurrentGroupMessages() {
  const group = selectedGroup.value;
  if (!group) return;

  // 二次确认
  if (!confirm(`确定要清空"${group.name || '该会话'}"的聊天记录吗？\n\n清空后，您将看不到清空时间之前的消息，但其他用户的聊天记录不受影响。`)) {
    return;
  }

  try {
    const result = await clearGroupMessages(group.id);
    notify(`会话已清空（${result.cleared_at}）`);

    // 清空当前显示的消息列表
    currentMessages.value = [];

    // 刷新群组列表
    await loadGroups();
  } catch (error) {
    notify("清空会话失败");
  }
}

/**
 * 隐藏所有右键菜单（用于点击其他地方关闭菜单）
 */
function hideAllContextMenus() {
  hideContextMenu();
  hideGroupContextMenu();
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

  // 修改：直接用创建返回的群数据打开聊天，不依赖 loadGroups 的结果（避免竞态条件导致列表为空）
  activeSidebar.value = "groups";
  showCreateGroup.value = false;
  clearSelectedMembers();
  sendWs({ type: "refresh_groups" }); // 刷新 WebSocket 订阅，确保后续能收到该群的消息

  // 新增：手动把新群加入群列表，这样左侧 sidebar 能立刻显示
  const newGroup = { ...group, unread_count: 0, is_dissolved: false } as unknown as Group;
  if (!groups.value.find((g) => g.id === newGroup.id)) {
    groups.value = [newGroup, ...groups.value];
  }

  selectedGroupId.value = newGroup.id;
  selectedGroup.value = newGroup;
  currentMessages.value = [];
  notify("私聊已打开");
  scrollToBottom();
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
  // 点击其他地方关闭右键菜单
  document.addEventListener("click", hideAllContextMenus);
});

onBeforeUnmount(() => {
  ws.value?.close();
  document.removeEventListener("click", hideAllContextMenus);
});
</script>
