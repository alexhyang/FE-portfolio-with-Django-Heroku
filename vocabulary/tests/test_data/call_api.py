from json.decoder import JSONDecodeError
import os
import requests
import json

app_id = "5e662635"
app_key = "d91614413cc0f9e97dd87b96e0581ca5"
word = input("Please enter the word: ")
url = (
    "https://od-api.oxforddictionaries.com:443/api/v2/entries/en-gb/"
    + word.lower()
)
r = requests.get(url, headers={"app_id": app_id, "app_key": app_key})
if (r.status_code == 403) | (r.status_code == 404):
    print(f"API call failed. Error {r.status_code}")
else:
    try: 
        result_json = r.json()
        word_file = open(f"{word}.json", "w")
        json.dump(result_json, word_file)
        word_file.close()
    except JSONDecodeError:
        print("Error: JSON decode error.")