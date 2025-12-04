/**
 * WPF v2.0 Discover Command
 *
 * Interactive wizard to generate wpf-config.yaml
 */
import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fsExtra from 'fs-extra';
const { writeFile } = fsExtra;
import { stringify as yamlStringify } from 'yaml';
import {
  type WPFConfig,
  type Industry,
  type PageTemplate
} from '../../types/config.js';
import { getIndustryDefaults } from '../../core/config-loader.js';

export interface DiscoverOptions {
  quick?: boolean;
  output?: string;
}

/**
 * Discover command handler
 */
export async function discover(options: DiscoverOptions): Promise<void> {
  console.log(chalk.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║          WPF Discovery Wizard                              ║'));
  console.log(chalk.cyan('║          Let\'s configure your WordPress site              ║'));
  console.log(chalk.cyan('╚═══════════════════════════════════════════════════════════╝\n'));

  try {
    // Step 1: Company Information
    console.log(chalk.yellow('\n📋 Company Information\n'));

    const companyAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Company name:',
        validate: (input: string) => input.length > 0 || 'Required'
      },
      {
        type: 'input',
        name: 'tagline',
        message: 'Company tagline:',
        validate: (input: string) => input.length > 0 || 'Required'
      },
      {
        type: 'list',
        name: 'industry',
        message: 'Industry:',
        choices: [
          { name: 'Technology', value: 'technology' },
          { name: 'Healthcare', value: 'healthcare' },
          { name: 'Legal', value: 'legal' },
          { name: 'Restaurant', value: 'restaurant' },
          { name: 'Retail', value: 'retail' },
          { name: 'Education', value: 'education' },
          { name: 'Finance', value: 'finance' },
          { name: 'Construction', value: 'construction' },
          { name: 'Beauty & Wellness', value: 'beauty' },
          { name: 'Real Estate', value: 'real-estate' },
          { name: 'Consulting', value: 'consulting' },
          { name: 'Other', value: 'other' }
        ]
      }
    ]);

    // Step 2: Contact Information
    console.log(chalk.yellow('\n📞 Contact Information\n'));

    const contactAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Email address:',
        validate: (input: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || 'Invalid email'
      },
      {
        type: 'input',
        name: 'phone',
        message: 'Phone number:',
        validate: (input: string) => input.length > 0 || 'Required'
      },
      {
        type: 'input',
        name: 'street',
        message: 'Street address:'
      },
      {
        type: 'input',
        name: 'city',
        message: 'City:',
        validate: (input: string) => input.length > 0 || 'Required'
      },
      {
        type: 'input',
        name: 'state',
        message: 'State/Province:',
        validate: (input: string) => input.length > 0 || 'Required'
      },
      {
        type: 'input',
        name: 'postal_code',
        message: 'Postal code:'
      },
      {
        type: 'input',
        name: 'country',
        message: 'Country:',
        default: 'BR'
      }
    ]);

    // Step 3: Branding
    console.log(chalk.yellow('\n🎨 Branding\n'));

    const industryDefaults = getIndustryDefaults(companyAnswers.industry);

    const brandingAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'primary_color',
        message: 'Primary color (hex):',
        default: industryDefaults.branding?.primary_color || '#16a34a',
        validate: (input: string) =>
          /^#[0-9A-Fa-f]{6}$/.test(input) || 'Must be hex color (e.g., #16a34a)'
      },
      {
        type: 'input',
        name: 'secondary_color',
        message: 'Secondary color (hex):',
        default: industryDefaults.branding?.secondary_color || '#15803d',
        validate: (input: string) =>
          /^#[0-9A-Fa-f]{6}$/.test(input) || 'Must be hex color'
      },
      {
        type: 'input',
        name: 'font_family',
        message: 'Font family (Google Fonts):',
        default: industryDefaults.branding?.font_family || 'Inter'
      }
    ]);

    // Step 4: Pages
    console.log(chalk.yellow('\n📄 Pages\n'));

    const pageAnswers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'pages',
        message: 'Select pages to create:',
        choices: [
          { name: 'Home', value: 'home', checked: true },
          { name: 'About', value: 'about', checked: true },
          { name: 'Services', value: 'services', checked: true },
          { name: 'Products', value: 'products', checked: false },
          { name: 'Solutions', value: 'solutions', checked: false },
          { name: 'Contact', value: 'contact', checked: true },
          { name: 'Blog', value: 'blog', checked: false }
        ],
        validate: (input: string[]) =>
          input.length > 0 || 'Select at least one page'
      }
    ]);

    // Generate project name from company name
    const projectName = companyAnswers.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Build pages array
    const pages = pageAnswers.pages.map((slug: string) => {
      const templateMap: Record<string, PageTemplate> = {
        'home': 'front-page',
        'about': 'about',
        'services': 'services',
        'products': 'products',
        'solutions': 'solutions',
        'contact': 'contact',
        'blog': 'blog'
      };

      const titleMap: Record<string, string> = {
        'home': 'Home',
        'about': 'About Us',
        'services': 'Services',
        'products': 'Products',
        'solutions': 'Solutions',
        'contact': 'Contact',
        'blog': 'Blog'
      };

      const page: any = {
        slug,
        title: titleMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1),
        template: templateMap[slug] || 'custom'
      };

      // Add sections for homepage
      if (slug === 'home') {
        page.sections = [
          {
            type: 'hero-centered',
            title: companyAnswers.tagline,
            subtitle: `Welcome to ${companyAnswers.name}`,
            cta_text: 'Learn More',
            cta_url: '/about'
          },
          {
            type: 'features-grid',
            title: 'Why Choose Us',
            columns: 3,
            items: [
              { icon: 'star', title: 'Quality', description: 'We deliver excellence in everything we do.' },
              { icon: 'shield', title: 'Trust', description: 'Your satisfaction is our top priority.' },
              { icon: 'lightning', title: 'Speed', description: 'Fast and efficient service delivery.' }
            ]
          },
          {
            type: 'cta-banner',
            title: 'Ready to Get Started?',
            subtitle: 'Contact us today to learn how we can help.',
            cta_text: 'Contact Us',
            cta_url: '/contact',
            background: 'primary'
          }
        ];
      }

      return page;
    });

    // Build menu
    const menu = {
      primary: pageAnswers.pages
        .filter((slug: string) => slug !== 'home')
        .map((slug: string) => ({
          title: slug.charAt(0).toUpperCase() + slug.slice(1),
          url: `/${slug}`
        }))
    };

    // Build config
    const config: WPFConfig = {
      project: {
        name: projectName,
        version: '1.0.0'
      },
      company: {
        name: companyAnswers.name,
        tagline: companyAnswers.tagline,
        industry: companyAnswers.industry as Industry
      },
      contact: {
        email: contactAnswers.email,
        phone: contactAnswers.phone,
        address: {
          street: contactAnswers.street || '',
          city: contactAnswers.city,
          state: contactAnswers.state,
          postal_code: contactAnswers.postal_code || '',
          country: contactAnswers.country
        }
      },
      branding: {
        primary_color: brandingAnswers.primary_color,
        secondary_color: brandingAnswers.secondary_color,
        font_family: brandingAnswers.font_family
      },
      pages,
      menu,
      compliance: {
        level: 'strict'
      }
    };

    // Write config file
    const outputPath = options.output || path.join(process.cwd(), 'wpf-config.yaml');
    const yamlContent = yamlStringify(config);

    await writeFile(outputPath, yamlContent, 'utf-8');

    console.log(chalk.green('\n✅ Configuration created successfully!\n'));
    console.log(chalk.white('  Output file: ') + chalk.cyan(outputPath));
    console.log(chalk.white('  Project name: ') + chalk.cyan(projectName));
    console.log(chalk.white('  Pages: ') + chalk.cyan(pages.map((p: any) => p.title).join(', ')));

    console.log(chalk.yellow('\n📦 Next steps:\n'));
    console.log(chalk.white('  1. Review the generated wpf-config.yaml'));
    console.log(chalk.white('  2. Run: ') + chalk.cyan(`wpf build ${projectName}`));
    console.log('');
  } catch (error) {
    if ((error as any).isTtyError) {
      console.error(chalk.red('\nPrompts not available in this environment.'));
      console.log(chalk.yellow('Use --quick mode or provide a config file directly.'));
    } else {
      console.error(chalk.red('\nError during discovery:'), (error as Error).message);
    }
    process.exit(1);
  }
}
