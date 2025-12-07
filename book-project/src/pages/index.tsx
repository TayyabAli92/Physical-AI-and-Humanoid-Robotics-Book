import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero hero--primary">
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="button-group">
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Read the Book
          </Link>
        </div>
      </div>
    </header>
  );
}

function ModuleCard({ title, description, link }: { title: string, description: string, link: string }) {
  return (
    <div className="col col--3">
      <div className="card">
        <div className="card__body">
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="button-group">
            <Link className="button button--primary button--block" to={link}>
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Physical AI & Humanoid Robotics Book: A Comprehensive Guide to Building AI-Powered Humanoid Robots from Simulation to Reality">
      <Head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.tagline} />
      </Head>
      <HomepageHeader />
      <main>
        <section className="container padding-vert--xl">
          <div className="row">
            <ModuleCard
              title="Module 1 – ROS 2"
              description="The Robotic Nervous System"
              link="/docs/module-1-ros2/intro"
            />
            <ModuleCard
              title="Module 2 – Digital Twin"
              description="Gazebo & Unity Simulation"
              link="/docs/module-2-digital-twin/intro"
            />
            <ModuleCard
              title="Module 3 – NVIDIA Isaac"
              description="Platform for AI Robotics"
              link="/docs/module-3-isaac/intro"
            />
            <ModuleCard
              title="Module 4 – VLA"
              description="Vision-Language-Action"
              link="/docs/module-4-vla/intro"
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}