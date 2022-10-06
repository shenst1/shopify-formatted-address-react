/** @format */

import React, { HTMLAttributes, PropsWithChildren } from 'react'

interface Label {
  address1: string
  address2: string
  city: string
  company: string
  country: string
  firstName: string
  lastName: string
  phone: string
  postalCode: string
  zone: string
}
interface Country {
  name: string
  code: string
  formatting: {
    edit: string
  }
  labels: Label
  zones: { name: string; code: string }[]
}

type AllowList = {
  [index: string]: string[]
}

interface InputProps {
  options?: { label: string; value: string }[]
}
type Input = {
  component: React.FC<InputProps>
  options?: HTMLAttributes<HTMLInputElement>
}

interface FormattedAddressProps {
  countries: Country[]
  currentCountryCode: string
  fields: {
    [index: string]: Input
  }
  allowList?: AllowList
  lineWrapperOptions?: HTMLAttributes<HTMLElement>
  LineWrapper: React.FC<PropsWithChildren>
}

export default function FormattedAddress({
  countries,
  allowList,
  fields,
  currentCountryCode,
  LineWrapper,
  lineWrapperOptions = {},
}: FormattedAddressProps) {
  if (!countries?.length) return null

  const country = countries.find((country) => country.code === currentCountryCode) || countries[0]

  const renderField = (field: string): React.ReactNode => {
    const { component: Field, options } = fields[field]
    const fieldOptions = { ...options, label: country.labels[field as keyof Label] }

    switch (field) {
      case 'country':
        return (
          <Field
            key={field}
            options={countries
              .filter((country) => (allowList ? Object.keys(allowList).includes(country.code) : country))
              .map((country) => ({ label: country.name, value: country.code }))}
            // onChange={({ target: { value } }) => onCountryChange(value)}
            {...fieldOptions}
          />
          //   {countries.map((country) => (<option key={country.code} value={country.code}>{country.name}</option>))}
          // </Field>
        )

      case 'zone':
        return (
          <Field
            key={field}
            options={country.zones
              .filter((zone) => (allowList ? allowList[country.code].includes(zone.code) : zone))
              .map((zone) => ({ label: zone.name, value: zone.code }))}
            {...fieldOptions}
          />
        )

      default:
        return <Field key={field} {...fieldOptions} />
    }
  }

  return (
    <>
      {getOrderedFields(country).map((line, i) => (
        <LineWrapper key={i} {...lineWrapperOptions}>
          {line.map((field) => renderField(field))}
        </LineWrapper>
      ))}
    </>
  )
}

/**
 * Given a format (eg. "{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}")
 * will return an array of arrays in the form needs to be formatted, eg.:
 * =>
 * [
 *   ['firstName', 'lastName'],
 *   ['company'],
 *   ['address1'],
 *   ['address2'],
 *   ['city'],
 *   ['country', 'province', 'zip'],
 *   ['phone']
 * ]
 */

function getOrderedFields(country: Country): string[][] {
  const FIELD_REGEXP = /({\w+})/g
  const LINE_DELIMITER = '_'
  const formatting = country.formatting.edit.split(LINE_DELIMITER).map(function (fields) {
    const result = fields.match(FIELD_REGEXP)
    if (!result) {
      return []
    }
    return result.map(function (fieldName) {
      const newFieldName = fieldName.replace(/[{}]/g, '')
      switch (newFieldName) {
        case 'zip':
          return 'postalCode'
        case 'province':
          return 'zone'
        default:
          return newFieldName
      }
    })
  })
  /*
    HACK: some formats are defined improperly like the UK. It is missing a zone field,
    but it has zones. Place the zone field after country for countries with bad formatting.
  */
  if (country.zones.length !== 0 && !formatting.flat().includes('zone')) {
    formatting.forEach((line) => {
      if (line.includes('country')) {
        line.splice(line.indexOf('country') + 1, 0, 'zone')
      }
    })
  }
  return formatting
}
