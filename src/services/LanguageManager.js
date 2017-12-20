class Dictionary {
  constructor(id, language, words) {
    this.id = id;
    this.language = language;
    this.words = words || {};
  }

  getWord(word) {
    return this.words[word];
  }
}

class LanguageManager {
  constructor(dictionaries) {
    this.dictionaries = dictionaries || [];

    this.dictionaries = this.dictionaries.map(d => {
      return new Dictionary(d.id, d.language, d.words);
    });

    this.currentDictionary = this.dictionaries[0] || null;
  }

  setLanguage(languageId) {
    for (let i = 0; i < this.dictionaries.length; i++) {
      if (this.dictionaries[i].id.toLowerCase() === languageId.toLowerCase()) {
        this.currentDictionary = this.dictionaries[i];
        return;
      }
    }
  }
}

export default LanguageManager;