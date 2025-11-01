/* Translation data for theme 18 (en)*/
const data = {"en":{}};

for (let lang in data){
  let cursor = I18n.translations;
  for (let key of [lang, "js", "theme_translations"]){
    cursor = cursor[key] ??= {};
  }
  cursor[18] = data[lang];
}
