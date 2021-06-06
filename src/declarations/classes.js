// generate declarations for classes.
// 1) user-facing type such that user can write functions with bound types.
//    this type holds instance-level things such as functions and members

// 2) internal class with constructors / static functions.
//    this is what is actually attached to the module instance
//
// 3) declaration binding internal class to exported module


// user facing type
const getClassUserFacingTypeDeclaation = (module,registry) => classInfo => {
	
}

// internal class
const getClassInternalClassDeclaration = (module,registry) => classInfo => {

}

// binding
const getClassModuleClassDeclaration = (module,registry) => classInfo => {

}
