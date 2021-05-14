#include <emscripten/bind.h>
using namespace emscripten;

std::string f() {return "hello world";}

EMSCRIPTEN_BINDINGS(returnsring) {
	function("f",&f);
}
