#!/bin/bash

rm -f test.db

make
./main 127.0.0.1 5000 --test > /dev/null 2>&1 & 
pid_of_main=$!

sqlite3 test.db <<EOF
DROP TABLE IF EXISTS user;
create table IF NOT EXISTS user(name string, passwd string, email string, PRIMARY KEY (name));
delete from user;

DROP TABLE IF EXISTS friends;
create table IF NOT EXISTS friends(name1 string, name2 string, PRIMARY KEY (name1, name2));
delete from friends;

DROP TABLE IF EXISTS message;
create table IF NOT EXISTS message(name1 string, name2 string, message string);
delete from message;
EOF

function curl_post()
{
    url=$1
    data=$2
    curl --header "Content-Type: application/json" --request POST --data "${data}" "${url}" 2> /dev/null
}

url_prefix='http://127.0.0.1:5000'
test_set_api=(
    '/api/register'
    '/api/login'
    '/api/islogin'
    '/api/information'
    '/api/alter_password'
    '/api/alter_information'
)

test_set_data=(
    '{ "name": "abc", "passwd": "123", "email": "123@abc.com" }'
    '{ "name": "abc", "passwd": "123" }'
    '{ "name": "abc", "session_id": "123456" }'
    '{ "name": "abc", "session_id": "123456" }'
    '{ "name": "abc", "session_id": "123456", "old_passwd": "123", "new_passwd": "321" }'
)

test_set_expect=(
    '{"status":true}'
    '{"session_id":"123456","status":true}'
    '{"status":true}'
    '{"information":{"email":"123@abc.com","name":"abc"}}'
    '{"status":true}'
)

function test_main()
{
    let "pass = 0"
    for i in ${!test_set_api[@]}; do
      result=$(curl_post "${url_prefix}${test_set_api[$i]}" "${test_set_data[$i]}")
      if [ "$result" = "${test_set_expect[$i]}" ]; then
          let "pass = pass + 1"
      else
          echo "test case $i failed"
      fi
    done
    echo "$pass PASSED"
}

test_main
kill -9 $pid_of_main
