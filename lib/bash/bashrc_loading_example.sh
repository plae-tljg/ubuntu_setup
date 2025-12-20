# ~/.bashrc 中的模块化加载示例

# Load custom environment variables
if [ -f ~/.bash_env_vars ]; then
    . ~/.bash_env_vars
fi

# Load aliases
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# Load Python module completion
if [ -f ~/.python_module_completion.sh ]; then
    source ~/.python_module_completion.sh
fi

# Load custom functions
if [ -f ~/.bash_functions ]; then
    . ~/.bash_functions
fi

