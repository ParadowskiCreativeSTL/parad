const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./utils')

cli
    .description('Guided setup for project deployment')
    .action(async () => {
        let config = { environments: {} }
        let { environments, assetsCompiled } = await inquirer
            .prompt([
                {
                    name: 'environments',
                    type: 'checkbox',
                    message: 'Which environments you\'d like to initialize?',
                    choices: [
                        'qa',
                        'staging',
                        'production'
                    ]
                },
                {
                    name: 'assetsCompiled',
                    type: 'list',
                    message: 'Are assets precompiled?',
                    choices: [
                        { name: 'Yes, we always build assets (JS, CSS, etc.) and sync to the server as part of our deployment', value: 'yes' },
                        { name: 'No, the server takes care of it', value: 'no' },
                        { name: 'Sometimes, depends on the environment', value: 'sometimes' }
                    ]
                }
            ])

        await Utils.asyncForEach(environments, async (env) => {
            if (assetsCompiled === 'sometimes') {
                var { compileAssets } = await inquirer
                    .prompt([
                        {
                            name: 'compileAssets',
                            type: 'list',
                            message: `Are assets precompiled for the ${env} environment?`,
                            choices: [
                                { name: 'Yes', value: true },
                                { name: 'No', value: false }
                            ]
                        }
                    ])
            }

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

            if (compileAssets || assetsCompiled === 'yes') {
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
        })

        // Convert the assetTrips string into an array
        Object.keys(config.environments).forEach((env) => {
            if (config.environments[env].assetTrips) {
                config.environments[env].assetTrips = config.environments[env].assetTrips.split(' ')
            }
        })
        
        await Utils.createRCFile(JSON.stringify(config, null, 4))
        console.log('Your config file has been saved!')
    })
    .parse(process.argv)
