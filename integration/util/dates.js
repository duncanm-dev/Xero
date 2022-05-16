const moment = require("moment");

function getMonthDifference(startDate, endDate) {
    try {
        return (
            endDate.getMonth() -
            startDate.getMonth() +
            12 * (endDate.getFullYear() - startDate.getFullYear())
        );
    } catch (err) {
        return 0;
    }
}

var enumerateDaysBetweenDates = function (startDate, endDate, period) {
    var now = moment(startDate).startOf('month'), dates = [];

    while (now.isSameOrBefore(moment(endDate).endOf('month'))) {
        dates.push(
            [
                moment(now)
                    .format('YYYY-MM-DD'),

                now
                    .add(1, period)
                    .clone()
                    .endOf('month')
                    .format('YYYY-MM-DD')
            ]
        );
    }
    return dates;
};

///////////////////////////////////////////////////////////////////////////////////////////////////

function dateOr(dateStr) {
    return dateStr ? new Date(dateStr) : new Date();
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function FYS() {
    var now = new Date();
    now.setFullYear(now.getMonth() < 5 ? now.getFullYear() - 1 : now.getFullYear());
    now.setMonth(6);
    now.setDate(0);
    return now;
}

function getEOM(date) {
    let d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
}

function getSOM(date) {
    let d = new Date(date);
    d.setDate(1);
    return d;
}

function now() {
    return new Date();
}

function xeroDateString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // 0-indexed
    let day = date.getDate();

    month = `${month}`.padStart(2, '0');
    day = `${day}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
}


module.exports = { getMonthDifference, dateOr, FYS, getEOM, now, xeroDateString, enumerateDaysBetweenDates };