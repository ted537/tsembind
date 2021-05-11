#pragma once
#include <emscripten.h>
#include <emscripten/bind.h>

namespace tsembind {
using namespace emscripten;

extern "C" {

void _embind_register_function_ts_declaration(
		const char name,
		unsigned argCount,
		const emscripten::internal::TYPEID argTypes[]
);

}

template<typename ReturnType, typename... Args, typename... Policies>
void function(const char* name, ReturnType (*fn)(Args...), Policies...) {
	emscripten::function
		<ReturnType, Args..., Policies...>
		(name, fn);
}

}
