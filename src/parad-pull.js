const cli = require('commander')

cli
    .description('Sync local project to remote environment')
    .command('db', 'Pull the database from a specific environment')
    .command('assets', 'Pull the assets from a specific environment')
    .parse(process.argv)
