#include <iostream>
#include <fstream>
#include "Sqlite.h"
using namespace std;

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

int main()
{
    Sqlite db("test.db");
    int ret = SQLITE_OK;
    ret |= db.execute("create table IF NOT EXISTS user(name string, passwd string, email string, PRIMARY KEY (name))");
    ret |= db.execute("insert into user values('abc', '123', '0.qq')");
    ret |= db.execute("insert into user values('abd', '123', '1.qq')");
    auto result = db.query("select * from user");
    print("ret = ", ret);
    for (auto x: result) {
        for (auto y: x)
            cout << y << "\t";
        cout << endl;
    }
    print("===============");

    PreparedStatement st(db, "select * from user");
    print("name", "passwd");
    while (st.step() == SQLITE_ROW) {
        string name = st.column_text(0);
        string passwd = st.column_text(1);
        print(name, passwd);
    }

}