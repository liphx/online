## DB 

```sql
DROP TABLE IF EXISTS user;
create table IF NOT EXISTS user(name string, passwd string, email string, PRIMARY KEY (name));
delete from user;

DROP TABLE IF EXISTS friends;
create table IF NOT EXISTS friends(name1 string, name2 string, PRIMARY KEY (name1, name2));
delete from friends;

DROP TABLE IF EXISTS message;
create table IF NOT EXISTS message(name1 string, name2 string, message string, time int);
delete from message;

DROP TABLE IF EXISTS files;
create table IF NOT EXISTS files(name1 string, name2 string, url string, time int);
delete from files;
```
