var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var ROSLIB = require('roslib');

var Amphion = require('amphion').default;

var widget_defaults = widgets.WidgetModel.prototype.defaults;
var domwidget_defaults = widgets.DOMWidgetModel.prototype.defaults;

var defaults = require('../../jupyter_amphion/amphion.py')

var default_serializers = function(names) {
    names = names || ['ros']

    var named_serializers = {}
    for (let idx in names)
    {
        named_serializers[names[idx]] = { deserialize: widgets.unpack_models }
    }
    return {serializers: _.extend(named_serializers, widgets.WidgetModel.serializers)};
}

var ROSModel = widgets.WidgetModel.extend({
    defaults: _.extend(widget_defaults(), defaults.ROSModelDefaults),
    initialize: function() {
        ROSModel.__super__.initialize.apply(this, arguments);
        this.connection = new ROSLIB.Ros({
          url: this.get('url')
        });
    },
    get_connection: function() {
        return this.connection;
    }
});


var Viewer3DModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(domwidget_defaults(), defaults.Viewer3DDefaults),
},
default_serializers(['ros']));

var Viewer3DView = widgets.DOMWidgetView.extend({
    initialize: function() {
        Viewer3DView.__super__.initialize.apply(this, arguments);
    },

    render: function() {
        this.el.style.height = '500px';

        var ros_connection = this.model.get('ros').get_connection();
        console.log(ros_connection);

        this.viewer = new Amphion.Viewer3d(ros_connection);
        this.viewer.setContainer(this.el);

        // just demo purposes
        var path = new Amphion.Path(ros_connection, '/path_rosbag');
        path.subscribe();
        this.viewer.addVisualization(path);

        // this.model.on("change:background_color", this.background_color_change, this);
        // this.model.on("change:alpha", this.background_color_change, this);
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
    ROSModel: ROSModel,
    MapModel: MapModel,

    MapView: MapView,
    Viewer3DModel: Viewer3DModel,
    Viewer3DView: Viewer3DView
};