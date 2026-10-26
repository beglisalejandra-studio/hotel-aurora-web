import { localeBlock, localeString, localeText } from "./objects/locale";
import { imageWithAlt } from "./objects/media";
import { cta, labelValue, navColumn, navLink, seo } from "./objects/misc";
import { sections } from "./sections";
import { faq, legalPage, offer, page, post, room } from "./documents/content";
import { cookieNotice, navigation, settings, theme } from "./documents/singletons";

export const schemaTypes = [
  localeString,
  localeText,
  localeBlock,
  imageWithAlt,
  seo,
  cta,
  labelValue,
  navLink,
  navColumn,
  ...sections,
  settings,
  theme,
  navigation,
  cookieNotice,
  page,
  room,
  offer,
  faq,
  post,
  legalPage,
];
