#include <emscripten/bind.h>
#include <iostream>
using namespace emscripten;

void f(const val &obj) {std::cout<<"hi"<<std::endl;}

EMSCRIPTEN_BINDINGS(voidfunc) {
	function("f",&f);
}
