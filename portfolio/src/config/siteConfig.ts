export const siteConfig = {
  owner: {
    name: 'Bogdan Femic',
    email: 'bogdanfemic07@gmail.com',
    location: 'Frankfurt am Main, Germany',
    streetAddress: 'Pfungststraße 11',
    postalCode: '60314',
    city: 'Frankfurt am Main',
    country: 'Germany',
  },
  hosting: {
    providerName: 'Contabo GmbH, Aschauer Strasse 32a, 81549 Munich, Germany',
    providerPrivacyUrl: 'https://contabo.com/en/legal/privacy/',
  },
  links: {
    github: 'https://github.com/bogdanfemic',
    linkedin: 'https://www.linkedin.com/in/bogdan-femic/',
  },
} as const;

export const portfolioBasePath = '/portfolio';

export function portfolioPath(path = '') {
  const suffix = path.replace(/^\/+|\/+$/g, '');
  return suffix ? `${portfolioBasePath}/${suffix}` : `${portfolioBasePath}/`;
}

export const hasCompleteLegalDetails =
  !siteConfig.owner.streetAddress.startsWith('[') &&
  !siteConfig.owner.postalCode.startsWith('[') &&
  !siteConfig.hosting.providerName.startsWith('[');
