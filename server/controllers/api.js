import loadData, { columnHeadings } from '../util/loadData';
import _ from 'lodash';

export default {
    get (req, res, next, columnName) {
        var column = _.find(columnHeadings, col => col.label === columnName);
        if (!column) {
            res.status(404).send('Page Not Found');
            return;
        }

        var data = loadData.map(row => {
            var dataPoint = { time: row.time };
            dataPoint[columnName] = row[columnName];
            return dataPoint;
        });

        res.json(data);
    }
};
