const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./Utils')

cli
    .description('remove a server environment configuration')
    .action(async () => {
        let rc = await Utils.rcFile()

        let { selected } = await inquirer
            .prompt([
                {
                    name: 'selected',
                    type: 'list',
                    message: 'Which environment would you like to delete?',
                    choices: Object.keys(rc.environments)
                }
            ])

        let { confirm } = await inquirer
            .prompt([
                {
                    name: 'confirm',
                    type: 'list',
                    message: `Are you sure you want to delete the ${selected} configuration?`,
                    choices: [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false }
                    ]
                }
            ])

        if (confirm) {
            delete rc.environments[selected]

            await Utils.createRCFile(JSON.stringify(rc, null, 4))

            console.log('Your configuration file has been updated!')
        } else {
            console.log('Ok')
        }
    })
    .parse(process.argv)