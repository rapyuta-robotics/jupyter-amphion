var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var ROSLIB = require('roslib');

var widget_defaults = widgets.WidgetModel.prototype.defaults;

var defaults = {
    ROSConnectionModelDefaults: {
        _model_module: "jupyter_amphion",
        _model_module_version: "^0.1.0",
        _model_name: "ROSConnectionModel",
        port: "9090",
        url: "ws://10.91.1.111",
    },
    MapDefaults: {
        _model_module: "jupyter_amphion",
        _model_module_version: "^0.1.0",
        _model_name: "MapModel",
        _view_module: "jupyter_ros",
        _view_module_version: "^0.1.0",
        _view_name: "MapView",
        color: "#FFFFFF",
        compression: "cbor",
        continuous: false,
        opacity: 1.0,
        ros: undefined,
        topic: "/costmap",
    },
    TfViewerDefaults: {
        _model_module: "jupyter_amphion",
        _model_module_version: "^0.1.0",
        _model_name: "TfViewerModel",
        ros: undefined,
    }
};

var default_serializers = function(names) {
    names = names || ['ros']

    var named_serializers = {}
    for (let idx in names)
    {
        named_serializers[names[idx]] = { deserialize: widgets.unpack_models }
    }
    return {serializers: _.extend(named_serializers, widgets.WidgetModel.serializers)};
}

var ROSConnectionModel = widgets.WidgetModel.extend({
    defaults: _.extend(widget_defaults(), defaults.ROSConnectionModelDefaults),
    initialize: function() {
        ROSConnectionModel.__super__.initialize.apply(this, arguments);
        this.connection = new ROSLIB.Ros({
          url: this.get('url')
        });
    },
    get_connection: function() {
        return this.connection;
    }
});

var MapModel = widgets.WidgetModel.extend({
        defaults: _.extend(widget_defaults(), defaults.MapDefaults),
    }, default_serializers()
);

var MapView = widgets.WidgetView.extend({
    initialize: function(args) {
        MapView.__super__.initialize.apply(this, arguments);
    },
    render: function() {
        this.view = new Amphion.Map({
            ros: this.model.get('ros').get_connection(),
            topic: this.model.get('topic')
        });
    }
});


var TfViewerModel = widgets.WidgetModel.extend({
        defaults: _.extend(widget_defaults(), defaults.TfViewerDefaults),
    }, default_serializers()
);

var TfViewerView = widgets.WidgetView.extend({
    initialize: function(args) {
        MapView.__super__.initialize.apply(this, arguments);
    },
    render: function() {
        this.view = new Amphion.Map({
            ros: this.model.get('ros').get_connection(),
            topic: this.model.get('topic')
        });
    }
});

module.exports = {
    ROSConnectionModel: ROSConnectionModel,
    MapModel: MapModel,
    Viewer3dModel: Viewer3dModel,

    MapView: MapView,
    Viewer3dView: Viewer3dView
};
