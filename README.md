# online

## 参考

* http <https://github.com/yhirose/cpp-httplib>
* websocket <https://gitlab.com/eidheim/Simple-WebSocket-Server>
* 数据库 <https://sqlite.org/index.html>
* JSON <https://github.com/nlohmann/json>
* 加密库 <https://www.cryptopp.com>
* 前端 <https://jquery.com>
* WebRTC <https://github.com/shushushv/webrtc-p2p>

## 部署

nginx 反向代理 `/etc/nginx/sites-enabled/test-pages`

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

upstream websocket {
    server localhost:9002;
}

server {
    listen 9000;
    server_name localhost;
    
    location / {
    root ${code-dir}/front-end;
        index index.html;
        charset utf-8;
    }

    location /api/ {
        proxy_pass http://localhost:9001;
    }

    location /ws-api/ {
        proxy_pass http://websocket;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
```