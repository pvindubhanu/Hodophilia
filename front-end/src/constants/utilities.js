// solution from Salman A,
// https://stackoverflow.com/a/13627586/15818885
export function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

export function formatDate(day, month, year) {
    let date;
    if ( !day || !month || !year) date = new Date();
    day? day = '' + day : day = date.getDate() + '';
    month? month = '' + month : month = date.getMonth() + 1 + '';
    year? year = '' + year : year = date.getFullYear() + '';
    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;
    if (year.length < 3) year = '20' + year; // will work until the year 2100 and assumes 2 digit input means 20XX
    return `${month}/${day}/${year}`;
}