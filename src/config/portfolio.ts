// Portfolio Configuration - Load from config.json file
import configData from './config.json';

export const portfolioConfig = {
  // Personal Information
  name: configData.personal.name || 'Developer',
  title: configData.personal.title || 'Developer',
  subtitle: configData.personal.subtitle || 'Building cool stuff',
  bio: configData.personal.bio || 'Developer passionate about creating amazing experiences',
  
  // Contact & Social
  contact: configData.contact || {
    email: '',
    github: '',
    telegram: '',
    twitter: '',
    instagram: ''
  },

  // Skills & Technologies
  skills: configData.skills || [],

  // Projects Portfolio
  projects: configData.projects || [],

  // GitHub Stats
  githubStats: configData.githubStats || {
    enabled: true,
    user: '',
    repo: '',
    title: 'GitHub Stats',
    useTotalStars: true,
  },
  
  contributionsTechStack: {
    enabled: true,
    title: 'Tech Stack',
    source: 'github',
    user: configData.githubStats?.user || '',
    limit: 8,
    items: [],
  },

  // Contributor Roles & Organizations
  contributionsSection: {
    enabled: configData.contributions?.enabled ?? true,
    contributorsEnabled: configData.contributors?.enabled ?? true,
    contributorsTitle: configData.contributors?.title || 'Contributors',
    contributors: configData.contributors?.data || [],
  },
  
  contributions: configData.contributions?.data || [],

  // Experience Timeline
  experience: configData.experience || [],
};