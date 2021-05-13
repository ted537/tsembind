cmake_minimum_required(VERSION 3.16)

project(tsembind)
include_directories(src)

add_executable(examplelib test/examplelib.cc)
add_executable(voidfunc test/voidfunc.cc)
add_executable(return_int test/return_int.cc)
add_executable(return_float test/return_float.cc)
add_executable(identity test/identity.cc)
add_executable(sum test/sum.cc)
add_executable(emptyclass test/empty_class.cc)
add_executable(constructor test/constructor.cc)
add_executable(classmethod test/class_method.cc)
add_executable(classmethodmultiparam test/class_method_multi_param.cc)

foreach(executable IN ITEMS 
		examplelib voidfunc return_int return_float identity sum
		emptyclass constructor classmethod classmethodmultiparam
)
	target_link_options(${executable} PUBLIC
		-s MODULARIZE --bind
	)

	set_property(
		TARGET ${executable}
		PROPERTY RUNTIME_OUTPUT_DIRECTORY
		${PROJECT_SOURCE_DIR}/lib
	)

endforeach()
