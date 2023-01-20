#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {};
class B: public A {};

std::shared_ptr<A> MakeSharedA() {
	return std::make_shared<A>(A{});
}

EMSCRIPTEN_BINDINGS(subclass_smart_ptr) {
	class_<A>("A").smart_ptr<std::shared_ptr<A>>("A");
	class_<B,base<A>>("B");
}
