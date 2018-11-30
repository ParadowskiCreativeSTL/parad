const cli = require('commander')
const Utils = require('./utils')

cli
    .description('list the different configured environments')
    .action(async () => {
        let { environments } = await Utils.rcFile()

        Object.keys(environments).forEach(key => {
            console.log(key)
        })
    })
    .parse(process.argv)
