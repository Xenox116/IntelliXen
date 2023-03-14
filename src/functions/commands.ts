import { Language } from "../interfaces";
import { ExtendedClient } from "../structs";

export async function trans(
  client: ExtendedClient,
  lang: string,
  str: string
): Promise<string> {
  const languages: Language[] = await client.languageService.getLanguage();
  if (!lang.includes("-")) {
    if (languages.filter((l) => l.code === lang).length > 0) {
      const trans = await client.languageService.transDetect(
        "auto",
        lang,
        str
      );
      return trans.translatedText;
    }
  } else {
    const codes: string[] = lang.split("-");
    if (
      languages.filter((l) => l.code === codes[0]).length > 0 &&
      languages.filter((l) => l.code === codes[1]).length > 0
    ) {
      const trans = await client.languageService.transDetect(
        codes[0],
        codes[1],
        str
      );
      return trans.translatedText;
    }
  }
  return "Codigo de idioma incorrecto";
}
