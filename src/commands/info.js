import chalk from 'chalk';
import ora from 'ora';
import { getRegistry } from '../utils.js';

export async function infoWorkflow(workflowName) {
    const spinner = ora('Fetching workflow details...').start();

    try {
        const registry = await getRegistry();

        const workflow = registry.workflows[workflowName];

        spinner.stop();

        if (!workflow) {
            console.log(chalk.red(`Workflow "${workflowName}" not found.`));
            return;
        }

        console.log(chalk.bold.green(`\n${workflowName}`));
        console.log('='.repeat(workflowName.length));
        console.log(`\n${chalk.bold('Description:')} ${workflow.description}`);
        console.log(`${chalk.bold('Category:')}    ${workflow.category}`);
        console.log(`${chalk.bold('Tags:')}        ${workflow.tags.join(', ')}`);
        console.log(`\n${chalk.bold('Install command:')}`);
        console.log(chalk.cyan(`  npx antigravity-workflows install ${workflowName}`));
        console.log('');

    } catch (error) {
        spinner.fail('Failed to get info');
        console.error(chalk.red(error.message));
    }
}
