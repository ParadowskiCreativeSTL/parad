/**
 *                            _
 *                           | |
 *  _ __   __ _ _ __ __ _  __| |
 * | '_ \ / _` | '__/ _` |/ _` |
 * | |_) | (_| | | | (_| | (_| |
 * | .__/ \__,_|_|  \__,_|\__,_|
 * | |                          
 * |_|
 * 
 * An easy-to-use deployment system with git in mind.
 * 
 * Author: Paradowski Creative (https://www.paradowski.com)
 * License: MIT (https://github.com/ParadowskiCreativeSTL/parad/blob/master/LICENSE)
 */

const cli = require('commander')
const pkg = require('../package.json')

cli
    .version(`parad v${pkg.version}`, '-v, --version')
    .description(pkg.description)
    .command('init', 'guided setup for project deployment').alias('i')
    .command('env', 'CRUD for different environments').alias('e')
    .command('push', 'deploy project to specified environment').alias('ps')
    .command('pull', 'sync local project to remote environment').alias('pl')
    .command('ssh', 'creates an ssh tunnel to a remote environment').alias('s')
    .parse(process.argv)