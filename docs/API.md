## API

| method | url | parameters | type | Responses | type |
| -- | -- | -- | -- | -- | -- |
| post | /api/register          | { "name": string, "passwd": string, "email": string } | json | { "status": bool } | json |
| post | /api/login             | { "name": string, "passwd": string } | json | { "status": bool, "session_id": string } | json |
| post | /api/islogin           | { "name": string, "session_id": string } | json | { "status": bool } | json |
| post | /api/information       | { "name": string, "session_id": string } | json | { "information": { "name": string, "email": string } } | json |
| post | /api/alter_password    | { "name": string, "session_id": string, "old_passwd": string, "new_passwd": string } | json | { "status": bool } | json
| post | /api/alter_information | { "name": string, "session_id": string, "email": string } | json | { "status": bool } | json
| post | /api/get_friends       | { "name": string, "session_id": string } | json | { "friends": [ string ] } | json
| post | /api/get_message       | { "name": string, "session_id": string, "friend_name": string, "how": int } | json | { "message": [ { "message" : string, type: string, "name1": string, "name2": string, "time": int } ] } | json
| post | /api/send_message      | { "name": string, "session_id": string, "friend_name": string, "message": string } | json | { "status": bool } | json
| post | /api/add_friend        | { "name": string, "session_id": string, "friend_name": string } | json | { "status": bool } | json
| post | /api/apply_friend      | { "name": string, "session_id": string } | json | { "request": [ string ] } | json
| post | /api/deal_friend       | { "name": string, "session_id": string, "friend_name": string, "agree": bool } | json | { "status": bool } | json
| post | /api/upload_file       | { "name": string, "session_id": string, "friend_name": string, "files": file } | form-data | { "status": bool, "url": string } | json |
