const { execSync } = require('child_process')
const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./utils')

cli
    .description('pull the assets from a specific environment')
    .action(async () => {
        let rc = await Utils.rcFile()

        let { selected } = await inquirer
            .prompt([
                {
                    name: 'selected',
                    type: 'list',
                    message: 'Which environment would you like to pull assets from?',
                    choices: Object.keys(rc.environments)
                }
            ])

        if (rc.environments[selected].assetTrips) {
            rc.environments[selected].assetTrips.forEach((tripString) => {
                let [localPath, destinationPath] = tripString.split(':')

                try {
                    execSync(`rsync -avz ${rc.environments[selected].connectionString}:${destinationPath} ${localPath}`, { stdio: [0, 1, 2] })
                } catch (err) {
                    console.error(err)
                }
            })
        } else {
            console.log('It doesn\'t look like you have asset paths set up yet. To update your environment, run: parad env update')
        }
    })
    .parse(process.argv)
