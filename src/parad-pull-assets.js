const cli = require('commander')

cli
    .description('pull the assets from a specific environment')
    .action(() => { console.log('this is the pull assets command') })
    .parse(process.argv)