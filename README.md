# React Finance

# Table of contents

1. [Project description](#description)
2. [References](#references)
3. [General Features](#features)
4. [Technical Implementation](#implementation)
5. [Technologies](#tech)
6. [System Features](#sys-features)
7. [Software Interfaces](#soft-interfaces)
8. [Installation instructions](#installation)
9. [Project structure](#structure)
10. [Screenshots](#screenshots)

## 1. Project description<a name="description"></a>

Financial is a tool to verify the current exchange rate and finance related information. This application to check the current finance rate depending on multiple currencies, convert in multiple ways, check finance related news and observe graph representation of exchange rate values.

The product is a full stack web application implemented on both front and back end, it is using API calls to operate the database.

### [> View Technical Specifications Finance](screenshots/Specifications_Project_Financial.pdf)

### Project Scope

Financial is a programming project, that allows its developers to practice client-side programming using API calls, authentication and user management.

## 2. References<a name="references"></a>

-   React - https://reactjs.org/
-   React Router - https://reactrouter.com/web/guides/quick-start
-   React Bootstrap - https://react-bootstrap.github.io/
-   React Spinners - http://www.davidhu.io/react-spinners/
-   React Toastify - https://www.npmjs.com/package/react-toastify/v/1.4.3
-   Formik - https://www.npmjs.com/package/formik
-   Yup - https://www.npmjs.com/package/yup
-   React Dark Mode Toggle - https://www.npmjs.com/package/react-dark-mode-toggle
-   React Token Auth - https://www.npmjs.com/package/react-token-auth
-   Flask - https://flask.palletsprojects.com/en/1.1.x/
-   Flask Mail - https://flask-mail.readthedocs.io/en/latest/
-   ItsDangerous - https://pypi.org/project/itsdangerous/
-   Flask SQLalchemy - https://flask-sqlalchemy.palletsprojects.com/en/2.x/
-   Flask JWT Extended - https://flask-jwt-extended.readthedocs.io/en/stable/
-   Flask Bcrypt - https://flask-bcrypt.readthedocs.io/en/latest/
-   Cloudinary - https://cloudinary.com/documentation/image_upload_api_reference

## 3. General Features<a name="features"></a>

The Financial system provides a simple mechanism for users to acquire information.

The following are the main features that are included in the system:

-   Convert Currencies: allow the user to convert from any source to any destination currency

-   Get Latest Rates: search for the latest currency rate from the European Central Bank

-   Exchange Rate Graph: draw an exchange graph for the selected currency available for different period of time.

-   Historical Exchange Rate Graph: draw historical exchange rate graph for the selected currency in the last year

-   Historical Exchange Rate: fetch and selected currency’s rate on all the available destination currencies, along with the historical rate of the last month.

-   Finance NewsFeed: fetch and provide the latest finance news feed related to finance trending topics.

-   User management: allow the user to connect and save preferences such as theme color and settings like default currency. That information and preferences about users are saved for future sessions.

## 4. Technical Implementation<a name="implementation"></a>

![Communication Screenshot](https://github.com/antoineratat/react_dashboard_finance/blob/main/screenshots/1.png?raw=true)

Application Communication Schema

## 5. Technologies<a name="tech"></a>

This system is provisioned to be built in JavaScript using React library which is highly flexible.

The browser will be in charge of rendering this application in its final form, HTML. Some of the logic involved in creating the web page, especially the one in charge of dealing with presentation logic is handled on the client-side.

List of frontend dependencies and version used:

-   react-fontawesome: V0.1.11,
-   bootstrap: V4.5.3,
-   chart.js: V2.9.3,
-   formik: V2.2.5,
-   jwt-decode: V3.1.2,
-   react: 16.12.0,
-   react-bootstrap: V1.4.0,
-   react-chartjs-2: 2.9.0,
-   react-dark-mode-toggle: 0.0.10,
-   react-datetime: 2.16.3,
-   react-dom: 16.12.0,
-   react-dropdown-select: V4.6.0,
-   react-helmet: V6.1.0,
-   react-js-pagination: V3.0.3,
-   react-router-dom: 5.1.2,
-   react-scripts: V3.4.4,
-   react-spinners: V0.9.0,
-   react-toastify: V6.1.0,
-   react-token-auth: V1.1.7,
-   reactstrap: V8.4.1,
-   styled-components: V5.2.1,
-   yup: V0.29.3

## 6. System Features<a name="sys-features"></a>

### Not Connected Features

-   Create an account
-   Login
-   Forgot Password
-   Reset Password

### Connected Features

Dashboard

-   Consult Financial Dashboard
-   Switch to Dark / Light mode in the sidebar
-   Navigate to other website pages in the sidebar
-   Access to Profile
-   Disconnect

Profile

-   Update Profile Information
-   Upload Profile Picture
-   Choose Default Currency (settings)
-   Choose Theme (settings)
-   Delete Profile Information
-   Delete Account
-   Consult User current information

Convert

-   Convert source currency to destination currency
-   Calculate input value to output value depending on the currency
-   Change input and output currency
-   Inverse source currency with destination currency
-   Check the daily exchange rate for selected currencies

Exchange Rate Graph

-   Check the exchange rate graph for selected currencies from 1 week, 1 month, 3 months, 6 months to a year time period.

Historical Exchange Rate Graph

-   Check the history rate graph for selected currencies for a year time period

Historical Rate

-   Check the history rate currency for selected currencies from 1 week, 1 month, 3 months, 6 months to a year time period.
-   Check the historical exchange rate from input currency to all existing currencies
-   Sort the historical exchange rate per currency, rate or, history value
-   Filter the historical exchange rate per currency label or the currency name
-   Paginate the results of the historical exchange rate currency to display only 10 results at once • Graphic representation in the historical exchange rate of the negative and positive using variable indicative color arrows.

Finance Feed

-   Check latest news feed related to Finance
-   Sort the news per Brand, Date or, Score
-   Filter the news per Article Name, Article Description or Brand
-   Click the Article Name to read the new article (external link)
-   Paginate the results of the finance feed to display only 12 results at once

## 7. Software Interfaces<a name="soft-interfaces"></a>

Software is designed in small fragmented atomic components. Each component has specific functionality and assembled together creates our application.

This is easier to maintain, replace, and re-use. The component organization of the Financial app is available in the scheme below:

![Interfaces Screenshot](https://github.com/antoineratat/react_dashboard_finance/blob/main/screenshots/12.png?raw=true)

Communication is assured to external interfaces. The system is connected to several APIs using REST (representational state transfer), The payload is defined in the request itself and is formatted in JSON. Most of the operations are directed to a custom-made API.

This API is a CRUD API created with Python and Flask technology in order to handle the Front-End requests and communicate safely with a PostgreSQL database.

## 8. Installation instructions<a name="installation"></a>

Versions:

-   Node: 14.15.1
-   Npm: 6.14.8
-   React: 17.0.1

Download code from Github:

```shell
git clone https://github.com/antoineratat/react_dashboard_finance.git
```

Navigate to project directory.

```shell
cd react_dashboard_finance
```

Install node modules.

```shell
npm install
```

Create .env

```shell
REACT_APP_AUTOCOMPLETE_API_KEY=yourKey
REACT_APP_MAP_API_KEY=yourKey
REACT_APP_FOURSQUARE_API_CLIENT_ID=yourKey
REACT_APP_FOURSQUARE_API_CLIENT_SECRET=yourKey
REACT_APP_OPENWEATHER_API_KEY=yourKey
```

Run the app in development mode. Open http://localhost:3000 to view it in the browser.

```shell
npm start
```

## 9. Project structure<a name="structure"></a>

![Components Screenshot](https://github.com/antoineratat/react_dashboard_finance/blob/main/screenshots/2.png?raw=true)

## 10. Screenshots<a name="screenshots"></a>

Login Page – Desktop and Mobile Version ![Components Screenshot](https://github.com/antoineratat/react_advisor/blob/master/screenshots/main_search.PNG?raw=true)

Dashboard - Purple Theme - Light Mode – Desktop and Mobile Version ![Components Screenshot](https://github.com/antoineratat/react_advisor/blob/master/screenshots/main_search.PNG?raw=true)

Dashboard - Purple Theme - Dark Mode – Desktop and Mobile Version ![Components Screenshot](https://github.com/antoineratat/react_advisor/blob/master/screenshots/main_search.PNG?raw=true)
