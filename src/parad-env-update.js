const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./utils')

cli
    .description('update a new server environment')
    .action(async () => {
        let rc = await Utils.rcFile()

        let { selected, assetsCompiled } = await inquirer
            .prompt([
                {
                    name: 'selected',
                    type: 'list',
                    message: 'Which environment would you like to update?',
                    choices: Object.keys(rc.environments)
                },
                {
                    name: 'assetsCompiled',
                    type: 'list',
                    message: `Are assets precompiled for the environment?`,
                    choices: [
                        { name: 'Yes', value: true },
                        { name: 'No', value: false }
                    ]
                }
            ])

        let questions = [
            {
                name: 'connectionString',
                type: 'input',
                message: `What\'s the ${selected} environment connection string? (Example: root@example.com)`
            },
            {
                name: 'rootDirectory',
                type: 'input',
                message: `What\'s the ${selected} environment project root directory? (Example: /var/www/html)`
            }
        ]

        if (assetsCompiled) {
            questions.push(
                {
                    name: 'precompileCommand',
                    type: 'input',
                    message: `What\'s the ${selected} environment precompile command? (Example: npm run build)`
                },
                {
                    name: 'assetTrips',
                    type: 'input',
                    message: `Where should I put ${selected} assets in relation to local and ${selected} directories? Separate multiple paths by spaces. (Example: /local/js:/${selected}/js /local/css:/${selected}/css)`
                }
            )
        }

        rc.environments[selected] = await inquirer.prompt(questions)

        await Utils.createRCFile(JSON.stringify(rc, null, 4))
        console.log('Your config file has been updated!')
    })
    .parse(process.argv)