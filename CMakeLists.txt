cmake_minimum_required(VERSION 3.16)

project(tsembind)
include_directories(src)

add_executable(examplelib test/examplelib.cc)
add_executable(voidfunc test/voidfunc.cc)
add_executable(overload test/overload.cc)
add_executable(return_int test/return_int.cc)
add_executable(return_float test/return_float.cc)
add_executable(return_bool test/return_bool.cc)
add_executable(identity test/identity.cc)
add_executable(sum test/sum.cc)
add_executable(emptyclass test/empty_class.cc)
add_executable(smartptr test/smart_ptr.cc)
add_executable(emptyenum test/empty_enum.cc)
add_executable(enum1 test/enum1.cc)
add_executable(enum2 test/enum2.cc)
add_executable(constructor test/constructor.cc)
add_executable(constructor_args test/constructor_args.cc)
add_executable(classmethod test/class_method.cc)
add_executable(classclassmethod test/class_class_method.cc)
add_executable(classmethodmultiparam test/class_method_multi_param.cc)

foreach(executable IN ITEMS 
		# general
		examplelib 
		# free functions	
		voidfunc return_int return_float return_bool identity sum overload
		# classes
		emptyclass constructor constructor_args
		classmethod classclassmethod classmethodmultiparam
		smartptr
		# enums
		emptyenum enum1 enum2
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
