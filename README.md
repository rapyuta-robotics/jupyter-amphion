jupyter-amphion
===============================

Jupyter Widget for Amphion

Installation
------------

To install use pip:

    $ pip install jupyter_amphion
    $ jupyter nbextension enable --py --sys-prefix jupyter_amphion


For a development installation (requires npm),

    $ git clone https://github.com/rapyuta-robotics/jupyter-amphion.git
    $ cd jupyter-amphion
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix jupyter_amphion
    $ jupyter nbextension enable --py --sys-prefix jupyter_amphion
