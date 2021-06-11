#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

bool f() {return true;}

EMSCRIPTEN_BINDINGS(returnbool) {
	function("f",&f);
}
