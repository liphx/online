all:main

main:main.cpp Sqlite.o httplib.o
	gcc -o main main.cpp Sqlite.o httplib.o -lpthread -lstdc++ -lsqlite3

Sqlite.o:Sqlite.cpp Sqlite.h
	gcc -c Sqlite.cpp

httplib.o:
	gcc -c third_party/cpp-httplib/out/httplib.cc

clean:
	rm -rf *.o main test.db