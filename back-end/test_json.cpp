#include "third_party/nlohmann/json.hpp"
#include <iostream>
using namespace std;
using json = nlohmann::json;

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

int main(int argc, char *argv[])
{
    if (argc < 2) 
        return 1;
    json j;
    string name;
    try {
        j = json::parse(argv[1]);
        name = j.at("name").get<string>();
    } catch (exception) {
        print("json::parse error");
    }
    print(name);

    //print(j.dump());
}