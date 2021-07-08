import json

word_name = input("Please enter the word: ")

try:
    word_file = open(f"{word_name}.json", "r", encoding="utf-8")
    r_json = json.load(word_file)
    word_file.close()

    def clean_entry(r_json):
        # extract information from r_json and save dict instance
        word_json = {}
        try:
            results = r_json["results"][0]
        except KeyError:
            return word_json
        word_json["word"] = results["word"]
        first_lexical_entry = results["lexicalEntries"][0]
        extract_lexical_entries(first_lexical_entry, word_json)  # add other entries later
        return word_json


    def extract_lexical_entries(lexical_entry, word_json):
        word_json["lexical_category"] = lexical_entry["lexicalCategory"]["id"]
        entry = lexical_entry["entries"][0]

        # pronunciations
        try:
            pronunciations = entry["pronunciations"][0]
            word_json["audio_link"] = pronunciations["audioFile"]
            word_json["ipa"] = pronunciations["phoneticSpelling"]
        except KeyError:
            pronunciations = ""
            word_json["audio_link"] = ""
            word_json["ipa"] = ""

        # inflection and senses
        senses = entry["senses"][0]
        try:
            inflections = [
                inflection["inflectedForm"] for inflection in entry["inflections"]
            ]
            word_json["inflections"] = ", ".join(inflections)
        except KeyError:
            word_json["inflections"] = ""
        try:
            word_json["senses"] = senses["shortDefinitions"][0]
        except KeyError:
            try:
                word_json["senses"] = senses["definitions"][0]
            except KeyError:
                word_json["senses"] = ""
        try:
            word_json["derivatives"] = lexical_entry["derivatives"][0]["text"]
        except KeyError:
            word_json["derivatives"] = ""

    print(clean_entry(r_json))
    
except FileNotFoundError:
    print(f"There is no {word_name} in the directory.")
