const shell = require('shelljs')

shell.exec('git add .')
shell.exec('git commit -m record')
shell.exec('git push')