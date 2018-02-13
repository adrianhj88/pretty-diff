# Pretty Diff

Pretty diff generates colorized HTML diffs similar to the diff/commit views on GitHub.
Simply use `pretty-diff` the same way you use `git diff` and you'll get pretty diffs.

Support this project by [donating on Gratipay](https://gratipay.com/scottgonzalez/).

![image](https://cloud.githubusercontent.com/assets/39191/10147714/8c358910-65e4-11e5-8e59-e1526ef674cd.png)


## Installation

Simply install globally via npm:

```sh
npm install -g pretty-diff
```

## Usage

### pretty-diff

pretty-diff has no settings of its own.
Simply provide whatever settings you want to pass to `git diff`.

For example, to see what changed in the last commit:

	pretty-diff HEAD^

