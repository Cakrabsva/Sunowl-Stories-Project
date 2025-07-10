'use strict'

class MyDate {
    static formateDate (date) {
        return date.toLocaleString("sv-SE").split(' ')[0]
    }

    static transformDate(date) {
        return date.replace(/-/g,'')
    }
}

module.exports={MyDate}