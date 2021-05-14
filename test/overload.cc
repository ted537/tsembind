#include <emscripten/bind.h>
using namespace emscripten;

void f() {}
void f(int x) {}

EMSCRIPTEN_BINDINGS(overload) {
	function("f",select_overload<void()>(&f));
	function("f",select_overload<void(int)>(&f));
}
