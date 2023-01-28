cmake_minimum_required(VERSION 3.16)

project(tsembind)
include_directories(src)

add_executable(examplelib test/cc/examplelib.cc)
add_executable(voidfunc test/cc/voidfunc.cc)
add_executable(emval test/cc/emval.cc)
add_executable(optimized test/cc/voidfunc.cc)
add_executable(overload test/cc/overload.cc)
add_executable(return_int test/cc/return_int.cc)
add_executable(return_float test/cc/return_float.cc)
add_executable(return_bool test/cc/return_bool.cc)
add_executable(return_string test/cc/return_string.cc)
add_executable(identity test/cc/identity.cc)
add_executable(sum test/cc/sum.cc)
add_executable(emptyclass test/cc/empty_class.cc)
add_executable(subclass test/cc/subclass.cc)
add_executable(smartptr test/cc/smart_ptr.cc)
add_executable(subclass_smartptr test/cc/subclass_smart_ptr.cc)
add_executable(emptyenum test/cc/empty_enum.cc)
add_executable(enum1 test/cc/enum1.cc)
add_executable(enum2 test/cc/enum2.cc)
add_executable(constructor test/cc/constructor.cc)
add_executable(constructor_args test/cc/constructor_args.cc)
add_executable(classmethod test/cc/class_method.cc)
add_executable(classproperty test/cc/class_property.cc)
add_executable(classclassmethod test/cc/class_class_method.cc)
add_executable(classmethodmultiparam test/cc/class_method_multi_param.cc)
add_executable(symbol_method test/cc/symbol_method.cc)

foreach(executable IN ITEMS 
		# general
		examplelib 
		# free functions	
		voidfunc identity sum overload emval
		return_int return_float return_bool return_string
		optimized
		# classes
		emptyclass constructor constructor_args subclass
		classmethod classclassmethod classmethodmultiparam classproperty
		smartptr subclass_smartptr
		# enums
		emptyenum enum1 enum2
		# symbols
		symbol_method
)
	target_link_options(${executable} PUBLIC
		-s MODULARIZE --bind
	)

	set_property(
		TARGET ${executable}
		PROPERTY RUNTIME_OUTPUT_DIRECTORY
		${PROJECT_SOURCE_DIR}/test/lib
	)

endforeach()

target_link_options(optimized PUBLIC -O3)

add_executable(nonmodule test/cc/voidfunc.cc)
target_link_options(nonmodule PUBLIC --bind)

set_property(
	TARGET nonmodule
	PROPERTY RUNTIME_OUTPUT_DIRECTORY
	${PROJECT_SOURCE_DIR}/test/lib
)
