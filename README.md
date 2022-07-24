# ZillowGame

A.) How to Request Data?

Make a GET request with the userName in the url link. UserName must be in the DB system, use featheru for testing purposes

btzAddress = http://flip2.engr.oregonstate.edu:6363
${btzAddress}/GET/spotifyproperties/{UserName}

B.) How to Receive Data?

Data returned as JSON from API. If no properties are found the following entry will be returned {Url: "No Properties Found"}

json({Url: ?})

C.) UML Sequence Diagrams

Partner: Spotify ML App API Backend Interaction

![Screen Shot 2022-07-24 at 4 37 12 PM](https://user-images.githubusercontent.com/71615880/180664941-9a7fb295-1893-4bc2-b613-27ecbd671a51.png)


Beat the Zestimate Get Random User Property

![Screen Shot 2022-07-24 at 4 37 51 PM](https://user-images.githubusercontent.com/71615880/180664969-afc28b2a-09ca-40d0-ae24-f082010babbe.png)


