import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync } from 'fs';
import { getRegistry, getWorkflowMarkdown } from '../utils.js';

export async function installWorkflow(workflows = [], options = {}) {
    const spinner = ora('Fetching workflow registry...').start();

    try {
        const registry = await getRegistry();

        // Create .agents/workflows and .agent/workflows directories
        const cwd = process.cwd();
        const agentsWorkflowDir = path.join(cwd, '.agents', 'workflows');
        const agentWorkflowDir = path.join(cwd, '.agent', 'workflows');

        if (!existsSync(agentsWorkflowDir)) {
            await fs.mkdir(agentsWorkflowDir, { recursive: true });
        }
        if (!existsSync(agentWorkflowDir)) {
            await fs.mkdir(agentWorkflowDir, { recursive: true });
        }

        // Handle --all flag
        if (options.all) {
            workflows = Object.keys(registry.workflows);
        }

        // Handle --category flag
        if (options.category) {
            workflows = Object.entries(registry.workflows)
                .filter(([_, w]) => w.category === options.category)
                .map(([name]) => name);
        }

        // Deduplicate
        workflows = [...new Set(workflows)];

        if (workflows.length === 0) {
            spinner.warn('No workflows specified. Use --all or --category <name> to install workflows.');
            return;
        }

        spinner.text = `Installing ${workflows.length} workflow(s)...`;

        let installedCount = 0;
        for (const name of workflows) {
            const workflow = registry.workflows[name];
            if (!workflow) {
                console.log(chalk.yellow(`\n⚠ Workflow "${name}" not found in registry, skipping`));
                continue;
            }

            try {
                const content = await getWorkflowMarkdown(workflow.category, name);
                
                // Write to both .agents/workflows and .agent/workflows for max compatibility
                await fs.writeFile(path.join(agentsWorkflowDir, `${name}.md`), content, 'utf-8');
                await fs.writeFile(path.join(agentWorkflowDir, `${name}.md`), content, 'utf-8');

                installedCount++;
                console.log(chalk.green(`\n✓ Installed ${name} (${workflow.description})`));
            } catch (dlErr) {
                console.log(chalk.red(`\n✖ Failed to load ${name}: ${dlErr.message}`));
            }
        }

        spinner.succeed(`Done! Installed ${installedCount} workflow(s).`);
        console.log(chalk.cyan(`📍 Workflows directory: ${agentsWorkflowDir}`));
        console.log(chalk.dim(`\nTry it now: Type /${workflows[0] || 'workflow-name'} in Antigravity or Cursor`));

    } catch (error) {
        spinner.fail('Installation failed');
        console.error(chalk.red(error.message));
    }
}
