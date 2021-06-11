const _doc = {}
const doc = (name,comment) => { _doc[name] = {comment} }

doc('f', '/** does nothing useful */')

const getDoc = ({name}) => _doc[name]

module.exports = getDoc
