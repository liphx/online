#ifndef DB_H_
#define DB_H_

#include <sqlite3.h>
#include <vector>
#include <string>

class Sqlite {
public:
    Sqlite(const char *filename);
    Sqlite(const Sqlite&) = delete;
    ~Sqlite();
    int execute(const char *sql);
    std::vector<std::vector<std::string>> query(const char *sql); // 若结结果不为空，第一列返回字段名称
private:
    friend class PreparedStatement;
    sqlite3 *db; // db handle
    
};

class PreparedStatement {
public:
    PreparedStatement(Sqlite &db, const char *sql);
    ~PreparedStatement();
    int reset();
    int step();
    int column_int(int index);
    std::string column_text(int index);
    double column_double(int index);

private:
    sqlite3_stmt *st;

};

#endif // DB_H_
