# PostgreSQL

## Installation of PSQL

```bash
sudo apt install postgresql
```

## Change Config Files

The config files are on `/etc/postgresql/<version>/main`,  

`pghba.conf`:  

<CodeViewer 
  title="pghba.conf" 
  filePath="/lib/psql/pghba.conf"
  language="conf"
/>

```bash
sudo systemctl restart postgresql
```

## Set Password

```bash
sudo -u postgres psql
\password postgres  # type the password
```
