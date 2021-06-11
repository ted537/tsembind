#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

int f() {return 42;}

EMSCRIPTEN_BINDINGS(voidfunc) {
	function("f",&f);
}
