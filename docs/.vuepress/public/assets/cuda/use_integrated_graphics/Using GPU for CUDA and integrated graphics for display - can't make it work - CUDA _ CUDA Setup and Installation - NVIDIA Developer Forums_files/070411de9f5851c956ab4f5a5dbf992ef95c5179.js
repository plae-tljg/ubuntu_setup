/* Translation data for theme 19 (en)*/
const data = {"en":{"close":{"title":"Close the banner","label":"Close"},"toggle":{"title":"Expand/Collapse the banner","collapse_label":"Collapse","expand_label":"Expand"}}};

for (let lang in data){
  let cursor = I18n.translations;
  for (let key of [lang, "js", "theme_translations"]){
    cursor = cursor[key] ??= {};
  }
  cursor[19] = data[lang];
}
