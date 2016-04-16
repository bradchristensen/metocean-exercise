import React from 'react';
import Graph from 'react-svg-graph-bradchristensen';

export default React.createClass({
    render () {
        return <Graph
            graphType='line'
            data={[
                { id: 0, value: parseInt(Math.random() * 100, 10) },
                { id: 1, value: parseInt(Math.random() * 100, 10) }
            ]}
            maxValue={100}
            width={400}
            height={150}
        />;
    }
});
