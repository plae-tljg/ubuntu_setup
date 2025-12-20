_python_module_completion() {
  local cur prev base_dir prefix
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  # 检查是否在 -m 参数后
  local has_m=0
  for ((i=1; i<COMP_CWORD; i++)); do
    if [[ "${COMP_WORDS[i]}" == "-m" ]]; then
      has_m=1
      break
    fi
  done

  # 如果不在 -m 参数后，使用默认补全
  if [[ $has_m -eq 0 ]]; then
    # 使用默认的文件名补全
    _filedir
    return 0
  fi

  # 只在 -m 后面补全
  if [[ "$prev" != "-m" ]]; then
    return 0
  fi

  # 分割模块路径，base_dir 是父目录，prefix 是当前补全前缀
  if [[ "$cur" == *.* ]]; then
    base_dir="${cur%.*}"
    prefix="${cur##*.}"
    search_dir="${base_dir//./\/}"
  else
    base_dir=""
    prefix="$cur"
    search_dir="."
  fi

  # 查找当前目录下的所有目录和 .py 文件（不含 __init__.py）
  local candidates=()
  if [[ -d "$search_dir" ]]; then
    while IFS= read -r entry; do
      if [[ -d "$search_dir/$entry" ]]; then
        candidates+=("$entry")
      elif [[ -f "$search_dir/$entry" && "$entry" == *.py && "$entry" != "__init__.py" ]]; then
        candidates+=("${entry%.py}")
      fi
    done < <(ls "$search_dir")
  fi

  # 拼接模块路径并补全
  local results=()
  for c in "${candidates[@]}"; do
    if [[ "$c" == "$prefix"* ]]; then
      if [[ -n "$base_dir" ]]; then
        results+=("$base_dir.$c")
      else
        results+=("$c")
      fi
    fi
  done

  COMPREPLY=( $(compgen -W "${results[*]}" -- "$cur") )
  compopt -o nospace
}

# 使用 -o default 选项来保持默认补全行为
complete -F _python_module_completion -o default python python3

