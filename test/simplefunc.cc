#include <emscripten/bind.h>

int doubleIt(int x) {return x*2;}

EMSCRIPTEN_BINDINGS(simplefunc) {
	emscripten::function("doubleIt",&doubleIt);
}
