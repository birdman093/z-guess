# Z-Guess: Beat the Zestimate!
<div align="center"  style="margin: 20px;">
<img width="100" src="./zillowgame/img/z-guess-dark.png">
</div>

Z-Guess enables users to track sell-price estimates for house listings on Zillow and generates a score based on "closeness" to the final sale price. Z-Guess leverages the RapidAPI Zillow.com API to acess real-time data and updates, and stores data in a PostgreSQL database. Developed as part of Software Development I at Oregon State University.

## Technologies
```
FrontEnd: React.js, HTML/CSS
BackEnd: Node.js
DataBase: PostgresSQL (switched from MySQL in 2023)
Cloud: Railway (Postgres), Vercel (Static, Node Server)
```

## Methodology (Demo vs. Production)

Current Design: Demo Logic

<div align="left"  style="margin: 20px;">
<img width="500" src="./zillowgame/img/demo-logic.png">
</div>

In Development: Production Logic

<div align="left"  style="margin: 20px;">
<img width="500" src="./zillowgame/img/production-logic.png">
</div>

## Remaining Items as of 08/2023 
- Shift from Demo to Production Logic (On-going)
- Deployment w/ Limits, Special Accounts
- User Authentication
- Group Competition Logic
- Removal of Spotify Project

## Revamped 08/2023 Screenshots

<div align="left"  style="margin: 20px;">
<img width="500" src="./zillowgame/img/instructions2023.png">
</div>

<div align="left"  style="margin: 20px;">
<img width="500" src="./zillowgame/img/login2023.png">
</div>

<div align="left"  style="margin: 20px;">
<img width="500" src="./zillowgame/img/property2023-dark.png">
</div>

<div align="left"  style="margin: 20px;">
<img width="500" src="./zillowgame/img/property2023-white.png">
</div>


## Screen shots from 08/2022 Final Presentation
<div align="left">
<img width="500" style="margin: 20px;" src="https://user-images.githubusercontent.com/71615880/195750606-684f32e2-49f1-474c-ac68-8d546d2e51ed.png">
</div>
<div align="left">
<img  style="margin: 20px;" width="400" src="https://user-images.githubusercontent.com/71615880/195750638-caaafdd1-1d06-4286-8f54-7f7d234adfaf.png">
</div>

## MicroService Integration with Partner Spotify ML App (2022 Version)

### How to Request Data?

Make a GET request with the userName in the url link. UserName must be in the DB system, use featheru for testing purposes

```
serverAddress = http://flip2.engr.oregonstate.edu:6363
GET ${serverAddress}spotifyproperties/{UserName}
```
<div align="left">
    <img width="400"  style="margin: 20px;" src="https://user-images.githubusercontent.com/71615880/180664969-afc28b2a-09ca-40d0-ae24-f082010babbe.png">
</div>

### How to Receive Data?

Data returned as JSON from API. If no properties are found the following entry will be returned {Url: "No Properties Found"}

```
json({Url: ?})
```

<div align="left">
    <img width="400" style="margin: 20px;" src="https://user-images.githubusercontent.com/71615880/180664941-9a7fb295-1893-4bc2-b613-27ecbd671a51.png">
</div>


