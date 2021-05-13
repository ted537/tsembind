#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

int f(int x, int y) {return x+y;}

EMSCRIPTEN_BINDINGS(voidfunc) {
	function("f",&f);
}
