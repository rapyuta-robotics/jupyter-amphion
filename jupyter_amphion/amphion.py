import ipywidgets as widgets
from traitlets import *


def _quick_widget(package_name, version, has_view=True):
    def quick_widget_decorator(cls):
        from traitlets import Unicode
        name = cls.__name__
        if name.endswith('Model'):
            name = name[:-5]

        cls._model_name = Unicode(name + 'Model').tag(sync=True)
        cls._model_name.class_init(cls, '_model_name')

        cls._model_module = Unicode(package_name).tag(sync=True)
        cls._model_module.class_init(cls, '_model_module')

        cls._model_module_version = Unicode(version).tag(sync=True)
        cls._model_module_version.class_init(cls, '_model_module_version')

        if has_view:
            cls._view_module = Unicode(package_name).tag(sync=True)
            cls._view_module.class_init(cls, '_view_module')

            cls._view_module_version = Unicode(version).tag(sync=True)
            cls._view_module_version.class_init(cls, '_view_module_version')

            cls._view_name = Unicode(name + 'View').tag(sync=True)
            cls._view_name.class_init(cls, '_view_name')

        cls = widgets.register(cls)
        return cls

    return quick_widget_decorator


register = _quick_widget('jupyter_amphion', '^0.1.0')
register_noview = _quick_widget('jupyter_amphion', '^0.1.0', False)
sync_widget = {'sync': True}
sync_widget.update(widgets.widget_serialization)


@register_noview
class ROS(widgets.Widget):
    url = Unicode("ws://10.91.1.111:9090").tag(sync=True)


@register
class Map(widgets.Widget):
    pass
