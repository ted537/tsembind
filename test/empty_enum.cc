#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

enum class Direction { };

EMSCRIPTEN_BINDINGS(emptyenum) {
	enum_<Direction>("Direction");
}
