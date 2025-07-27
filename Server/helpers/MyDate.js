'use strict'

class MyDate {
    static formateDate (date) {
        return date.toLocaleString("sv-SE").split(' ')[0]
    }

    static transformDate(date) {
        return date.replace(/-/g,'')
    }

    static htmlDateReader (date) {
        return date.toISOString().split("T")[0];
    }
}

module.exports=MyDate