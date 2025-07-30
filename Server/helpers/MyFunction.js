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

    static getImagePublicId (url) {
        const pathname = url.split('?')[0];
        const parts = pathname.split('/');
        const filename = parts[parts.length - 1];
        return filename;
    }
}

module.exports = MyFunction