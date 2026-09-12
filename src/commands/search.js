import chalk from 'chalk';
import ora from 'ora';
import { getRegistry } from '../utils.js';

export async function searchWorkflows(query, options = {}) {
    const spinner = ora('Searching...').start();

    try {
        const registry = await getRegistry();

        spinner.stop();

        const results = Object.entries(registry.workflows).filter(([name, data]) => {
            const q = query.toLowerCase();
            return (
                name.toLowerCase().includes(q) ||
                data.description.toLowerCase().includes(q) ||
                (data.tags && data.tags.some(t => t.toLowerCase().includes(q)))
            );
        });

        if (results.length === 0) {
            console.log(chalk.yellow(`No workflows found matching "${query}"`));
            return;
        }

        console.log(chalk.bold(`\nFound ${results.length} result(s) for "${query}":\n`));

        results.forEach(([name, data]) => {
            console.log(`${chalk.green.bold(name)}  ${chalk.dim(`(${data.category})`)}`);
            console.log(`${data.description}`);
            console.log(chalk.dim(`Tags: ${data.tags.join(', ')}`));
            console.log('');
        });

    } catch (error) {
        spinner.fail('Search failed');
        console.error(chalk.red(error.message));
    }
}
