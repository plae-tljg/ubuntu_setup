/* Translation data for theme 13 (en)*/
const data = {"en":{"header_breadcrumb":"Categories","title_breadcrumb":"Home","breadcrumb_title":"All Categories"}};

for (let lang in data){
  let cursor = I18n.translations;
  for (let key of [lang, "js", "theme_translations"]){
    cursor = cursor[key] ??= {};
  }
  cursor[13] = data[lang];
}
