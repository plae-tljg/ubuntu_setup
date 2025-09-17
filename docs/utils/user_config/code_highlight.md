# Code Highlighting

For optimizing gedit by introducing new syntax coloring, we can note the folder at about `/usr/share/gtksourceview-4/language-specs/`.  

Example: consider the case of asterisk conf file at like `/etc/asterisk/`, its commenting is done by `;`, but gedit not support it.  

Remember the file name has to be same as its `id` inside, if not, will not be recognized.  

<CodeViewer 
  title="Lang Setting" 
  filePath="/assets/code_highlight/ast_dialplan.lang"
  language="conf"
/>

<ReferenceViewer 
  title="Asterisk dialplan syntax highlighting for gedit" 
  htmlPath="/assets/code_highlight/Asterisk dialplan syntax highlighting for gedit.html"
  originalUrl="https://www.frigon.info/posts/asterisk/asterisk-dialplan-highlight/"
/>
