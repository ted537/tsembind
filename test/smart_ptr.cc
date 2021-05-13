#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

class A {};

std::shared_ptr<A> MakeSharedA() {
	return std::make_shared<A>(A{});
}

EMSCRIPTEN_BINDINGS(emptyclass) {
	class_<A>("A")
		.smart_ptr<std::shared_ptr<A>>("A");
	function("MakeSharedA",&MakeSharedA);
}
