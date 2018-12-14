const cli = require('commander')

cli
    .description('CRUD for different environments')
    .command('get', 'Get the configuration for a specific environment').alias('g')
    .command('list', 'List the different configured environments').alias('l')
    .command('add', 'Add a new server environment configuration').alias('a')
    .command('update', 'Update a server environment configuration').alias('u')
    .command('remove', 'Remove a server environment configuration').alias('r')
    .parse(process.argv)
