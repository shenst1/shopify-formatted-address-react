# shopify-formatted-address-react
An opinionated address form formatter based on the data contained in the Shopify country service https://country-service.shopifycloud.com/graphql. 

Reflow, re-label, and populate your input fields based on the country selected or the locale. CSS and field implementation is up to you!

<img width="330" alt="image" src="https://user-images.githubusercontent.com/3740533/194427724-bfd47506-58f4-489f-baad-1fb5b54524ce.png"> <img width="330" alt="image" src="https://user-images.githubusercontent.com/3740533/194428960-1b296fd8-0ca2-47d9-ab96-9110adce6c9f.png">


### NOTE: This library is not associated with Shopify and is not associated with the maintainers of the API. 
### It is highly recommended to keep a cached version of the results you desire to guarantee availability of the data.


# Installation 

`npm install shopify-formated-address-react`. 

# Usage 

See examples folder or [see it in action](https://shenst1.github.io/shopify-formatted-address-react/) 

```
 import YourTextField from './YourTextField'
 import YourSelectField from './YourSelectField'
 import YourLineWrapper from './YourLineWrapper
 import { FormattedAddress, loadCountries } from 'shopify-formatted-address-react'

 const allowList = {
  US: ['MA', 'CA', 'WA'],
  CA: ['AB', 'NB', 'ON'],
 }
const [locale, setLocale] = useState('en')
const [countries, setCountries] = useState()

const fetchData = useCallback(async (locale) => {
  const data = await loadCountries(locale)
  setCountries(data)
}, [])

useEffect(() => {
  fetchData(locale).catch(console.error)
}, [fetchData, locale])

<FormattedAddress
  countries={countries}
  allowList={allowList}
  currentCountryCode={values.country}
  LineWrapper={YourLineWrapper}
  fields={{
    firstName: {
      component: YourTextField,
      options: {
        name: 'firstName',
        type: 'text',
      },
    },
    lastName: {
      component: YourTextField,
      options: {
        name: 'lastName',

        type: 'text',
      },
    },
    company: {
      component: YourTextField,
      options: {
        name: 'company',
        type: 'text',
        label: 'company',
        placeholder: 'company',
      },
    },
    address1: {
      component: YourTextField,
      options: {
        name: 'address1',
        type: 'text',
      },
    },
    address2: {
      component: YourTextField,
      options: {
        name: 'address2',
        type: 'text',
      },
    },
    country: {
      component: YourSelectField,
      options: {
        name: 'country',
        onChange: (val) => {
          // your application will be responsible for resetting the province if the country is changed. 
          setFieldValue('country', val)
          if (values.province) {
            setFieldValue('province', '')
          }
        },
      },
    },
    zone: {
      component: YourSelectField,
      options: {

        name: 'province',
        type: 'select',
      },
    },
    postalCode: {
      component: YourTextField,
      options: {
        name: 'zip',
        type: 'text',
      },
    },
    city: {
      component: YourTextField,
      options: {
        name: 'city',
        type: 'text',
      },
    },
    phone: {
      component: YourTextField,
      options: {
        name: 'phone',
        type: 'tel',
      },
    },
  }}
/>
```
### Note: Implementing translations for placeholders is not provided by this library. 

# Props

```
interface FormattedAddressProps {
  countries: Country[]  
  currentCountryCode: string
  fields: {
    [index: string]: Input
  }
  allowList?: AllowList
  LineWrapper: React.FC<PropsWithChildren>
  lineWrapperOptions?: HTMLAttributes<HTMLElement>
  
}
```

#### countries 
Pass in countries data provided by your application. Recommend to statically precompile countries data if possible. Import from a static JSON file if this is the easiest.

#### currentCountryCode
Your application will be responsible for maintaining form state and passing in the currently selected country.

#### fields 
A dictionary object of form fields matching with the naming convention of Shopify: 
```
interface fields {
  address1: {
    component: YourReactFieldInput,
    options: {
      ...anyPropsForYourReactFieldInput
    } 
  }
  address2: ...
  city: ...
  company: ...
  country: ...
  firstName: ...
  lastName: ...
  phone: ...
  postalCode: ...
  zone: ...
}
```

#### allowList
An object dictionary with country code as the index and an array of provinces allowed for the country
```
interface AllowList  {
  [index: string]: string[]
}
```

#### LineWrapper
A Component that takes children. Used for spacing out form rows. 

#### lineWrapperOptions
Props passed to LineWrapper

# Custom inputs
Why leave input implementation up to the developer? Form inputs and management will be unique to the application. For example, `address1` may be a
GoogleAutoComplete input. Or the phone number may be formatted by Cleave.js. This implementation allows for total flexibility on input inplementation. 






