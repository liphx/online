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
    ret |= db.execute("create table IF NOT EXISTS user(id int, name string, passwd string, PRIMARY KEY (id))");
    ret |= db.execute("insert into user values(0, 'abc', '123')");
    ret |= db.execute("insert into user values(1, 'abc', '123')");
    auto result = db.query("select * from user");
    print("ret = ", ret);
    for (auto x: result) {
        for (auto y: x)
            cout << y << "\t";
        cout << endl;
    }
    print("===============");

    PreparedStatement st(db, "select * from user");
    print("id", "name", "passwd");
    while (st.step() == SQLITE_ROW) {
        int id = st.column_int(0);
        string name = st.column_text(1);
        string passwd = st.column_text(2);
        print(id, name, passwd);
    }

}