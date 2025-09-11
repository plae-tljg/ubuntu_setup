# Common Command

| 命令             | 作用说明             |
|------------------|----------------------|
| cat /etc/group   | 查看系统所有用户组信息 |
| systemctl --user list-units --type=service --state=running  |  see user service  |

## Command to Reload and Restart Services

| 命令             | 作用说明             |
|------------------|----------------------|
|     sudo systemctl daemon-reload   | reload services |
| sudo systemctl restart xxx.services  |  restart service  |
