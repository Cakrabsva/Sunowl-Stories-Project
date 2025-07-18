'use strict' 

class MyFunction {
    static firstNameGenetrator (id) {
        let sliceId = id.slice(0,5)
        let dummyFirstName = `User${sliceId}`
        return dummyFirstName
    }
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
        }
}

module.exports = {MyFunction}