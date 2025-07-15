'use strict' 

class MyFunction {
    static firstNameGenetrator (id) {
        let sliceId = id.slice(0,5)
        let dummyFirstName = `User${sliceId}`
        return dummyFirstName
    }
}

module.exports = {MyFunction}