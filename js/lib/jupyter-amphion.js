var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var ROSLIB = require('roslib');
var Amphion = require('amphion').default;
var THREE = require('three');
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
    defaults: _.extend(domwidget_defaults(), defaults.Viewer3DModelDefaults, {objects: []}),
}, default_serializers(['ros', 'objects']));

var Viewer3DView = widgets.DOMWidgetView.extend({
    initialize: function() {
        Viewer3DView.__super__.initialize.apply(this, arguments);
    },
    add_object: function (model) {
        return this.create_child_view(model, {
            viewer: this.viewer,
        });
    },
    remove_object: function (view) {
        view.remove();
    },
    background_change: function () {
        this.viewer.scene.background = new THREE.Color(this.model.get('background'));
    },
    render: function() {
        this.el.style.height = '500px';

        var ros_connection = this.model.get('ros').get_connection();
        console.log(ros_connection);

        this.viewer = new Amphion.Viewer3d(ros_connection);
        this.viewer.setContainer(this.el);
        window.jviewer = this.viewer;
        window.xt = THREE;
        // just demo purposes

        this.object_views = new widgets.ViewList(this.add_object, this.remove_object, this);
        this.object_views.update(this.model.get('objects'));
        this.model.on("change:background", this.background_change, this);
        this.background_change();

        /*this.displayed.then(() => {
           this.init_viewer();
        });*/
        // this.model.on("change:alpha", this.background_color_change, this);
    }
});

var TfViewerModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(domwidget_defaults(), defaults.TfViewerModelDefaults, {objects: []}),
}, default_serializers(['ros', 'objects']));

var TfViewerView = widgets.DOMWidgetView.extend({
    initialize: function() {
        TfViewerView.__super__.initialize.apply(this, arguments);
    },
    add_object: function (model) {
        return this.create_child_view(model, {
            viewer: this.viewer,
        });
    },
    remove_object: function (view) {
        view.remove();
    },
    background_change: function () {
        this.viewer.scene.background = new THREE.Color(this.model.get('background'));
    },
    render: function() {
        this.el.style.height = '500px';

        var ros_connection = this.model.get('ros').get_connection();
        console.log(ros_connection);

        this.viewer = new Amphion.TfViewer(ros_connection);
        this.viewer.setContainer(this.el);
        window.jviewer = this.viewer;
        window.xt = THREE;
        // just demo purposes

        this.object_views = new widgets.ViewList(this.add_object, this.remove_object, this);
        this.object_views.update(this.model.get('objects'));
        this.model.on("change:background", this.background_change, this);
        this.background_change();

        /*this.displayed.then(() => {
           this.init_viewer();
        });*/
        // this.model.on("change:alpha", this.background_color_change, this);
    }
    /*init_viewer: function() {
        this.ini*/
});

var ArrowOptionsModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.ArrowOptionsModelDefaults)
});

var AxesOptionsModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.AxesOptionsModelDefaults)
});

var FlatArrowOptionsModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.FlatArrowOptionsModelDefaults)
});

var GridModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.GridModelDefaults)
});

var ImageModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.ImageModelDefaults),
}, default_serializers());

var MapModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.MapModelDefaults),
}, default_serializers());

var LaserScanModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.LaserScanModelDefaults),
}, default_serializers());

var MarkerModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.MarkerModelDefaults),
}, default_serializers());

var MarkerArrayModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.MarkerArrayModelDefaults),
}, default_serializers());

var OdometryModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.OdometryModelDefaults),
}, default_serializers(['ros', 'arrow_options', 'axes_options', 'flat_arrow_options']));

var PathModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.PathModelDefaults),
}, default_serializers());

var PointCloudModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.PointCloudModelDefaults),
}, default_serializers());

var PolygonModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.PolygonModelDefaults),
}, default_serializers());

var PoseModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.PoseModelDefaults),
}, default_serializers(['ros', 'arrow_options', 'axes_options']));

var PoseArrayModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.PoseArrayModelDefaults),
}, default_serializers(['ros', 'arrow_options', 'axes_options', 'flat_arrow_options']));

var RobotModel = widgets.WidgetModel.extend({
    defaults: _.extend(widgets.WidgetModel.prototype.defaults(), defaults.RobotModelDefaults),
}, default_serializers());

var GridView = widgets.WidgetView.extend({
    initialize: function(parms) {
        GridView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.trigger_rerender, this);
    },
    render: function() {
        var grid = new Amphion.Grid(
            this.model.get('cell_size'),
            this.model.get('color'),
            this.model.get('num_cells')
        );
        grid.subscribe();
        this.viewer.addVisualization(grid);
    },
    trigger_rerender: function() {
        this.remove();
        this.render();
    },
    remove: function() {
        this.viewer.scene.remove(this.grid_view);
    }
});

var ImageView = widgets.WidgetView.extend({
    initialize: function(parms) {
        ImageView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.image.updateOptions({
            queueSize: this.model.get('queue_size')
        });
    },
    render: function() {
        this.image = new Amphion.Image(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                queueSize: this.model.get('queue_size')
            }
        );
        this.update();
        this.image.subscribe();
        this.viewer.addVisualization(this.image);
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var MapView = widgets.WidgetView.extend({
    initialize: function(parms) {
        MapView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.map.updateOptions(
            {
                alpha: this.model.get('alpha'),
                colorScheme: this.model.get('color_scheme'),
                drawBehind: this.model.get('draw_behind')
            }
        );
    },
    render: function() {
        this.map = new Amphion.Map(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                alpha: this.model.get('alpha'),
                colorScheme: this.model.get('color_scheme'),
                drawBehind: this.model.get('draw_behind')
            }
        );
        this.update();
        this.map.subscribe();
        this.viewer.addVisualization(this.map);
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var LaserScanView = widgets.WidgetView.extend({
    initialize: function(parms) {
        LaserScanView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.laserscan.updateOptions(
            {
                selectable: this.model.get('selectable'),
                style: this.model.get('style'),
                size: this.model.get('size'),
                alpha: this.model.get('alpha'),
                decayTime: this.model.get('decay_time'),
                queueSize: this.model.get('queue_size'),
                colorTransformer: this.model.get('color_transformer'),
                flatColor: this.model.get('flat_color')
            }
        );
    },
    render: function() {
        this.laserscan = new Amphion.LaserScan(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                selectable: this.model.get('selectable'),
                style: this.model.get('style'),
                size: this.model.get('size'),
                alpha: this.model.get('alpha'),
                decayTime: this.model.get('decay_time'),
                queueSize: this.model.get('queue_size'),
                colorTransformer: this.model.get('color_transformer'),
                flatColor: this.model.get('flat_color')
            }
        );
        this.update();
        this.laserscan.subscribe();
        this.viewer.addVisualization(this.laserscan);
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var MarkerView = widgets.WidgetView.extend({
    initialize: function(parms) {
        MarkerView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.marker.updateOptions(
            {
                queueSize: this.model.get('queue_size'),
                namespaces: this.model.get('namespaces')
            }
        );
    },
    render: function() {
        this.marker = new Amphion.Marker(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                queueSize: this.model.get('queue_size'),
                namespaces: this.model.get('namespaces')
            }
        );
        this.update();
        this.marker.subscribe();
        this.viewer.addVisualization(this.marker);
    },
    trigger_rerender: function() {
        this.remove();
        this.render();
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var MarkerArrayView = widgets.WidgetView.extend({
    initialize: function(parms) {
        MarkerArrayView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.markerarray.updateOptions(
            {
                queueSize: this.model.get('queue_size'),
                namespaces: this.model.get('namespaces'),
                throttleRate: this.model.get('throttle_rate')
            }
        );
    },
    render: function() {
        this.markerarray = new Amphion.MarkerArray(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                queueSize: this.model.get('queue_size'),
                namespaces: this.model.get('namespaces'),
                throttleRate: this.model.get('throttle_rate')
            }
        );
        this.update();
        this.markerarray.subscribe();
        this.viewer.addVisualization(this.markerarray);
    },
    trigger_rerender: function() {
        this.remove();
        this.render();
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var OdometryView = widgets.WidgetView.extend({
    initialize: function(parms) {
        OdometryView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.odometry.updateOptions(
            {
                type: this.model.get('type_attr'),
                color: this.model.get('color'),
                alpha: this.model.get('alpha'),
                shaftLength: this.model.get('arrow_options').get('shaft_length'),
                shaftRadius: this.model.get('arrow_options').get('shaft_radius'),
                headLength: this.model.get('arrow_options').get('head_length'),
                headRadius: this.model.get('arrow_options').get('head_radius'),
                axesLength: this.model.get('axes_options').get('axes_length'),
                axesRadius: this.model.get('axes_options').get('axes_radius'),
                arrowLength: this.model.get('flat_arrow_options').get('arrow_length'),
                positionTolerance: this.model.get('position_tolerance'),
                angleTolerance: this.model.get('angle_tolerance'),
                keep: this.model.get('keep')
            }
        );
    },
    render: function() {
        this.odometry = new Amphion.Odometry(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                type: this.model.get('type_attr'),
                color: this.model.get('color'),
                alpha: this.model.get('alpha'),
                shaftLength: this.model.get('arrow_options').get('shaft_length'),
                shaftRadius: this.model.get('arrow_options').get('shaft_radius'),
                headLength: this.model.get('arrow_options').get('head_length'),
                headRadius: this.model.get('arrow_options').get('head_radius'),
                axesLength: this.model.get('axes_options').get('axes_length'),
                axesRadius: this.model.get('axes_options').get('axes_radius'),
                arrowLength: this.model.get('flat_arrow_options').get('arrow_length'),
                positionTolerance: this.model.get('position_tolerance'),
                angleTolerance: this.model.get('angle_tolerance'),
                keep: this.model.get('keep')
            }
        );
        this.update();
        this.odometry.subscribe();
        this.viewer.addVisualization(this.odometry);
    },
    trigger_rerender: function() {
        this.remove();
        this.render();
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});


var PathView = widgets.WidgetView.extend({
    initialize: function(parms) {
        PathView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.path.updateOptions(
            {
                color: this.model.get('color'),
                alpha: this.model.get('alpha')
            }
        );
    },
    render: function() {
        this.path = new Amphion.Path(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                color: this.model.get('color'),
                alpha: this.model.get('alpha')
            }
        );
        this.update();
        this.path.subscribe();
        this.viewer.addVisualization(this.path);
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var PointCloudView = widgets.WidgetView.extend({
    initialize: function(parms) {
        PointCloudView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
    },
    render: function() {
        this.pointcloud = new Amphion.PointCloud(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            this.model.get('message_type')
        );
        this.update();
        this.pointcloud.subscribe();
        this.viewer.addVisualization(this.pointcloud);
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var PolygonView = widgets.WidgetView.extend({
    initialize: function(parms) {
        PolygonView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
    },
    render: function() {
        this.polygon = new Amphion.Polygon(
            this.model.get('ros').get_connection(),
            this.model.get('topic')
        );
        this.update();
        this.polygon.subscribe();
        this.viewer.addVisualization(this.polygon);
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var PoseView = widgets.WidgetView.extend({
    initialize: function(parms) {
        PoseView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.pose.updateOptions(
            {
                color: this.model.get('color'),
                alpha: this.model.get('alpha'),
                shaftLength: this.model.get('arrow_options').get('shaft_length'),
                shaftRadius: this.model.get('arrow_options').get('shaft_radius'),
                headLength: this.model.get('arrow_options').get('head_length'),
                headRadius: this.model.get('arrow_options').get('head_radius'),
                axesLength: this.model.get('axes_options').get('axes_length'),
                axesRadius: this.model.get('axes_options').get('axes_radius'),
                type: this.model.get('type_attr')
            }
        )
    },
    render: function() {
        this.pose = new Amphion.Pose(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                color: this.model.get('color'),
                alpha: this.model.get('alpha'),
                shaftLength: this.model.get('arrow_options').get('shaft_length'),
                shaftRadius: this.model.get('arrow_options').get('shaft_radius'),
                headLength: this.model.get('arrow_options').get('head_length'),
                headRadius: this.model.get('arrow_options').get('head_radius'),
                axesLength: this.model.get('axes_options').get('axes_length'),
                axesRadius: this.model.get('axes_options').get('axes_radius'),
                type: this.model.get('type_attr')
            }
        );
        this.update();
        this.pose.subscribe();
        this.viewer.addVisualization(this.pose);
    },
    trigger_rerender: function() {
        this.remove();
        this.render();
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var PoseArrayView = widgets.WidgetView.extend({
    initialize: function(parms) {
        PoseArrayView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        this.model.on('change', this.update, this);
    },
    update: function() {
        this.posearray.updateOptions(
            {
                color: this.model.get('color'),
                alpha: this.model.get('alpha'),
                shaftLength: this.model.get('arrow_options').get('shaft_length'),
                shaftRadius: this.model.get('arrow_options').get('shaft_radius'),
                headLength: this.model.get('arrow_options').get('head_length'),
                headRadius: this.model.get('arrow_options').get('head_radius'),
                axesLength: this.model.get('axes_options').get('axes_length'),
                axesRadius: this.model.get('axes_options').get('axes_radius'),
                arrowLength: this.model.get('flat_arrow_options').get('arrow_length'),
                type: this.model.get('type_attr')
            }
        )
    },
    render: function() {
        this.posearray = new Amphion.PoseArray(
            this.model.get('ros').get_connection(),
            this.model.get('topic'),
            {
                color: this.model.get('color'),
                alpha: this.model.get('alpha'),
                shaftLength: this.model.get('arrow_options').get('shaft_length'),
                shaftRadius: this.model.get('arrow_options').get('shaft_radius'),
                headLength: this.model.get('arrow_options').get('head_length'),
                headRadius: this.model.get('arrow_options').get('head_radius'),
                axesLength: this.model.get('axes_options').get('axes_length'),
                axesRadius: this.model.get('axes_options').get('axes_radius'),
                arrowLength: this.model.get('flat_arrow_options').get('arrow_length'),
                type: this.model.get('type_attr')
            }
        );
        this.update();
        this.posearray.subscribe();
        this.viewer.addVisualization(this.posearray);
    },
    trigger_rerender: function() {
        this.remove();
        this.render();
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

var RobotView = widgets.WidgetView.extend({
    initialize: function(parms) {
        RobotView.__super__.initialize.apply(this, arguments);
        this.viewer = this.options.viewer;
        //this.model.on('change', this.update, this);
    },
    update: function() {
        this.robotmodel.updateOptions(
            {
            }
        )
    },
    render: function() {
        this.robotmodel = new Amphion.RobotModel(
            this.model.get('ros').get_connection(),
            this.model.get('description'),
            {
                packages: this.model.get('packages')
            }
        );
        //this.update();
        this.viewer.addRobot(this.robotmodel);
    },
    trigger_rerender: function() {
        this.remove();
        this.render();
    },
    remove: function() {
        this.viewer.scene.remove(this.view);
    }
});

module.exports = {
    ROSModel: ROSModel,
    Viewer3DModel: Viewer3DModel,
    Viewer3DView: Viewer3DView,
    TfViewerModel: TfViewerModel,
    TfViewerView: TfViewerView,
    ArrowOptionsModel: ArrowOptionsModel,
    AxesOptionsModel: AxesOptionsModel,
    FlatArrowOptionsModel: FlatArrowOptionsModel,
    ImageModel: ImageModel,
    ImageView: ImageView,
    LaserScanModel: LaserScanModel,
    LaserScanView: LaserScanView,
    MapModel: MapModel,
    MapView: MapView,
    MarkerModel: MarkerModel,
    MarkerView: MarkerView,
    MarkerArrayModel: MarkerArrayModel,
    MarkerArrayView: MarkerArrayView,
    OdometryModel: OdometryModel,
    OdometryView: OdometryView,
    PathModel: PathModel,
    PathView: PathView,
    PointCloudModel: PointCloudModel,
    PointCloudView: PointCloudView,
    PolygonModel: PolygonModel,
    PolygonView: PolygonView,
    PoseModel: PoseModel,
    PoseView: PoseView,
    PoseArrayModel: PoseArrayModel,
    PoseArrayView: PoseArrayView,
    RobotModel: RobotModel,
    RobotView: RobotView
    };
