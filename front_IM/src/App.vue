<template>
  <div v-if="!authed" class="auth-shell qq-auth-shell">
    <div class="qq-window">
      <div class="qq-window-actions" aria-hidden="true">
        <span></span>
        <span></span>
      </div>

      <div class="qq-avatar-wrap">
        <div class="qq-avatar">
          <span>IM</span>
        </div>
      </div>

      <div class="qq-auth-panel">
        <div v-if="authMode === 'login'" class="qq-form">
          <div class="qq-input-row">
            <input v-model.trim="loginForm.email" placeholder="&#37038;&#31665;&#36134;&#21495;" autocomplete="username" />
            <button class="qq-drop-btn" type="button" title="&#36134;&#21495;&#21015;&#34920;">
              <ChevronDown :size="24" />
            </button>
          </div>
          <div class="qq-input-row">
            <input v-model.trim="loginForm.password" type="password" placeholder="&#23494;&#30721;" autocomplete="current-password" />
          </div>

          <div class="qq-options-row">
            <label class="qq-check">
              <input v-model="autoLogin" type="checkbox" />
              <span></span>
              &#33258;&#21160;&#30331;&#24405;
            </label>
            <label class="qq-check">
              <input v-model="rememberPassword" type="checkbox" />
              <span></span>
              &#35760;&#20303;&#23494;&#30721;
            </label>
          </div>

          <button class="qq-login-btn" :disabled="!canSubmitLogin" @click="handleLogin">&#30331;&#24405;</button>

          <label class="qq-agreement">
            <input v-model="agreedToTerms" type="checkbox" />
            <span></span>
            &#24050;&#38405;&#35835;&#24182;&#21516;&#24847; <button type="button">&#26381;&#21153;&#21327;&#35758;</button> &#21644; <button type="button">&#38544;&#31169;&#25919;&#31574;</button>
          </label>

          <div class="qq-links">
            <button type="button" @click="notify('\u626b\u7801\u767b\u5f55\u6682\u672a\u63a5\u5165')">&#25195;&#30721;&#30331;&#24405;</button>
            <i></i>
            <button type="button" @click="authMode = 'register'">&#27880;&#20876;&#36134;&#21495;</button>
            <i></i>
            <button type="button" @click="authMode = 'reset'">&#25214;&#22238;&#23494;&#30721;</button>
          </div>

          <button class="qq-backend-link" type="button" @click="refreshBackend">&#26816;&#27979;&#21518;&#31471;</button>
        </div>

        <div v-else-if="authMode === 'register'" class="qq-form qq-secondary-form">
          <h2>&#27880;&#20876;&#36134;&#21495;</h2>
          <input v-model.trim="registerForm.username" placeholder="&#26165;&#31216;" autocomplete="nickname" />
          <input v-model.trim="registerForm.email" placeholder="&#37038;&#31665;" autocomplete="email" />
          <input v-model.trim="registerForm.password" type="password" placeholder="&#23494;&#30721;&#19981;&#23569;&#20110; 6 &#20301;" autocomplete="new-password" />
          <div class="qq-code-row">
            <input v-model.trim="registerForm.verification_code" placeholder="&#39564;&#35777;&#30721;" />
            <button type="button" @click="sendRegisterCode">&#21457;&#36865;&#39564;&#35777;&#30721;</button>
          </div>
          <button class="qq-login-btn" @click="handleRegister">&#27880;&#20876;</button>
          <div class="qq-links compact">
            <button type="button" @click="authMode = 'login'">&#36820;&#22238;&#30331;&#24405;</button>
            <i></i>
            <button type="button" @click="authMode = 'reset'">&#37325;&#32622;&#23494;&#30721;</button>
          </div>
        </div>

        <div v-else class="qq-form qq-secondary-form">
          <h2>&#37325;&#32622;&#23494;&#30721;</h2>
          <input v-model.trim="resetForm.email" placeholder="&#37038;&#31665;" autocomplete="email" />
          <div class="qq-code-row">
            <input v-model.trim="resetForm.verification_code" placeholder="&#39564;&#35777;&#30721;" />
            <button type="button" @click="sendResetCode">&#21457;&#36865;&#39564;&#35777;&#30721;</button>
          </div>
          <input v-model.trim="resetForm.new_password" type="password" placeholder="&#26032;&#23494;&#30721;" autocomplete="new-password" />
          <button class="qq-login-btn" @click="handleReset">&#25552;&#20132;&#37325;&#32622;</button>
          <div class="qq-links compact">
            <button type="button" @click="authMode = 'login'">&#36820;&#22238;&#30331;&#24405;</button>
            <i></i>
            <button type="button" @click="authMode = 'register'">&#27880;&#20876;&#36134;&#21495;</button>
          </div>
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
          <button class="tab-btn" :class="{ active: activeSidebar === 'ai' }" @click="openAIChat">
            <Bot :size="16" /> AI
          </button>
          <button class="tab-btn" :class="{ active: activeSidebar === 'knowledge' }" @click="openKnowledgeBases">
            <BookOpen :size="16" /> 知识库
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

          <div v-else-if="activeSidebar === 'ai'" class="small-grid">
            <div class="panel-card">
              <div class="panel-title">
                <span>AI 对话</span>
              </div>
              <div class="small-grid">
                <button class="btn primary" @click="focusAIInput">打开对话</button>
                <button class="btn ghost" @click="clearAIChat" :disabled="aiMessages.length === 0 || aiLoading">清空对话</button>
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-title">
                <span>平台 AI</span>
                <button class="btn ghost" @click="loadAIProviderState" :disabled="aiModelsLoading">刷新状态</button>
              </div>
              <div class="small-grid">
                <div>服务提供方：{{ aiProviderConfig?.provider || '未配置' }}</div>
                <div>当前模型：{{ selectedAIModelName || '未配置' }}</div>
                <div>服务状态：{{ aiProviderConfig?.key_configured ? '已配置，可直接使用' : '未配置，请联系管理员' }}</div>
              </div>
              <div class="muted" style="margin-top: 12px">
                AI 接口和模型由平台统一配置，用户无需填写 API Key 或 Base URL。
              </div>
            </div>
          </div>

          <div v-else-if="activeSidebar === 'knowledge'" class="small-grid">
            <div class="panel-card">
              <div class="panel-title">
                <span>知识库</span>
                <button class="btn ghost" @click="loadKnowledgeBases" :disabled="knowledgeBaseLoading">
                  {{ knowledgeBaseLoading ? '加载中...' : '刷新' }}
                </button>
              </div>
              <button class="btn primary" @click="startCreateKnowledgeBase">新建知识库</button>
            </div>
            <div class="list">
              <div v-for="item in knowledgeBases" :key="item.id" class="list-item">
                <div class="list-item-head">
                  <strong>{{ item.name }}</strong>
                  <span class="muted">{{ item.file_count }} 个文件</span>
                </div>
                <div class="muted">{{ item.description || '暂无描述' }}</div>
                <div class="toolbar">
                  <button class="btn primary" @click="openKnowledgeBase(item)">打开</button>
                  <button class="btn ghost" @click="startEditKnowledgeBase(item)">编辑</button>
                  <button class="btn danger" @click="removeKnowledgeBase(item)">删除</button>
                </div>
              </div>
              <div v-if="!knowledgeBaseLoading && knowledgeBases.length === 0" class="empty-state">
                <span class="muted">还没有知识库</span>
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
        <div v-if="activeSidebar === 'ai'" class="ai-chat-card">
          <section class="ai-chat-main">
            <div class="chat-head ai-chat-head">
              <div class="chat-title">
                <strong>AI 对话</strong>
                <span class="muted">{{ aiMessages.length }} 条消息</span>
              </div>
              <div class="toolbar">
                <span class="muted">平台模型：{{ selectedAIModelName || '未配置' }}</span>
                <button class="btn ghost" @click="clearAIChat" :disabled="aiMessages.length === 0 || aiLoading">清空</button>
              </div>
            </div>

            <div ref="aiScrollRef" class="chat-body ai-chat-body">
              <div v-if="aiMessages.length === 0" class="ai-empty">
                <Bot :size="42" />
                <strong>开始新的 AI 对话</strong>
              </div>
              <div v-else class="message-list ai-message-list">
                <div
                  v-for="message in aiMessages"
                  :key="message.id"
                  class="message-row ai-message-row"
                  :class="{ self: message.role === 'user' }"
                >
                  <div class="message-frame">
                    <div class="message-avatar ai-avatar">
                      {{ message.role === 'user' ? '我' : 'AI' }}
                    </div>
                    <div class="message-stack">
                      <div class="message-meta">
                        <strong>{{ message.role === 'user' ? currentUser?.username || '我' : message.model || 'AI 助手' }}</strong>
                        <span>{{ formatTime(message.created_at) }}</span>
                      </div>
                      <div class="message-bubble">
                        <div class="message-content">{{ message.content }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="aiLoading" class="message-row ai-message-row">
                  <div class="message-frame">
                    <div class="message-avatar ai-avatar">AI</div>
                    <div class="message-stack">
                      <div class="message-meta"><strong>AI 助手</strong></div>
                      <div class="message-bubble">
                        <div class="message-content">正在生成...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="composer ai-composer">
              <div class="composer-row">
                <textarea
                  ref="aiInputRef"
                  v-model="aiDraft"
                  placeholder="问 AI 一个问题..."
                  :disabled="aiLoading"
                  @keydown.enter.exact.prevent="sendAIMessage"
                  @keydown.enter.shift.stop
                />
                <div class="composer-buttons">
                  <button class="btn primary" :disabled="aiLoading || !aiDraft.trim()" @click="sendAIMessage">
                    <SendHorizontal :size="16" /> {{ aiLoading ? '生成中' : '发送' }}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div v-else-if="activeSidebar === 'knowledge'" class="panel-card knowledge-main-card">
          <div class="chat-head">
            <div class="chat-title">
              <strong>我的知识库</strong>
              <span class="muted">当前阶段管理知识库元数据</span>
            </div>
            <button class="btn primary" @click="startCreateKnowledgeBase">新建知识库</button>
          </div>
          <div v-if="knowledgeBaseEditorVisible" class="knowledge-editor">
            <div class="field">
              <label>名称</label>
              <input v-model.trim="knowledgeBaseForm.name" maxlength="120" placeholder="例如：产品资料库" />
            </div>
            <div class="field">
              <label>描述</label>
              <textarea v-model="knowledgeBaseForm.description" maxlength="2000" rows="4" placeholder="描述这个知识库存放的资料"></textarea>
            </div>
            <div class="toolbar">
              <button class="btn primary" :disabled="knowledgeBaseSaving" @click="saveKnowledgeBase">
                {{ knowledgeBaseSaving ? '保存中...' : '保存' }}
              </button>
              <button class="btn ghost" :disabled="knowledgeBaseSaving" @click="cancelKnowledgeBaseEdit">取消</button>
            </div>
          </div>
          <div v-else-if="selectedKnowledgeBaseId" class="knowledge-file-panel">
            <div class="chat-head">
              <div class="chat-title">
                <strong>{{ selectedKnowledgeBase?.name }}</strong>
                <span class="muted">{{ selectedKnowledgeBase?.description || '暂无描述' }}</span>
              </div>
              <div class="toolbar">
                <label class="btn primary">
                  选择文件
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.docx,.pptx,.xlsx,.csv,.txt,.md"
                    @change="onKnowledgeBaseFileChange"
                  />
                </label>
                <button class="btn ghost" @click="loadKnowledgeBaseFiles(selectedKnowledgeBaseId)" :disabled="knowledgeBaseFilesLoading">
                  {{ knowledgeBaseFilesLoading ? '刷新中...' : '刷新状态' }}
                </button>
                <button class="btn ghost" @click="closeKnowledgeBase">返回列表</button>
              </div>
            </div>
            <div class="muted knowledge-upload-hint">
              支持 PDF、DOCX、PPTX、XLSX、CSV、TXT、MD，单个文件不超过 100MB。
            </div>
            <div class="knowledge-search-panel">
              <input
                v-model.trim="knowledgeSearchQuery"
                placeholder="输入问题，检索这个知识库里的相关片段"
                @keydown.enter.prevent="runKnowledgeSearch"
              />
              <button class="btn primary" :disabled="knowledgeSearchLoading || !knowledgeSearchQuery" @click="runKnowledgeSearch">
                {{ knowledgeSearchLoading ? '检索中...' : '检索' }}
              </button>
            </div>
            <div v-if="knowledgeSearchResults.length" class="knowledge-search-results">
              <div v-for="item in knowledgeSearchResults" :key="item.chunk_id" class="knowledge-search-item">
                <div class="list-item-head">
                  <strong>{{ item.filename || '未知文件' }}</strong>
                  <span class="muted">
                    {{ item.reranked ? 'Reranker' : (item.retrieval || 'hybrid') }}
                    · {{ item.reranked ? `重排 ${item.rerank_score?.toFixed(4)}` : `RRF ${(item.rrf_score || item.score).toFixed(4)}` }}
                  </span>
                </div>
                <div class="muted">
                  Chunk {{ item.chunk_index + 1 }}
                  · BM25排名 {{ item.retrieval_ranks?.bm25 || '-' }}
                  · Dense排名 {{ item.retrieval_ranks?.dense || '-' }}
                </div>
                <div class="knowledge-search-content">{{ item.content }}</div>
              </div>
            </div>
            <div v-if="knowledgeBaseFileUploading" class="muted">文件上传中...</div>
            <div v-if="knowledgeBaseFilesLoading && !knowledgeBaseFiles.length" class="muted">正在读取文件列表...</div>
            <div v-else-if="knowledgeBaseFiles.length" class="list">
              <div v-for="file in knowledgeBaseFiles" :key="file.id" class="list-item">
                <div class="list-item-head">
                  <strong>{{ file.file_name }}</strong>
                  <span class="badge" :class="`file-status-${file.status}`">{{ knowledgeBaseFileStatusLabel(file.status) }}</span>
                </div>
                <div class="muted">
                  {{ formatFileSize(file.file_size) }} · {{ file.chunk_count || 0 }} 个 Chunk · {{ formatTime(file.created_at) }}
                </div>
                <div v-if="file.error_message" class="ai-message-error">{{ file.error_message }}</div>
                <div v-if="file.vector_error_message" class="ai-message-error">
                  向量化：{{ file.vector_error_message }}
                </div>
                <div class="toolbar">
                  <button
                    v-if="file.status === 'failed'"
                    class="btn ghost"
                    @click="retryKnowledgeBaseFile(file)"
                  >
                    重新解析
                  </button>
                  <button
                    v-if="file.vector_error_message && file.chunk_count"
                    class="btn ghost"
                    @click="retryKnowledgeBaseVectorization(file)"
                  >
                    重新向量化
                  </button>
                  <span v-if="file.status === 'success'" class="muted">
                    已提取 {{ file.parse_metadata?.text_length || 0 }} 个字符，生成 {{ file.chunk_count || 0 }} 个 Chunk
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <BookOpen :size="34" />
              <span class="muted">这个知识库还没有文件</span>
            </div>
          </div>
          <div v-else-if="knowledgeBases.length" class="small-grid knowledge-detail-list">
            <div v-for="item in knowledgeBases" :key="item.id" class="panel-card">
              <div class="panel-title">
                <strong>{{ item.name }}</strong>
                <span class="muted">{{ item.file_count }} 个文件</span>
              </div>
              <p class="muted">{{ item.description || '暂无描述' }}</p>
              <div class="toolbar">
                <button class="btn primary" @click="openKnowledgeBase(item)">打开</button>
                <button class="btn ghost" @click="startEditKnowledgeBase(item)">编辑信息</button>
                <button class="btn danger" @click="removeKnowledgeBase(item)">删除知识库</button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <BookOpen :size="42" />
            <strong>还没有知识库</strong>
            <span class="muted">先创建一个知识库，后续可以上传文件供 AI 使用。</span>
          </div>
        </div>

        <div v-else-if="selectedGroup" class="chat-card" :class="selectedGroup.type === 'private' ? 'is-private-chat' : 'is-group-chat'">
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
                <button class="btn ghost" @click="openSearchPanel">搜索</button>
                <button
                  v-if="selectedGroup.type !== 'private'"
                  class="btn ghost"
                  :class="{ active: showChatHistoryQAPanel }"
                  @click="toggleChatHistoryQAPanel"
                >
                  <Bot :size="16" /> 历史问答
                </button>
                <button class="btn ghost" @click="loadOnlineUsers(selectedGroup.id)">在线成员</button>
                <button class="btn ghost" @click="readCurrentGroup">已读</button>
                <button class="btn ghost" @click="handleClearCurrentGroupMessages">清空记录</button>
                <button v-if="selectedGroup.owner_id === currentUser?.id" class="btn danger" @click="dissolveCurrentGroup">解散</button>
                <button v-else class="btn danger" @click="leaveCurrentGroup">退出</button>
              </div>
            </div>

            <div v-if="showChatHistoryQAPanel && selectedGroup.type !== 'private'" class="chat-history-qa-panel">
              <div class="chat-history-qa-head">
                <div>
                  <strong>历史 AI 问答</strong>
                  <span class="muted">检索这个群里以前成功完成的 AI 问答</span>
                </div>
                <span class="muted">{{ chatHistoryQAResults.length }} 条结果</span>
              </div>
              <div class="knowledge-search-panel">
                <input
                  v-model.trim="chatHistoryQAQuery"
                  placeholder="例如：客户端怎么安装？"
                  @keyup.enter="searchChatHistoryQAAction"
                />
                <button
                  class="btn primary"
                  :disabled="chatHistoryQALoading || !chatHistoryQAQuery"
                  @click="searchChatHistoryQAAction"
                >
                  {{ chatHistoryQALoading ? '检索中...' : '检索' }}
                </button>
              </div>
              <div v-if="chatHistoryQAResults.length" class="chat-history-qa-results">
                <div v-for="item in chatHistoryQAResults" :key="item.qa_id" class="chat-history-qa-item">
                  <div class="chat-history-qa-meta">
                    <span>
                      {{ item.reranked ? 'Reranker' : (item.retrieval || 'hybrid') }}
                      · {{ item.reranked ? `重排 ${item.rerank_score?.toFixed(4)}` : `RRF ${(item.rrf_score || item.score).toFixed(4)}` }}
                      · BM25 {{ item.retrieval_ranks?.bm25 || '-' }}
                      · Dense {{ item.retrieval_ranks?.dense || '-' }}
                    </span>
                  </div>
                  <div class="chat-history-qa-question">问：{{ item.question }}</div>
                  <div class="chat-history-qa-answer">答：{{ item.answer }}</div>
                </div>
              </div>
              <div v-else-if="!chatHistoryQALoading" class="muted chat-history-qa-empty">
                输入问题后检索历史 AI 问答。
              </div>
            </div>

            <div ref="messageScrollRef" class="chat-body" @scroll.passive="handleMessageScroll">
              <div class="message-list">
                <div
                  v-for="msg in currentMessages"
                  :key="msg.id"
                  :data-message-id="msg.id"
                  class="message-row"
                  :class="{
                    self: msg.sender_id === currentUser?.id && !msg.is_revoke,
                    'ai-message-row': msg.is_AI,
                    highlighted: highlightedMessageId === msg.id,
                    'multi-select-mode': isMultiSelectMode,
                    'selected': isMultiSelectMode && isMessageSelected(msg.id)
                  }"
                  @contextmenu.prevent="showMessageContextMenu($event, msg)"
                  @click="isMultiSelectMode && !msg.is_revoke && toggleMessageSelection(msg)"
                >
                  <!-- 多选复选框 -->
                  <div v-if="isMultiSelectMode && !msg.is_revoke" class="message-checkbox">
                    <input
                      type="checkbox"
                      :checked="isMessageSelected(msg.id)"
                      @click.stop
                      @change="toggleMessageSelection(msg)"
                    />
                  </div>
                  <!-- 撤回消息：居中显示 -->
                  <div v-if="msg.is_revoke" class="message-revoked">
                    {{ msg.sender_id === currentUser?.id ? '你撤回了一条消息' : `${msg.sender_username}撤回了一条消息` }}
                  </div>
                  <!-- 正常消息 -->
                  <div v-else class="message-frame">
                    <div v-if="msg.is_AI" class="message-avatar ai-message-avatar" aria-label="AI消息">
                      <Bot :size="20" />
                    </div>
                    <img v-else class="message-avatar" :src="avatarUrl(msg.sender_id)" alt="" />
                    <div class="message-stack">
                      <div class="message-meta">
                        <strong>{{ msg.is_AI ? (msg.model_name || 'AI助手') : msg.sender_username }}</strong>
                        <span v-if="msg.is_AI" class="ai-message-badge">AI</span>
                        <span>{{ formatTime(msg.created_at) }}</span>
                        <span v-if="msg.is_deleted">&#24050;&#21024;&#38500;</span>
                      </div>
                      <div class="message-bubble">
                    <!-- 引用消息显示 -->
                    <div v-if="msg.cite" class="message-cite" @click="scrollToMessage(msg.cite.id)">
                      <div class="cite-line"></div>
                      <div class="cite-content">
                        <div class="cite-sender">{{ msg.cite.sender_username }}</div>
                        <div class="cite-text">{{ renderContent(msg.cite.content) }}</div>
                      </div>
                    </div>
                    <div class="message-content">
                      <template v-if="isImageMessage(msg)">
                        <a :href="downloadUrlForMessage(msg)" target="_blank" rel="noreferrer">
                          <img :src="downloadUrlForMessage(msg)" alt="image" />
                        </a>
                      </template>
                      <template v-else-if="isVideoMessage(msg)">
                        <div class="video-message">
                          <video
                            :src="downloadUrlForMessage(msg)"
                            controls
                            preload="metadata"
                            style="max-width: 100%; max-height: 300px; border-radius: 8px;"
                          ></video>
                        </div>
                      </template>
                      <template v-else-if="isAudioMessage(msg)">
                        <div class="custom-audio-player">
                          <audio
                            ref="audioElements"
                            :src="downloadUrlForMessage(msg)"
                            :data-message-id="msg.id"
                            @loadedmetadata="onAudioLoaded(msg.id, $event)"
                            @timeupdate="onAudioTimeUpdate(msg.id, $event)"
                            @play="onAudioPlay(msg.id)"
                            @pause="onAudioPause(msg.id)"
                            @ended="onAudioEnded(msg.id)"
                          ></audio>
                          <button class="audio-play-btn" @click="toggleAudioPlay(msg.id)">
                            {{ getAudioPlayerState(msg.id)?.playing ? '⏸' : '▶' }}
                          </button>
                          <div class="audio-progress-bar" @click="seekAudio(msg.id, $event)">
                            <div
                              class="audio-progress-fill"
                              :style="{ width: getAudioProgress(msg.id) + '%' }"
                            ></div>
                          </div>
                          <div class="audio-time">
                            <template v-if="getAudioPlayerState(msg.id)?.playing">
                              {{ formatAudioTime(getAudioPlayerState(msg.id)?.currentTime || 0) }} / {{ formatAudioTime(getAudioPlayerState(msg.id)?.duration || getAudioDuration(msg)) }}
                            </template>
                            <template v-else>
                              {{ formatAudioTime(getAudioPlayerState(msg.id)?.duration || getAudioDuration(msg)) }}
                            </template>
                          </div>
                        </div>
                      </template>
                      <template v-else-if="isAudioFileMessage(msg)">
                        <div class="audio-file-message">
                          <div class="custom-audio-player audio-file-player">
                            <audio
                              ref="audioElements"
                              :src="downloadUrlForMessage(msg)"
                              :data-message-id="msg.id"
                              @loadedmetadata="onAudioLoaded(msg.id, $event)"
                              @timeupdate="onAudioTimeUpdate(msg.id, $event)"
                              @play="onAudioPlay(msg.id)"
                              @pause="onAudioPause(msg.id)"
                              @ended="onAudioEnded(msg.id)"
                            ></audio>
                            <button class="audio-play-btn" @click="toggleAudioPlay(msg.id)">
                              {{ getAudioPlayerState(msg.id)?.playing ? '' : '▶' }}
                            </button>
                            <div class="audio-file-details">
                              <div class="audio-file-name-row">
                                <span class="audio-file-icon">🎵</span>
                                <span class="audio-file-name">{{ getFileName(msg) }}</span>
                              </div>
                              <div class="audio-file-progress-row">
                                <div class="audio-progress-bar" @click="seekAudio(msg.id, $event)">
                                  <div
                                    class="audio-progress-fill"
                                    :style="{ width: getAudioProgress(msg.id) + '%' }"
                                  ></div>
                                </div>
                                <div class="audio-time">
                                  <template v-if="getAudioPlayerState(msg.id)?.playing">
                                    {{ formatAudioTime(getAudioPlayerState(msg.id)?.currentTime || 0) }} / {{ formatAudioTime(getAudioPlayerState(msg.id)?.duration || getAudioDuration(msg)) }}
                                  </template>
                                  <template v-else>
                                    {{ formatAudioTime(getAudioPlayerState(msg.id)?.duration || getAudioDuration(msg)) }}
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-else-if="isFileMessage(msg)">
                        <a :href="downloadUrlForMessage(msg)" target="_blank" rel="noreferrer">
                          {{ fileNameOf(msg) }}
                        </a>
                      </template>
                      <template v-else-if="msg.is_AI && msg.is_streaming && !renderContent(msg.content)">
                        正在生成...
                      </template>
                      <template v-else>
                        {{ renderContent(msg.content) }}
                      </template>
                    </div>
                    <div v-if="msg.is_AI && msg.is_streaming" class="ai-streaming-status">AI 正在生成...</div>
                    <div v-else-if="msg.is_AI && msg.stop" class="ai-streaming-status">已停止生成</div>
                    <div v-if="msg.is_AI && msg.error_message" class="ai-message-error">{{ msg.error_message }}</div>
                    <!-- 已读状态显示 -->
                    <div v-if="isMessageRead(msg) !== null" class="message-read-status">
                      <span v-if="isMessageRead(msg)" class="read">已读</span>
                      <span v-else class="unread">未读</span>
                    </div>
                      </div>
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
                  <button
                    v-if="selectedGroup.type !== 'private'"
                    class="btn ghost"
                    :class="{ active: aiTriggerEnabled }"
                    @click="toggleAITrigger"
                  >
                    <Bot :size="16" />
                    {{ aiTriggerEnabled ? '关闭AI回复' : '让AI回复' }}
                  </button>
                  <button
                    v-if="selectedGroup.type !== 'private' && currentStreamingAIMessage"
                    class="btn danger"
                    :disabled="stoppingAIMessage"
                    @click="stopCurrentAIMessage"
                  >
                    <Square :size="15" />
                    {{ stoppingAIMessage ? '停止中...' : '停止AI生成' }}
                  </button>
                  <span v-if="aiTriggerEnabled" class="muted ai-trigger-model">
                    模型：{{ selectedAIModelName || '未选择' }}
                  </span>
                  <!-- 多选模式切换 -->
                  <button
                    class="btn ghost"
                    :class="{ active: isMultiSelectMode }"
                    @click="toggleMultiSelectMode"
                  >
                    {{ isMultiSelectMode ? '取消多选' : '多选' }}
                  </button>
                  <button v-if="citeMessage" class="btn ghost" @click="citeMessage = null">取消引用</button>
                  <!-- 多选时显示转发按钮 -->
                  <button
                    v-if="isMultiSelectMode && selectedMessages.length > 0"
                    class="btn primary"
                    @click="batchForward"
                  >
                    转发 ({{ selectedMessages.length }})
                  </button>
                </div>
                <div class="muted">
                  {{ isMultiSelectMode ? '点击消息进行选择，然后点击"转发"按钮' : '回车发送，Shift+回车换行' }}
                </div>
              </div>
              <!-- 引用消息提示 -->
              <div v-if="citeMessage" class="cite-preview">
                <span class="muted">引用：</span>
                <span>{{ citeMessage.sender_username }}: {{ renderContent(citeMessage.content) }}</span>
              </div>

              <!-- 录音状态显示 -->
              <div v-if="isRecording" class="recording-indicator">
                <div class="recording-status">
                  <span class="recording-dot"></span>
                  <span class="recording-time">正在录音 {{ formatDuration(recordingDuration) }}</span>
                </div>
                <div class="recording-actions">
                  <button class="btn ghost" @click="cancelRecording">取消</button>
                  <button class="btn primary" @click="stopRecording">
                    <SendHorizontal :size="16" /> 发送
                  </button>
                </div>
              </div>

              <div class="composer-row">
                <textarea
                  v-model="draftMessage"
                  placeholder="输入消息..."
                  @keydown.enter.exact.prevent="sendTextMessage"
                  @keydown.enter.shift.stop
                  :disabled="isRecording"
                />
                <div class="composer-buttons">
                  <button
                    class="btn ghost"
                    :class="{ active: isRecording }"
                    @click="isRecording ? stopRecording() : startRecording()"
                    :title="isRecording ? '停止录音' : '开始录音'"
                  >
                    <Mic :size="16" />
                  </button>
                  <button class="btn primary" @click="sendTextMessage" :disabled="isRecording">
                    <SendHorizontal :size="16" /> 发送
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside v-if="selectedGroup.type !== 'private'" class="right-rail">
            <div class="hint-card announcement-card">
              <div class="panel-title">
                <span>群公告</span>
                <button v-if="canEditAnnouncement" class="btn ghost small" @click="openAnnouncementEditor()">
                  发布
                </button>
              </div>
              <div v-if="announcements.length === 0" class="announcement-empty muted">
                暂无公告
              </div>
              <div v-else class="announcement-list">
                <div v-for="announcement in announcements" :key="announcement.id" class="announcement-item">
                  <div class="announcement-content">{{ announcement.content }}</div>
                  <div class="announcement-meta">
                    <span>{{ announcement.updated_by_username || announcement.created_by_username || '未知用户' }}</span>
                    <span>{{ formatTime(announcement.updated_at) }}</span>
                  </div>
                  <div v-if="canEditAnnouncement" class="announcement-actions">
                    <button class="btn ghost small" @click="openAnnouncementEditor(announcement)">编辑</button>
                    <button class="btn ghost small danger-text" @click="removeAnnouncement(announcement.id)">删除</button>
                  </div>
                </div>
              </div>
            </div>
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

            <div class="hint-card member-role-card">
              <div class="panel-title">
                <span>群成员</span>
                <div class="member-role-actions">
                  <button
                    v-if="canManageMute"
                    class="btn ghost small"
                    @click="toggleAllMute"
                  >
                    {{ allMuteActive ? '关闭全员禁言' : '全员禁言10分钟' }}
                  </button>
                  <button class="btn ghost small" @click="loadGroupMembers(selectedGroup.id)">刷新</button>
                </div>
              </div>
              <div v-if="allMuteActive" class="mute-tip">
                全员禁言中，截止 {{ formatTime(selectedGroup.all_muted_until) }}
              </div>
              <div class="member-role-list qq-member-list">
                <div
                  v-for="member in selectedGroup.members || []"
                  :key="member.id || member.user_id"
                  class="member-role-item"
                >
                  <div>
                    <strong>{{ member.username }}</strong>
                    <span class="role-badge" :class="`role-${member.role || 'member'}`">
                      {{ roleLabel(member.role) }}
                    </span>
                    <span v-if="activeMuteFor(member.id || member.user_id)" class="mute-badge">
                      禁言中
                    </span>
                  </div>
                  <div v-if="activeMuteFor(member.id || member.user_id)" class="mute-tip">
                    截止 {{ formatTime(activeMuteFor(member.id || member.user_id)?.muted_until) }}
                  </div>
                  <div class="member-action-row">
                    <button
                      v-if="canManageMute && canMuteMember(member)"
                      class="btn ghost small"
                      @click="toggleMemberMute(member)"
                    >
                      {{ activeMuteFor(member.id || member.user_id) ? '解除禁言' : '禁言10分钟' }}
                    </button>
                  </div>
                  <div v-if="canManageRoles && member.id !== currentUser?.id && member.user_id !== currentUser?.id">
                    <button
                      v-if="member.role === 'admin'"
                      class="btn ghost small"
                      @click="changeMemberAdmin(member.id || member.user_id || '', false)"
                    >
                      取消管理员
                    </button>
                    <button
                      v-else-if="member.role === 'member'"
                      class="btn ghost small"
                      @click="changeMemberAdmin(member.id || member.user_id || '', true)"
                    >
                      设为管理员
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="hint-card scroll online-card">
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

  <div
    v-if="showAnnouncementEditor"
    class="modal-overlay"
    @click.self="closeAnnouncementEditor"
  >
    <div class="modal-card">
      <div class="modal-header">
        <strong>{{ editingAnnouncementId ? '编辑群公告' : '发布群公告' }}</strong>
        <button class="btn ghost small" @click="closeAnnouncementEditor">关闭</button>
      </div>
      <div class="modal-body">
        <textarea
          v-model="announcementDraft"
          rows="6"
          maxlength="2000"
          placeholder="输入群公告内容"
        ></textarea>
        <div class="muted">{{ announcementDraft.length }}/2000</div>
      </div>
      <div class="modal-footer">
        <button class="btn ghost" @click="closeAnnouncementEditor">取消</button>
        <button class="btn primary" :disabled="savingAnnouncement" @click="saveAnnouncement">
          {{ savingAnnouncement ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>

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
    <button class="context-menu-item" @click="handleContextAction('forward')">
      转发
    </button>
    <button class="context-menu-item" @click="handleContextAction('multiselect')">
      多选
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

  <!-- 转发到群组模态框 -->
  <div
    v-if="showForwardModal"
    class="modal-overlay"
    @click.self="closeForwardModal"
  >
    <div class="modal-card" style="max-width: 500px">
      <div class="modal-header">
        <h3>选择转发目标</h3>
        <button class="btn ghost" @click="closeForwardModal">✕</button>
      </div>
      <div class="modal-body" style="max-height: 400px; overflow-y: auto">
        <div class="muted" style="margin-bottom: 12px">
          已选择 {{ forwardMessages.length }} 条消息，请选择目标群组：
        </div>
        <div class="list">
          <button
            v-for="group in groups"
            :key="group.id"
            class="list-item"
            :class="{ active: selectedForwardGroupId === group.id }"
            @click="selectedForwardGroupId = group.id"
          >
            <div class="list-item-head">
              <strong>{{ group.name || '未命名群' }}</strong>
            </div>
            <div class="muted">
              {{ group.type === 'private' ? '私聊' : '群聊' }}
            </div>
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn ghost" @click="closeForwardModal">取消</button>
        <button
          class="btn primary"
          @click="confirmForward"
          :disabled="!selectedForwardGroupId"
        >
          确认转发
        </button>
      </div>
    </div>
  </div>

  <!-- 消息搜索面板 -->
  <div
    v-if="showSearchPanel"
    class="modal-overlay"
    @click.self="closeSearchPanel"
  >
    <div class="modal-card" style="max-width: 600px; max-height: 80vh; display: flex; flex-direction: column">
      <div class="modal-header">
        <strong>搜索消息</strong>
        <button class="btn ghost small" @click="closeSearchPanel">关闭</button>
      </div>
      <div class="modal-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px">
        <div class="field">
          <label>关键词</label>
          <div class="toolbar">
            <input
              v-model.trim="searchKeyword"
              placeholder="输入搜索关键词（至少2个字符）"
              @keyup.enter="doSearch()"
              style="flex: 1"
            />
            <button class="btn primary" :disabled="searchLoading || searchKeyword.length < 2" @click="doSearch()">
              {{ searchLoading ? '搜索中...' : '搜索' }}
            </button>
          </div>
        </div>

        <div v-if="searchTotal > 0" class="muted" style="text-align: center">
          找到 {{ searchTotal }} 条结果
        </div>

        <div v-if="searchResults.length > 0" class="list" style="flex: 1; overflow-y: auto">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="list-item"
            style="cursor: pointer"
            @click="jumpToMessage(result.id)"
          >
            <div class="list-item-head">
              <strong>{{ result.sender_username }}</strong>
              <span class="muted">{{ formatTime(result.created_at) }}</span>
            </div>
            <div class="search-result-content" v-html="highlightKeyword(result.content)"></div>
          </div>
        </div>

        <div v-else-if="!searchLoading && searchKeyword.length >= 2 && searchTotal === 0" class="muted" style="text-align: center; padding: 20px">
          未找到匹配的消息
        </div>

        <div v-if="searchHasMore" style="text-align: center; padding: 10px">
          <button class="btn ghost" :disabled="searchLoading" @click="loadMoreSearchResults()">
            {{ searchLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {
  Bot,
  BookOpen,
  ChevronDown,
  Clock3,
  Ellipsis,
  Folder,
  Image,
  MessageSquareMore,
  Mic,
  MonitorUp,
  Phone,
  Search,
  SendHorizontal,
  Square,
  UserRound,
  Users,
  Video,
} from "lucide-vue-next";
import {
  API_BASE,
  WS_BASE,
  avatarUrl,
  chatWithAI,
  createGroupAnnouncement,
  createGroup,
  deleteGroupAnnouncement,
  deleteFriend as apiDeleteFriend,
  dissolveGroup,
  downloadFileUrl,
  friendRequestCount,
  getGroupAnnouncements,
  getAIProviderConfig,
  getGroupMembers,
  getFriendRequestList,
  getFriends,
  getGroupMessages,
  getGroups,
  getStoredToken,
  getStoredUser,
  handleFriendRequest,
  leaveGroup,
  login,
  muteAllGroupMembers,
  muteGroupMember,
  queryUsers,
  register,
  resetPassword,
  resetPasswordCode,
  revokeToken,
  searchUsers,
  sendEmailCode,
  sendFriendRequest,
  setAuthToken,
  setGroupAdmin,
  setStoredUser,
  unsetGroupAdmin,
  unmuteAllGroupMembers,
  unmuteGroupMember,
  updateGroupAnnouncement,
  updateUser,
  uploadAvatar,
  uploadGroupFile,
  uploadGroupMedia,
  pingConfirm,
  getGroupDetail,
  markRead,
  toggleGroupPin,  // 新增：置顶接口
  clearGroupMessages,  // 新增：清空会话消息接口
  searchMessages,  // 新增：消息搜索接口
  stopAIMessage,
  getKnowledgeBases,
  createKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBaseFiles,
  uploadKnowledgeBaseFile,
  parseKnowledgeBaseFile,
  vectorizeKnowledgeBaseFile,
  searchKnowledgeBase,
  searchChatHistoryQA,
} from "./services/api";
import type { AuthMode, ChatHistoryQASearchItem, FriendRequest, Group, GroupAnnouncement, GroupMemberRole, GroupMemberWithRole, LoginUser, Message, MutedMember, User, SearchResult, SearchResponse, AIProviderConfig, KnowledgeBase, KnowledgeBaseFile, KnowledgeBaseSearchChunk } from "./types";

type AIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  model?: string;
};

const authed = ref(false);
const authMode = ref<AuthMode | "reset">("login");
const autoLogin = ref(false);
const rememberPassword = ref(true);
const agreedToTerms = ref(true);
const canSubmitLogin = computed(() => Boolean(loginForm.email && loginForm.password && agreedToTerms.value));
const currentUser = ref<User | null>(getStoredUser());
const token = ref(getStoredToken());
const wsReady = ref(false);
const loadingHistory = ref(false); // 新增：加载历史消息的状态
const uploadingFile = ref(false); // 新增：文件上传中状态
const hasMoreHistory = ref(false); // 新增：是否还有更多历史消息
const nextCursor = ref<string | null>(null); // 新增：下一页游标
const pendingHistoryScroll = ref<{ top: number; height: number } | null>(null);
const ws = ref<WebSocket | null>(null);
const activeSidebar = ref<"groups" | "ai" | "knowledge" | "friends" | "profile">("groups");
const groups = ref<Group[]>([]);
const friends = ref<User[]>([]);
const friendRequests = ref<FriendRequest[]>([]);
const friendRequestUnread = ref(0);
const userSearchResults = ref<User[]>([]);
const selectedMemberIds = ref<string[]>([]);
const selectedGroupId = ref("");
const selectedGroup = ref<Group | null>(null);
const currentMessages = ref<Message[]>([]);
const knowledgeBases = ref<KnowledgeBase[]>([]);
const knowledgeBaseLoading = ref(false);
const knowledgeBaseSaving = ref(false);
const knowledgeBaseEditorVisible = ref(false);
const editingKnowledgeBaseId = ref<string | null>(null);
const knowledgeBaseForm = reactive({ name: "", description: "" });
const selectedKnowledgeBaseId = ref<string | null>(null);
const knowledgeBaseFiles = ref<KnowledgeBaseFile[]>([]);
const knowledgeBaseFilesLoading = ref(false);
const knowledgeBaseFileUploading = ref(false);
const knowledgeSearchQuery = ref("");
const knowledgeSearchLoading = ref(false);
const knowledgeSearchResults = ref<KnowledgeBaseSearchChunk[]>([]);

const selectedKnowledgeBase = computed(() =>
  knowledgeBases.value.find((item) => item.id === selectedKnowledgeBaseId.value) || null,
);
const onlineUsers = ref<Array<{ user_id: string; username: string; device_count: number }>>([]);

// 当前打开群的公告列表。它和聊天消息分开存，避免公告刷新影响消息列表。
const announcements = ref<GroupAnnouncement[]>([]);

// 公告编辑弹窗状态：editingAnnouncementId 为 null 表示发布新公告，否则表示编辑已有公告。
const showAnnouncementEditor = ref(false);
const editingAnnouncementId = ref<string | null>(null);
const announcementDraft = ref("");
const savingAnnouncement = ref(false);
const draftMessage = ref("");
const userSearchQuery = ref("");
const friendSearchQuery = ref("");

// 消息搜索相关状态
const showSearchPanel = ref(false);
const showChatHistoryQAPanel = ref(false);
const chatHistoryQAQuery = ref("");
const chatHistoryQALoading = ref(false);
const chatHistoryQAResults = ref<ChatHistoryQASearchItem[]>([]);
const searchKeyword = ref("");
const searchResults = ref<SearchResult[]>([]);
const searchLoading = ref(false);
const searchTotal = ref(0);
const searchPage = ref(1);
const searchHasMore = ref(false);
const highlightedMessageId = ref<string | null>(null); // 高亮显示的消息ID

// 多选模式相关状态
const isMultiSelectMode = ref(false);
const selectedMessages = ref<Message[]>([]);

// 录音相关状态
const isRecording = ref(false);
const recordingDuration = ref(0);
const recordingTimer = ref<number | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingStartTime = ref<number>(0);

// 自定义音频播放器状态：{ messageId: { playing, currentTime, duration } }
const audioPlayerStates = ref<Map<string, { playing: boolean; currentTime: number; duration: number }>>(new Map());

// 输入中状态管理
const typingUsers = ref<Map<string, { userId: string; username: string }>>(new Map());
let typingSendTimer: ReturnType<typeof setTimeout> | null = null;
let lastTypingSendTime = 0;
const TYPING_THROTTLE_MS = 3000; // 3秒节流
const TYPING_STOP_DELAY_MS = 5000; // 5秒无输入发送停止
const showCreateGroup = ref(false);
const toast = ref("");
const messageScrollRef = ref<HTMLElement | null>(null);
const aiScrollRef = ref<HTMLElement | null>(null);
const aiInputRef = ref<HTMLTextAreaElement | null>(null);
const aiDraft = ref("");
const aiLoading = ref(false);
const aiMessages = ref<AIMessage[]>([]);
const aiModelsLoading = ref(false);
const aiProviderConfig = ref<AIProviderConfig | null>(null);
const selectedAIModelName = ref("");
const aiTriggerEnabled = ref(false);
const stoppingAIMessage = ref(false);

const currentStreamingAIMessage = computed(() =>
  currentMessages.value.find(
    (message) =>
      message.group_id === selectedGroupId.value &&
      message.is_AI === true &&
      message.is_streaming === true,
  ) || null,
);

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
const forwardMessages = ref<Message[]>([]); // 转发的消息列表
const showForwardModal = ref(false); // 显示转发模态框
const selectedForwardGroupId = ref<string>(""); // 选中的目标群组ID

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

const canEditAnnouncement = computed(() => {
  // 前端只负责控制按钮显示；真正的权限仍以后端校验为准。
  if (!selectedGroup.value || !currentUser.value) return false;
  return (
    selectedGroup.value.owner_id === currentUser.value.id ||
    (selectedGroup.value.admin_ids || []).includes(currentUser.value.id) ||
    (selectedGroup.value.announcement_editor_ids || []).includes(currentUser.value.id)
  );
});

const canManageRoles = computed(() => {
  return selectedGroup.value?.owner_id === currentUser.value?.id;
});

const canManageMute = computed(() => {
  if (!selectedGroup.value || !currentUser.value) return false;
  return (
    selectedGroup.value.owner_id === currentUser.value.id ||
    (selectedGroup.value.admin_ids || []).includes(currentUser.value.id)
  );
});

const allMuteActive = computed(() => {
  const mutedUntil = selectedGroup.value?.all_muted_until;
  return !!mutedUntil && new Date(mutedUntil).getTime() > Date.now();
});

function roleLabel(role?: GroupMemberRole) {
  if (role === "owner") return "群主";
  if (role === "admin") return "管理员";
  return "成员";
}

function notify(message: string) {
  toast.value = message;
  window.clearTimeout((notify as unknown as { t?: number }).t);
  (notify as unknown as { t?: number }).t = window.setTimeout(() => {
    toast.value = "";
  }, 2600);
}

function scrollAIToBottom() {
  nextTick(() => {
    const el = aiScrollRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

function openAIChat() {
  activeSidebar.value = "ai";
  selectedGroupId.value = "";
  selectedGroup.value = null;
  loadAIProviderState();
  focusAIInput();
}

async function openKnowledgeBases() {
  activeSidebar.value = "knowledge";
  selectedGroupId.value = "";
  selectedGroup.value = null;
  selectedKnowledgeBaseId.value = null;
  await loadKnowledgeBases();
}

async function loadKnowledgeBases() {
  if (knowledgeBaseLoading.value) return;
  knowledgeBaseLoading.value = true;
  try {
    knowledgeBases.value = await getKnowledgeBases();
  } catch (error: any) {
    notify(error?.response?.data?.message || "知识库列表读取失败");
  } finally {
    knowledgeBaseLoading.value = false;
  }
}

function resetKnowledgeBaseForm() {
  knowledgeBaseForm.name = "";
  knowledgeBaseForm.description = "";
}

function startCreateKnowledgeBase() {
  selectedKnowledgeBaseId.value = null;
  editingKnowledgeBaseId.value = null;
  resetKnowledgeBaseForm();
  knowledgeBaseEditorVisible.value = true;
}

function startEditKnowledgeBase(item: KnowledgeBase) {
  editingKnowledgeBaseId.value = item.id;
  knowledgeBaseForm.name = item.name;
  knowledgeBaseForm.description = item.description || "";
  knowledgeBaseEditorVisible.value = true;
}

function cancelKnowledgeBaseEdit() {
  knowledgeBaseEditorVisible.value = false;
  editingKnowledgeBaseId.value = null;
  resetKnowledgeBaseForm();
}

async function openKnowledgeBase(item: KnowledgeBase) {
  knowledgeBaseEditorVisible.value = false;
  editingKnowledgeBaseId.value = null;
  selectedKnowledgeBaseId.value = item.id;
  await loadKnowledgeBaseFiles(item.id);
}

function closeKnowledgeBase() {
  selectedKnowledgeBaseId.value = null;
  knowledgeBaseFiles.value = [];
  knowledgeSearchQuery.value = "";
  knowledgeSearchResults.value = [];
}

async function runKnowledgeSearch() {
  if (!selectedKnowledgeBaseId.value || !knowledgeSearchQuery.value) return;
  knowledgeSearchLoading.value = true;
  try {
    const result = await searchKnowledgeBase(selectedKnowledgeBaseId.value, {
      query: knowledgeSearchQuery.value,
      top_k: 5,
    });
    knowledgeSearchResults.value = result.chunks;
    if (!result.chunks.length) notify("没有检索到相关片段");
  } catch (error: any) {
    notify(error?.response?.data?.message || "知识库检索失败");
  } finally {
    knowledgeSearchLoading.value = false;
  }
}

async function searchChatHistoryQAAction() {
  if (!selectedGroupId.value || selectedGroup.value?.type === "private") return;
  const query = chatHistoryQAQuery.value.trim();
  if (!query) return;

  chatHistoryQALoading.value = true;
  try {
    const response = await searchChatHistoryQA({
      group_id: selectedGroupId.value,
      query,
      top_k: 5,
    });
    chatHistoryQAResults.value = response.items;
    if (!response.items.length) notify("没有检索到相似的历史 AI 问答");
  } catch (error: any) {
    chatHistoryQAResults.value = [];
    notify(error?.response?.data?.message || "历史 AI 问答检索失败");
  } finally {
    chatHistoryQALoading.value = false;
  }
}

function toggleChatHistoryQAPanel() {
  showChatHistoryQAPanel.value = !showChatHistoryQAPanel.value;
  if (!showChatHistoryQAPanel.value) {
    chatHistoryQAQuery.value = "";
    chatHistoryQAResults.value = [];
  }
}

async function loadKnowledgeBaseFiles(knowledgeBaseId: string | null) {
  if (!knowledgeBaseId) return;
  knowledgeBaseFilesLoading.value = true;
  try {
    knowledgeBaseFiles.value = await getKnowledgeBaseFiles(knowledgeBaseId);
  } catch (error: any) {
    notify(error?.response?.data?.message || "知识库文件列表读取失败");
  } finally {
    knowledgeBaseFilesLoading.value = false;
  }
}

async function onKnowledgeBaseFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file || !selectedKnowledgeBaseId.value) return;

  const allowedExtensions = [".pdf", ".docx", ".pptx", ".xlsx", ".csv", ".txt", ".md"];
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    notify("只支持 PDF、DOCX、PPTX、XLSX、CSV、TXT、MD 文件");
    return;
  }
  if (file.size > 100 * 1024 * 1024) {
    notify("文件不能超过 100MB");
    return;
  }

  knowledgeBaseFileUploading.value = true;
  try {
    const uploaded = await uploadKnowledgeBaseFile(selectedKnowledgeBaseId.value, file);
    knowledgeBaseFiles.value = [uploaded, ...knowledgeBaseFiles.value];
    const knowledgeBase = knowledgeBases.value.find(
      (item) => item.id === selectedKnowledgeBaseId.value,
    );
    if (knowledgeBase) knowledgeBase.file_count += 1;
    notify("文件上传成功，当前状态：已上传");
    window.setTimeout(() => {
      loadKnowledgeBaseFiles(selectedKnowledgeBaseId.value);
    }, 1000);
  } catch (error: any) {
    notify(error?.response?.data?.message || "知识库文件上传失败");
  } finally {
    knowledgeBaseFileUploading.value = false;
  }
}

async function retryKnowledgeBaseFile(file: KnowledgeBaseFile) {
  if (!selectedKnowledgeBaseId.value) return;
  try {
    await parseKnowledgeBaseFile(selectedKnowledgeBaseId.value, file.id);
    file.status = "parsing";
    file.error_message = null;
    notify("已重新提交解析任务");
    window.setTimeout(() => {
      loadKnowledgeBaseFiles(selectedKnowledgeBaseId.value);
    }, 1000);
  } catch (error: any) {
    notify(error?.response?.data?.message || "重新解析失败");
  }
}

async function retryKnowledgeBaseVectorization(file: KnowledgeBaseFile) {
  if (!selectedKnowledgeBaseId.value) return;
  try {
    await vectorizeKnowledgeBaseFile(selectedKnowledgeBaseId.value, file.id);
    file.status = "vectorizing";
    file.error_message = null;
    file.vector_error_message = null;
    notify("已重新提交向量化任务");
    window.setTimeout(() => {
      loadKnowledgeBaseFiles(selectedKnowledgeBaseId.value);
    }, 1000);
  } catch (error: any) {
    notify(error?.response?.data?.message || "重新向量化失败");
  }
}

function knowledgeBaseFileStatusLabel(status: KnowledgeBaseFile["status"]) {
  const labels: Record<KnowledgeBaseFile["status"], string> = {
    uploaded: "已上传",
    parsing: "解析中",
    chunking: "切分中",
    vectorizing: "向量化中",
    success: "处理成功",
    failed: "处理失败",
  };
  return labels[status] || status;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

async function saveKnowledgeBase() {
  const name = knowledgeBaseForm.name.trim();
  if (!name) {
    notify("请输入知识库名称");
    return;
  }

  knowledgeBaseSaving.value = true;
  try {
    if (editingKnowledgeBaseId.value) {
      await updateKnowledgeBase(editingKnowledgeBaseId.value, {
        name,
        description: knowledgeBaseForm.description.trim(),
      });
      notify("知识库修改成功");
    } else {
      await createKnowledgeBase({
        name,
        description: knowledgeBaseForm.description.trim(),
      });
      notify("知识库创建成功");
    }
    cancelKnowledgeBaseEdit();
    await loadKnowledgeBases();
  } catch (error: any) {
    notify(error?.response?.data?.message || "知识库保存失败");
  } finally {
    knowledgeBaseSaving.value = false;
  }
}

async function removeKnowledgeBase(item: KnowledgeBase) {
  if (!window.confirm(`确定删除知识库“${item.name}”吗？`)) return;
  try {
    await deleteKnowledgeBase(item.id);
    notify("知识库删除成功");
    await loadKnowledgeBases();
  } catch (error: any) {
    notify(error?.response?.data?.message || "知识库删除失败");
  }
}

function focusAIInput() {
  nextTick(() => aiInputRef.value?.focus());
}

function clearAIChat() {
  aiMessages.value = [];
  aiDraft.value = "";
  focusAIInput();
}

async function loadAIProviderState() {
  if (aiModelsLoading.value) return;
  aiModelsLoading.value = true;
  try {
    const config = await getAIProviderConfig();
    aiProviderConfig.value = config;
    selectedAIModelName.value = config?.selected_model || "";
  } catch (error: any) {
    notify(error?.response?.data?.message || "平台 AI 状态读取失败");
  } finally {
    aiModelsLoading.value = false;
  }
}

async function sendAIMessage() {
  const content = aiDraft.value.trim();
  if (!content || aiLoading.value) return;

  aiMessages.value.push({
    id: `user-${Date.now()}`,
    role: "user",
    content,
    created_at: new Date().toISOString(),
  });
  aiDraft.value = "";
  aiLoading.value = true;
  scrollAIToBottom();

  try {
    const reply = await chatWithAI({
      message: content,
    });
    aiMessages.value.push({
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: reply.content,
      model: reply.model,
      created_at: new Date().toISOString(),
    });
  } catch (error: any) {
    notify(error?.response?.data?.message || "AI 生成失败");
  } finally {
    aiLoading.value = false;
    scrollAIToBottom();
    focusAIInput();
  }
}

async function toggleAITrigger() {
  if (aiTriggerEnabled.value) {
    aiTriggerEnabled.value = false;
    notify("已关闭 AI 回复");
    return;
  }

  if (!aiProviderConfig.value) {
    await loadAIProviderState();
  }

  if (!aiProviderConfig.value?.key_configured || !selectedAIModelName.value) {
    notify("平台 AI 尚未配置，请联系管理员");
    return;
  }

  aiTriggerEnabled.value = true;
  notify(`已开启 AI 回复：${selectedAIModelName.value}`);
}

async function stopCurrentAIMessage() {
  const message = currentStreamingAIMessage.value;
  if (!message || !selectedGroupId.value || stoppingAIMessage.value) return;

  stoppingAIMessage.value = true;
  try {
    await stopAIMessage({
      group_id: selectedGroupId.value,
      message_id: message.id,
    });
    notify("已停止 AI 生成");
  } catch (error: any) {
    notify(error?.response?.data?.message || "停止 AI 生成失败");
  } finally {
    stoppingAIMessage.value = false;
  }
}

// 监听输入框变化，发送输入中状态
function activeMuteFor(userId?: string) {
  if (!userId) return null;
  const now = Date.now();
  return (selectedGroup.value?.muted_members || []).find((item) => {
    return item.user_id === userId && new Date(item.muted_until).getTime() > now;
  }) || null;
}

function canMuteMember(member: GroupMemberWithRole) {
  if (!selectedGroup.value || !currentUser.value) return false;
  const currentRole = selectedGroup.value.owner_id === currentUser.value.id
    ? "owner"
    : (selectedGroup.value.admin_ids || []).includes(currentUser.value.id)
      ? "admin"
      : "member";
  const targetId = member.id || member.user_id;

  if (!targetId || targetId === currentUser.value.id || member.role === "owner") return false;
  if (currentRole === "owner") return true;
  return currentRole === "admin" && member.role === "member";
}

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

/**
 * 渲染消息内容为可读文本
 * 用于文本消息、引用预览、复制等场景
 */
function renderContent(content: unknown): string {
  const parsed = safeParseContent(content);
  if (typeof parsed === "string") return parsed;
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    // 新格式：显示文件名或文件ID
    if ("filename" in obj) return String(obj.filename);
    if ("file_id" in obj) return `文件: ${String(obj.file_id).slice(0, 8)}...`;
  }
  return String(parsed ?? "");
}

/**
 * 消息类型判断函数
 * 支持新统一类型（text/image/video/file/audio）和旧 MIME 类型兼容
 */

function normalizeMessageType(msg: Message): string {
  // 已经是统一类型
  if (["text", "image", "video", "audio", "file"].includes(msg.type)) {
    return msg.type;
  }
  // 兼容旧消息：MIME 类型转换
  if (msg.type.startsWith("image/")) return "image";
  if (msg.type.startsWith("video/")) return "video";
  if (msg.type.startsWith("audio/")) return "audio";
  return "file";
}

function isImageMessage(msg: Message): boolean {
  return normalizeMessageType(msg) === "image";
}

function isVideoMessage(msg: Message): boolean {
  return normalizeMessageType(msg) === "video";
}

function isAudioMessage(msg: Message): boolean {
  // 语音消息：content 有 duration 但没有 filename
  if (normalizeMessageType(msg) !== "audio") return false;
  const parsed = safeParseContent(msg.content);
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    return !("filename" in obj);
  }
  // 旧格式：纯字符串 content（file_id）也是语音
  return typeof parsed === "string";
}

function isAudioFileMessage(msg: Message): boolean {
  // 音频文件消息：content 有 filename
  if (normalizeMessageType(msg) !== "audio") return false;
  const parsed = safeParseContent(msg.content);
  if (parsed && typeof parsed === "object") {
    return "filename" in parsed;
  }
  return false;
}

function isFileMessage(msg: Message): boolean {
  return normalizeMessageType(msg) === "file";
}

/**
 * 从消息 content 中获取文件 ID
 * 支持新格式 {file_id: "..."} 和旧格式 {id: "..."} 或纯字符串
 */
function getFileId(msg: Message): string {
  const parsed = safeParseContent(msg.content);
  if (typeof parsed === "string") {
    return parsed; // 旧格式：content 直接是 file_id
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    // 新格式优先
    if ("file_id" in obj) return String(obj.file_id);
    // 旧格式兼容
    if ("id" in obj) return String(obj.id);
  }
  return "";
}

/**
 * 从消息 content 中获取文件名
 */
function getFileName(msg: Message): string {
  const parsed = safeParseContent(msg.content);
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if ("filename" in obj) return String(obj.filename);
  }
  return "附件";
}

/**
 * 从消息 content 中获取音频时长
 */
function getAudioDuration(msg: Message): number {
  const parsed = safeParseContent(msg.content);
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if ("duration" in obj) return Number(obj.duration) || 0;
  }
  // 旧格式兼容
  return msg.duration || 0;
}

function fileNameOf(msg: Message): string {
  return getFileName(msg);
}

function downloadUrlForMessage(msg: Message): string {
  const fileId = getFileId(msg);
  return downloadFileUrl(fileId || msg.id, token.value);
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
    selectedGroup.value = current
      ? {
          ...selectedGroup.value,
          ...current,
          members: selectedGroup.value?.members || current.members,
          admin_ids: selectedGroup.value?.admin_ids || current.admin_ids,
          announcement_editor_ids: selectedGroup.value?.announcement_editor_ids || current.announcement_editor_ids,
          muted_members: selectedGroup.value?.muted_members || current.muted_members,
          all_muted_until: selectedGroup.value?.all_muted_until || current.all_muted_until,
          all_muted_by: selectedGroup.value?.all_muted_by || current.all_muted_by,
          all_muted_at: selectedGroup.value?.all_muted_at || current.all_muted_at,
        }
      : null;
  }
}

function sortAnnouncements(items: GroupAnnouncement[]) {
  // 公告按更新时间倒序展示，用户最先看到最新通知。
  return [...items].sort((a, b) => {
    const left = new Date(a.updated_at || a.created_at).getTime();
    const right = new Date(b.updated_at || b.created_at).getTime();
    return right - left;
  });
}

function upsertAnnouncement(announcement: GroupAnnouncement) {
  // WebSocket 和接口返回都可能带来同一条公告，所以这里统一做“有则替换，无则插入”。
  const existingIndex = announcements.value.findIndex((item) => item.id === announcement.id);
  if (existingIndex >= 0) {
    announcements.value[existingIndex] = announcement;
  } else {
    announcements.value = [announcement, ...announcements.value];
  }
  announcements.value = sortAnnouncements(announcements.value);
}

async function loadAnnouncements(groupId = selectedGroupId.value) {
  // 打开私聊时清空公告；只有群聊才调用公告接口。
  if (!groupId || selectedGroup.value?.type === "private") {
    announcements.value = [];
    return;
  }
  try {
    announcements.value = sortAnnouncements(await getGroupAnnouncements(groupId));
  } catch {
    announcements.value = [];
  }
}

function applyMemberRole(userId: string, role: GroupMemberRole) {
  if (!selectedGroup.value?.members) return;
  selectedGroup.value.members = selectedGroup.value.members.map((member) => {
    const memberId = member.id || member.user_id;
    return memberId === userId ? { ...member, role } : member;
  });
}

async function loadGroupMembers(groupId = selectedGroupId.value) {
  if (!groupId || selectedGroup.value?.type === "private") return;
  try {
    const data = await getGroupMembers(groupId);
    if (selectedGroup.value && selectedGroup.value.id === groupId) {
      selectedGroup.value.members = data.members;
    }
  } catch {
    notify("加载群成员失败");
  }
}

async function changeMemberAdmin(userId: string, makeAdmin: boolean) {
  if (!selectedGroupId.value || !userId) return;
  try {
    const result = makeAdmin
      ? await setGroupAdmin(selectedGroupId.value, userId)
      : await unsetGroupAdmin(selectedGroupId.value, userId);
    applyMemberRole(result.user_id, result.role);
    notify(makeAdmin ? "管理员已设置" : "管理员已取消");
  } catch {
    notify(makeAdmin ? "设置管理员失败" : "取消管理员失败");
  }
}

function upsertMemberMute(mute: MutedMember) {
  if (!selectedGroup.value) return;
  const list = selectedGroup.value.muted_members || [];
  selectedGroup.value.muted_members = [
    ...list.filter((item) => item.user_id !== mute.user_id),
    mute,
  ];
}

function removeMemberMute(userId: string) {
  if (!selectedGroup.value) return;
  selectedGroup.value.muted_members = (selectedGroup.value.muted_members || []).filter((item) => item.user_id !== userId);
}

async function toggleMemberMute(member: GroupMemberWithRole) {
  const userId = member.id || member.user_id;
  if (!selectedGroupId.value || !userId) return;

  try {
    const currentMute = activeMuteFor(userId);
    if (currentMute) {
      await unmuteGroupMember(selectedGroupId.value, userId);
      removeMemberMute(userId);
      notify("成员禁言已解除");
    } else {
      const result = await muteGroupMember(selectedGroupId.value, userId, 10);
      upsertMemberMute(result);
      notify("成员已禁言10分钟");
    }
  } catch {
    notify("禁言操作失败");
  }
}

async function toggleAllMute() {
  if (!selectedGroup.value || !selectedGroupId.value) return;

  try {
    if (allMuteActive.value) {
      await unmuteAllGroupMembers(selectedGroupId.value);
      selectedGroup.value.all_muted_until = null;
      selectedGroup.value.all_muted_by = null;
      selectedGroup.value.all_muted_at = null;
      notify("全员禁言已关闭");
    } else {
      const result = await muteAllGroupMembers(selectedGroupId.value, 10);
      selectedGroup.value.all_muted_until = result.muted_until;
      selectedGroup.value.all_muted_by = result.muted_by;
      selectedGroup.value.all_muted_at = result.muted_at;
      notify("全员禁言已开启10分钟");
    }
  } catch {
    notify("全员禁言操作失败");
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
  aiTriggerEnabled.value = false;
  hasMoreHistory.value = false;
  nextCursor.value = null;
  pendingHistoryScroll.value = null;
  announcements.value = [];
  try {
    const payload = await getGroupMessages({ id: groupId, page: 1, page_size: 50 });
    // 修改：打开群聊时走统一排序入口；删除原来的直接赋值，避免接口顺序影响页面顺序。
    setCurrentMessages(payload.items || []);
    hasMoreHistory.value = payload.total > (payload.items || []).length;
    nextCursor.value = payload.items?.[0]?.id || null;
    onlineUsers.value = [];
  } catch {
    currentMessages.value = [];
  }
  await loadAnnouncements(groupId);
  await loadGroupMembers(groupId);
  await markLoadedMessagesRead(groupId, currentMessages.value);
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
  if (currentMessages.value.length && !hasMoreHistory.value) {
    notify("没有更早的历史消息");
    return;
  }
  loadingHistory.value = true;
  pendingHistoryScroll.value = {
    top: messageScrollRef.value?.scrollTop || 0,
    height: messageScrollRef.value?.scrollHeight || 0,
  };

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

function handleMessageScroll() {
  const element = messageScrollRef.value;
  if (!element || loadingHistory.value || !hasMoreHistory.value || !selectedGroupId.value) {
    return;
  }

  if (element.scrollTop <= 80) {
    loadGroupMessages(selectedGroupId.value);
  }
}

async function markLoadedMessagesRead(groupId: string, messages: Message[]) {
  const userId = currentUser.value?.id;
  if (!userId || !messages.length) return;

  const unreadIds = messages
    .filter((message) => !message.read_list.includes(userId))
    .map((message) => message.id);
  if (!unreadIds.length) return;

  try {
    await markRead({ group_id: groupId, message_ids: unreadIds });
  } catch {
    // 消息已经被其他设备标记已读时，不影响当前页面继续浏览。
  }

  currentMessages.value = currentMessages.value.map((message) =>
    unreadIds.includes(message.id)
      ? { ...message, read_list: [...new Set([...message.read_list, userId])] }
      : message,
  );
  await loadGroups();
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
  const scrollElement = messageScrollRef.value;
  const wasNearBottom =
    !scrollElement ||
    scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 120;
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
  if (normalized.group_id === selectedGroupId.value && wasNearBottom) {
    scrollToBottom();
  }
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

        // before_id 表示向上翻页：把更早消息插入顶部，并恢复原滚动位置。
        if (data.before_id) {
          currentMessages.value = mergeMessagesByTime(items, currentMessages.value);
          await nextTick();
          const element = messageScrollRef.value;
          const previousScroll = pendingHistoryScroll.value;
          if (element && previousScroll) {
            element.scrollTop =
              previousScroll.top + (element.scrollHeight - previousScroll.height);
          }
        } else {
          setCurrentMessages(items);
          scrollToBottom();
        }

        await markLoadedMessagesRead(data.group_id, items);
        pendingHistoryScroll.value = null;
        loadingHistory.value = false;
        notify(`已加载 ${items.length} 条消息${hasMoreHistory.value ? "，还有更多" : ""}`);
      }
      return;
    }
    if (type === "group_history" && typeof data.group_id === "string") {
      if (selectedGroupId.value === data.group_id) {
        // 打开群聊会通过 HTTP 加载完整的首屏历史，这里的连接初始化消息只作为空列表时的兜底。
        if (!currentMessages.value.length) {
          mergeCurrentMessages((data.content as Message[]) || []);
          scrollToBottom();
        }
      }
      return;
    }
    if (type === "offline_messages" && Array.isArray(data.content)) {
      const offlineGroups = data.content as Array<{ group_id: string; messages: Message[] }>;
      for (const group of offlineGroups) {
        const normalizedMessages = (group.messages || []).map(normalizeMessage);
        if (group.group_id === selectedGroupId.value && !currentMessages.value.length) {
          // 首屏 HTTP 请求失败时才使用离线消息兜底，避免和首屏历史重复并把滚动位置拉到底部。
          mergeCurrentMessages(normalizedMessages);
          scrollToBottom();
        }
        // 群列表连接时已经带有服务端计算的未读数，这里只更新最后一条消息，避免重复累加未读数。
        const g = groups.value.find((item) => item.id === group.group_id);
        if (g) {
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
    if (type === "ai_reply_success" && data.content && typeof data.content === "object") {
      notify("AI已回复");
      return;
    }
    if (type === "ai_reply_error" && data.content && typeof data.content === "object") {
      const errorMessage = String(
        (data.content as { error_message?: string }).error_message || "AI回复失败",
      );
      notify(errorMessage);
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
    if (type === "group_announcement_updated" && data.content && typeof data.content === "object") {
      const groupId = String(data.group_id || "");
      const content = data.content as {
        action?: string;
        announcement?: GroupAnnouncement;
        announcement_id?: string;
      };

      if (groupId === selectedGroupId.value) {
        if ((content.action === "created" || content.action === "updated") && content.announcement) {
          upsertAnnouncement(content.announcement);
          notify(content.action === "created" ? "收到新群公告" : "群公告已更新");
        }
        if (content.action === "deleted" && content.announcement_id) {
          announcements.value = announcements.value.filter((item) => item.id !== content.announcement_id);
          notify("群公告已删除");
        }
      }
      return;
    }
    if (type === "group_member_role_updated" && data.content && typeof data.content === "object") {
      const groupId = String(data.group_id || "");
      const content = data.content as {
        user_id?: string;
        role?: GroupMemberRole;
      };
      if (groupId === selectedGroupId.value && content.user_id && content.role) {
        applyMemberRole(content.user_id, content.role);
        notify("群成员角色已更新");
      }
      return;
    }
    if (type === "group_member_muted" && data.content && typeof data.content === "object") {
      const groupId = String(data.group_id || "");
      const content = data.content as MutedMember;
      if (groupId === selectedGroupId.value && content.user_id) {
        upsertMemberMute(content);
        notify("群成员禁言状态已更新");
      }
      return;
    }
    if (type === "group_member_unmuted" && data.content && typeof data.content === "object") {
      const groupId = String(data.group_id || "");
      const content = data.content as { user_id?: string };
      if (groupId === selectedGroupId.value && content.user_id) {
        removeMemberMute(content.user_id);
        notify("群成员禁言已解除");
      }
      return;
    }
    if (type === "group_all_muted" && data.content && typeof data.content === "object") {
      const groupId = String(data.group_id || "");
      const content = data.content as { muted_by?: string; muted_at?: string; muted_until?: string };
      if (groupId === selectedGroupId.value && selectedGroup.value && content.muted_until) {
        selectedGroup.value.all_muted_until = content.muted_until;
        selectedGroup.value.all_muted_by = content.muted_by || null;
        selectedGroup.value.all_muted_at = content.muted_at || null;
        notify("全员禁言已开启");
      }
      return;
    }
    if (type === "group_all_unmuted") {
      const groupId = String(data.group_id || "");
      if (groupId === selectedGroupId.value && selectedGroup.value) {
        selectedGroup.value.all_muted_until = null;
        selectedGroup.value.all_muted_by = null;
        selectedGroup.value.all_muted_at = null;
        notify("全员禁言已关闭");
      }
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

function handleContextAction(action: "copy" | "quote" | "forward" | "multiselect" | "revoke" | "delete") {
  const msg = contextMenu.value.message;
  if (!msg) {
    hideContextMenu();
    return;
  }

  switch (action) {
    case "copy":
      // 复制消息内容（渲染为可读文本）
      navigator.clipboard.writeText(renderContent(msg.content)).then(() => {
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

    case "forward":
      // 转发消息 - 弹出群组选择
      forwardMessages.value = [msg];
      selectedForwardGroupId.value = "";
      showForwardModal.value = true;
      break;

    case "multiselect":
      // 进入多选模式，并选中当前消息
      isMultiSelectMode.value = true;
      selectedMessages.value = [msg];
      notify("已进入多选模式，点击其他消息继续选择");
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

// ========== 多选模式相关函数 ==========

// 切换多选模式
function toggleMultiSelectMode() {
  isMultiSelectMode.value = !isMultiSelectMode.value;
  if (!isMultiSelectMode.value) {
    // 退出多选模式时清空选择
    selectedMessages.value = [];
  }
}

// 检查消息是否被选中
function isMessageSelected(messageId: string): boolean {
  return selectedMessages.value.some(m => m.id === messageId);
}

// 切换消息选择状态
function toggleMessageSelection(msg: Message) {
  const index = selectedMessages.value.findIndex(m => m.id === msg.id);
  if (index > -1) {
    selectedMessages.value.splice(index, 1);
  } else {
    selectedMessages.value.push(msg);
  }
}

// 批量转发选中的消息
function batchForward() {
  if (selectedMessages.value.length === 0) {
    notify("请先选择要转发的消息");
    return;
  }
  forwardMessages.value = [...selectedMessages.value];
  selectedForwardGroupId.value = "";
  showForwardModal.value = true;
  // 不清空选择，等确认后再清空
}

// 确认转发到目标群
async function confirmForward() {
  if (!selectedForwardGroupId.value) {
    notify("请选择目标群组");
    return;
  }
  if (forwardMessages.value.length === 0) {
    notify("没有要转发的消息");
    return;
  }

  try {
    const messageIds = forwardMessages.value.map(m => m.id);
    const res = await fetch(`${API_BASE}/api/group/messages/forward-to-group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        source_group_id: selectedGroupId.value,
        target_group_id: selectedForwardGroupId.value,
        message_ids: messageIds,
      }),
    });

    const data = await res.json();
    if (data.code === 200) {
      notify(`成功转发 ${data.data.forwarded_count} 条消息`);
      closeForwardModal();
      // 清空选择并退出多选模式
      selectedMessages.value = [];
      isMultiSelectMode.value = false;
    } else {
      notify(data.message || "转发失败");
    }
  } catch (err) {
    console.error("转发出错:", err);
    notify("转发失败，请重试");
  }
}

// ========== 转发功能 ==========

// 关闭转发模态框
function closeForwardModal() {
  showForwardModal.value = false;
  selectedForwardGroupId.value = "";
  forwardMessages.value = [];
}

// 滚动到引用的原消息
function scrollToMessage(messageId: string) {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  if (messageElement) {
    messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    // 高亮显示
    highlightedMessageId.value = messageId;
    setTimeout(() => {
      highlightedMessageId.value = null;
    }, 2000);
  }
}

function sendTextMessage() {
  if (!selectedGroupId.value || !draftMessage.value.trim()) return;
  if (aiTriggerEnabled.value && !selectedAIModelName.value) {
    notify("平台 AI 尚未配置，请联系管理员");
    return;
  }
  const payload: Record<string, unknown> = {
    type: "text",
    group_id: selectedGroupId.value,
    content: draftMessage.value.trim(),
    at_list: [],
  };
  if (aiTriggerEnabled.value) {
    payload.trigger_ai = true;
  }
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

  // 重置 input，允许重复选择同一文件
  (event.target as HTMLInputElement).value = "";

  try {
    if (/audio/i.test(file.type)) {
      await uploadGroupMedia(selectedGroupId.value, file);
    } else {
      await uploadGroupFile(selectedGroupId.value, file);
    }
    notify("文件已上传");
  } catch (e: any) {
    notify(e?.message || "文件上传失败，请检查文件大小和类型");
  }
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

function openAnnouncementEditor(announcement?: GroupAnnouncement) {
  // 有 announcement 表示编辑；没有则是发布。弹窗复用同一个 textarea。
  editingAnnouncementId.value = announcement?.id || null;
  announcementDraft.value = announcement?.content || "";
  showAnnouncementEditor.value = true;
}

function closeAnnouncementEditor() {
  showAnnouncementEditor.value = false;
  editingAnnouncementId.value = null;
  announcementDraft.value = "";
  savingAnnouncement.value = false;
}

async function saveAnnouncement() {
  // 根据 editingAnnouncementId 决定走“新增”还是“修改”接口。
  if (!selectedGroupId.value) return;
  const content = announcementDraft.value.trim();
  if (!content) {
    notify("请输入群公告内容");
    return;
  }

  savingAnnouncement.value = true;
  try {
    const saved = editingAnnouncementId.value
      ? await updateGroupAnnouncement(selectedGroupId.value, editingAnnouncementId.value, content)
      : await createGroupAnnouncement(selectedGroupId.value, content);
    upsertAnnouncement(saved);
    notify(editingAnnouncementId.value ? "群公告已更新" : "群公告已发布");
    closeAnnouncementEditor();
  } catch {
    notify(editingAnnouncementId.value ? "更新群公告失败" : "发布群公告失败");
  } finally {
    savingAnnouncement.value = false;
  }
}

async function removeAnnouncement(announcementId: string) {
  // 删除是不可逆操作，先让用户确认，再调用后端删除。
  if (!selectedGroupId.value) return;
  if (!confirm("确定删除这条群公告吗？")) return;

  try {
    await deleteGroupAnnouncement(selectedGroupId.value, announcementId);
    announcements.value = announcements.value.filter((item) => item.id !== announcementId);
    notify("群公告已删除");
  } catch {
    notify("删除群公告失败");
  }
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

// ==================== 新增：消息搜索功能 ====================

/**
 * 打开搜索面板
 */
function openSearchPanel() {
  showSearchPanel.value = true;
  searchKeyword.value = "";
  searchResults.value = [];
  searchTotal.value = 0;
  searchPage.value = 1;
  searchHasMore.value = false;
}

/**
 * 关闭搜索面板
 */
function closeSearchPanel() {
  showSearchPanel.value = false;
  searchKeyword.value = "";
  searchResults.value = [];
  searchTotal.value = 0;
  searchPage.value = 1;
  searchHasMore.value = false;
}

/**
 * 执行消息搜索
 */
async function doSearch(page = 1) {
  if (!selectedGroupId.value || !searchKeyword.value.trim()) return;

  searchLoading.value = true;
  searchPage.value = page;

  try {
    const response = await searchMessages({
      group_id: selectedGroupId.value,
      keyword: searchKeyword.value.trim(),
      page: page,
      page_size: 20,
    });

    searchResults.value = page === 1 ? response.items : [...searchResults.value, ...response.items];
    searchTotal.value = response.total;
    searchHasMore.value = response.has_more;
  } catch (error: any) {
    notify(error?.response?.data?.message || "搜索失败");
    searchResults.value = [];
    searchTotal.value = 0;
    searchHasMore.value = false;
  } finally {
    searchLoading.value = false;
  }
}

/**
 * 加载更多搜索结果
 */
async function loadMoreSearchResults() {
  if (searchLoading.value || !searchHasMore.value) return;
  await doSearch(searchPage.value + 1);
}

/**
 * 高亮搜索关键词
 * 先渲染内容为可读文本，再高亮关键词
 */
function highlightKeyword(content: unknown): string {
  // 先渲染为可读文本
  const text = renderContent(content);
  if (!searchKeyword.value.trim()) return text;
  const regex = new RegExp(`(${searchKeyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 点击搜索结果，跳转到消息位置
 */
async function jumpToMessage(messageId: string) {
  if (!messageId) return;

  // 检查消息是否在当前加载的消息列表中
  const msgIndex = currentMessages.value.findIndex(msg => msg.id === messageId);

  if (msgIndex !== -1) {
    // 消息已加载，直接滚动到该消息
    scrollToMessageById(messageId);
    highlightMessage(messageId);
  } else {
    // 消息未加载，需要加载更多历史消息
    notify("正在加载历史消息...");
    await loadHistoryUntilMessage(messageId);
  }

  // 关闭搜索面板
  closeSearchPanel();
}

/**
 * 滚动到指定消息ID的消息元素
 */
function scrollToMessageById(messageId: string) {
  nextTick(() => {
    const messageElements = messageScrollRef.value?.querySelectorAll('.message-row');
    if (!messageElements) return;

    messageElements.forEach((el) => {
      const msgId = el.getAttribute('data-message-id');
      if (msgId === messageId) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/**
 * 高亮显示指定消息（3秒后取消高亮）
 */
function highlightMessage(messageId: string) {
  highlightedMessageId.value = messageId;
  setTimeout(() => {
    highlightedMessageId.value = null;
  }, 3000);
}

// ==================== 新增：语音录音功能 ====================

/**
 * 开始录音
 */
async function startRecording() {
  try {
    // 1. 先向浏览器申请麦克风权限，拿到一条音频输入流。
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 2. MediaRecorder 负责把麦克风声音录成浏览器可播放的 webm/opus 音频。
    const recorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    mediaRecorder.value = recorder;
    audioChunks.value = [];

    // 3. 录音过程中浏览器会一小段一小段吐出 Blob，这里先临时收集起来。
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    recorder.onstop = async () => {
      // 4. 停止录音后要释放麦克风，不然浏览器会一直占用录音设备。
      stream.getTracks().forEach(track => track.stop());

      // 5. 把刚刚收集到的多个音频片段合成一个完整语音文件。
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });

      if (selectedGroupId.value && audioBlob.size > 0) {
        const duration = recordingDuration.value;
        // 6. 后端接收的是文件上传，所以这里把 Blob 包装成 File。
        const file = new File([audioBlob], `voice_${Date.now()}.webm`, {
          type: 'audio/webm'
        });

        try {
          // 7. 上传语音文件、群ID、语音时长；后端会保存文件并生成一条语音消息。
          await uploadGroupMedia(selectedGroupId.value, file, duration);
          notify("语音消息已发送");

          // 8. 上传接口会通过 WebSocket 广播消息；这里再刷新一次历史，兜底保证自己页面能看到最新语音。
          setTimeout(async () => {
            if (selectedGroupId.value) {
              try {
                const payload = await getGroupMessages({ id: selectedGroupId.value, page: 1, page_size: 50 });
                setCurrentMessages(payload.items || []);
                scrollToBottom();
              } catch (e) {
                console.error("刷新消息失败:", e);
              }
            }
          }, 800);
        } catch (error) {
          console.error("上传失败:", error);
          notify("语音消息发送失败");
        }
      }

      isRecording.value = false;
      recordingDuration.value = 0;
      audioChunks.value = [];
    };

    // 每 100ms 取一次录音片段，片段最终会在 onstop 里合成完整文件。
    recorder.start(100);
    isRecording.value = true;
    recordingStartTime.value = Date.now();
    recordingDuration.value = 0;

    // 前端自己计时，用来显示”正在录音 0:05”，也会作为 duration 传给后端。
    recordingTimer.value = window.setInterval(() => {
      recordingDuration.value = Math.floor((Date.now() - recordingStartTime.value) / 1000);

      // 不限制录音时长，用户手动停止
    }, 1000);

    notify("开始录音");
  } catch (error) {
    notify("无法访问麦克风，请检查权限设置");
    console.error("录音错误:", error);
  }
}

/**
 * 停止录音
 */
function stopRecording() {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();

    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }
  }
}

/**
 * 取消录音
 */
function cancelRecording() {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();

    // 清除计时器
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }

    // 清空音频数据，不发送
    audioChunks.value = [];
    isRecording.value = false;
    recordingDuration.value = 0;

    notify("已取消录音");
  }
}

/**
 * 格式化录音时长显示
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==================== 自定义音频播放器 ====================

/**
 * 获取音频元素
 */
function getAudioElement(messageId: string): HTMLAudioElement | null {
  const el = document.querySelector(`audio[data-message-id="${messageId}"]`) as HTMLAudioElement;
  return el || null;
}

/**
 * 获取音频播放器状态
 */
function getAudioPlayerState(messageId: string) {
  return audioPlayerStates.value.get(messageId) || null;
}

/**
 * 获取播放进度百分比
 */
function getAudioProgress(messageId: string): number {
  const state = audioPlayerStates.value.get(messageId);
  if (!state || !state.duration) return 0;
  return (state.currentTime / state.duration) * 100;
}

/**
 * 格式化音频时间
 */
function formatAudioTime(seconds: number): string {
  const s = Math.floor(seconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 音频元数据加载完成
 */
/**
 * 音频元数据加载完成
 * 从 content.duration 或 msg.duration 获取时长
 */
function onAudioLoaded(messageId: string, event: Event) {
  const audio = event.target as HTMLAudioElement;
  const msg = currentMessages.value.find(m => m.id === messageId);

  // 新格式：duration 在 content 对象中
  let duration = 0;
  if (msg) {
    const parsed = safeParseContent(msg.content);
    if (parsed && typeof parsed === "object" && "duration" in parsed) {
      duration = Number((parsed as Record<string, unknown>).duration) || 0;
    } else if (msg.duration) {
      // 旧格式：duration 在消息顶层
      duration = msg.duration;
    }
  }

  // WebM 流式音频 duration 可能是 Infinity，用计算出的 duration 兜底
  const finalDuration = isFinite(audio.duration) ? audio.duration : duration;

  audioPlayerStates.value.set(messageId, {
    playing: false,
    currentTime: 0,
    duration: finalDuration,
  });
}

/**
 * 音频播放进度更新
 */
function onAudioTimeUpdate(messageId: string, event: Event) {
  const audio = event.target as HTMLAudioElement;
  const state = audioPlayerStates.value.get(messageId);
  if (state) {
    state.currentTime = audio.currentTime;
    if (isFinite(audio.duration) && audio.duration > state.duration) {
      state.duration = audio.duration;
    }
  }
}

/**
 * 音频开始播放
 */
function onAudioPlay(messageId: string) {
  const state = audioPlayerStates.value.get(messageId);
  if (state) state.playing = true;
}

/**
 * 音频暂停
 */
function onAudioPause(messageId: string) {
  const state = audioPlayerStates.value.get(messageId);
  if (state) state.playing = false;
}

/**
 * 音频播放结束
 */
function onAudioEnded(messageId: string) {
  const state = audioPlayerStates.value.get(messageId);
  if (state) {
    state.playing = false;
    state.currentTime = 0;
  }
}

/**
 * 切换播放/暂停
 */
function toggleAudioPlay(messageId: string) {
  const audio = getAudioElement(messageId);
  if (!audio) return;

  // 暂停其他正在播放的音频
  audioPlayerStates.value.forEach((state, id) => {
    if (id !== messageId && state.playing) {
      const otherAudio = getAudioElement(id);
      if (otherAudio) otherAudio.pause();
    }
  });

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

/**
 * 点击进度条跳转
 */
function seekAudio(messageId: string, event: MouseEvent) {
  const audio = getAudioElement(messageId);
  if (!audio || !audio.duration) return;

  const bar = event.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  audio.currentTime = ratio * audio.duration;
}

/**
 * 加载历史消息直到找到目标消息
 */
async function loadHistoryUntilMessage(targetMessageId: string) {
  if (!selectedGroupId.value || !ws.value) return;

  // 循环加载历史消息，直到找到目标消息或没有更多消息
  let found = false;
  let attempts = 0;
  const maxAttempts = 10; // 最多尝试加载10次

  while (!found && attempts < maxAttempts) {
    // 检查当前消息列表中是否有目标消息
    if (currentMessages.value.some(msg => msg.id === targetMessageId)) {
      found = true;
      break;
    }

    // 发送获取历史消息请求
    const payload: { type: string; group_id: string; limit: number; before_id?: string } = {
      type: "get_history",
      group_id: selectedGroupId.value,
      limit: 50,
    };

    if (nextCursor.value) {
      payload.before_id = nextCursor.value;
    }

    ws.value.send(JSON.stringify(payload));

    // 等待一段时间让消息加载
    await new Promise(resolve => setTimeout(resolve, 500));

    attempts++;
  }

  if (found) {
    scrollToMessageById(targetMessageId);
    highlightMessage(targetMessageId);
    notify("已跳转到目标消息");
  } else {
    notify("未找到该消息，可能已被删除");
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

<style scoped>
/* 消息高亮样式 */
.message-row.highlighted {
  animation: highlight-pulse 3s ease-out;
  background-color: rgba(255, 215, 0, 0.3);
}

.ai-streaming-status {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

.ai-message-error {
  margin-top: 6px;
  font-size: 12px;
  color: #b42318;
}

@keyframes highlight-pulse {
  0% {
    background-color: rgba(255, 215, 0, 0.5);
  }
  100% {
    background-color: transparent;
  }
}

/* 搜索结果内容样式 */
.search-result-content {
  padding: 8px 0;
  color: #555;
  line-height: 1.5;
}

.search-result-content mark {
  background-color: #ffd700;
  color: #000;
  padding: 1px 3px;
  border-radius: 2px;
}

/* 录音相关样式 */
.recording-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin-bottom: 10px;
}

.recording-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recording-dot {
  width: 12px;
  height: 12px;
  background-color: #dc3545;
  border-radius: 50%;
  animation: recording-pulse 1s ease-in-out infinite;
}

@keyframes recording-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.recording-time {
  color: #856404;
  font-weight: 500;
}

.recording-actions {
  display: flex;
  gap: 8px;
}

.composer-buttons {
  display: flex;
  gap: 8px;
}

.composer-buttons .btn.active {
  background-color: #dc3545;
  color: white;
}

/* 视频消息样式 */
.video-message {
  display: inline-block;
  max-width: 100%;
}

.video-message video {
  display: block;
  border-radius: 8px;
  background: #000;
}

/* 自定义音频播放器样式 */
.custom-audio-player {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 20px;
  min-width: 200px;
  max-width: 320px;
}

/* 音频文件消息样式（上传的MP3等） */
.audio-file-message {
  max-width: 360px;
}

.audio-file-player {
  min-width: 280px;
  max-width: 360px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
}

.audio-file-player .audio-play-btn {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border: none;
}

.audio-file-player .audio-play-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}

.audio-file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.audio-file-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.audio-file-progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.audio-file-progress-row .audio-progress-bar {
  flex: 1;
}

.audio-file-player .audio-file-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.audio-file-player .audio-file-name {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audio-file-player .audio-progress-bar {
  background: rgba(255, 255, 255, 0.25);
  height: 4px;
  cursor: pointer;
  border-radius: 2px;
}

.audio-file-player .audio-progress-fill {
  background: #fff;
  height: 100%;
  border-radius: 2px;
}

.audio-file-player .audio-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 45px;
  text-align: right;
}

.custom-audio-player audio {
  display: none;
}

.audio-play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #4a90d9;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.audio-play-btn:hover {
  background: #357abd;
}

.audio-progress-bar {
  flex: 1;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.audio-progress-fill {
  height: 100%;
  background: #4a90d9;
  border-radius: 3px;
  transition: width 0.1s linear;
}

.audio-time {
  font-size: 12px;
  color: #666;
  min-width: 45px;
  text-align: right;
  flex-shrink: 0;
}

.knowledge-search-panel {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.knowledge-search-panel input {
  flex: 1;
  min-width: 0;
}

.knowledge-search-results {
  display: grid;
  gap: 8px;
  margin: 10px 0 14px;
}

.knowledge-search-item {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
}

.knowledge-search-content {
  margin-top: 6px;
  color: #1f2937;
  line-height: 1.6;
  white-space: pre-wrap;
}

.chat-history-qa-panel {
  margin: 0 14px 10px;
  padding: 12px;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  background: #f8fafc;
}

.chat-history-qa-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.chat-history-qa-head > div {
  display: grid;
  gap: 3px;
}

.chat-history-qa-results {
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
}

.chat-history-qa-item {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
}

.chat-history-qa-meta {
  color: #64748b;
  font-size: 12px;
  text-align: right;
}

.chat-history-qa-question {
  margin-top: 4px;
  color: #1e3a8a;
  font-weight: 600;
}

.chat-history-qa-answer {
  margin-top: 6px;
  color: #1f2937;
  line-height: 1.6;
  white-space: pre-wrap;
}

.chat-history-qa-empty {
  padding: 8px 0 2px;
}
</style>
