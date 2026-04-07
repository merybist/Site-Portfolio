import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  note,
  outro,
  select,
  text,
} from '@clack/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'src', 'config', 'config.json');
const markerPath = path.join(rootDir, '.portfolio-configured');
const viteConfigPath = path.join(rootDir, 'vite.config.ts');

const args = new Set(process.argv.slice(2));
const checkMode = args.has('--check');

const defaultConfig = {
  personal: {
    name: '<Your Name>',
    title: '<Your Title / Role>',
    subtitle: '<Short tagline / subtitle>',
    bio: '<A brief bio about you, experience, and skills>',
    location: '',
    avatar: '',
  },
  contact: {
    email: '<Email>',
    github: '<GitHub URL>',
    telegram: '<Telegram URL>',
    twitter: '<Twitter URL>',
    instagram: '<Instagram URL>',
  },
  githubStats: {
    enabled: true,
    user: '<GitHub username>',
    repo: '<Repo to show stats for>',
    title: 'GitHub Stats',
    useTotalStars: true,
  },
  contributions: { enabled: true, data: [] },
  contributors: { enabled: true, title: 'Contributors', data: [] },
  skills: [],
  projects: [],
  experience: [],
};

const commonSkills = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Docker',
  'Linux',
  'Cybersecurity',
  'Tailwind CSS',
  'PostgreSQL',
  'Git',
];

function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Setup cancelled. You can run it any time with: npm run setup');
    process.exit(0);
  }
  return value;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readConfig() {
  try {
    const raw = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return defaultConfig;
  }
}

function deepMerge(base, next) {
  if (Array.isArray(base) && Array.isArray(next)) return next;
  if (typeof base !== 'object' || base === null) return next;
  if (typeof next !== 'object' || next === null) return base;

  const result = { ...base };
  for (const key of Object.keys(next)) {
    result[key] = key in base ? deepMerge(base[key], next[key]) : next[key];
  }
  return result;
}

function normalizeGithubUsername(urlOrUsername) {
  const value = (urlOrUsername || '').trim();
  if (!value) return '';
  const m = value.match(/github\.com\/([A-Za-z0-9-]+)/i);
  return m ? m[1] : value.replace(/^@/, '');
}

function isValidGithubUrl(value) {
  return /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9-]+\/?$/i.test(value.trim());
}

async function patchViteBase(repoName) {
  if (!repoName) return;
  try {
    const current = await fs.readFile(viteConfigPath, 'utf-8');
    const baseLine = `  base: '/${repoName}/',`;

    let updated;
    if (/\n\s*base:\s*['"].*?['"],?/m.test(current)) {
      updated = current.replace(/\n\s*base:\s*['"].*?['"],?/m, `\n${baseLine}`);
    } else {
      updated = current.replace(/defineConfig\s*\(\s*\{/, (m) => `${m}\n${baseLine}`);
    }

    if (updated !== current) {
      await fs.writeFile(viteConfigPath, updated, 'utf-8');
    }
  } catch {
    // non-blocking
  }
}

async function run() {
  const configured = await fileExists(markerPath);
  if (configured && checkMode) return;

  if (configured && !checkMode) {
    const rerun = handleCancel(
      await confirm({
        message: 'Setup already completed. Run setup again?',
        initialValue: false,
      }),
    );
    if (!rerun) {
      outro('No changes made.');
      return;
    }
  }

  intro('merybist portfolio setup');

  const current = await readConfig();

  const name = handleCancel(
    await text({
      message: 'Your name',
      placeholder: 'John Doe',
      initialValue: current.personal?.name || '',
      validate: (v) => (!v.trim() ? 'Name is required' : undefined),
    }),
  );

  const title = handleCancel(
    await text({
      message: 'Your role/title',
      placeholder: 'Frontend Developer',
      initialValue: current.personal?.title || '',
      validate: (v) => (!v.trim() ? 'Title is required' : undefined),
    }),
  );

  const subtitle = handleCancel(
    await text({
      message: 'Subtitle',
      placeholder: 'Building useful things on the web',
      initialValue: current.personal?.subtitle || '',
    }),
  );

  const bio = handleCancel(
    await text({
      message: 'Short bio',
      placeholder: 'I build apps, tools, and products people enjoy using.',
      initialValue: current.personal?.bio || '',
      validate: (v) => (!v.trim() ? 'Bio is required' : undefined),
    }),
  );

  const location = handleCancel(
    await text({
      message: 'Location (optional)',
      placeholder: 'Kyiv, Ukraine',
      initialValue: current.personal?.location || '',
    }),
  );

  const avatar = handleCancel(
    await text({
      message: 'Avatar URL or local path (optional)',
      placeholder: '/images/me.jpg or https://...',
      initialValue: current.personal?.avatar || '',
    }),
  );

  const email = handleCancel(
    await text({
      message: 'Email',
      placeholder: 'you@example.com',
      initialValue: current.contact?.email || '',
    }),
  );

  const github = handleCancel(
    await text({
      message: 'GitHub profile URL',
      placeholder: 'https://github.com/username',
      initialValue: current.contact?.github || '',
      validate: (v) => (!v.trim() ? 'GitHub URL is required' : (!isValidGithubUrl(v) ? 'Use format: https://github.com/username' : undefined)),
    }),
  );

  const telegram = handleCancel(
    await text({
      message: 'Telegram link (optional)',
      placeholder: 'https://t.me/username',
      initialValue: current.contact?.telegram || '',
    }),
  );

  const twitter = handleCancel(
    await text({
      message: 'Twitter/X link (optional)',
      placeholder: 'https://x.com/username',
      initialValue: current.contact?.twitter || '',
    }),
  );

  const instagram = handleCancel(
    await text({
      message: 'Instagram link (optional)',
      placeholder: 'https://instagram.com/username',
      initialValue: current.contact?.instagram || '',
    }),
  );

  const selectedSkills = handleCancel(
    await multiselect({
      message: 'Pick your skills',
      options: commonSkills.map((s) => ({ label: s, value: s })),
      initialValues: (current.skills || []).map((s) => s?.name).filter(Boolean),
      required: false,
    }),
  );

  const customSkillsInput = handleCancel(
    await text({
      message: 'Custom skills (comma separated, optional)',
      placeholder: 'Rust, GraphQL',
    }),
  );

  const deployment = handleCancel(
    await select({
      message: 'Where do you plan to deploy?',
      options: [
        { value: 'vercel', label: 'Vercel' },
        { value: 'cloudflare', label: 'Cloudflare Pages' },
        { value: 'github-pages', label: 'GitHub Pages' },
        { value: 'other', label: 'Other' },
      ],
    }),
  );

  let repoName = '';
  if (deployment === 'github-pages') {
    repoName = handleCancel(
      await text({
        message: 'GitHub repository name for base path',
        placeholder: 'Site-Portfolio',
        validate: (v) => (!v.trim() ? 'Repository name is required' : undefined),
      }),
    );
  }

  const customSkills = customSkillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allSkills = Array.from(new Set([...selectedSkills, ...customSkills]));

  const nextConfig = deepMerge(current, {
    personal: {
      name: name.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      bio: bio.trim(),
      location: location.trim(),
      avatar: avatar.trim(),
    },
    contact: {
      email: email.trim(),
      github: github.trim(),
      telegram: telegram.trim(),
      twitter: twitter.trim(),
      instagram: instagram.trim(),
    },
    githubStats: {
      ...current.githubStats,
      user: normalizeGithubUsername(github),
      repo:
        current.githubStats?.repo && !String(current.githubStats.repo).includes('<')
          ? current.githubStats.repo
          : `${normalizeGithubUsername(github)}/${repoName || 'portfolio'}`,
    },
    skills: allSkills.map((name) => ({
      name,
      category: ['React', 'TypeScript', 'Tailwind CSS'].includes(name)
        ? 'frontend'
        : ['Node.js', 'Python', 'Rust'].includes(name)
        ? 'backend'
        : ['PostgreSQL'].includes(name)
        ? 'database'
        : 'tools',
    })),
  });

  await fs.writeFile(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`, 'utf-8');
  await fs.writeFile(markerPath, `configuredAt=${new Date().toISOString()}\n`, 'utf-8');

  if (deployment === 'github-pages' && repoName.trim()) {
    await patchViteBase(repoName.trim());
  }

  note(
    [
      `Name: ${nextConfig.personal.name}`,
      `Title: ${nextConfig.personal.title}`,
      `GitHub: ${nextConfig.contact.github}`,
      `Skills: ${nextConfig.skills.length}`,
      `Deployment: ${deployment}`,
    ].join('\n'),
    'Setup complete',
  );

  outro('Portfolio is ready. Start with: npm run dev');
}

run().catch((error) => {
  cancel(`Setup failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
