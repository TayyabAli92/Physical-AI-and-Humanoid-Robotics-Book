
const config = {
  title: 'Physical AI & Humanoid Robotics Book',
  tagline: 'A Comprehensive Guide to Building AI-Powered Humanoid Robots from Simulation to Reality',
  url: 'https://your-github-username.github.io',
  baseUrl: '/physical-ai-robotics-book/',
  organizationName: 'your-github-username',
  projectName: 'physical-ai-robotics-book',
  trailingSlash: true,
  onBrokenLinks: 'warn',
  markdown: {
    mermaid: true,
  },
  favicon: 'img/favicon.ico',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/TayyabAli92/Physical-AI-and-Humanoid-Robotics-Book/edit/main/book-project/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/TayyabAli92/Physical-AI-and-Humanoid-Robotics-Book/edit/main/book-project/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Physical AI & Humanoid Robotics Book',
      logo: {
        alt: 'My Project Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/',
          label: 'Home',
          position: 'left',
        },
        {
          to: '/docs/intro',
          label: 'Modules',
          position: 'left',
        },
        {
          href: 'https://github.com/TayyabAli92/Physical-AI-and-Humanoid-Robotics-Book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Modules',
          items: [
            {
              label: 'Module 1 – ROS 2: The Robotic Nervous System',
              to: 'docs/module-1-ros2/intro',
            },
            {
              label: 'Module 2 – Digital Twin (Gazebo & Unity)',
              to: 'docs/module-2-digital-twin/intro',
            },
            {
              label: 'Module 3 – NVIDIA Isaac Platform',
              to: 'docs/module-3-isaac/intro',
            },
            {
              label: 'Module 4 – Vision-Language-Action',
              to: 'docs/module-4-vla/intro',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/TayyabAli92/Physical-AI-and-Humanoid-Robotics-Book',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Tutorial',
              to: 'docs/intro',
            },
            {
              label: 'Community',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Book. All rights reserved.`,
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
    },
  },
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
};

module.exports = config;
