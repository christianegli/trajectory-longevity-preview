# Trajectory site backup and undo log

Canonical site folder:

`/Users/atlas/Documents/New project 4/site`

## Safety baseline

Before product work resumed, the whole site folder was backed up and committed to Git.

- Baseline commit: `a5b80089ee77a775a6c6d0a77fae34c62347171a`
- Baseline tag: `safety/baseline-20260522-101430`
- Archive backup: `/Users/atlas/backups/trajectory-site/20260522-101430/site.zip`
- Archive SHA-256: `615231c8e212f39bc2f8adb5eca9fe0819a78c61bc0631d66ba9071c92966092`
- Working branch: `work/trajectory-site-recovery-20260522`

## Undo options

### Inspect history

```bash
cd "/Users/atlas/Documents/New project 4/site"
git log --oneline --decorate --graph --all
```

### Undo only the latest commit while preserving the change as unstaged files

```bash
cd "/Users/atlas/Documents/New project 4/site"
git reset --mixed HEAD~1
```

### Revert a specific commit safely

```bash
cd "/Users/atlas/Documents/New project 4/site"
git revert <commit-sha>
```

### Return the whole tree to the baseline commit

This discards changes after the baseline in the working tree.

```bash
cd "/Users/atlas/Documents/New project 4/site"
git reset --hard safety/baseline-20260522-101430
```

### Restore from the zip archive

```bash
cd /Users/atlas/backups/trajectory-site/20260522-101430
shasum -a 256 -c site.zip.sha256
mkdir -p /Users/atlas/restore-tests
/usr/bin/ditto -x -k site.zip /Users/atlas/restore-tests/
```

## Operating rule

Every meaningful change should be committed separately with a clear message so it can be reverted independently.

## GitHub/off-machine backup

GitHub CLI was present but not authenticated during setup, so cloud backup is prepared but not yet pushed. After authenticating, run:

```bash
cd "/Users/atlas/Documents/New project 4/site"
gh auth login
./scripts/push_github_backup.sh christianegli trajectory-site
```

The script creates a private repository if it does not exist, pushes the current branch, and pushes tags including the safety baseline tag.
