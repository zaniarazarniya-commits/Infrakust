/**
 * site.ts — central plats för kontakt- och företagsuppgifter.
 *
 * Uppdatera värdena här så slår de igenom överallt (kontaktsektion, formulär,
 * footer, schema). Fält markerade TODO behöver dina riktiga uppgifter.
 */
export const site = {
  name: 'Infrakust',
  url: 'https://www.infrakust.se',
  email: 'hello@infrakust.se',

  // TODO: fyll i ditt riktiga telefonnummer (E.164-format för schema, t.ex. +46701234567).
  // Lämna tomt ('') om du inte vill visa telefon — då döljs det automatiskt.
  phone: '',

  // TODO: klistra in din bokningslänk (Cal.com / Calendly). Lämna tomt ('')
  // för att dölja "Boka möte"-knappen tills du har en.
  bookingUrl: '',

  address: {
    locality: 'Lysekil',
    region: 'Västra Götaland',
    country: 'SE',
  },

  // TODO: ungefärliga koordinater för Lysekil — justera till din faktiska adress
  // om du vill ranka mer exakt lokalt.
  geo: {
    latitude: 58.2747,
    longitude: 11.4357,
  },
} as const;
