import type { Language } from "../languages";
import en from "./en";
import ru from "./ru";
import uz from "./uz";

export const dictionaries: Record<Language, typeof en> = { en, ru, uz };
