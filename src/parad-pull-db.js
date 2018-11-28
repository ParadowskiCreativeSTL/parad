const cli = require('commander')

cli
    .description('pull the database from a specific environment')
    .action(() => { console.log('this is the pull db command') })
    .parse(process.argv)