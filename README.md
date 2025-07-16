# Project Hermes

[SmiteStats.gg](https://www.smitestats.gg/#/)
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Usage](#usage)

## General info
A project using the smite api to pull and store data to create a smite version of u.gg. This is an attempt to learn and master skills previously learned in other projects.
	
## Technologies
Project is created with:
- Python 3.9
- Flask
- React JS
- MUI 5
	
## Features
- Can fully sort Smite data by rank, role, patch, and specifc matchup against another character
- Fully functioning Discord bot along with the website
- Fast load times thanks to MongoDB Aggregation pipelines and Search Indexes
- Gain Access to over 500,000 matches of Smite Data


## To Contribute
- git clone the repo
Running backend
- in the folder you cloned into run py -m flask run
- install required dependancies (dnspython, pymongo, flask)
Running frontend
- start a terminal in the hermesfrontend folder
- npm install dependancies 
- npm run start


Back-End
    • Using the Hirez API requested game data for a popular online game and stored in a MongoDB Atlas cluster.
    • Fetched, Cleaned, and Structured Data to fit project needs better and improve readability/scalability.
    • Using React on the frontend to display data for all 116 characters in each of the 5 unique playable roles and 7 different ranks, data includes basic win rates and popularity to more advanced breakdowns of items and each character’s worst matchup against other characters in the game.
    • Data served to React with a Flask backend and REST API.
    • Fully production web application hosted on a VPS.
    • Developed backend functions to handle, clean, and manage the Database to ensure data quality.
    • Reduced JSON sizes to improve backend request speeds.
    • Fully automated data gathering and formatting from the Hirez API.
    • Implemented MongoDB aggregation pipelines to increase data processing speed.
    • Currently handling around 500,000 games of data.
Front-End
    • Using React JS and functional components to filter data to switch between displaying different types of data
    • Using React Router DOM and Hash Router created 120+ Routes to fully support the expansive data on the backend
    • Home and Main god pages fully responsive with MUI 5 Components, with the other pages getting integrated soon.
    • Using React Table made paginated and sortable tables to display large data sets
    • Added a search bar to go right to a specific character’s page
      

