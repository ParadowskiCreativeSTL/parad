const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./utils')

cli
    .description('add a new server environment configuration')
    .action(async () => {
        let config = await Utils.rcFile()

        let { env, assetsCompiled } = await inquirer
            .prompt([
                {
                    name: 'env',
                    type: 'input',
                    message: 'Environment name: (Example: qa, staging, production, etc.)'
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
                message: `What\'s the ${env} environment connection string? (Example: root@example.com)`
            },
            {
                name: 'rootDirectory',
                type: 'input',
                message: `What\'s the ${env} environment project root directory? (Example: /var/www/html)`
            }
        ]

        if (assetsCompiled) {
            questions.push(
                {
                    name: 'precompileCommand',
                    type: 'input',
                    message: `What\'s the ${env} environment precompile command? (Example: npm run build)`
                },
                {
                    name: 'assetTrips',
                    type: 'input',
                    message: `Where should I put ${env} assets in relation to local and ${env} directories? Separate multiple paths by spaces. (Example: /local/js:/${env}/js /local/css:/${env}/css)`
                }
            )
        }

        config.environments[env] = await inquirer.prompt(questions)

        await Utils.createRCFile(JSON.stringify(config, null, 4))
        console.log('Your config file has been updated!')
    })
    .parse(process.argv)