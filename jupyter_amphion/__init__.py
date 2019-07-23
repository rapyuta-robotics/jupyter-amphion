from ._version import version_info, __version__

from .amphion import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'jupyter-amphion',
        'require': 'jupyter-amphion/extension'
    }]
