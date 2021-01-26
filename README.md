# onlineChatSystem

## 用到的库

* http <https://github.com/yhirose/cpp-httplib>
* 数据库 <https://sqlite.org/index.html>
* JSON <https://github.com/nlohmann/json.git>
* 加密库 <https://www.cryptopp.com>
* 前端 <https://jquery.com>

## todo

* sql 目前采用拼接的方式，需加fmt
* 校验
* session 定时器

## db 

```sql
DROP TABLE IF EXISTS user;
create table IF NOT EXISTS user(name string, passwd string, email string, PRIMARY KEY (name));
delete from user;

DROP TABLE IF EXISTS friends;
create table IF NOT EXISTS friends(name1 string, name2 string, PRIMARY KEY (name1, name2));
delete from friends;

DROP TABLE IF EXISTS message;
create table IF NOT EXISTS message(name1 string, name2 string, message string);
delete from message;
```

## json

* /api/register { "name":STRING, "passwd":STRING, "email":STRING } => { "status": BOOL }
* /api/login { "name":STRING, "passwd":STRING } => { "status": BOOL, "session_id": STRING }
* /api/islogin { "name":STRING, "session_id": STRING } => { "status": BOOL }
* /api/information { "name":STRING, "session_id": STRING } => { "information": { "name":STRING, "email":STRING } }
* /api/alter_password { "name":STRING, "session_id": STRING, "old_passwd": STRING, "new_passwd": STRING } => { "status": BOOL }
* /api/alter_information { "name":STRING, "session_id": STRING, "email": STRING } => { "status": BOOL }
* /api/get_friends { "name":STRING, "session_id": STRING } => { "friends": LIST }
* /api/get_message { "name":STRING, "session_id": STRING, "firend_name: STRING } => { "message": LIST }
* /api/send_message { "name":STRING, "session_id": STRING, "firend_name: STRING, "message": STRING } => { "status": BOOL }
* /api/add_friends { "name":STRING, "session_id": STRING, "firend_name: STRING } => { "status": BOOL }
