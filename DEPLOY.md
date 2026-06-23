# 上线说明

## 1. 安装依赖

```bash
npm ci
```

## 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入高德地图 Web JS API 的 key 和安全密钥：

```bash
VITE_AMAP_KEY=你的高德Key
VITE_AMAP_SECURITY_CODE=你的安全密钥
```

如果暂时不配置，高德地图不会加载，首页会显示项目内置的小区位置示意图，不影响其他页面使用。

## 3. 本地构建检查

```bash
npm run build
npm run preview
```

构建产物在 `dist/` 目录。

## 4. 静态部署

把 `dist/` 目录上传到静态网站服务即可，例如 Nginx、OSS、COS、Vercel、Netlify、Cloudflare Pages。

项目已使用 Hash 路由，地址里会带 `#/`，静态服务器不需要额外配置前端路由回退。

## 5. Nginx 示例

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/3d-house-viewer/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```
