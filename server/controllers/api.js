import loadData, { apiColumnHeadings } from '../util/loadData';
import _ from 'lodash';

export default {
    get (req, res, next, columnName) {
        if (columnName === undefined) {
            // No columnName was specified (we hit /api), so return the APIs that can be hit
            res.json(apiColumnHeadings);
            return;
        }

        var column = _.find(apiColumnHeadings, col => col.label === columnName);
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
