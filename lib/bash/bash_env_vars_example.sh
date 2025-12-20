#!/usr/bin/env bash
# ~/.bash_env_vars
# 示例环境变量配置文件

# 别名定义
alias python_serve="python -m http.server"
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# 系统相关
export SYSTEM_USER_LIB=/usr/local/lib

# Java 配置
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Python 相关
export PYENV=$HOME/.pyenv/bin

# Node.js 相关
export NODE_JS=$HOME/.local/node/bin

# PATH 配置
export PATH=$HOME/.local/bin:$PYENV:$NODE_JS:$PATH

# LD_LIBRARY_PATH 配置
export LD_LIBRARY_PATH=$HOME/.local/lib:$SYSTEM_USER_LIB:$LD_LIBRARY_PATH

