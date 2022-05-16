const _ = require('lodash');

///////////////////////////////////////////////////////////////////////////////////////////////////

const rowHandlers = {
    Section: (row) => {
        let { Rows, Title } = row;

        if ( Rows.length === 0 ) return {};

        Title = Title || "Running Totals";

        let obj = { [Title]: {} };
        // let obj = {};

        for (r of Rows) {
            let data = handleRow(r);

            obj[Title][data.rowHeader] = data.values;
            // obj[data.rowHeader] = data.values;
        }

        return obj;
    },

    Row: (row) => {
        let obj = {};

        let { Cells } = row;

        let cellValues = cells(Cells);

        let rowHeader = cellValues[0];
        cellValues = cellValues.slice(1);

        return {
            rowHeader,
            values: cellValues
        };
    },

    SummaryRow: (row) => {
        let obj = {};

        let { Cells } = row;

        let cellValues = cells(Cells);
        let rowHeader = cellValues[0];
        cellValues = cellValues.slice(1);

        return {
            rowHeader: `Summary - ${rowHeader}`,
            values: cellValues
        };
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function cells(c) {
    return c.filter((x) => x.Value).map((x) => x.Value);
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function handleRow(row) {
    try {
        // console.log(`Handling row of type ${row.RowType}`)
        return rowHandlers[row.RowType](row);
    } catch (err) {
        // console.log(`ERROR - couldn't find handler for row of type ${row.RowType}`)
        return { error: err.message };
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getSingleSection(obj, n) {
    let newObj = {}

    for (let [k, s] of Object.entries(obj)) {
        newObj[k] = {};

        for (let [skey, sval] of Object.entries(s)) {
            newObj[k][skey] = sval[n];
        }
    }
    return newObj;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getSingleSectionNoNesting(obj, n) {
    let newObj = {}

    for (let [k, s] of Object.entries(obj)) {
        newObj[k] = s[n];
    }
    return newObj;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function transformSections(input) {
    let report = input.Reports[0];

    let rows = report.Rows;

    let headers = rows[0].Cells.map((x) => x.Value);

    rows = rows.slice(1);

    let sections = {};

    for (row of rows) {
        
      let rowData = handleRow( row );

      sections = _.merge(sections, rowData);

      // z.console.log(sections)
    }

    let obj = {data: []};

    for (let i=0;i<headers.length-1;i++) {
        // console.log("Headers processing for "+headers[i]);
      let header = headers[i];
      let lineItem = {};

      lineItem.timePeriod = header || report.ReportTitles[2];
      Object.assign(lineItem, getSingleSection(sections, i));

      obj.data.push(lineItem);
    }

    if (obj.data.length === 1) obj = obj.data[0];

    return obj;
  }

module.exports = { cells, handleRow, getSingleSection, getSingleSectionNoNesting, transformSections };