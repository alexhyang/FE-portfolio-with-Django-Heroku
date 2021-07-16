import requests
import os

OXFORD_API_ID = os.environ.get("OXFORD_API_ID")
OXFORD_API_KEY = os.environ.get("OXFORD_API_KEY")


class CallExternalOxford:
    def __init__(self, word):
        self.word = word
        self.root = ""
        self.status_code = {}
        self.app_id = OXFORD_API_ID
        self.app_key = OXFORD_API_KEY

    def call_api(self, endpoint):
        # set url filter
        # url = https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/pretty?fields=definitions%2Cpronunciations&strictMatch=false
        if endpoint == "entries":
            url = (
                f"https://od-api.oxforddictionaries.com:443/api/v2/entries/en-us/"
                + self.word.lower()
            )
        elif endpoint == "lemmas":
            url = (
                f"https://od-api.oxforddictionaries.com:443/api/v2/lemmas/en/"
                + self.word.lower()
            )
        else:
            return f"Endpoint {endpoint} not found. Please try again."

        # call API
        r = requests.get(url, headers={"app_id": self.app_id, "app_key": self.app_key})
        self.status_code[endpoint] = r.status_code
        if r.status_code == 200:
            return r.json()

    def call_lemmas(self):
        """retrieve and save the root of the word"""
        result = self.call_api("lemmas")
        if isinstance(result, str):
            print(result)
        elif result == None:
            lemmas_status_code = self.status_code["lemmas"]
            print(f"Lemmas Endpoint request failed: {lemmas_status_code} error.")
        else:
            self.root = result["results"][0]["lexicalEntries"][0]["inflectionOf"][0][
                "text"
            ]

    def call_entries(self):
        """retrieve and return word entry"""
        result = self.call_api("entries")
        if isinstance(result, str):
            print(result)
        elif result == None:
            entries_status_code = self.status_code["entries"]
            print(f"Entries Endpoint request failed: {entries_status_code} Error.")
        else:
            return self.__clean_entries(result)

    def __clean_entries(self, r_json):
        word_json = {}
        try:
            results = r_json["results"][0]
        except KeyError:
            return word_json
        return self.__extract_lexical_entries(results, word_json)

    def __extract_lexical_entries(self, results, word_json):
        # initialize word_json
        word_json["word"] = results["word"]
        word_json["derivatives"] = []
        word_json["entries"] = []

        # pass results data to word_json
        lexical_entries = results["lexicalEntries"]  # a list of entries
        for lexical_entry in lexical_entries:
            # save derivatives
            try:
                derivatives = lexical_entry["derivatives"]
                for derivative in derivatives:
                    if derivative["text"] not in word_json["derivatives"]:
                        word_json["derivatives"].append(derivative["text"])
            except KeyError:
                pass

            # save entries - lexical category
            category_senses = {}
            category_senses["lexicalCategory"] = lexical_entry["lexicalCategory"][
                "text"
            ]

            # save entries - pronunciation
            category_senses["pronunciation"] = [
                {"audioFile": "", "phoneticSpelling": ""}
            ]
            try:
                pronunciations = lexical_entry["entries"][0]["pronunciations"]
                for pronunciation in pronunciations:
                    if pronunciation["phoneticNotation"] == "IPA":
                        category_senses["pronunciation"] = [
                            {
                                "audioFile": pronunciation["audioFile"],
                                "phoneticSpelling": pronunciation["phoneticSpelling"],
                            }
                        ]
                        break
            except KeyError:
                pass

            # save entries - definitions and short definitions
            senses = lexical_entry["entries"][0]["senses"]  # a list of senses
            category_senses["definitions"] = []
            category_senses["shortDefinitions"] = []
            for sense in senses:
                try:
                    category_senses["definitions"].append(sense["definitions"][0])
                    category_senses["shortDefinitions"].append(
                        sense["shortDefinitions"][0]
                    )
                except KeyError:
                    pass

            # save entries - inflections
            category_senses["inflections"] = []
            try:
                inflections = lexical_entry["entries"][0][
                    "inflections"
                ]  # a list of inflections
                for inflection in inflections:
                    if (
                        inflection["inflectedForm"]
                        not in category_senses["inflections"]
                    ):
                        category_senses["inflections"].append(
                            inflection["inflectedForm"]
                        )
            except KeyError:
                pass

            # append entry to entries
            word_json["entries"].append(category_senses)
        return word_json
