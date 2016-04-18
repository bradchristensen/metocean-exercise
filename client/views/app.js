import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Graph from 'react-svg-graph-bradchristensen';
import ReactSelect from 'react-select';
import _ from 'lodash';
import jsonXHR from 'json-xhr-promise';

// The APIs that are available can be found by hitting /api, or they're available
// as a glorious global
var api = _.keyBy(window.metOceanDataFunConfig.api, 'label');

export default React.createClass({
    // Only re-render on immutable data changes
    mixins: [PureRenderMixin],

    getInitialState () {
        return {
            graphData: {},
            visibleGraphs: []
        };
    },

    render () {
        var apiOptions = _.map(api, apiItem => ({
            value: apiItem.label, // I'm starting to think I should have named this better
            label: apiItem.description
        }));

        return <div>
            <ReactSelect
                options={apiOptions}
                value={this.state.visibleGraphs}
                multi={true}
                placeholder='Add a graph'
                onChange={selectedOptions => {
                    var visibleGraphs = selectedOptions.map(option => option.value); // Immutable state
                    // Cache requests to the same API (if this app were more complicated, this would ideally
                    // live in the data layer, e.g. Flux)
                    visibleGraphs.forEach(apiName => {
                        if (!api[apiName].apiRequest) {
                            api[apiName].apiRequest = jsonXHR('GET', `/api/${apiName}`).then(data => {
                                var graphData = _.clone(this.state.graphData); // Immutable state
                                graphData[apiName] = data;
                                this.setState({ graphData });
                            });
                        }
                    });
                    this.setState({ visibleGraphs });
                }}
            />

            {this.state.visibleGraphs.map(key => {
                if (!this.state.graphData[key]) {
                    return <p key={'loading-' + key}>Loading {api[key].description}...</p>;
                }

                return <div key={'graph-' + key}>
                    <h4>{api[key].description}</h4>
                    <Graph
                        graphType='line'
                        data={this.state.graphData[key].map(dataPoint => ({
                            value: dataPoint[key],
                            id: dataPoint.time
                        }))}
                        width={400}
                        height={150}
                        animationRenderInterval={10}
                    />
                </div>;
            })}
        </div>;
    }
});
