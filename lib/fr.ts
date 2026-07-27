/** Single FR dictionary — EN added later via the same pattern as the other apps. */
export const t = {
  brand: "Léa",
  product: "Prospection",

  nav: {
    groupSuivi: "Suivi",
    groupConfig: "Configuration",
    home: "Accueil",
    campagnes: "Campagnes",
    contacts: "Contacts",
    transferts: "Transferts",
    reglages: "Réglages",
    signout: "Déconnexion",
  },

  login: {
    title: "Connexion",
    sub: "Portail de prospection",
    email: "Courriel",
    password: "Mot de passe",
    submit: "Se connecter",
    submitting: "Connexion",
    error: "Courriel ou mot de passe incorrect.",
  },

  home: {
    eyebrow: "Vue d'ensemble",
    title: "Tableau de bord",
    live: "Appels actifs",
    tiles: {
      dials: "Appels composés (30 j)",
      reached: "Personnes jointes",
      transfers: "Transferts réussis",
      rate: "Taux de transfert",
    },
    empty_title: "Aucune campagne active.",
    empty_text:
      "Créez une campagne et importez vos contacts. Léa compose, qualifie, et transfère vos prospects intéressés à un représentant.",
  },

  campagnes: {
    title: "Campagnes",
    sub: "Chaque campagne compose une liste selon une cadence et une fenêtre d'appel.",
    col_name: "Campagne",
    col_status: "Statut",
    col_sendable: "Joignables",
    col_blocked: "Bloqués",
    col_created: "Créée le",
    empty_title: "Aucune campagne pour l'instant.",
    empty_text: "Votre première campagne apparaîtra ici.",
    new: "Nouvelle campagne",
  },

  contacts: {
    title: "Contacts",
    sub: "Les entreprises à joindre. Les numéros retirés (opt-out) sont bloqués automatiquement.",
    col_business: "Entreprise",
    col_phone: "Téléphone",
    col_status: "Statut",
    col_attempts: "Tentatives",
    col_last: "Dernière tentative",
    empty_title: "Aucun contact importé.",
    empty_text: "Importez une liste pour démarrer une campagne.",
  },

  transferts: {
    title: "Transferts",
    sub: "Chaque appel qualifié transféré à un représentant, avec son résultat.",
    col_when: "Date",
    col_number: "Numéro",
    col_dest: "Destination",
    col_outcome: "Résultat",
    empty_title: "Aucun transfert pour l'instant.",
    empty_text: "Dès qu'un prospect qualifié sera transféré, il apparaîtra ici.",
    outcomes: {
      connected: "Connecté",
      "no-answer": "Sans réponse",
      busy: "Occupé",
      failed: "Échec",
      canceled: "Annulé",
      attempted: "En cours",
      unknown: "Inconnu",
    } as Record<string, string>,
  },

  reglages: {
    title: "Réglages",
    sub: "Où vont les transferts et quand Léa a le droit d'appeler.",
    dest_title: "Destinations de transfert",
    dest_empty: "Aucune destination configurée.",
    dest_note:
      "Léa tente ces numéros lorsqu'un prospect veut parler à quelqu'un. La stratégie « simultané » sonne tous les numéros en même temps avec confirmation par touche 1, ce qui empêche une boîte vocale de capter l'appel.",
    strategy: "Stratégie de sonnerie",
    window_title: "Fenêtre d'appel",
    window_note:
      "Les heures permises sont calculées selon le fuseau horaire du destinataire, pas le vôtre. Les listes d'exclusion sont respectées automatiquement.",
    business: "Entreprise",
    note: "Pour modifier ces réglages, écrivez-nous.",
  },

  common: {
    loading: "Chargement",
    none: "—",
  },
};
