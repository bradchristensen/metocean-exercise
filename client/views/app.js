import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Graph from 'react-svg-graph-bradchristensen';
import ReactSelect from 'react-select';
import _ from 'lodash';
import jsonXHR from 'json-xhr-promise';

// The APIs that are available are surfaced from this config, passed through from the server.
// They could also be obtained by hitting /api (without providing an API name).
var api = _.keyBy(window.metOceanDataFunConfig.api, 'label');

export default React.createClass({
    // Only re-render on immutable data changes
    mixins: [PureRenderMixin],

    getInitialState () {
        return {
            graphData: {},
            granularity: 2,
            visibleGraphs: []
        };
    },

    render () {
        // TODO: make property names like 'label' and 'description' less ambiguous
        var apiOptions = _.map(api, apiItem => ({
            value: apiItem.label,
            label: apiItem.description
        }));

        return (
            <div>
                <div style={{ float: 'left', width: 300 }}>
                    <ul>
                        <li>
                            <ReactSelect
                                options={apiOptions}
                                value={this.state.visibleGraphs}
                                multi={true}
                                placeholder='Add a graph'
                                onChange={selectedOptions => {
                                    var visibleGraphs = (selectedOptions || []).map(option => option.value);
                                    // Cache requests to the same API (if this app were more complicated,
                                    // this would ideally live in the data layer, e.g. Flux)
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
                        </li>

                        <li>
                            <ReactSelect
                                placeholder='Granularity'
                                options={[1, 2, 3, 4, 5, 10, 20, 50, 100].map(x => ({
                                    value: x,
                                    label: `Granularity ${x}`
                                }))}
                                value={this.state.granularity}
                                clearable={false}
                                onChange={selectedOption => this.setState({ granularity: selectedOption.value })}
                            />
                        </li>
                    </ul>
                </div>

                <div style={{ marginLeft: 340, width: 'auto' }}>
                    {this.state.visibleGraphs.map(key => {
                        if (!this.state.graphData[key]) {
                            return <p key={'loading-' + key}>Loading {api[key].description}...</p>;
                        }

                        return <div key={'graph-' + key}>
                            <h4>{api[key].description} ({api[key].units})</h4>
                            <Graph
                                graphType='line'
                                data={_.filter(
                                    this.state.graphData[key].map(dataPoint => {
                                        return {
                                            value: dataPoint[key],

                                            // react-svg-graph doesn't handle axes very well at the moment, so it's
                                            // probably better to leave this blank to avoid rendering a zillion
                                            // overlapping text elements
                                            id: ''
                                        };
                                    }),
                                    // TODO: Binning data should average across binned data points
                                    (x, i) => i % (this.state.granularity || 1) === 0
                                )}
                                width={400}
                                height={150}
                                animationRenderInterval={16} // FPS goals
                            />
                        </div>;
                    })}
                </div>
            </div>
        );
    }
});
