/*
Script		Language

Hebrew		Hebrew, Yiddish
Arabic		Arabic, Persian/Farsi, Urdu, Pashto, Kurdish, Sindhi, etc.
Syriac		Aramaic, Assyrian, Chaldean liturgical
Thaana		Dhivehi (Maldives)
N’Ko		N’Ko (West African language)
Mandaic		Mandaic (religious liturgy)
Adlam		Fulani (modern African)
*/
export const RTL_REGEX = /[\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}\p{Script=Mandaic}\p{Script=Adlam}]/u;