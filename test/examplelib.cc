#include <emscripten/bind.h>
using namespace emscripten;

int doubleIt(int x) {return x*2;}

class Multiplier {
	float scale;
	public:
	Multiplier(float _scale):scale(_scale) {}
	float Multiply(float x) {return x*scale;}
};
Multiplier makeDoubler() {return Multiplier(3); }


EMSCRIPTEN_BINDINGS(simplefunc) {
	function("doubleIt",&doubleIt);
	function("makeDoubler",&makeDoubler);
	class_<Multiplier>("Multiplier")
		.constructor<float>()
		.function("multiply",&Multiplier::Multiply)
		;
}
