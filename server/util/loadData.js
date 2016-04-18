import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const CHAR_NEWLINE = '\n';
const CHAR_TAB = '\t';

var crazyDataString = fs.readFileSync(path.resolve(__dirname, '../metocean.txt'), 'utf8');
var dataTable = [];

var lines = crazyDataString.split(CHAR_NEWLINE);

var columnHeadings = _.flow(
    x => x.split(CHAR_TAB),
    x => x.map(columnHeading => {
        var firstBracketIndex = columnHeading.indexOf('[');
        var secondBracketIndex = columnHeading.indexOf(']');
        var label = columnHeading.substring(0, firstBracketIndex).toLowerCase();
        var units = columnHeading.substring(firstBracketIndex + 1, secondBracketIndex);
        return { label, units };
    })
)(lines[1]);

for (var lineIndex = 2; lines[lineIndex].trim() !== '>'; lineIndex++) {
    let line = lines[lineIndex].split(CHAR_TAB);
    let row = {};
    line.forEach((dataPointValue, columnIndex) => {
        var column = columnHeadings[columnIndex];
        if (column.label !== 'time') {
            dataPointValue = parseFloat(dataPointValue);
        }
        row[column.label] = dataPointValue;
    });
    dataTable.push(row);
}

for (lineIndex = lineIndex + 1; lines[lineIndex].trim() !== ''; lineIndex++) {
    let line = lines[lineIndex].split(':');
    let key = line[0].trim();
    let description = line[1].trim();

    let columnHeading = _.find(columnHeadings, ch => ch.label === key);
    if (columnHeading) {
        columnHeading.description = description;
    }
}

export var apiColumnHeadings = (function () {
    var apiColumnHeadings = _.clone(columnHeadings);
    _.remove(apiColumnHeadings, ch => ch.label === 'time');
    return apiColumnHeadings;
})();

export default dataTable;
