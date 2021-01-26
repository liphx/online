#include "Sqlite.h"
#include <iostream>
#include <stdexcept>
#include <sqlite3.h>
#include <map>
#include <vector>
#include <string>
#include <algorithm>

Sqlite::Sqlite(const char *filename)
    : db(nullptr)
{
    int ret = sqlite3_open(filename, &db);
    if (ret != SQLITE_OK) {
        throw std::runtime_error(sqlite3_errmsg(db));
    }
}

int Sqlite::execute(const char *sql)
{
    return sqlite3_exec(db, sql, nullptr, nullptr, nullptr);
}

std::vector<std::vector<std::string>> Sqlite::query(const char *sql)
{
    std::vector<std::vector<std::string>> result;
    int ret = sqlite3_exec(db, sql, [](void *data, int num, char **fields, char **names) {
        auto result = (std::vector<std::vector<std::string>> *)data;
        if (result->empty()) {
            std::vector<std::string> name;
            for (int i = 0; i < num; i++) {
                name.emplace_back(names[i]);
            }
            result->emplace_back(name);
        }
        std::vector<std::string> field;
        for (int i = 0; i < num; i++) {
            field.emplace_back(fields[i]);
        }
        result->emplace_back(field);

        return 0;
    }, &result, nullptr);

    if (ret != SQLITE_OK) {
        std::cerr << sqlite3_errmsg(db) << std::endl;
    }
    return result;
}



Sqlite::~Sqlite()
{
    sqlite3_close(db);
    db = nullptr;
}

PreparedStatement::PreparedStatement(Sqlite &db, const char *sql)
    : st(nullptr)
{
    int ret = sqlite3_prepare_v2(db.db, sql, -1, &st, nullptr);
    if (ret != SQLITE_OK) {
        throw std::runtime_error(sqlite3_errmsg(db.db));
    }
}

PreparedStatement::~PreparedStatement()
{
    sqlite3_finalize(st);
    st = nullptr;
}

int PreparedStatement::reset()
{
    return sqlite3_reset(st);
}

// int PreparedStatement::bindvalue(int index, int val)
// {
//     retrun sqlite3_bind_int(st, index, val);
// }

// int PreparedStatement::bindvalue(int index, )

int PreparedStatement::step()
{
    return sqlite3_step(st);
}

int PreparedStatement::column_int(int index)
{
    return sqlite3_column_int(st, index);
}

double PreparedStatement::column_double(int index)
{
    return sqlite3_column_double(st, index);
}

std::string PreparedStatement::column_text(int index)
{
    return (char *)sqlite3_column_text(st, index);
}
