#include <iostream>
#include <cstdlib>

#include "Sqlite.h"

#include "third_party/cpp-httplib/out/httplib.h"
#include "third_party/nlohmann/json.hpp"
using namespace std;
using json = nlohmann::json;

void print()
{
    cout << endl;
}

template <typename T, typename... Types>
void print(const T& firstArg, const Types&... args)
{
    cout << firstArg << '\t';
    print(args...);
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
        Sqlite db("test.db");
        auto result = db.query(("select * from user where name = " + name).c_str());
        if (!result.empty()) { // 用户已存在
            ret["status"] = false;
        } else {
            int db_ret = db.execute(("insert into user values('" + name + "', '" + passwd + "',  '" + email + "')").c_str());
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

int main(int argc, char *argv[])
{
    if (argc < 2) {
        exit(1);
    }
    httplib::Server svr;

    svr.Post("/api/register", Register);

    svr.listen(argv[1], atoi(argv[2]));
    return 0;
}