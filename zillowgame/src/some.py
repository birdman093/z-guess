import requests

response = requests.post('http://flip3.engr.oregonstate.edu:23401/playlistgenerator', json={
    'title': "My playlist", 
    'tracks': [
        "https://open.spotify.com/track/2NtqZmfRIDkXJ2YvY2Kv1F?si=c286783f05554217",
        "https://open.spotify.com/track/4lFO4X6ef61SR6M1KXkSRN?si=55590f077b4a410e",
        "https://open.spotify.com/track/4pCNJwixy2ImFncaPY2yE2?si=7b57e427de78428c"
        ]
    })

print(response.json())