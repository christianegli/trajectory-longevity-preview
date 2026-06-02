# Push this Trajectory site to a new GitHub repository

Local Git commit has been created in this directory. GitHub push requires an authenticated `gh` session.

Default private repo target:

```bash
cd "/Users/atlas/Documents/New project 4/site"
gh auth login
gh repo create christianegli/trajectory-site --private --source . --remote origin --push
```

If you want a different repo name or owner:

```bash
cd "/Users/atlas/Documents/New project 4/site"
gh repo create OWNER_OR_ORG/REPO_NAME --private --source . --remote origin --push
```

If `origin` already exists later:

```bash
git remote set-url origin https://github.com/OWNER_OR_ORG/REPO_NAME.git
git push -u origin HEAD:main
```
