import requests

class CallExternalOxford:
    def __init__(self, word):
        self.word = word
        self.app_id = "5e662635"
        self.app_key = "493d105381c3700d21ea487f3f03962a"
        
    def call_api(self, endpoint):
        url = (
            f"https://od-api.oxforddictionaries.com:443/api/v2/{endpoint}/en-gb/"
            + self.word.lower()
        )
        r = requests.get(url, headers={"app_id": self.app_id, "app_key": self.app_key})
        
        if (r.status_code != 200):
            print(f"API call failed. Error {r.status_code}")
        else:
            return r.json()
        
    def call_lemma(self):
        return self.call_api("lemmas")
        
    def call_entry(self):
        return self.call_api("entries")
        