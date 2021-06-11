#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {
	public:
	int f(int, float) {return 42;}
};

EMSCRIPTEN_BINDINGS(emptyclass) {
	class_<A>("A").
		function("f",&A::f);
}
