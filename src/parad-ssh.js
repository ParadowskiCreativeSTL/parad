const { execSync } = require('child_process')
const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./utils')

cli
    .description('Creates an ssh tunnel to a remote environment')
    .arguments('[env]')
    .action(async (env) => {
        let rc = await Utils.rcFile()

        let { selected } = await inquirer
            .prompt([
                {
                    name: 'selected',
                    type: 'list',
                    message: 'Which environment would you like to ssh into?',
                    choices: Object.keys(rc.environments)
                }
            ])

        try {
            // For security, timeout after 3 mins
            execSync(`ssh ${rc.environments[selected].connectionString}`, { stdio: [0, 1, 2], timeout: 180000 })
        } catch (err) {
            if (err.code) {
                switch (err.code) {
                    case 'ETIMEDOUT':
                        console.log('\nFor your security, I\'ve closed the connection.')
                        break
                    default:
                        console.error('\nAn unknown error has occurred: ', err.stdout)
                }
            } else if (err.status) {
                switch (err.status) {
                    // We purposely don't want to display an error when ^C is pressed
                    // since we want the user to be able to use that over the ssh connection
                    case 130:
                        break
                    case 255:
                        console.error('\nSSH failed, there may be output above this message. Please try again or adjust your configuration file.')
                        break
                    default:
                        console.error('\nAn unknown error has occurred: ', err.stdout)
                }
            }
        }
    })
    .parse(process.argv)
