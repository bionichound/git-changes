# Git Changes VS Code Extension

The git changes vscode extension makes it easier to write consistent changelogs. It does
so by ensuring that all links created are added automatically.

## Extension Settings

This extension contributes the following settings:

* `git-changes.repo`: Specifies the repository name to use for changelog links
* `git-changes.owner`: Specifies the owner/organisation name to use for changelog links
* `git-changes.enabled`: Specifies the owner/organisation name to use for changelog links

Whenever changes are made to the settings file, make sure to reload the editor using the
`Developer: Reload Window` command.

## Example

When writing the following in your changelog and saving the file:

```md
[git-changes v0.1.0 -> v0.2.0] Added git-changes support
```

The git-changes extension will add the following link at the end of the changelog block:

```md
[git-changes v0.1.0 -> v0.2.0]:https://github.com/bionichound/git-changes/compare/v0.1.0...v0.2.0
```

Changelog blocks are delimited by the following regex: ^[#]+ \[\S+\] - \S+$, for example:

```md
## [v0.1.0] - 2021-11-14
This is the first changelog block

[v0.1.0]:https://github.com/bionichound/git-changes/releases/tag/v0.1.0


## [v0.0.0] - 2021-10-14
A new changelog block starts here
```

## Release Notes
### 0.1.0
Initial release of git-changes