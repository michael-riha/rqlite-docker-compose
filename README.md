
> [!NOTE]
> This is just a POC to test `rqlite` on a local maschine & it's ability to make `sqlite` the 🫅 of lightweight `RDMS`.

# Usage:

`docker compose up`

## enter/ `exec` the leader `node1`

- `docker compose exec rqlite-node1 sh`
- `rqlite` to enter the rqlite shell
- execute a few SQL statements -> https://rqlite.io/docs/cli/#example

## see the replication

- `docker compose exec rqlite-node2 sh`
- `cd /root/backup`
- `rqlite` to enter the rqlite shell
- `.backup bak.sqlite3` from https://rqlite.io/docs/guides/backup/#backing-up-rqlite

🥳 now in the folder `backup-node1` you should see the file `.backup bak.sqlite3` which has all the data create in `rqlite-node1` replicated ✅

