#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {
	public:
	A(int x, float y) {}
};

EMSCRIPTEN_BINDINGS(emptyclass) {
	class_<A>("A")
		.constructor<int,float>();
}
