#include <emscripten/bind.h>
#include <string>

using namespace emscripten;

struct CustomObj {};

EMSCRIPTEN_BINDINGS(voidfunc) {
	class_<CustomObj>("CustomObj")
        .constructor()
        .function("@@iterator", optional_override([](CustomObj const& cm) {
            // The return value doesn't matter. We only want to test the method name.
            return val("iterator");
        }));
}
