import {
  AppProvider,
  Card,
  FormLayout,
  Frame,
  Layout,
  Navigation,
  Page,
  Select,
  TextContainer,
  TextField,
} from '@shopify/polaris'
import { Form, Formik, useField } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { FormattedAddress, loadCountries, SUPPORTED_LOCALES } from 'shopify-formatted-address-react'
// import { loadCountries, SUPPORTED_LOCALES, FormattedAddress } from '../../src'

export default function PolarisExample() {
  const [countries, setCountries] = useState()
  const [allowList, setAllowList] = useState({
    US: ['MA', 'CA', 'WA'],
    CA: ['AB', 'NB', 'ON'],
  })
  const [locale, setLocale] = useState('en')

  const fetchData = useCallback(async (locale) => {
    const data = await loadCountries(locale)
    setCountries(data)
  }, [])

  useEffect(() => {
    fetchData(locale).catch(console.error)
  }, [fetchData, locale])
  const navigation = (
    <Navigation location='/'>
      <Navigation.Section
        items={[
          {
            url: 'https://github.com/shenst1/shopify-formatted-address-react',
            label: 'Github',
          },
        ]}
      />
    </Navigation>
  )
  return (
    <AppProvider>
      <Frame navigation={navigation}>
        <Formik
          initialValues={{ country: 'US' }}
          onSubmit={(values) => {
            alert(JSON.stringify(values))
          }}
        >
          {({ setFieldValue, values, handleSubmit, initialValues }) => (
            <Page
              breadcrumbs={[{ content: 'Github', url: 'https://github.com/shenst1/shopify-formatted-address-react' }]}
              title='Shopify React Formatted Address'
              primaryAction={{
                content: 'Save',
                disabled: false,
                onAction: handleSubmit,
              }}
              secondaryActions={SUPPORTED_LOCALES.map((locale) => ({
                content: locale,
                onAction: () => setLocale(locale),
              }))}
            >
              <Layout>
                <Layout.AnnotatedSection
                  title='A Polaris address form'
                  description={
                    <TextContainer>
                      <p>
                        This address form has been standardized based on data provided by Shopify&apos;s Countries CDN.
                      </p>
                      <p>Try changing the locale or Country to see the form reflow.</p>
                    </TextContainer>
                  }
                >
                  <Card
                    actions={[
                      {
                        content: 'Limit countries',
                        onAction: () => {
                          const allowList = {
                            US: ['MA', 'CA', 'WA'],
                            CA: ['AB', 'NB', 'ON'],
                          }
                          setFieldValue('country', initialValues.country)
                          alert('Country data limited to:' + JSON.stringify(allowList, null, 2))
                          setAllowList(allowList)
                        },
                      },
                      {
                        content: 'All countries',
                        onAction: () => {
                          setAllowList(null)
                        },
                      },
                    ]}
                    sectioned
                  >
                    <Form>
                      <FormLayout>
                        <FormattedAddress
                          countries={countries}
                          allowList={allowList}
                          currentCountryCode={values.country}
                          LineWrapper={FormLayout.Group}
                          fields={{
                            firstName: {
                              component: FormikTextField,
                              options: {
                                name: 'firstName',
                                type: 'text',
                              },
                            },
                            lastName: {
                              component: FormikTextField,
                              options: {
                                name: 'lastName',

                                type: 'text',
                              },
                            },
                            company: {
                              component: FormikTextField,
                              options: {
                                name: 'company',
                                type: 'text',
                                label: 'company',
                                placeholder: 'company',
                              },
                            },
                            address1: {
                              component: FormikTextField,
                              options: {
                                name: 'address1',
                                type: 'text',
                              },
                            },
                            address2: {
                              component: FormikTextField,
                              options: {
                                name: 'address2',
                                type: 'text',
                              },
                            },
                            country: {
                              component: FormikSelectField,
                              options: {
                                name: 'country',
                                onChange: (val) => {
                                  setFieldValue('country', val)
                                  if (values.province) {
                                    setFieldValue('province', '')
                                  }
                                },
                              },
                            },
                            zone: {
                              component: FormikSelectField,
                              options: {
                                placeholder: 'Select province', // you will need to provide your own translations for placeholders
                                name: 'province',
                                type: 'select',
                              },
                            },
                            postalCode: {
                              component: FormikTextField,
                              options: {
                                name: 'zip',
                                type: 'text',
                              },
                            },
                            city: {
                              component: FormikTextField,
                              options: {
                                name: 'city',
                                type: 'text',
                              },
                            },
                            phone: {
                              component: FormikTextField,
                              options: {
                                name: 'phone',
                                type: 'tel',
                              },
                            },
                          }}
                        />
                      </FormLayout>
                    </Form>
                  </Card>
                </Layout.AnnotatedSection>
              </Layout>
            </Page>
          )}
        </Formik>
      </Frame>
    </AppProvider>
  )
}

// These don't need to be Polaris components
function FormikTextField({ ...props }) {
  const [field, { error, touched }, { setValue }] = useField(props)

  return <TextField {...props} {...field} onChange={setValue} error={touched && error} />
}

// eslint-disable-next-line react/prop-types
function FormikSelectField({ onChange, ...props }) {
  const [field, { error, touched }, { setValue }] = useField(props)

  return <Select {...props} {...field} onChange={onChange || setValue} error={touched && error} />
}
