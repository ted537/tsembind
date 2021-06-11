#include <emscripten/bind.h>
using namespace emscripten;

enum class Direction {
	Up = 1
};

EMSCRIPTEN_BINDINGS(enum1) {
	enum_<Direction>("Direction")
		.value("Up",Direction::Up);
}
