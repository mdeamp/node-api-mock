# node-api-mock
 
![main](https://mdeamf.github.io/img/main-header.png)

# Thoughts & Ramblings

Whenever I'm developing a front-end environment - whether it's a simple Web project, or even an Angular application - the time where a mockable Web Service is needed is inevitable. To accomodate that, I decided to develop a simple NodeJS API. However, to make it even simpler and more reusable, I structured it in a such a way that no database is needed.

## The Project
* **NAME**: NodeJS Mock API

* **DOCS**: [Postman Docs](https://documenter.getpostman.com/view/10557665/SzKZrvqz)

* **LANGUAGE(S)**: JavaScript

* **FRAMEWORKS**: None

* **PLATFORM**: NodeJS v10+

* **LIBRARIES**: ExpressJS

* **IMPORTANT**: *This is just a simple server not meant for production architecture.*

## The Purpose
* Create a very simple and reusable API.
* Avoid the need of Databases for such simple use cases.
* Lightweight, customizable implementation.
* Runtime side-effects.
* Well-commented code to help newcomers.

## The Content
* **/public**: Contains the main JSON of the customer collection.
* **/utils**: Contains a simple factory and validator for the Customer object.
* **app.js**: Main file, containing every route.
