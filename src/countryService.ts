// Utilizies the shopify CDN for countries and formatting.

const query =
  'query countries($locale: SupportedLocale!) {' +
  '  countries(locale: $locale) {' +
  '    name' +
  '    code' +
  '    labels {' +
  '      address1' +
  '      address2' +
  '      city' +
  '      company' +
  '      country' +
  '      firstName' +
  '      lastName' +
  '      phone' +
  '      postalCode' +
  '      zone' +
  '    }' +
  '    formatting {' +
  '      edit' +
  '    }' +
  '    zones {' +
  '      name' +
  '      code' +
  '    }' +
  '  }' +
  '}'

const GRAPHQL_ENDPOINT = 'https://country-service.shopifycloud.com/graphql'

export async function loadCountries(locale: string) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      query: query,
      operationName: 'countries',
      variables: {
        locale: toSupportedLocale(locale),
      },
    }),
  })
  const data = await response.json()
  return data.data.countries
}

const DEFAULT_LOCALE = 'EN'
export const SUPPORTED_LOCALES = ['DA', 'DE', 'EN', 'ES', 'FR', 'IT', 'JA', 'NL', 'PT', 'PT_BR']

export function toSupportedLocale(locale: string) {
  const supportedLocale = locale.replace(/-/, '_').toUpperCase()

  if (SUPPORTED_LOCALES.indexOf(supportedLocale) !== -1) {
    return supportedLocale
  } else if (SUPPORTED_LOCALES.indexOf(supportedLocale.substring(0, 2)) !== -1) {
    return supportedLocale.substring(0, 2)
  } else {
    return DEFAULT_LOCALE
  }
}
