# HTTPS 配置

在这里记录 HTTPS 的配置方法。

## 服务器设置

请先准备如下 `conf` 配置文件：  

<CodeViewer 
  title="根证书配置（CA 配置）" 
  filePath="/lib/https/ca.conf"
  language="conf"
/>

<CodeViewer 
  title="服务器证书配置" 
  filePath="/lib/https/server.conf"
  language="conf"
/>

然后运行以下命令生成根证书和服务器证书：  

```bash
mkdir certs && cd certs
openssl genrsa -out ca.key 4096
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt -config ca.conf    # 生成 CA 根证书

openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -config server.conf
    -out server.crt -days 365 -sha256 \
    -extensions v3_req -extfile server.conf
```

```bash
# 在服务器上
sudo cp ca.crt /usr/local/share/ca-certificates/localdev-ca.crt
sudo update-ca-certificates
```

在代码中可以这样使用证书（以 `js` 代码为例）：  

```javascript
const sslOptions = {
    key: fs.readFileSync('/home/ubuntu/certs/server.key'),
    cert: fs.readFileSync('/home/ubuntu/certs/server.crt')
};
```

或者也可以在 `package.json` 里添加相关脚本，并安装 `serve` 以支持 `npm` 操作：  

```javascript
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "serve-https": "vue-cli-service serve --https --host lkmbugjournal.local --port 443",
    "start": "serve dist --ssl-cert certs/server.crt --ssl-key certs/server.key -l 443"
  }
}
```

## 客户端机器

在客户端机器上，打开你常用的浏览器（如 Firefox 或 Chrome），进入设置中的安全/证书相关部分，将生成的根 CA 证书导入（不要导入服务器证书，否则可能报错）。

如需在 Ubuntu 系统下添加本地 CA 证书，可按如下操作：

```bash
sudo cp ca.crt /usr/local/share/ca-certificates/localdev-ca.crt
sudo update-ca-certificates
```

或通过如下方式为 Chrome （或使用 NSS 数据库的浏览器）添加 CA 证书：

```bash
certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "Local Dev CA" -i /usr/local/share/ca-certificates/localdev-ca.crt
# 如果失败，请手动在 Chrome 信任根证书管理中导入
```

### DNS 解析

本地 DNS 解析，可在 `/etc/hosts` 文件中添加如下内容：  

```bash
# 添加：
192.168.13.107 lkmbugjournal.local
```