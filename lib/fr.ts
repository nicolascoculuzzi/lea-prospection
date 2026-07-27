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
    not_run: "Pas encore évaluée",
    col_created: "Créée le",
    empty_title: "Aucune campagne pour l'instant.",
    empty_text: "Créez une campagne, importez vos contacts, puis lancez-la.",
    new: "Nouvelle campagne",
    f_name: "Nom de la campagne",
    f_name_ph: "Ex. : Plombiers Montréal — janvier",
    f_cap: "Appels max par jour",
    f_start: "Début",
    f_end: "Fin",
    f_create: "Créer",
    f_note:
      "La campagne démarre en brouillon : aucun appel n'est composé tant que vous ne l'activez pas. Les heures sont respectées selon le fuseau du destinataire, et les listes d'exclusion s'appliquent automatiquement.",
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


  detail: {
    back: "Retour aux campagnes",
    step1: "Étape 1",
    step2: "Étape 2",
    step3: "Étape 3",
    import_title: "Importer votre liste",
    import_sub:
      "Un fichier CSV avec une colonne entreprise et une colonne téléphone. Les numéros sont normalisés, les doublons fusionnés, et toute personne sur votre liste d'exclusion est bloquée dès l'importation.",
    csv_ph: "entreprise,telephone\nPlomberie Gagnon,514-555-0142",
    import_btn: "Importer",
    import_done: "{n} contacts importés · {dupe} doublons · {bad} numéros invalides",
    preview_title: "Vérifier avant d'appeler",
    preview_sub:
      "Chaque contact passe par le filtre de conformité sans qu'un seul appel soit composé. Vous voyez qui est joignable, qui est bloqué, et pourquoi.",
    preview_btn: "Lancer la vérification",
    p_total: "Contacts",
    p_sendable: "Joignables",
    p_blocked: "Bloqués",
    why_blocked: "Raisons de blocage",
    launch_title: "Activer la campagne",
    launch_sub:
      "Une fois active, Léa compose selon votre cadence et votre fenêtre d'appel, et transfère les prospects intéressés à un représentant.",
    activate: "Activer",
    pause: "Mettre en pause",
    is_active: "La campagne compose selon la cadence configurée.",
    is_idle: "Aucun appel n'est composé pour l'instant.",
    recent_leads: "Contacts récents",
  },

  reasons: {
    no_consent: "Consentement absent",
    dnc_suppressed: "Sur la liste d'exclusion",
    quiet_hours: "Hors des heures permises",
    attempt_cap: "Trop de tentatives",
    unknown_jurisdiction: "Territoire inconnu",
    no_jurisdiction_profile: "Aucune règle pour ce territoire",
    "awaiting_registration:crtc_ran": "Inscription CRTC requise",
    "awaiting_registration:crtc_dncl_subscription": "Abonnement à la LNNTE requis",
    "awaiting_registration:national_dnc": "Inscription au registre national requise",
    "awaiting_registration:a2p_10dlc_sms": "Enregistrement 10DLC requis",
  } as Record<string, string>,

  common: {
    loading: "Chargement",
    none: "—",
    saving: "Enregistrement",
    cancel: "Annuler",
    error: "Une erreur est survenue. Réessayez.",
  },
};
