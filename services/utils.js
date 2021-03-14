class Utils {
    static paging(pageSum, pageLimit) {
        if (pageSum / pageLimit == 0) {
            return 1;
        } else {
            return pageSum / pageLimit
        }
    }
    static updatePath(name) {
        let res = "";
        let n = name.trim().split(" ");
        for (let i = 0; i < n.length - 1; i++) {
            res += n[i] + "-";
        }
        return (res + n[n.length - 1]);
    }

    static formatDateToShow(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('-');
    }

}

module.exports = Utils;