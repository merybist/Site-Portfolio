import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Star, GitFork, Users } from 'lucide-react';
import { portfolioConfig } from '@/config/portfolio';

const Contributions = () => {
  const contributorsList =
    portfolioConfig.contributionsSection?.contributors || [];
  const contributorsKey = useMemo(
    () => JSON.stringify(contributorsList),
    [contributorsList],
  );
  const [contributorsData, setContributorsData] = useState<
    Record<string, { login?: string; name?: string; avatar_url?: string; html_url?: string }>
  >({});

  const getGithubUsername = (url: string) => {
    const clean = url.trim().replace(/\/+$/, '');
    const parts = clean.split('/');
    return parts[parts.length - 1] || '';
  };

  useEffect(() => {
    let isMounted = true;

    const loadContributors = async () => {
      const results = await Promise.all(
        contributorsList.map(async (contributor: { github: string }) => {
          const username = getGithubUsername(contributor.github);
          if (!username) return null;
          try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) return null;
            const data = await response.json();
            return { username, data };
          } catch {
            return null;
          }
        }),
      );

      if (!isMounted) return;
      setContributorsData((prev) => {
        const next = { ...prev };
        results.forEach((item) => {
          if (item) {
            next[item.username] = item.data;
          }
        });
        return next;
      });
    };

    if (contributorsList.length) {
      loadContributors();
    }

    return () => {
      isMounted = false;
    };
  }, [contributorsKey]);

  const githubStatsConfig = portfolioConfig.githubStats || {};
  const [githubStats, setGithubStats] = useState<{
    stars?: number;
    forks?: number;
    followers?: number;
  }>({});
  const formatCount = (value?: number) => {
    if (value === undefined || value === null) return '—';
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  useEffect(() => {
    let isMounted = true;

    const loadGithubStats = async () => {
      try {
        const [userRes, repoRes, reposRes] = await Promise.all([
          githubStatsConfig.user
            ? fetch(`https://api.github.com/users/${githubStatsConfig.user}`)
            : Promise.resolve(null),
          githubStatsConfig.repo
            ? fetch(`https://api.github.com/repos/${githubStatsConfig.repo}`)
            : Promise.resolve(null),
          githubStatsConfig.useTotalStars && githubStatsConfig.user
            ? fetch(`https://api.github.com/users/${githubStatsConfig.user}/repos?per_page=100`)
            : Promise.resolve(null),
        ]);

        const userData = userRes && userRes.ok ? await userRes.json() : null;
        const repoData = repoRes && repoRes.ok ? await repoRes.json() : null;
        const reposData =
          reposRes && reposRes.ok ? await reposRes.json() : null;
        const totalStars = Array.isArray(reposData)
          ? reposData.reduce(
              (sum: number, repo: { stargazers_count?: number }) =>
                sum + (repo.stargazers_count || 0),
              0,
            )
          : undefined;

        if (!isMounted) return;
        setGithubStats({
          followers: userData?.followers ?? undefined,
          stars:
            githubStatsConfig.useTotalStars && totalStars !== undefined
              ? totalStars
              : repoData?.stargazers_count ?? undefined,
          forks: repoData?.forks_count ?? undefined,
        });
      } catch {
        if (!isMounted) return;
        setGithubStats({});
      }
    };

    if (githubStatsConfig.enabled !== false) {
      loadGithubStats();
    }

    return () => {
      isMounted = false;
    };
  }, [githubStatsConfig.enabled, githubStatsConfig.user, githubStatsConfig.repo]);

  const statusClassMap: Record<string, string> = {
    active: 'text-green-400',
    'in development': 'text-orange-400',
    developing: 'text-orange-400',
    paused: 'text-yellow-400',
    'on hold': 'text-yellow-400',
    archived: 'text-gray-400',
  };

  const getStatusClass = (status?: string) => {
    if (!status) return 'text-text-secondary/70';
    const key = status.toLowerCase();
    return statusClassMap[key] ?? 'text-text-secondary/70';
  };

  const statusOrderMap: Record<string, number> = {
    active: 1,
    'in development': 2,
    developing: 2,
    paused: 3,
    'on hold': 3,
    archived: 4,
  };

  const getStatusOrder = (status?: string) => {
    if (!status) return 99;
    const key = status.toLowerCase();
    return statusOrderMap[key] ?? 98;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section id="contributions" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent-blue font-mono text-lg md:text-xl">03.</span>{' '}
            <span className="bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              Contributions & Organizations
            </span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {portfolioConfig.contributionsSection?.enabled !== false ? (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-6 items-stretch">
              <motion.div
                variants={cardVariants}
                className="grid grid-cols-1 gap-8 h-full"
              >
                {portfolioConfig.contributions?.length ? (
                  portfolioConfig.contributions.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={cardVariants}
                      className="group relative rounded-xl border border-border bg-secondary/70 hover:border-accent-blue/60 h-full flex flex-col"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                              Organization
                            </p>
                            <h4 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
                              {item.organization}
                            </h4>
                          </div>
                          {item.position && (
                            <span className="px-3 py-1 bg-background text-text-secondary text-sm font-mono rounded-full border border-border">
                              {item.position}
                            </span>
                          )}
                        </div>

                        {item.summary && (
                          <p className="text-text-secondary mt-3 leading-relaxed text-[15px] md:text-base">
                            {item.summary}
                          </p>
                        )}

                        {item.projects?.length ? (
                          <div className="mt-6">
                            <p className="text-xs font-mono text-text-secondary mb-3 uppercase tracking-widest">
                              Active Projects
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {[...item.projects]
                                .sort((a, b) => {
                                  const orderDiff =
                                    getStatusOrder(a.status) - getStatusOrder(b.status);
                                  if (orderDiff !== 0) return orderDiff;
                                  return a.name.localeCompare(b.name);
                                })
                                .map((project) => (
                                  <div key={project.name}>
                                    {project.link ? (
                                      <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/item flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 transition-colors duration-300 hover:border-accent-blue/60 hover:bg-accent-blue/5"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
                                        <span className="text-text-secondary group-hover/item:text-accent-blue transition-colors duration-300 text-sm">
                                          {project.name}
                                        </span>
                                        {project.status && (
                                          <span
                                            className={`text-[10px] font-mono uppercase tracking-wide ${getStatusClass(
                                              project.status,
                                            )}`}
                                          >
                                            {project.status}
                                          </span>
                                        )}
                                      </a>
                                    ) : (
                                      <div className="group/item flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
                                        <span className="text-text-secondary text-sm">
                                          {project.name}
                                        </span>
                                        {project.status && (
                                          <span
                                            className={`text-[10px] font-mono uppercase tracking-wide ${getStatusClass(
                                              project.status,
                                            )}`}
                                          >
                                            {project.status}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ))
                ) : null}
              </motion.div>

              {githubStatsConfig.enabled !== false &&
              (githubStatsConfig.user || githubStatsConfig.repo) ? (
                <motion.div
                  variants={cardVariants}
                  className="rounded-xl border border-border bg-secondary/70 p-6 h-full flex flex-col"
                >
                  <h4 className="text-lg font-bold text-text-primary mb-4">
                    {githubStatsConfig.title || 'GitHub Stats'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 auto-rows-max">
                    <div className="rounded-lg border border-border bg-background/60 px-3 py-4 flex flex-col items-center justify-center min-w-0">
                      <Star className="text-accent-blue mb-2" size={24} />
                      <p className="text-xl md:text-2xl font-bold text-text-primary">
                        {formatCount(githubStats.stars)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/60 px-3 py-4 flex flex-col items-center justify-center min-w-0">
                      <GitFork className="text-accent-purple mb-2" size={24} />
                      <p className="text-xl md:text-2xl font-bold text-text-primary">
                        {formatCount(githubStats.forks)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/60 px-3 py-4 flex flex-col items-center justify-center min-w-0">
                      <Users className="text-accent-green mb-2" size={24} />
                      <p className="text-xl md:text-2xl font-bold text-text-primary">
                        {formatCount(githubStats.followers)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {portfolioConfig.contributionsSection?.contributorsEnabled !== false &&
              portfolioConfig.contributionsSection?.contributors?.length ? (
                <motion.div
                  variants={cardVariants}
                  className="rounded-xl border border-border bg-secondary/70 p-6 h-full flex flex-col"
                >
                  <h4 className="text-lg font-bold text-text-primary mb-4">
                    {portfolioConfig.contributionsSection?.contributorsTitle || 'Contributors'}
                  </h4>
                  <div className="space-y-3">
                    {portfolioConfig.contributionsSection.contributors.map(
                      (contributor: { github: string; role?: string }) => {
                        const username = getGithubUsername(contributor.github);
                        const data = contributorsData[username];
                        const displayName = data?.name || data?.login || username || 'Unknown';
                        const avatar = data?.avatar_url;
                        const profileUrl = data?.html_url || contributor.github;

                        return (
                          <a
                            key={contributor.github}
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2 hover:border-accent-blue hover:bg-accent-blue/5 transition-all duration-300"
                          >
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={displayName}
                                className="h-9 w-9 rounded-full border border-border object-cover"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-full border border-border bg-secondary" />
                            )}
                            <div>
                              <p className="text-text-primary text-sm font-medium">
                                {displayName}
                              </p>
                              {contributor.role && (
                                <p className="text-text-secondary text-xs">{contributor.role}</p>
                              )}
                            </div>
                          </a>
                        );
                      },
                    )}
                  </div>
                </motion.div>
              ) : null}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
};

export default Contributions;
