# `git 1337`
## Customize your git commit hashes (to an extent)

---

### How it works
Git's commit hashes take a bunch of inputs, one of them is time.
By calculating hashes of a commit, with its time altered, we get
random commit hashes cheaply. Thus, we can alter a commit's hash
without ruining our repository with junk placed somewhere crazy.

### Use/Installation
```sh
# One-time use (no install, just node/npm and git required)
npx git-1337
```
Or for more extended use:
```sh
# Install globally
npm i -g git-1337
# Use from now on
git 1337
```

### Caveats
This is just a proof of concept right now, not exactly going for
perfection in implementation or UX here. There is nothing really
that can be done here besides coming up with random hashes, read
the code behind it to see how it works (it's not much).
