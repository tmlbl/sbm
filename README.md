sbm
===

Git submodules, the way I wish they worked.

## Install
```
npm i -g sbm
```
Or, clone this repository and run `make install`.

## Use

It's easy, and fun.

### Initialize a project
```
sbm init
```
### Add a dependency
```
sbm add -b mybranch git@github.com:me/myrepo lib/mylib
```
### Fetch latest code
```
sbm sync lib/mylib
```
### Remove a dependency
```
sbm rm lib/mylib
```

