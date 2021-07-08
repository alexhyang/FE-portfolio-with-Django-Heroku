import json

word_name = input("Please enter the word: ")

try:
    word_file = open(f"{word_name}.json", "r", encoding="utf-8")
    r_json = json.load(word_file)
    word_file.close()

    def clean_lemma(r_json):
        return r_json["results"][0]["lexicalEntries"][0]["inflectionOf"][0]["text"]
    
    print(clean_lemma(r_json))
    
except FileNotFoundError:
    print(f"There is no {word_name} in the directory.")