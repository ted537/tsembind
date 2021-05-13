#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {
	public:
	void f() {}
};

EMSCRIPTEN_BINDINGS(emptyclass) {
	class_<A>("A").
		function("f",&A::f);
}
