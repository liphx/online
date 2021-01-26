#include <iostream>
#include <cstdlib>
#include <map>
#include <ctime>
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
    json ret;
    ret["information"] = nullptr;
    auto name = req.get_param_value("name");
    auto session_id = req.get_param_value("session_id");
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
    print(ret.dump());
    res.set_content(ret.dump(), "application/json"); 
}

void Islogin(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    ret["status"] = false;
    auto name = req.get_param_value("name");
    auto session_id = req.get_param_value("session_id");
    ret["status"] = check_session(name, session_id);

    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void Login(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    ret["status"] = false;
    ret["session_id"] = nullptr;
    auto name = req.get_param_value("name");
    auto passwd = req.get_param_value("passwd");
    if (name == "" || passwd == "") {
        ret["status"] = false;
    } else {
        Sqlite db(db_path);
        string sql = "select * from user where name = '" + name + "' and passwd = '" + passwd + "'";
        print("sql:", sql);
        auto result = db.query(sql.c_str());
        if (result.empty()) {
            ret["status"] = false;
        } else {
            ret["status"] = true;
        }
    }

    if (ret["status"]) { // 记录session 返回给客户端
        session_info info;
        info.create_time = time(nullptr);
        info.session_id = md5(passwd);
        session[name] = info;
        ret["session_id"] = info.session_id;
    }

    print(ret.dump());

    res.set_content(ret.dump(), "application/json"); 
}

void Register(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    auto name = req.get_param_value("name");
    auto passwd = req.get_param_value("passwd");
    auto email = req.get_param_value("email");
    if (name == "" || passwd == "" || email == "") {
        ret["status"] = false;
    } else {
        Sqlite db(db_path);
        string sql = "select * from user where name = '" + name + "'";
        print("sql:", sql);
        auto result = db.query(sql.c_str());
        if (!result.empty()) { // 用户已存在
            ret["status"] = false;
        } else {
            string sql = "insert into user values('" + name + "', '" + passwd + "',  '" + email + "')";
            print("sql:", sql);
            int db_ret = db.execute(sql.c_str());
            if (db_ret != SQLITE_OK) {
                ret["status"] = false;
            } else {
                ret["status"] = true;
            }
        }

        ret["status"] = true;
    }
    print(ret.dump());

    res.set_content(ret.dump(), "application/json"); 
}

void AlterPassword(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    ret["status"] = false;
    auto name = req.get_param_value("name");
    auto session_id = req.get_param_value("session_id");
    auto old_passwd = req.get_param_value("old_passwd");
    auto new_passwd = req.get_param_value("new_passwd");
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
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void AlterInformation(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    ret["status"] = false;
    auto name = req.get_param_value("name");
    auto session_id = req.get_param_value("session_id");
    auto email = req.get_param_value("email");
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
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void GetFriends(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    ret["friends"] = nullptr;
    auto name = req.get_param_value("name");
    auto session_id = req.get_param_value("session_id");
    if (check_session(name, session_id)) {
        Sqlite db(db_path);
        string sql = "select name2 from friends where name1 = '" + name + "'";
        print("sql:", sql);
        auto result = db.query(sql.c_str());
        for (int i = 1; i < result.size(); i++) {
            ret["friends"][i - 1] = result[i][0];
        }
    }
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void GetMessage(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    ret["message"] = nullptr;
    auto name = req.get_param_value("name");
    auto session_id = req.get_param_value("session_id");
    auto friend_name = req.get_param_value("friend_name");
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
        auto pr = message_cache.equal_range(name);
        if (pr.first != message_cache.end()) {
            auto iter = pr.first;
            int i = 0;
            for (; iter != pr.second; i++) {
                if (friend_name == iter->second.from) {
                    ret["message"][i]["name1"] = iter->second.from;
                    ret["message"][i]["name2"] = iter->second.to;
                    ret["message"][i]["message"] = iter->second.message;
                    iter = message_cache.erase(iter); // 注意迭代器失效
                } else {
                    iter++;
                }
            }
        }
         
    }
    print(ret.dump());
    res.set_content(ret.dump(), "application/json");
}

void SendMessage(const httplib::Request &req, httplib::Response &res)
{
    json ret;
    ret["status"] = false;
    auto name = req.get_param_value("name");
    auto session_id = req.get_param_value("session_id");
    auto friend_name = req.get_param_value("friend_name");
    auto message = req.get_param_value("message");
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
    print(ret.dump());
    //print_message_cache();
    res.set_content(ret.dump(), "application/json");
}


int main(int argc, char *argv[])
{
    if (argc < 2) {
        exit(1);
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

    // svr.Post("/api/add_friends", AddFriends);

    svr.listen(argv[1], atoi(argv[2]));
    return 0;
}