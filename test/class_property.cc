#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {
	public:
	int x;
};

EMSCRIPTEN_BINDINGS(classproperty) {
	class_<A>("A").
		property("x",&A::x);
}
