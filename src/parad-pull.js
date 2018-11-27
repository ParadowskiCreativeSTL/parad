const cli = require('commander')

cli
    .description('Sync local project to remote environment')
    .action(() => { console.log('this is the pull command') })
    .parse(process.argv)