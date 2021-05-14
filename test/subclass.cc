#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {};
class B: public A {};


EMSCRIPTEN_BINDINGS(subclass) {
	class_<A>("A");
	class_<B,base<A>>("B");
}
