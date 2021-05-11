#pragma once
#include <string>
#include <sstream>
#include <iostream>
#include <emscripten.h>
#include <emscripten/bind.h>

namespace tsembind {
using namespace emscripten;
using namespace emscripten::internal;

struct FunctionDeclaration {
	std::string name;
	std::vector<TYPEID> types;
};
	
std::vector<FunctionDeclaration> functionDeclarations;
emscripten::val getTypescriptDeclarations() {
	auto declarations = emscripten::val::object();

	declarations.set("x","y");

	return declarations;
}

template<typename ReturnType, typename... Args, typename... Policies>
void function(const char* name, ReturnType (*fn)(Args...), Policies...) {
	emscripten::function
		<ReturnType, Args..., Policies...>
		(name, fn);
	typename WithPolicies<Policies...>::template ArgTypeList<ReturnType, Args...> args;

	//_embind_register_function_ts_declaration(name,args.getCount(),args.getTypes());
	//functionDeclarations.insert(args.getTypes(),args.getTypes()+args.getCount());
	functionDeclarations.push_back(FunctionDeclaration {
			name,
			std::vector<TYPEID>(
				args.getTypes(), args.getTypes()+args.getCount()
			)
	});
}

EMSCRIPTEN_BINDINGS(tsembind) {
	emscripten::function("getTypescriptDeclarations",&getTypescriptDeclarations);
}

}
