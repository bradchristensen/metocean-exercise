import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const CHAR_NEWLINE = '\n';
const CHAR_TAB = '\t';

var crazyDataString = fs.readFileSync(path.resolve(__dirname, '../metocean.txt'), 'utf8');
var dataTable = [];

var lines = crazyDataString.split(CHAR_NEWLINE);

export var columnHeadings = lines[1].split(CHAR_TAB).map(columnHeading => {
    var firstBracketIndex = columnHeading.indexOf('[');
    var secondBracketIndex = columnHeading.indexOf(']');
    var label = columnHeading.substring(0, firstBracketIndex).toLowerCase();
    var units = columnHeading.substring(firstBracketIndex + 1, secondBracketIndex);
    return { label, units };
});

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

export var listOfApis = (function () {
    var columnHeadingLabels = columnHeadings.map(columnHeading => columnHeading.label);
    _.remove(columnHeadingLabels, 'time');
    return columnHeadingLabels;
})();

export default dataTable;
