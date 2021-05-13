#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {};

EMSCRIPTEN_BINDINGS(emptyclass) {
	class_<A>("A");
}
