cmake_minimum_required(VERSION 3.16)

project(tsembind)
include_directories(src)

add_executable(examplelib test/examplelib.cc)
target_link_options(examplelib PUBLIC
	-s MODULARIZE --bind
)

set_property(
	TARGET examplelib
	PROPERTY RUNTIME_OUTPUT_DIRECTORY
	${PROJECT_SOURCE_DIR}/lib
)
