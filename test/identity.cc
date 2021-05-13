#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

int f(int x) {return x;}

EMSCRIPTEN_BINDINGS(voidfunc) {
	function("f",&f);
}
