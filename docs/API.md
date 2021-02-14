## API

* /api/register { "name":STRING, "passwd":STRING, "email":STRING } => { "status": BOOL }
* /api/login { "name":STRING, "passwd":STRING } => { "status": BOOL, "session_id": STRING }
* /api/islogin { "name":STRING, "session_id": STRING } => { "status": BOOL }
* /api/information { "name":STRING, "session_id": STRING } => { "information": { "name":STRING, "email":STRING } }
* /api/alter_password { "name":STRING, "session_id": STRING, "old_passwd": STRING, "new_passwd": STRING } => { "status": BOOL }
* /api/alter_information { "name":STRING, "session_id": STRING, "email": STRING } => { "status": BOOL }
* /api/get_friends { "name":STRING, "session_id": STRING } => { "friends": LIST }
* /api/get_message { "name":STRING, "session_id": STRING, "friend_name": STRING, "how": INT } => { "message": LIST }
* /api/send_message { "name":STRING, "session_id": STRING, "friend_name": STRING, "message": STRING } => { "status": BOOL }
* /api/add_friend { "name":STRING, "session_id": STRING, "friend_name": STRING } => { "status": BOOL }
* /api/apply_friend { "name":STRING, "session_id": STRING } => { "request": LIST }
* /api/deal_friend { "name":STRING, "session_id": STRING, "friend_name": STRING, "agree": STRING } => { "status": BOOL }