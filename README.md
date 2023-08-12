# Z-Guess: Beat the Zestimate!

Z-Guess tracks user house sell-price estimates for house listings on Zillow and generates a score based on "closeness" to the final sale price. Z-Guess utilizes the RapidAPI Zillow.com API, and stores data in a PostgreSQL database. Created as part of Software Development I at Oregon State University.

## Technologies
```
FrontEnd: React.js, HTML/CSS
BackEnd: Node.js
DataBase: PostgresSQL (switched from MySQL)
Cloud: Railway (Postgres)
```

## Screen shots from 08/08/22 Final Presentation

<img width="949" alt="Screen Shot 2022-10-13 at 10 43 40 PM" src="https://user-images.githubusercontent.com/71615880/195750537-fe3e5a64-3115-42fd-94f5-240a5b8ae2f0.png">

<img width="967" alt="Screen Shot 2022-10-13 at 10 44 02 PM" src="https://user-images.githubusercontent.com/71615880/195750606-684f32e2-49f1-474c-ac68-8d546d2e51ed.png">

![image](https://user-images.githubusercontent.com/71615880/195750638-caaafdd1-1d06-4286-8f54-7f7d234adfaf.png)

## MicroService Integration with Partner Spotify ML App

### How to Request Data?

Make a GET request with the userName in the url link. UserName must be in the DB system, use featheru for testing purposes

```
btzAddress = http://flip2.engr.oregonstate.edu:6363
${btzAddress}/GET/spotifyproperties/{UserName}
```

### How to Receive Data?

Data returned as JSON from API. If no properties are found the following entry will be returned {Url: "No Properties Found"}

```
json({Url: ?})
```

###  UML Sequence Diagrams

#### Partner: Spotify ML App API Backend Interaction

![Screen Shot 2022-07-24 at 4 37 12 PM](https://user-images.githubusercontent.com/71615880/180664941-9a7fb295-1893-4bc2-b613-27ecbd671a51.png)


#### Beat the Zestimate Get Random User Property

![Screen Shot 2022-07-24 at 4 37 51 PM](https://user-images.githubusercontent.com/71615880/180664969-afc28b2a-09ca-40d0-ae24-f082010babbe.png)


