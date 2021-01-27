#include <iostream>
#include <cstdlib>
#include <map>
#include <ctime>
#include <unistd.h>
#include "Sqlite.h"
#define CRYPTOPP_ENABLE_NAMESPACE_WEAK 1
#include <cryptopp/md5.h>
#include <cryptopp/hex.h>
#include "third_party/cpp-httplib/httplib.h"
#include "third_party/nlohmann/json.hpp"

using namespace std;
using json = nlohmann::json;
using namespace CryptoPP;

const char db_path[] = "./test.db";
bool test_flag = false;
string test_session_id = "123456";

void print()
{
    cout << endl;
}

template <typename T, typename... Types>
void print(const T& firstArg, const Types&... args)
{
    cout << firstArg << ' ';
    print(args...);
}

string md5(string msg)
{
    Weak::MD5 hash;
    std::string digest;
    hash.Update((const byte*)msg.data(), msg.size());
    digest.resize(hash.DigestSize());
    hash.Final((byte*)&digest[0]);
    string out;
    StringSource ss(digest, true, new HexEncoder(new StringSink(out)));
    return out;
}

int session_timeout = 20 * 60; // 20 mins

struct session_info {
    string session_id;
    time_t create_time;
};

map<string, session_info> session;

struct message_info {
    string from;
    string to;
    string message;
};

multimap<string, message_info> message_cache;
multimap<string, string> friend_request;

void print_message_cache()
{
    for (auto i: message_cache) {
        print("print_message_cache", i.first, i.second.from, i.second.to, i.second.message);
    }
}

bool check_session(string name, string session_id)
{
    if (name == "" || session_id == "") {
        return false;
    }
    auto iter = session.find(name);
    if (iter == session.end() || session_id != iter->second.session_id) { 
        return false;
    }
    return true;
}

void Information(const httplib::Request &req, httplib::Response &res)
{
    print("POST Information");
    json body, ret;
    ret["information"] = nullptr;

    string name, session_id;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
    } catch (exception) {
        print("json::parse error");
        res.set_content(ret.dump(), "application/json"); 
        return;
    }

    if (check_session(name, session_id)) {
        Sqlite db(db_path);
        string sql = "select name, email from user where name = '" + name + "'";
        print("sql:", sql);
        auto result = db.query(sql.c_str());
        if (result.size() > 1) {
            for (int i = 0; i < result[0].size(); i++) {
                ret["information"][result[0][i]] = result[1][i];
            }
            
        }
    }
    res.set_content(ret.dump(), "application/json");
}

void Islogin(const httplib::Request &req, httplib::Response &res)
{
    print("POST Islogin");
    json body, ret;
    string name, session_id;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
        print(name, session_id);

        ret["status"] = check_session(name, session_id);
    } catch (exception) {
        print("json::parse error");
        ret["status"] = false;
    }

    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void Login(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    goto start;
err:
    ret["status"] = false;
    ret["session_id"] = nullptr;
    res.set_content(ret.dump(), "application/json");
    return;
start:
    print("POST Login");
    json body;
    string name, passwd;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        passwd = body.at("passwd").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto err;
    }
  
    if (name == "" || passwd == "") {
        goto err;
    }

    Sqlite db(db_path);
    string sql = "select * from user where name = '" + name + "' and passwd = '" + passwd + "'";
    print("sql:", sql);
    auto result = db.query(sql.c_str());
    if (result.empty()) {
        goto err;
    } else {
        ret["status"] = true;
    }
    
    if (ret["status"]) { // 记录session 返回给客户端
        session_info info;
        info.create_time = time(nullptr);
        info.session_id = md5(passwd);
        if (test_flag) { // for test
            info.session_id = test_session_id;
        }
        session[name] = info;
        ret["session_id"] = info.session_id;
    }

    print(ret.dump());
    res.set_content(ret.dump(), "application/json"); 
}

void Register(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    goto start;
err:
    ret["status"] = false;
    res.set_content(ret.dump(), "application/json");
    return;
start:
    print("POST Register");
    json body;
    string name, passwd, email;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        passwd = body.at("passwd").get<string>();
        email = body.at("email").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto err;
    }
    print(name, passwd, email);
    if (name == "" || passwd == "" || email == "") {
        goto err;
    }

    Sqlite db(db_path);
    string sql = "select * from user where name = '" + name + "'";
    print("sql:", sql);
    auto result = db.query(sql.c_str());
    if (!result.empty()) { // 用户已存在
        goto err;
    } 

    sql = "insert into user values('" + name + "', '" + passwd + "',  '" + email + "')";
    print("sql:", sql);
    int db_ret = db.execute(sql.c_str());
    if (db_ret != SQLITE_OK) {
        goto err;
    }
    
    ret["status"] = true;
    res.set_content(ret.dump(), "application/json");
}

void AlterPassword(const httplib::Request &req, httplib::Response &res)
{
    print("POST AlterPassword");
    json body, ret;
    ret["status"] = false;
    string name, session_id, old_passwd, new_passwd;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
        old_passwd = body.at("old_passwd").get<string>();
        new_passwd = body.at("new_passwd").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }
    
    print(name, session_id, old_passwd, new_passwd);
    if (old_passwd != "" && new_passwd != "" && check_session(name, session_id)) {
        Sqlite db(db_path);
        string sql = "select * from user where name = '" + name + "' and passwd = '" + old_passwd + "'";
        print("sql:", sql);
        auto result = db.query(sql.c_str());
        if (!result.empty()) {
            sql = "update user set passwd = '" + new_passwd + "' where name = '" + name + "' and passwd = '" + old_passwd + "'";
            print("sql:", sql);
            int db_ret = db.execute(sql.c_str());
            if (db_ret != SQLITE_OK) {
                ret["status"] = false;
            } else {
                ret["status"] = true;
            }
        }
    }
result:
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void AlterInformation(const httplib::Request &req, httplib::Response &res)
{
    print("POST AlterInformation");
    json body, ret;
    ret["status"] = false;

    string name, session_id, email;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
        email = body.at("email").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }

    if (email != "" && check_session(name, session_id)) {
        Sqlite db(db_path);
        string sql = "update user set email = '" + email + "' where name = '" + name + "'";
        print("sql:", sql);
        int db_ret = db.execute(sql.c_str());
        if (db_ret != SQLITE_OK) {
            ret["status"] = false;
        } else {
            ret["status"] = true;
        }
    }

result:
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void GetFriends(const httplib::Request &req, httplib::Response &res)
{
    print("POST GetFriends");
    json body, ret;
    ret["friends"] = nullptr;

    string name, session_id;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }

    if (check_session(name, session_id)) {
        Sqlite db(db_path);
        string sql = "select name2 from friends where name1 = '" + name + "'";
        print("sql:", sql);
        auto result = db.query(sql.c_str());
        for (int i = 1; i < result.size(); i++) {
            ret["friends"][i - 1] = result[i][0];
        }
    }

result:
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void GetMessage(const httplib::Request &req, httplib::Response &res)
{
    print("POST GetMessage");
    json body, ret;
    ret["message"] = nullptr;

    string name, session_id, friend_name;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
        friend_name = body.at("friend_name").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }

    print(name, session_id, friend_name);
    if (friend_name != "" && check_session(name, session_id)) {
        // Sqlite db(db_path);
        // string sql = "select * from message where (name1='" + name + "' and name2='" + friend_name + 
        //     "') or (name1='" + friend_name + "' and name2='" + name + "')";
        // print("sql:", sql);
        // auto result = db.query(sql.c_str());
        // for (int i = 1; i < result.size(); i++) {
        //     ret["message"][i - 1]["name1"] = result[i][0];
        //     ret["message"][i - 1]["name2"] = result[i][1];
        //     ret["message"][i - 1]["message"] = result[i][2];
        // }
        bool has_new_message = false;
        for (;;) { // 长轮询
            auto pr = message_cache.equal_range(name);
            if (pr.first != message_cache.end()) {
                auto iter = pr.first;
                int i = 0;
                for (; iter != pr.second; i++) {
                    if (friend_name == iter->second.from) {
                        has_new_message = true;
                        ret["message"][i]["name1"] = iter->second.from;
                        ret["message"][i]["name2"] = iter->second.to;
                        ret["message"][i]["message"] = iter->second.message;
                        iter = message_cache.erase(iter); // 注意迭代器失效
                    } else {
                        iter++;
                    }
                }
            }
            if (has_new_message) {
                break;
            } else { // 没有消息，阻塞
                sleep(2);
            }
        }
         
    }

result:
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void SendMessage(const httplib::Request &req, httplib::Response &res)
{
    print("POST SendMessage");
    json body, ret;
    ret["status"] = false;

    string name, session_id, friend_name, message;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
        friend_name = body.at("friend_name").get<string>();
        message = body.at("message").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }

    if (friend_name != "" && message != "" && check_session(name, session_id)) {
        Sqlite db(db_path);
        string sql = "insert into message values('" + name + "', '" + friend_name + 
            "', '" + message + "')";
        print("sql:", sql);
        int db_ret = db.execute(sql.c_str());
        if (db_ret != SQLITE_OK) {
            ret["status"] = false;
        } else {
            ret["status"] = true;
            message_info info;
            info.from = name;
            info.to = friend_name;
            info.message = message;
            message_cache.insert(make_pair(friend_name, info));
        }
    }

result:
    print(ret.dump());
    //print_message_cache();
    res.set_content(ret.dump(), "application/json");
}

void AddFriend(const httplib::Request &req, httplib::Response &res)
{
    print("POST AddFriend");
    json body, ret;
    ret["status"] = false;

    string name, session_id, friend_name;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
        friend_name = body.at("friend_name").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }

    if (friend_name != "" && check_session(name, session_id)) {
        Sqlite db(db_path);
        string sql = "select * from user where name = '" + friend_name + "'";
        print("sql:", sql);
        auto result = db.query(sql.c_str());
        if (result.empty()) { // 用户不存在
            ret["status"] = false;
        } else {
            sql = "select * from friends where (name1='" + name + "' and name2='" + friend_name + "')";
            result = db.query(sql.c_str());
            if (!result.empty()) { // 已经是好友
                ret["status"] = false;
            } else {
                ret["status"] = true;
                bool is_in_request = false;
                auto pr = friend_request.equal_range(friend_name);
                if (pr.first != friend_request.end()) {
                    for (auto iter = pr.first; iter != pr.second; iter++) {
                        if (iter->second == name) {
                            is_in_request = true; // 已经请求过了
                            break;
                        }
                    }
                }
                if (!is_in_request) {
                    friend_request.insert(make_pair(friend_name, name));
                }
            }
        }
    }

result:
    print(ret.dump());
    // for (auto i: friend_request) {
    //     print("friend_request", i.first, i.second);
    // }
    res.set_content(ret.dump(), "application/json");
}

void ApplyFriend(const httplib::Request &req, httplib::Response &res)
{
    print("POST ApplyFriend");
    json body, ret;
    ret["request"] = nullptr;

    string name, session_id;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }
    
    if (check_session(name, session_id)) {
        auto pr = friend_request.equal_range(name);
        if (pr.first != friend_request.end()) {
            int i = 0;
            for (auto iter = pr.first; iter != pr.second; iter++, i++) {
                ret["request"][i] = iter->second;
            }
        }
    }

result:
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void DealFriend(const httplib::Request &req, httplib::Response &res)
{
    print("POST DealFriend");
    json body, ret;
    ret["status"] = false;

    string name, session_id, friend_name, agree;
    try {
        body = json::parse(req.body);
        name = body.at("name").get<string>();
        session_id = body.at("session_id").get<string>();
        friend_name = body.at("friend_name").get<string>();
        agree = body.at("agree").get<string>();
    } catch (exception) {
        print("json::parse error");
        goto result;
    }

    print("deal_friend", name, friend_name, agree);
    if (friend_name != "" && check_session(name, session_id)) {
        auto pr = friend_request.equal_range(name);
        if (pr.first != friend_request.end()) {
            for (auto iter = pr.first; iter != pr.second; iter++) {
                if (iter->second == friend_name) {
                    friend_request.erase(iter);
                    if (agree == "true") { // 写入db
                        Sqlite db(db_path);
                        string sql = "insert into friends values('" + name + "', '" + friend_name + "')";
                        int db_ret = db.execute(sql.c_str());
                        sql = "insert into friends values('" + friend_name + "', '" + name + "')";
                        db_ret |= db.execute(sql.c_str());
                        if (db_ret != SQLITE_OK) {
                            ret["status"] = false;
                        } else {
                            ret["status"] = true;
                        }
                    }
                    break;
                }
            }
        }
    }

result:
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

int main(int argc, char *argv[])
{
    if (argc < 2) {
        exit(1);
    }
    if (argc >= 4 && argv[3] == string("--test")) {
        test_flag = true;
    }

    httplib::Server svr;

    svr.Post("/api/register", Register);
    svr.Post("/api/login", Login);
    svr.Post("/api/islogin", Islogin);
    svr.Post("/api/information", Information);
    svr.Post("/api/alter_password", AlterPassword);
    svr.Post("/api/alter_information", AlterInformation);
    svr.Post("/api/get_friends", GetFriends);
    svr.Post("/api/get_message", GetMessage);
    svr.Post("/api/send_message", SendMessage);
    svr.Post("/api/add_friend", AddFriend);
    svr.Post("/api/apply_friend", ApplyFriend);
    svr.Post("/api/deal_friend", DealFriend);

    svr.listen(argv[1], atoi(argv[2]));
    return 0;
}
