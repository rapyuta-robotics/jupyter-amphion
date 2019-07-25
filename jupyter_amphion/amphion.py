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

@register
class Viewer3D(widgets.DOMWidget):
    ros = Instance(ROS).tag(**sync_widget)





## No need to care about everyhting that follows....

def js_formatter(d_in):
    import json
    from traitlets import utils as tut
    def remove_undefined(d):
        for key in d:
            if type(d[key]) is tut.sentinel.Sentinel:
                d[key] = '##UNDEFINED##'
            if type(d[key]) is dict:
                remove_undefined(d[key])

    remove_undefined(d_in)
    s = '{\n'
    for key in sorted(d_in.keys()):
        val = d_in[key] if d_in[key] is not None else "null"
        if type(val) is str:
            val = '"' + val + '"'
        if type(val) is bool:
            val = 'true' if val else 'false'

        s += '    {}: {},\n'.format(key, val)
    # s = json.dumps(d_in, indent=4)
    s += '}\n'
    s = s.replace('"##UNDEFINED##"', 'undefined')
    return s


def js_extract_cls(cls):

    template = """
var {class_name}Defaults = {json_defaults}
    """

    name = cls.__name__
    if not name.endswith('Model'):
        name += 'Model'

    defd = cls.__base__.class_trait_names()
    base_class_name = cls.__base__.__name__
    defaults = {}
    # trait_values = cls()._trait_values
    trait_values = cls.__dict__
    forward_traits = ['_model_module', '_model_name', '_model_module_version', '_view_name', '_view_module', '_view_module_version']
    for key, item in trait_values.items():
        if key not in defd or key in forward_traits:
            if not item is traitlets.Instance:
                if issubclass(item.__class__, traitlets.TraitType):
                    defaults[key] = item.default_value
            else:
                defaults[key] = traitlets.Undefined

    jd = js_formatter(defaults)
    jd = '\n'.join([" " * 4 + l for l in jd.split('\n')])

    return (name, template.format(class_name=name,
                          base_class=base_class_name,
                          json_defaults=jd))

def js_extract():
    import sys, inspect, json
    clsmembers = inspect.getmembers(sys.modules[__name__], inspect.isclass)
    # print(clsmembers)
    def modulify(d, suffix=''):
        js = {key + suffix: key + suffix for key in d}
        s = "{\n"
        for key in sorted(d.keys()):
            s += "    {key}: {key},\n".format(key=key + suffix)
        return s + '}\n'

    for_export = {}
    for cls_name, cls in clsmembers:
        if cls.__module__ == __name__:
            cls_name, text = js_extract_cls(cls)
            for_export[cls_name] = text

    for key in for_export:
        print(for_export[key])

    export_template = """
module.exports = {exports_json}
    """
    print(export_template.format(exports_json=modulify(for_export, 'Defaults')))
