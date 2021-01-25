#include <iostream>
#include <cstdlib>

#include "third_party/cpp-httplib/out/httplib.h"
#include "third_party/nlohmann/json.hpp"
using namespace std;

int main(int argc, char *argv[])
{
    if (argc < 2) {
        exit(1);
    }
    httplib::Server svr;

    svr.Get("/hi", [](const httplib::Request &, httplib::Response &res) {
        res.set_content("Hello World!", "text/plain");
    });

    svr.listen(argv[1], atoi(argv[2]));
    return 0;
}