# Pure IM Vue3 Frontend

这是 Pure IM 的 Vue 3 前端，提供即时通信、群聊 AI、知识库管理和检索结果展示界面。

## 当前功能

- 邮箱注册、登录和密码重置
- 群聊和私聊
- 好友和群成员管理
- 历史消息、未读消息和离线消息
- 消息引用、撤回、删除和转发
- 文件、图片、音频和视频消息
- 群公告、禁言、置顶和在线成员
- 群聊中触发 AI 回复
- AI 流式回复实时显示
- 停止 AI 生成
- AI 模型状态显示
- 知识库创建和管理
- 知识库文件上传、解析、切分和向量化状态展示
- 知识库 Chunk 检索
- 群聊历史 AI 问答检索
- BM25、Dense、RRF 和 Reranker 检索结果展示

## 环境要求

- Node.js LTS
- npm
- 正常运行的 Pure IM 后端

后端默认地址：

```text
http://127.0.0.1:8000
ws://127.0.0.1:8000
```

## 安装和启动

```powershell
Set-Location -LiteralPath "D:\Lenovo\桌面\IM\IM_front\front_IM"
npm install
npm run dev
```

启动后访问：

```text
http://127.0.0.1:5173
```

## 配置后端地址

默认情况下，前端会连接本机 8000 端口。如果后端地址不同，可以在前端项目根目录创建 `.env`：

```dotenv
VITE_API_BASE=http://127.0.0.1:8000
VITE_WS_BASE=ws://127.0.0.1:8000
```

修改环境变量后需要重新启动 Vite 开发服务器。

## 生产构建

```powershell
Set-Location -LiteralPath "D:\Lenovo\桌面\IM\IM_front\front_IM"
npm run build
```

预览构建结果：

```powershell
npm run preview
```

构建输出目录是 `dist/`，它属于构建产物，不需要提交到 Git。

## 页面使用说明

### 群聊 AI

进入群聊后，打开“让 AI 回复”，再发送问题。AI 会在群消息中以流式方式生成，其他在线群成员也能看到生成过程。生成过程中可以点击“停止 AI 生成”。

### 历史 AI 问答

在群聊顶部打开“历史问答”，输入问题后，前端会检索当前群聊之前成功完成的 AI 问答，并显示：

- 历史问题
- AI 答案
- BM25 和 Dense 排名
- RRF 分数或 Reranker 重排分数

### 知识库

打开“知识库”后，可以创建知识库并上传 PDF、DOCX、PPTX、XLSX、CSV、TXT、MD 文件。文件解析、Chunk 切分和向量化在后端完成，前端会展示文件状态并支持检索相关 Chunk。

FAQ 自动抽取功能目前暂缓。

## 常用命令

```powershell
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查并构建
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```text
front_IM/
├── src/
│   ├── App.vue              # 主界面和主要交互逻辑
│   ├── services/api.ts      # HTTP API 封装
│   ├── types.ts             # TypeScript 类型
│   └── main.ts              # Vue 应用入口
├── index.html
├── package.json
├── package-lock.json
├── vite.config.mjs
└── README.md
```
