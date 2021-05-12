project(tsembind)
include_directories(src)

add_executable(simplefunc test/simplefunc.cc)
target_link_options(simplefunc PUBLIC
	-s MODULARIZE --bind
	-sEXPORTED_RUNTIME_METHODS=[registeredTypes] 
)
