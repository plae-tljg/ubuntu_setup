# Cursor Style

To manage cursor style, it would be best to install `gnome-tweaks` tool to manage its style.  

Note that files (of type X11 cursor) inside cursor style can be viewed with `gimp`.  

The place to place cursor styles is inside `/usr/share/icons/`.  

## Constructing Cursor Style

Just download any cursor style online, example: [https://www.gnome-look.org/browse?cat=107&ord=latest](https://www.gnome-look.org/browse?cat=107&ord=latest)  

Then change any file there for your cursor style, like if you downloaded `oero_blue_cursors`, you can replace `default`, `progress`, `text`, `pointer`, `help`, `alias`, `up-arrow` and many others.  

To deploy it, just use gnome-tweaks tools, in `appearance` tab, change the `Cursor` under `Themes` to your cursor style.  

For trying to create one's own X11 cursor files, remember I have written a library before for `cur2png` and `png2cur` by C. (Oops, does the C lib or the python lib work? Forgotten)  

Please see the `./lib/cursor_style_lib`, the library's underlying logic is that I already get a window cursor style zip, so I want to adapt it to a ubuntu style.  
