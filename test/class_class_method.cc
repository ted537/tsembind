#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {
	public:
};

void f() {}

EMSCRIPTEN_BINDINGS(emptyclass) {
	class_<A>("A").
		class_function("f",&f);
}
