import React, { useEffect } from 'react';
import styled from 'styled-components';
import { portfolioPath, siteConfig } from '../../config/siteConfig';

const Page = styled.main`
  min-height: 100vh;
  padding: clamp(2rem, 6vw, 5rem) 0;
  background: var(--background-color);
  color: var(--text-color);
`;

const Content = styled.article`
  width: min(90%, 780px);
  margin: 0 auto;

  h1 {
    margin-bottom: 0.75rem;
    font-size: clamp(2.4rem, 7vw, 4.5rem);
    line-height: 1;
  }

  h2 {
    margin: 2.25rem 0 0.7rem;
    font-size: 1.35rem;
  }

  p, li {
    color: var(--dark-gray);
    line-height: 1.75;
  }

  ul {
    list-style: disc;
    padding-left: 1.4rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
`;

const BackLink = styled.a`
  display: inline-flex;
  margin-bottom: 2.5rem;
  font-weight: 800;
`;

const Warning = styled.p`
  padding: 1rem;
  border: 1px solid var(--warning-color);
  border-radius: 12px;
  background: color-mix(in srgb, var(--warning-color) 12%, transparent);
  color: var(--text-color) !important;
`;

function useLegalPageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | ${siteConfig.owner.name}`;
    window.scrollTo(0, 0);
    return () => { document.title = previous; };
  }, [title]);
}

const Address = () => (
  <address>
    {siteConfig.owner.name}<br />
    {siteConfig.owner.streetAddress}<br />
    {siteConfig.owner.postalCode} {siteConfig.owner.city}<br />
    {siteConfig.owner.country}
  </address>
);

export function ImpressumPage() {
  useLegalPageTitle('Impressum');
  return (
    <Page>
      <Content>
        <BackLink href={portfolioPath()}>← Back to portfolio</BackLink>
        <p><a href={portfolioPath('datenschutz')}>Privacy notice</a></p>
        <h1>Impressum</h1>
        <p>Information pursuant to § 5 of the German Digital Services Act (DDG).</p>
        {siteConfig.owner.streetAddress.startsWith('[') && (
          <Warning>This page still requires the site owner's serviceable postal address before public deployment.</Warning>
        )}
        <h2>Service provider</h2>
        <Address />
        <h2>Contact</h2>
        <p>Email: <a href={`mailto:${siteConfig.owner.email}`}>{siteConfig.owner.email}</a></p>
        <h2>Editorial responsibility</h2>
        <Address />
        <h2>Liability for links</h2>
        <p>
          This website links to external websites whose content is outside my control. The respective provider is
          responsible for that content. Links are reviewed when they are added and removed if a legal violation becomes known.
        </p>
        <h2>Copyright</h2>
        <p>
          Unless otherwise indicated, the original text, design, and software presented on this portfolio were created by
          Bogdan Femic. Third-party names, trademarks, screenshots, and project material remain the property of their respective owners.
        </p>
      </Content>
    </Page>
  );
}

export function PrivacyPage() {
  useLegalPageTitle('Privacy');
  return (
    <Page>
      <Content>
        <BackLink href={portfolioPath()}>← Back to portfolio</BackLink>
        <p><a href={portfolioPath('impressum')}>Impressum</a></p>
        <h1>Privacy notice</h1>
        <p>Last updated: 26 August 2026</p>
        <h2>1. Controller</h2>
        <Address />
        <p>Email: <a href={`mailto:${siteConfig.owner.email}`}>{siteConfig.owner.email}</a></p>
        <h2>2. Hosting and server logs</h2>
        {siteConfig.hosting.providerName.startsWith('[') && (
          <Warning>The final hosting provider and its privacy information must be added before deployment.</Warning>
        )}
        <p>
          This website is hosted by {siteConfig.hosting.providerName}. When the website is requested, the hosting provider
          may process technical connection data such as IP address, date and time, requested resource, referrer, browser,
          operating system, and response status. This processing is necessary to deliver and secure the website and is based
          on Article 6(1)(f) GDPR. Server logs are rotated daily and retained for up to 14 days before deletion. Further
          information is available in the provider's{' '}
          <a href={siteConfig.hosting.providerPrivacyUrl} target="_blank" rel="noopener noreferrer">privacy policy</a>.
        </p>
        <h2>3. Contact</h2>
        <p>
          The contact form prepares an email in your own email application. The website does not transmit or retain the form
          contents on a server. Your email provider processes the message when you choose to send it. Incoming messages are
          processed to answer your request under Article 6(1)(b) GDPR for project or employment enquiries, or Article 6(1)(f)
          GDPR for other correspondence, and are deleted when no longer required unless a legal retention duty applies.
        </p>
        <h2>4. Local browser storage</h2>
        <p>
          The website stores your selected colour theme and the local high score for the Neon Drift game on your device.
          These values are used only to provide the features you requested, are not used for tracking, and can be removed
          through your browser settings.
        </p>
        <h2>5. External links</h2>
        <p>
          Links to GitHub, LinkedIn, and project websites do not contact those services until you activate the link. Their own
          privacy notices apply after leaving this website.
        </p>
        <h2>6. Your rights</h2>
        <p>
          Subject to the applicable conditions, you have rights of access, rectification, erasure, restriction, data
          portability, and objection. You may also complain to a data-protection supervisory authority. In Hessen, the
          competent authority is the Hessian Commissioner for Data Protection and Freedom of Information.
        </p>
        <h2>7. No analytics or advertising</h2>
        <p>This website currently uses no analytics, advertising pixels, social-media plugins, or cross-site tracking.</p>
      </Content>
    </Page>
  );
}
