const { execSync } = require('child_process')
const cli = require('commander')
const inquirer = require('inquirer')
const Utils = require('./utils')

cli
    .description('pull the database from a specific environment')
    .action(async () => {
        let rc = await Utils.rcFile()

        if (!rc.environments.local)
            return console.error('Looks like you don\'t have a local environment setup!')

        let { selected } = await inquirer
            .prompt([
                {
                    name: 'selected',
                    type: 'list',
                    message: 'Which environment would you like to pull assets from?',
                    choices: Object.keys(rc.environments)
                }
            ])

        // Download the database from the remote server
        try {
            execSync(`
                ssh ${rc.environments[selected].connectionString} "cd ${rc.environments[selected].rootDirectory}/htdocs && wp db export --skip-lock-tables --allow-root -| gzip > ${rc.environments[selected].rootDirectory}/${process.env.DB_NAME}.sql.gz"
                scp ${rc.environments[selected].connectionString}:${rc.environments[selected].rootDirectory}/${process.env.DB_NAME}.sql.gz .
                ssh ${rc.environments[selected].connectionString} "rm -v ${rc.environments[selected].rootDirectory}/${process.env.DB_NAME}.sql.gz"
            `)
        } catch (error) {
            console.error(error)
        }

        // Replace the database
        if (rc.environments.local.contains('@')) {
            // If the local connection string is an ssh connection
            try {
                sshReplaceDb(rc.environments.local)
            } catch (error) {
                console.error('There was an error replacing the database: ', error)
            }
        } else {
            // Otherwise, looks like we have a docker setup
            try {
                dockerReplaceDb(rc.environments.local)
            } catch (error) {
                console.error('There was an error replacing the database: ', error)
            }
        }

        // Remove the database dump from the local directory
        try {
            execSync(`rm ${process.env.DB_NAME}.sql.gz`)
        } catch (error) {
            console.error('Unable to delete database dump: ', error)
        }
    })
    .parse(process.argv)

function sshReplaceDb(config) {
    let replaceUrl = new URL(process.env.WP_HOME).host

    return execSync(`
        ssh ${config.connectionString} "cd ${config.rootDirectory} && gunzip -c ${config.rootDirectory}/${process.env.DB_NAME}.sql.gz | wp db import - && wp search-replace --url=${config.url} ${config.url} ${replaceUrl} '${process.env.DB_PREFIX}*options'"
    `)
}

function dockerReplaceDb(config) {
    let replaceUrl = new URL(process.env.WP_HOME).host

    // copy file into volume space
    execSync(`
        cp ${process.env.DB_NAME}.sql.gz ./htdocs/wp/${process.env.DB_NAME}.sql.gz 
    `)
    
    // unzip the db dump
    execSync(`
        gunzip -kf ./htdocs/wp/${process.env.DB_NAME}.sql.gz
    `)

    // use wp-cli to import db
    execSync(`
        docker run --rm --volumes-from ${config.connectionString} --network container:${config.connectionString} wordpress:cli --path=${config.rootDirectory}/wp db import ${config.rootDirectory}/wp/${process.env.DB_NAME}.sql
    `, { stdio: [0, 1, 2] })

    // use wp-cli to search and replace source url with destination url
    execSync(`
        docker run --rm --volumes-from ${config.connectionString} --network container:${config.connectionString} wordpress:cli --path=${config.rootDirectory}/wp search-replace --url=${config.url} ${config.url} ${replaceUrl} '${process.env.DB_PREFIX}*options'
    `, { stdio: [0, 1, 2] })

    // Remove decompressed file
    execSync(`
        rm ./htdocs/wp/${process.env.DB_NAME}.sql
        rm ./htdocs/wp/${process.env.DB_NAME}.sql.gz
    `)
}