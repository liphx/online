# onlineChatSystem

## 用到的库

* http <https://github.com/yhirose/cpp-httplib>
* 数据库 <https://sqlite.org/index.html>
* JSON <https://github.com/nlohmann/json>
* 加密库 <https://www.cryptopp.com>
* 前端 <https://jquery.com>

## todo

* sql 目前采用拼接的方式，需加fmt
* 数据校验

## DB 

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
