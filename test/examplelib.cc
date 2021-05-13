#include <emscripten/bind.h>
using namespace emscripten;

int sum(int x, int y) {return x+y;}
int doubleIt(int x) {return x*2;}

class Multiplier {
	int scale;
	public:
	Multiplier(int _scale):scale(_scale) {}
	int Multiply(int x) {return x*scale;}
};
Multiplier makeDoubler() {return Multiplier(3); }


EMSCRIPTEN_BINDINGS(simplefunc) {
	function("doubleIt",&doubleIt);
	function("sum",&sum);
	function("makeDoubler",&makeDoubler);
	class_<Multiplier>("Multiplier")
		.constructor<float>()
		.function("multiply",&Multiplier::Multiply)
		;
}
