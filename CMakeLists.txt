cmake_minimum_required(VERSION 3.16)

project(tsembind)
include_directories(src)

add_executable(examplelib test/examplelib.cc)
add_executable(voidfunc test/voidfunc.cc)
add_executable(return_int test/return_int.cc)

foreach(executable IN ITEMS examplelib voidfunc return_int)
	target_link_options(${executable} PUBLIC
		-s MODULARIZE --bind
	)

	set_property(
		TARGET ${executable}
		PROPERTY RUNTIME_OUTPUT_DIRECTORY
		${PROJECT_SOURCE_DIR}/lib
	)

endforeach()
