#include "tsembind.h"

int doubleIt(int x) {return x*2;}

EMSCRIPTEN_BINDINGS(simplefunc) {
	tsembind::function("doubleIt",&doubleIt);
}
