# Local CodeSearch server

A simple UI server for showing code search results for local code. The indexing
and actual code search is provided by Russ Cox's csearch program
(https://swtch.com/~rsc/regexp/regexp4.html,
 https://github.com/google/codesearch).

# Getting Started

To get started, first clone the repo to your machine:

```
git clone https://github.com/mknichel/local-csearch-server.git

cd local-csearch-server/
```

Install the `cindex` and `csearch` programs by following the instructions at
https://github.com/google/codesearch

Run the `cindex` program on the directories that you want searchable.
For example:

```
~/bin/cindex $HOME/src
```

Now, everytime you run the `~/bin/cindex` program, it will refresh the index.

Now you can start up the UI server to get code search results:

```
node index.js
```

and visit `http://localhost:3000` in a browser to access the UI.