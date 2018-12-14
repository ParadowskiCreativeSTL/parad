const cli = require('commander')

cli
    .description('Deploy project to specified environment')
    .action(() => { console.log('this is the push command') })
    .parse(process.argv)
