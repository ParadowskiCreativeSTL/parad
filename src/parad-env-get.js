const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./utils')

cli
    .description('get a server environment configuration')
    .action(async () => {
        let { environments } = await Utils.rcFile()

        let { selected } = await inquirer
            .prompt([
                {
                    name: 'selected',
                    type: 'list',
                    message: 'Which environment would you like to view the configuration for?',
                    choices: Object.keys(environments)
                }
            ])

        console.log(JSON.stringify(environments[selected], null, 4))
    })
    .parse(process.argv)
