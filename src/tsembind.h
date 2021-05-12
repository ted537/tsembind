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

val as_val(const FunctionDeclaration &functionDeclaration) {
	auto obj = emscripten::val::object();
	obj.set("name",functionDeclaration.name);
	auto types = val::array();
	for (const auto &type : functionDeclaration.types)
		types.call<void>("push",unsigned(type));
	obj.set("types",types);
	return obj;
}

val as_val(const std::vector<FunctionDeclaration> &functionDeclarations) {
	auto array = emscripten::val::array();
	for (const auto &functionDeclaration : functionDeclarations)
		array.call<void>("push",as_val(functionDeclaration));
	return array;
}

val getTypescriptDeclarations() {
	auto declarations = emscripten::val::object();

	declarations.set("functions",as_val(functionDeclarations));

	return declarations;
}

template<typename ReturnType, typename... Args, typename... Policies>
void function(const char* name, ReturnType (*fn)(Args...), Policies...) {
	emscripten::function
		<ReturnType, Args..., Policies...>
		(name, fn);
	typename WithPolicies<Policies...>::template ArgTypeList<ReturnType, Args...> args;

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
