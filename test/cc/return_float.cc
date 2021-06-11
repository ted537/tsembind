#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

float f() {return 42;}

EMSCRIPTEN_BINDINGS(voidfunc) {
	function("f",&f);
}
