/*
 * Sky Card for Home Assistant
 * https://github.com/juju35/ha-sky-card
 *
 * Animated Lovelace cards for the sun, the moon, the lunar phase and the season, on top of the Sun integration
 * (https://www.home-assistant.io/integrations/sun/), the Moon integration (https://www.home-assistant.io/integrations/moon/),
 * the Season integration (https://www.home-assistant.io/integrations/season/) and, when it is installed, the Lunar Phase
 * custom integration (https://github.com/ngocjohn/lunar-phase). Whatever is missing is computed by the card from Home
 * Assistant's location with the usual astronomical approximations (NOAA solar equations, Meeus' lunar and seasonal series).
 */

const VERSION = "__VERSION__";

const STRINGS = {
  en: {
    title: "Sky",
    title_option: "Title (optional)",
    phase_day: "Day",
    phase_golden: "Golden hour",
    phase_blue: "Blue hour",
    phase_night: "Night",
    dawn: "Dawn",
    sunrise: "Sunrise",
    solar_noon: "Solar noon",
    sunset: "Sunset",
    dusk: "Dusk",
    elevation: "Elevation",
    azimuth: "Azimuth",
    vs_yesterday: "{delta} vs yesterday",
    same_as_yesterday: "Same as yesterday",
    section_season: "Season",
    moon_new_moon: "New moon",
    moon_waxing_crescent: "Waxing crescent",
    moon_first_quarter: "First quarter",
    moon_waxing_gibbous: "Waxing gibbous",
    moon_full_moon: "Full moon",
    moon_waning_gibbous: "Waning gibbous",
    moon_last_quarter: "Last quarter",
    moon_waning_crescent: "Waning crescent",
    moon_lit: "{pct} lit",
    moonrise: "Moonrise",
    moonset: "Moonset",
    next_full: "Full moon",
    next_new: "New moon",
    computed: "Partly computed by the card",
    season_spring: "Spring",
    season_summer: "Summer",
    season_autumn: "Autumn",
    season_winter: "Winter",
    event_spring: "Spring equinox",
    event_summer: "Summer solstice",
    event_autumn: "Autumn equinox",
    event_winter: "Winter solstice",
    season_astronomical: "Astronomical (solstices and equinoxes)",
    season_meteorological: "Meteorological (1st of March, June, September, December)",
    no_location: "No sun.sun entity and no home location: set up the Sun integration.",
    show_title: "Show title",
    show_subtitle: "Show subtitle",
    show_sky: "Show the sky",
    animations: "Animations",
    season_type: "Season type",
    language: "Language",
    lang_auto: "Automatic",
    next_golden: "Golden hour at {time}",
    next_sunset: "Sunset at {time}",
    next_sunrise: "Sunrise at {time}",
    daylight_tile: "Daylight",
    dawn_dusk: "Dawn · dusk",
    details: "Details",
    details_option: "Details section",
    details_collapsed: "Folded",
    details_expanded: "Unfolded",
    details_hidden: "Hidden",
    show_tiles: "Show the tiles",
    polar_day_short: "Midnight sun",
    polar_night_short: "Polar night",
    moon_age_label: "Moon age",
    zoom: "Detail button",
    zoom_helper: "Button at the top right that switches the mini card to the full card and back",
    zoom_in: "Show the full card",
    zoom_out: "Show the compact card",
    illustration: "Illustrated header",
    illustration_theme: "Illustration theme",
    theme_auto: "Automatic (sun, then dark theme)",
    theme_day: "Day",
    theme_night: "Night",
  },
  fr: {
    title: "Ciel",
    title_option: "Titre (facultatif)",
    phase_day: "Jour",
    phase_golden: "Heure dorée",
    phase_blue: "Heure bleue",
    phase_night: "Nuit",
    dawn: "Aube",
    sunrise: "Lever",
    solar_noon: "Midi solaire",
    sunset: "Coucher",
    dusk: "Crépuscule civil",
    elevation: "Élévation",
    azimuth: "Azimut",
    vs_yesterday: "{delta} par rapport à hier",
    same_as_yesterday: "Comme hier",
    section_season: "Saison",
    moon_new_moon: "Nouvelle lune",
    moon_waxing_crescent: "Premier croissant",
    moon_first_quarter: "Premier quartier",
    moon_waxing_gibbous: "Gibbeuse croissante",
    moon_full_moon: "Pleine lune",
    moon_waning_gibbous: "Gibbeuse décroissante",
    moon_last_quarter: "Dernier quartier",
    moon_waning_crescent: "Dernier croissant",
    moon_lit: "{pct} éclairée",
    moonrise: "Lever de lune",
    moonset: "Coucher de lune",
    next_full: "Pleine lune",
    next_new: "Nouvelle lune",
    computed: "En partie calculé par la carte",
    season_spring: "Printemps",
    season_summer: "Été",
    season_autumn: "Automne",
    season_winter: "Hiver",
    event_spring: "Équinoxe de printemps",
    event_summer: "Solstice d'été",
    event_autumn: "Équinoxe d'automne",
    event_winter: "Solstice d'hiver",
    season_astronomical: "Astronomique (solstices et équinoxes)",
    season_meteorological: "Météorologique (1er mars, juin, septembre, décembre)",
    no_location: "Ni entité sun.sun ni position du domicile : configurez l'intégration Soleil.",
    show_title: "Afficher le titre",
    show_subtitle: "Afficher le sous-titre",
    show_sky: "Afficher le ciel",
    animations: "Animations",
    season_type: "Type de saison",
    language: "Langue",
    lang_auto: "Automatique",
    next_golden: "Heure dorée à {time}",
    next_sunset: "Coucher du soleil à {time}",
    next_sunrise: "Lever du soleil à {time}",
    daylight_tile: "Durée du jour",
    dawn_dusk: "Aube · crépuscule",
    details: "Détails",
    details_option: "Section détails",
    details_collapsed: "Repliée",
    details_expanded: "Dépliée",
    details_hidden: "Masquée",
    show_tiles: "Afficher les tuiles",
    polar_day_short: "Soleil de minuit",
    polar_night_short: "Nuit polaire",
    moon_age_label: "Âge de la lune",
    zoom: "Bouton détail",
    zoom_helper: "Bouton en haut à droite qui bascule la mini-carte vers la carte complète et inversement",
    zoom_in: "Afficher la carte complète",
    zoom_out: "Afficher la carte compacte",
    illustration: "En-tête illustré",
    illustration_theme: "Thème de l'illustration",
    theme_auto: "Automatique (soleil, puis thème sombre)",
    theme_day: "Jour",
    theme_night: "Nuit",
  },
  de: {
    title: "Himmel",
    title_option: "Titel (optional)",
    phase_day: "Tag",
    phase_golden: "Goldene Stunde",
    phase_blue: "Blaue Stunde",
    phase_night: "Nacht",
    dawn: "Morgendämmerung",
    sunrise: "Sonnenaufgang",
    solar_noon: "Sonnenhöchststand",
    sunset: "Sonnenuntergang",
    dusk: "Abenddämmerung",
    elevation: "Höhe",
    azimuth: "Azimut",
    vs_yesterday: "{delta} gegenüber gestern",
    same_as_yesterday: "Wie gestern",
    section_season: "Jahreszeit",
    moon_new_moon: "Neumond",
    moon_waxing_crescent: "Zunehmende Sichel",
    moon_first_quarter: "Erstes Viertel",
    moon_waxing_gibbous: "Zunehmender Mond",
    moon_full_moon: "Vollmond",
    moon_waning_gibbous: "Abnehmender Mond",
    moon_last_quarter: "Letztes Viertel",
    moon_waning_crescent: "Abnehmende Sichel",
    moon_lit: "{pct} beleuchtet",
    moonrise: "Mondaufgang",
    moonset: "Monduntergang",
    next_full: "Vollmond",
    next_new: "Neumond",
    computed: "Teilweise von der Karte berechnet",
    season_spring: "Frühling",
    season_summer: "Sommer",
    season_autumn: "Herbst",
    season_winter: "Winter",
    event_spring: "Frühlings-Tagundnachtgleiche",
    event_summer: "Sommersonnenwende",
    event_autumn: "Herbst-Tagundnachtgleiche",
    event_winter: "Wintersonnenwende",
    season_astronomical: "Astronomisch (Sonnenwenden und Tagundnachtgleichen)",
    season_meteorological: "Meteorologisch (1. März, Juni, September, Dezember)",
    no_location: "Keine sun.sun-Entität und kein Heimstandort: Richte die Sonne-Integration ein.",
    show_title: "Titel anzeigen",
    show_subtitle: "Untertitel anzeigen",
    show_sky: "Himmel anzeigen",
    animations: "Animationen",
    season_type: "Art der Jahreszeit",
    language: "Sprache",
    lang_auto: "Automatisch",
    next_golden: "Goldene Stunde um {time}",
    next_sunset: "Sonnenuntergang um {time}",
    next_sunrise: "Sonnenaufgang um {time}",
    daylight_tile: "Tageslicht",
    dawn_dusk: "Morgen- · Abenddämmerung",
    details: "Details",
    details_option: "Detailbereich",
    details_collapsed: "Eingeklappt",
    details_expanded: "Ausgeklappt",
    details_hidden: "Ausgeblendet",
    show_tiles: "Kacheln anzeigen",
    polar_day_short: "Mitternachtssonne",
    polar_night_short: "Polarnacht",
    moon_age_label: "Mondalter",
    zoom: "Detail-Schaltfläche",
    zoom_helper: "Schaltfläche oben rechts, die die Mini-Karte zur vollständigen Karte und zurück umschaltet",
    zoom_in: "Vollständige Karte anzeigen",
    zoom_out: "Kompakte Karte anzeigen",
    illustration: "Illustrierte Kopfzeile",
    illustration_theme: "Illustrationsthema",
    theme_auto: "Automatisch (Sonne, dann dunkles Design)",
    theme_day: "Tag",
    theme_night: "Nacht",
  },
  es: {
    title: "Cielo",
    title_option: "Título (opcional)",
    phase_day: "Día",
    phase_golden: "Hora dorada",
    phase_blue: "Hora azul",
    phase_night: "Noche",
    dawn: "Alba",
    sunrise: "Amanecer",
    solar_noon: "Mediodía solar",
    sunset: "Atardecer",
    dusk: "Anochecer",
    elevation: "Elevación",
    azimuth: "Acimut",
    vs_yesterday: "{delta} respecto a ayer",
    same_as_yesterday: "Igual que ayer",
    section_season: "Estación",
    moon_new_moon: "Luna nueva",
    moon_waxing_crescent: "Luna creciente",
    moon_first_quarter: "Cuarto creciente",
    moon_waxing_gibbous: "Gibosa creciente",
    moon_full_moon: "Luna llena",
    moon_waning_gibbous: "Gibosa menguante",
    moon_last_quarter: "Cuarto menguante",
    moon_waning_crescent: "Luna menguante",
    moon_lit: "{pct} iluminada",
    moonrise: "Salida de la luna",
    moonset: "Puesta de la luna",
    next_full: "Luna llena",
    next_new: "Luna nueva",
    computed: "Calculado en parte por la tarjeta",
    season_spring: "Primavera",
    season_summer: "Verano",
    season_autumn: "Otoño",
    season_winter: "Invierno",
    event_spring: "Equinoccio de primavera",
    event_summer: "Solsticio de verano",
    event_autumn: "Equinoccio de otoño",
    event_winter: "Solsticio de invierno",
    season_astronomical: "Astronómica (solsticios y equinoccios)",
    season_meteorological: "Meteorológica (1 de marzo, junio, septiembre, diciembre)",
    no_location: "No hay entidad sun.sun ni ubicación de la casa: configura la integración Sol.",
    show_title: "Mostrar título",
    show_subtitle: "Mostrar subtítulo",
    show_sky: "Mostrar el cielo",
    animations: "Animaciones",
    season_type: "Tipo de estación",
    language: "Idioma",
    lang_auto: "Automático",
    next_golden: "Hora dorada a las {time}",
    next_sunset: "Puesta de sol a las {time}",
    next_sunrise: "Salida del sol a las {time}",
    daylight_tile: "Luz del día",
    dawn_dusk: "Alba · anochecer",
    details: "Detalles",
    details_option: "Sección de detalles",
    details_collapsed: "Plegada",
    details_expanded: "Desplegada",
    details_hidden: "Oculta",
    show_tiles: "Mostrar los mosaicos",
    polar_day_short: "Sol de medianoche",
    polar_night_short: "Noche polar",
    moon_age_label: "Edad lunar",
    zoom: "Botón de detalle",
    zoom_helper: "Botón arriba a la derecha que cambia la minitarjeta a la tarjeta completa y viceversa",
    zoom_in: "Mostrar la tarjeta completa",
    zoom_out: "Mostrar la tarjeta compacta",
    illustration: "Encabezado ilustrado",
    illustration_theme: "Tema de la ilustración",
    theme_auto: "Automático (sol, luego tema oscuro)",
    theme_day: "Día",
    theme_night: "Noche",
  },
  it: {
    title: "Cielo",
    title_option: "Titolo (facoltativo)",
    phase_day: "Giorno",
    phase_golden: "Ora dorata",
    phase_blue: "Ora blu",
    phase_night: "Notte",
    dawn: "Alba",
    sunrise: "Levata del sole",
    solar_noon: "Mezzogiorno solare",
    sunset: "Tramonto",
    dusk: "Crepuscolo civile",
    elevation: "Elevazione",
    azimuth: "Azimut",
    vs_yesterday: "{delta} rispetto a ieri",
    same_as_yesterday: "Come ieri",
    section_season: "Stagione",
    moon_new_moon: "Luna nuova",
    moon_waxing_crescent: "Luna crescente",
    moon_first_quarter: "Primo quarto",
    moon_waxing_gibbous: "Gibbosa crescente",
    moon_full_moon: "Luna piena",
    moon_waning_gibbous: "Gibbosa calante",
    moon_last_quarter: "Ultimo quarto",
    moon_waning_crescent: "Luna calante",
    moon_lit: "{pct} illuminata",
    moonrise: "Sorgere della luna",
    moonset: "Tramonto della luna",
    next_full: "Luna piena",
    next_new: "Luna nuova",
    computed: "In parte calcolato dalla scheda",
    season_spring: "Primavera",
    season_summer: "Estate",
    season_autumn: "Autunno",
    season_winter: "Inverno",
    event_spring: "Equinozio di primavera",
    event_summer: "Solstizio d'estate",
    event_autumn: "Equinozio d'autunno",
    event_winter: "Solstizio d'inverno",
    season_astronomical: "Astronomica (solstizi ed equinozi)",
    season_meteorological: "Meteorologica (1° marzo, giugno, settembre, dicembre)",
    no_location: "Nessuna entità sun.sun e nessuna posizione di casa: configura l'integrazione Sole.",
    show_title: "Mostra titolo",
    show_subtitle: "Mostra sottotitolo",
    show_sky: "Mostra il cielo",
    animations: "Animazioni",
    season_type: "Tipo di stagione",
    language: "Lingua",
    lang_auto: "Automatica",
    next_golden: "Ora dorata alle {time}",
    next_sunset: "Tramonto alle {time}",
    next_sunrise: "Alba alle {time}",
    daylight_tile: "Luce del giorno",
    dawn_dusk: "Alba · crepuscolo",
    details: "Dettagli",
    details_option: "Sezione dettagli",
    details_collapsed: "Chiusa",
    details_expanded: "Aperta",
    details_hidden: "Nascosta",
    show_tiles: "Mostra i riquadri",
    polar_day_short: "Sole di mezzanotte",
    polar_night_short: "Notte polare",
    moon_age_label: "Età della luna",
    zoom: "Pulsante dettagli",
    zoom_helper: "Pulsante in alto a destra che passa dalla mini scheda alla scheda completa e viceversa",
    zoom_in: "Mostra la scheda completa",
    zoom_out: "Mostra la scheda compatta",
    illustration: "Intestazione illustrata",
    illustration_theme: "Tema dell'illustrazione",
    theme_auto: "Automatico (sole, poi tema scuro)",
    theme_day: "Giorno",
    theme_night: "Notte",
  },
  nl: {
    title: "Hemel",
    title_option: "Titel (optioneel)",
    phase_day: "Dag",
    phase_golden: "Gouden uur",
    phase_blue: "Blauwe uur",
    phase_night: "Nacht",
    dawn: "Dageraad",
    sunrise: "Zonsopkomst",
    solar_noon: "Zonnemiddag",
    sunset: "Zonsondergang",
    dusk: "Avondschemering",
    elevation: "Hoogte",
    azimuth: "Azimut",
    vs_yesterday: "{delta} t.o.v. gisteren",
    same_as_yesterday: "Zelfde als gisteren",
    section_season: "Seizoen",
    moon_new_moon: "Nieuwe maan",
    moon_waxing_crescent: "Wassende sikkel",
    moon_first_quarter: "Eerste kwartier",
    moon_waxing_gibbous: "Wassende maan",
    moon_full_moon: "Volle maan",
    moon_waning_gibbous: "Afnemende maan",
    moon_last_quarter: "Laatste kwartier",
    moon_waning_crescent: "Afnemende sikkel",
    moon_lit: "{pct} verlicht",
    moonrise: "Maanopkomst",
    moonset: "Maanondergang",
    next_full: "Volle maan",
    next_new: "Nieuwe maan",
    computed: "Deels berekend door de kaart",
    season_spring: "Lente",
    season_summer: "Zomer",
    season_autumn: "Herfst",
    season_winter: "Winter",
    event_spring: "Lente-equinox",
    event_summer: "Zomerzonnewende",
    event_autumn: "Herfst-equinox",
    event_winter: "Winterzonnewende",
    season_astronomical: "Astronomisch (zonnewendes en equinoxen)",
    season_meteorological: "Meteorologisch (1 maart, juni, september, december)",
    no_location: "Geen sun.sun-entiteit en geen thuislocatie: stel de Zon-integratie in.",
    show_title: "Titel tonen",
    show_subtitle: "Ondertitel tonen",
    show_sky: "Hemel tonen",
    animations: "Animaties",
    season_type: "Soort seizoen",
    language: "Taal",
    lang_auto: "Automatisch",
    next_golden: "Gouden uur om {time}",
    next_sunset: "Zonsondergang om {time}",
    next_sunrise: "Zonsopkomst om {time}",
    daylight_tile: "Daglicht",
    dawn_dusk: "Dageraad · schemering",
    details: "Details",
    details_option: "Detailsectie",
    details_collapsed: "Ingeklapt",
    details_expanded: "Uitgeklapt",
    details_hidden: "Verborgen",
    show_tiles: "Tegels tonen",
    polar_day_short: "Middernachtszon",
    polar_night_short: "Poolnacht",
    moon_age_label: "Leeftijd van de maan",
    zoom: "Detailknop",
    zoom_helper: "Knop rechtsboven die de minikaart naar de volledige kaart omschakelt en terug",
    zoom_in: "Volledige kaart tonen",
    zoom_out: "Compacte kaart tonen",
    illustration: "Geïllustreerde koptekst",
    illustration_theme: "Illustratiethema",
    theme_auto: "Automatisch (zon, dan donker thema)",
    theme_day: "Dag",
    theme_night: "Nacht",
  },
  pt: {
    title: "Céu",
    title_option: "Título (opcional)",
    phase_day: "Dia",
    phase_golden: "Hora dourada",
    phase_blue: "Hora azul",
    phase_night: "Noite",
    dawn: "Alvorada",
    sunrise: "Nascer do sol",
    solar_noon: "Meio-dia solar",
    sunset: "Pôr do sol",
    dusk: "Anoitecer",
    elevation: "Elevação",
    azimuth: "Azimute",
    vs_yesterday: "{delta} em relação a ontem",
    same_as_yesterday: "Igual a ontem",
    section_season: "Estação",
    moon_new_moon: "Lua nova",
    moon_waxing_crescent: "Lua crescente",
    moon_first_quarter: "Quarto crescente",
    moon_waxing_gibbous: "Crescente gibosa",
    moon_full_moon: "Lua cheia",
    moon_waning_gibbous: "Minguante gibosa",
    moon_last_quarter: "Quarto minguante",
    moon_waning_crescent: "Lua minguante",
    moon_lit: "{pct} iluminada",
    moonrise: "Nascer da lua",
    moonset: "Pôr da lua",
    next_full: "Lua cheia",
    next_new: "Lua nova",
    computed: "Calculado em parte pelo cartão",
    season_spring: "Primavera",
    season_summer: "Verão",
    season_autumn: "Outono",
    season_winter: "Inverno",
    event_spring: "Equinócio da primavera",
    event_summer: "Solstício de verão",
    event_autumn: "Equinócio de outono",
    event_winter: "Solstício de inverno",
    season_astronomical: "Astronómica (solstícios e equinócios)",
    season_meteorological: "Meteorológica (1 de março, junho, setembro, dezembro)",
    no_location: "Sem entidade sun.sun nem localização da casa: configure a integração Sol.",
    show_title: "Mostrar título",
    show_subtitle: "Mostrar subtítulo",
    show_sky: "Mostrar o céu",
    animations: "Animações",
    season_type: "Tipo de estação",
    language: "Idioma",
    lang_auto: "Automático",
    next_golden: "Hora dourada às {time}",
    next_sunset: "Pôr do sol às {time}",
    next_sunrise: "Nascer do sol às {time}",
    daylight_tile: "Luz do dia",
    dawn_dusk: "Alvorada · anoitecer",
    details: "Detalhes",
    details_option: "Secção de detalhes",
    details_collapsed: "Recolhida",
    details_expanded: "Expandida",
    details_hidden: "Oculta",
    show_tiles: "Mostrar os mosaicos",
    polar_day_short: "Sol da meia-noite",
    polar_night_short: "Noite polar",
    moon_age_label: "Idade da lua",
    zoom: "Botão de detalhe",
    zoom_helper: "Botão no canto superior direito que alterna o mini cartão para o cartão completo e vice-versa",
    zoom_in: "Mostrar o cartão completo",
    zoom_out: "Mostrar o cartão compacto",
    illustration: "Cabeçalho ilustrado",
    illustration_theme: "Tema da ilustração",
    theme_auto: "Automático (sol, depois tema escuro)",
    theme_day: "Dia",
    theme_night: "Noite",
  },
  pl: {
    title: "Niebo",
    title_option: "Tytuł (opcjonalnie)",
    phase_day: "Dzień",
    phase_golden: "Złota godzina",
    phase_blue: "Niebieska godzina",
    phase_night: "Noc",
    dawn: "Świt",
    sunrise: "Wschód słońca",
    solar_noon: "Górowanie",
    sunset: "Zachód słońca",
    dusk: "Zmierzch cywilny",
    elevation: "Wysokość",
    azimuth: "Azymut",
    vs_yesterday: "{delta} względem wczoraj",
    same_as_yesterday: "Tak jak wczoraj",
    section_season: "Pora roku",
    moon_new_moon: "Nów",
    moon_waxing_crescent: "Przybywający sierp",
    moon_first_quarter: "Pierwsza kwadra",
    moon_waxing_gibbous: "Przybywający garb",
    moon_full_moon: "Pełnia",
    moon_waning_gibbous: "Ubywający garb",
    moon_last_quarter: "Ostatnia kwadra",
    moon_waning_crescent: "Ubywający sierp",
    moon_lit: "Oświetlenie {pct}",
    moonrise: "Wschód księżyca",
    moonset: "Zachód księżyca",
    next_full: "Pełnia",
    next_new: "Nów",
    computed: "Częściowo obliczone przez kartę",
    season_spring: "Wiosna",
    season_summer: "Lato",
    season_autumn: "Jesień",
    season_winter: "Zima",
    event_spring: "Równonoc wiosenna",
    event_summer: "Przesilenie letnie",
    event_autumn: "Równonoc jesienna",
    event_winter: "Przesilenie zimowe",
    season_astronomical: "Astronomiczna (przesilenia i równonoce)",
    season_meteorological: "Meteorologiczna (1 marca, czerwca, września, grudnia)",
    no_location: "Brak encji sun.sun i lokalizacji domu: skonfiguruj integrację Słońce.",
    show_title: "Pokaż tytuł",
    show_subtitle: "Pokaż podtytuł",
    show_sky: "Pokaż niebo",
    animations: "Animacje",
    season_type: "Rodzaj pory roku",
    language: "Język",
    lang_auto: "Automatycznie",
    next_golden: "Złota godzina o {time}",
    next_sunset: "Zachód słońca o {time}",
    next_sunrise: "Wschód słońca o {time}",
    daylight_tile: "Światło dzienne",
    dawn_dusk: "Świt · zmierzch",
    details: "Szczegóły",
    details_option: "Sekcja szczegółów",
    details_collapsed: "Zwinięta",
    details_expanded: "Rozwinięta",
    details_hidden: "Ukryta",
    show_tiles: "Pokaż kafelki",
    polar_day_short: "Dzień polarny",
    polar_night_short: "Noc polarna",
    moon_age_label: "Wiek księżyca",
    zoom: "Przycisk szczegółów",
    zoom_helper: "Przycisk w prawym górnym rogu przełączający mini kartę na pełną kartę i z powrotem",
    zoom_in: "Pokaż pełną kartę",
    zoom_out: "Pokaż kompaktową kartę",
    illustration: "Ilustrowany nagłówek",
    illustration_theme: "Motyw ilustracji",
    theme_auto: "Automatyczny (słońce, potem ciemny motyw)",
    theme_day: "Dzień",
    theme_night: "Noc",
  },
  sr: {
    title: "Небо",
    title_option: "Наслов (опционо)",
    phase_day: "Дан",
    phase_golden: "Златни сат",
    phase_blue: "Плави сат",
    phase_night: "Ноћ",
    dawn: "Зора",
    sunrise: "Излазак сунца",
    solar_noon: "Соларно подне",
    sunset: "Залазак сунца",
    dusk: "Сумрак",
    elevation: "Висина",
    azimuth: "Азимут",
    vs_yesterday: "{delta} у односу на јуче",
    same_as_yesterday: "Исто као јуче",
    section_season: "Годишње доба",
    moon_new_moon: "Млад месец",
    moon_waxing_crescent: "Растући срп",
    moon_first_quarter: "Прва четврт",
    moon_waxing_gibbous: "Растући месец",
    moon_full_moon: "Пун месец",
    moon_waning_gibbous: "Опадајући месец",
    moon_last_quarter: "Последња четврт",
    moon_waning_crescent: "Опадајући срп",
    moon_lit: "Осветљено {pct}",
    moonrise: "Излазак месеца",
    moonset: "Залазак месеца",
    next_full: "Пун месец",
    next_new: "Млад месец",
    computed: "Делимично израчунала картица",
    season_spring: "Пролеће",
    season_summer: "Лето",
    season_autumn: "Јесен",
    season_winter: "Зима",
    event_spring: "Пролећна равнодневица",
    event_summer: "Летња дугодневица",
    event_autumn: "Јесења равнодневица",
    event_winter: "Зимска краткодневица",
    season_astronomical: "Астрономско (солстицији и еквиноцији)",
    season_meteorological: "Метеоролошко (1. март, јун, септембар, децембар)",
    no_location: "Нема ентитета sun.sun ни локације куће: подесите интеграцију Сунце.",
    show_title: "Прикажи наслов",
    show_subtitle: "Прикажи поднаслов",
    show_sky: "Прикажи небо",
    animations: "Анимације",
    season_type: "Врста годишњег доба",
    language: "Језик",
    lang_auto: "Аутоматски",
    next_golden: "Златни сат у {time}",
    next_sunset: "Залазак сунца у {time}",
    next_sunrise: "Излазак сунца у {time}",
    daylight_tile: "Дневна светлост",
    dawn_dusk: "Зора · сумрак",
    details: "Детаљи",
    details_option: "Одељак детаља",
    details_collapsed: "Скупљен",
    details_expanded: "Раширен",
    details_hidden: "Скривен",
    show_tiles: "Прикажи плочице",
    polar_day_short: "Поноћно сунце",
    polar_night_short: "Поларна ноћ",
    moon_age_label: "Старост месеца",
    zoom: "Дугме за детаље",
    zoom_helper: "Дугме горе десно које пребацује мини картицу на пуну картицу и назад",
    zoom_in: "Прикажи пуну картицу",
    zoom_out: "Прикажи компактну картицу",
    illustration: "Илустровано заглавље",
    illustration_theme: "Тема илустрације",
    theme_auto: "Аутоматски (сунце, па тамна тема)",
    theme_day: "Дан",
    theme_night: "Ноћ",
  },
  "sr-Latn": {
    title: "Nebo",
    title_option: "Naslov (opciono)",
    phase_day: "Dan",
    phase_golden: "Zlatni sat",
    phase_blue: "Plavi sat",
    phase_night: "Noć",
    dawn: "Zora",
    sunrise: "Izlazak sunca",
    solar_noon: "Solarno podne",
    sunset: "Zalazak sunca",
    dusk: "Sumrak",
    elevation: "Visina",
    azimuth: "Azimut",
    vs_yesterday: "{delta} u odnosu na juče",
    same_as_yesterday: "Isto kao juče",
    section_season: "Godišnje doba",
    moon_new_moon: "Mlad mesec",
    moon_waxing_crescent: "Rastući srp",
    moon_first_quarter: "Prva četvrt",
    moon_waxing_gibbous: "Rastući mesec",
    moon_full_moon: "Pun mesec",
    moon_waning_gibbous: "Opadajući mesec",
    moon_last_quarter: "Poslednja četvrt",
    moon_waning_crescent: "Opadajući srp",
    moon_lit: "Osvetljeno {pct}",
    moonrise: "Izlazak meseca",
    moonset: "Zalazak meseca",
    next_full: "Pun mesec",
    next_new: "Mlad mesec",
    computed: "Delimično izračunala kartica",
    season_spring: "Proleće",
    season_summer: "Leto",
    season_autumn: "Jesen",
    season_winter: "Zima",
    event_spring: "Prolećna ravnodnevica",
    event_summer: "Letnja dugodnevica",
    event_autumn: "Jesenja ravnodnevica",
    event_winter: "Zimska kratkodnevica",
    season_astronomical: "Astronomsko (solsticiji i ekvinocije)",
    season_meteorological: "Meteorološko (1. mart, jun, septembar, decembar)",
    no_location: "Nema entiteta sun.sun ni lokacije kuće: podesite integraciju Sunce.",
    show_title: "Prikaži naslov",
    show_subtitle: "Prikaži podnaslov",
    show_sky: "Prikaži nebo",
    animations: "Animacije",
    season_type: "Vrsta godišnjeg doba",
    language: "Jezik",
    lang_auto: "Automatski",
    next_golden: "Zlatni sat u {time}",
    next_sunset: "Zalazak sunca u {time}",
    next_sunrise: "Izlazak sunca u {time}",
    daylight_tile: "Dnevna svetlost",
    dawn_dusk: "Zora · sumrak",
    details: "Detalji",
    details_option: "Odeljak detalja",
    details_collapsed: "Skupljen",
    details_expanded: "Raširen",
    details_hidden: "Skriven",
    show_tiles: "Prikaži pločice",
    polar_day_short: "Ponoćno sunce",
    polar_night_short: "Polarna noć",
    moon_age_label: "Starost meseca",
    zoom: "Dugme za detalje",
    zoom_helper: "Dugme gore desno koje prebacuje mini karticu na punu karticu i nazad",
    zoom_in: "Prikaži punu karticu",
    zoom_out: "Prikaži kompaktnu karticu",
    illustration: "Ilustrovano zaglavlje",
    illustration_theme: "Tema ilustracije",
    theme_auto: "Automatski (sunce, pa tamna tema)",
    theme_day: "Dan",
    theme_night: "Noć",
  },
  ro: {
    title: "Cer",
    title_option: "Titlu (opțional)",
    phase_day: "Zi",
    phase_golden: "Ora de aur",
    phase_blue: "Ora albastră",
    phase_night: "Noapte",
    dawn: "Zori",
    sunrise: "Răsărit",
    solar_noon: "Amiază solară",
    sunset: "Apus",
    dusk: "Amurg civil",
    elevation: "Elevație",
    azimuth: "Azimut",
    vs_yesterday: "{delta} față de ieri",
    same_as_yesterday: "La fel ca ieri",
    section_season: "Anotimp",
    moon_new_moon: "Lună nouă",
    moon_waxing_crescent: "Semilună în creștere",
    moon_first_quarter: "Primul pătrar",
    moon_waxing_gibbous: "Lună convexă în creștere",
    moon_full_moon: "Lună plină",
    moon_waning_gibbous: "Lună convexă în descreștere",
    moon_last_quarter: "Ultimul pătrar",
    moon_waning_crescent: "Semilună în descreștere",
    moon_lit: "{pct} luminată",
    moonrise: "Răsăritul lunii",
    moonset: "Apusul lunii",
    next_full: "Lună plină",
    next_new: "Lună nouă",
    computed: "Calculat parțial de card",
    season_spring: "Primăvară",
    season_summer: "Vară",
    season_autumn: "Toamnă",
    season_winter: "Iarnă",
    event_spring: "Echinocțiul de primăvară",
    event_summer: "Solstițiul de vară",
    event_autumn: "Echinocțiul de toamnă",
    event_winter: "Solstițiul de iarnă",
    season_astronomical: "Astronomic (solstiții și echinocții)",
    season_meteorological: "Meteorologic (1 martie, iunie, septembrie, decembrie)",
    no_location: "Nicio entitate sun.sun și nicio locație a casei: configurați integrarea Soare.",
    show_title: "Afișează titlul",
    show_subtitle: "Afișează subtitlul",
    show_sky: "Afișează cerul",
    animations: "Animații",
    season_type: "Tip de anotimp",
    language: "Limbă",
    lang_auto: "Automat",
    next_golden: "Ora de aur la {time}",
    next_sunset: "Apus la {time}",
    next_sunrise: "Răsărit la {time}",
    daylight_tile: "Lumina zilei",
    dawn_dusk: "Zori · amurg",
    details: "Detalii",
    details_option: "Secțiunea detalii",
    details_collapsed: "Restrânsă",
    details_expanded: "Extinsă",
    details_hidden: "Ascunsă",
    show_tiles: "Afișează plăcile",
    polar_day_short: "Soarele de la miezul nopții",
    polar_night_short: "Noapte polară",
    moon_age_label: "Vârsta lunii",
    zoom: "Buton de detalii",
    zoom_helper: "Buton din dreapta sus care comută mini cardul în cardul complet și înapoi",
    zoom_in: "Afișează cardul complet",
    zoom_out: "Afișează cardul compact",
    illustration: "Antet ilustrat",
    illustration_theme: "Tema ilustrației",
    theme_auto: "Automat (soare, apoi tema întunecată)",
    theme_day: "Zi",
    theme_night: "Noapte",
  },
  da: {
    title: "Himmel",
    title_option: "Titel (valgfri)",
    phase_day: "Dag",
    phase_golden: "Gyldne time",
    phase_blue: "Blå time",
    phase_night: "Nat",
    dawn: "Daggry",
    sunrise: "Solopgang",
    solar_noon: "Solens middag",
    sunset: "Solnedgang",
    dusk: "Skumring",
    elevation: "Højde",
    azimuth: "Azimut",
    vs_yesterday: "{delta} i forhold til i går",
    same_as_yesterday: "Som i går",
    section_season: "Årstid",
    moon_new_moon: "Nymåne",
    moon_waxing_crescent: "Tiltagende segl",
    moon_first_quarter: "Første kvarter",
    moon_waxing_gibbous: "Tiltagende måne",
    moon_full_moon: "Fuldmåne",
    moon_waning_gibbous: "Aftagende måne",
    moon_last_quarter: "Sidste kvarter",
    moon_waning_crescent: "Aftagende segl",
    moon_lit: "{pct} oplyst",
    moonrise: "Måneopgang",
    moonset: "Månenedgang",
    next_full: "Fuldmåne",
    next_new: "Nymåne",
    computed: "Delvist beregnet af kortet",
    season_spring: "Forår",
    season_summer: "Sommer",
    season_autumn: "Efterår",
    season_winter: "Vinter",
    event_spring: "Forårsjævndøgn",
    event_summer: "Sommersolhverv",
    event_autumn: "Efterårsjævndøgn",
    event_winter: "Vintersolhverv",
    season_astronomical: "Astronomisk (solhverv og jævndøgn)",
    season_meteorological: "Meteorologisk (1. marts, juni, september, december)",
    no_location: "Ingen sun.sun-enhed og ingen hjemmeposition: opsæt Sol-integrationen.",
    show_title: "Vis titel",
    show_subtitle: "Vis undertitel",
    show_sky: "Vis himlen",
    animations: "Animationer",
    season_type: "Årstidstype",
    language: "Sprog",
    lang_auto: "Automatisk",
    next_golden: "Gyldne time kl. {time}",
    next_sunset: "Solnedgang kl. {time}",
    next_sunrise: "Solopgang kl. {time}",
    daylight_tile: "Dagslys",
    dawn_dusk: "Daggry · skumring",
    details: "Detaljer",
    details_option: "Detaljesektion",
    details_collapsed: "Foldet sammen",
    details_expanded: "Foldet ud",
    details_hidden: "Skjult",
    show_tiles: "Vis felterne",
    polar_day_short: "Midnatssol",
    polar_night_short: "Polarnat",
    moon_age_label: "Månens alder",
    zoom: "Detaljeknap",
    zoom_helper: "Knap øverst til højre, der skifter minikortet til det fulde kort og tilbage",
    zoom_in: "Vis det fulde kort",
    zoom_out: "Vis det kompakte kort",
    illustration: "Illustreret overskrift",
    illustration_theme: "Illustrationstema",
    theme_auto: "Automatisk (sol, derefter mørkt tema)",
    theme_day: "Dag",
    theme_night: "Nat",
  },
  sv: {
    title: "Himmel",
    title_option: "Titel (valfri)",
    phase_day: "Dag",
    phase_golden: "Gyllene timmen",
    phase_blue: "Blå timmen",
    phase_night: "Natt",
    dawn: "Gryning",
    sunrise: "Soluppgång",
    solar_noon: "Soltimmen mitt på dagen",
    sunset: "Solnedgång",
    dusk: "Skymning",
    elevation: "Höjd",
    azimuth: "Azimut",
    vs_yesterday: "{delta} jämfört med i går",
    same_as_yesterday: "Samma som i går",
    section_season: "Årstid",
    moon_new_moon: "Nymåne",
    moon_waxing_crescent: "Tilltagande skära",
    moon_first_quarter: "Första kvarteret",
    moon_waxing_gibbous: "Tilltagande måne",
    moon_full_moon: "Fullmåne",
    moon_waning_gibbous: "Avtagande måne",
    moon_last_quarter: "Sista kvarteret",
    moon_waning_crescent: "Avtagande skära",
    moon_lit: "{pct} belyst",
    moonrise: "Månuppgång",
    moonset: "Månnedgång",
    next_full: "Fullmåne",
    next_new: "Nymåne",
    computed: "Delvis beräknat av kortet",
    season_spring: "Vår",
    season_summer: "Sommar",
    season_autumn: "Höst",
    season_winter: "Vinter",
    event_spring: "Vårdagjämning",
    event_summer: "Sommarsolstånd",
    event_autumn: "Höstdagjämning",
    event_winter: "Vintersolstånd",
    season_astronomical: "Astronomisk (solstånd och dagjämningar)",
    season_meteorological: "Meteorologisk (1 mars, juni, september, december)",
    no_location: "Ingen sun.sun-entitet och ingen hemposition: konfigurera Sol-integrationen.",
    show_title: "Visa titel",
    show_subtitle: "Visa undertitel",
    show_sky: "Visa himlen",
    animations: "Animationer",
    season_type: "Typ av årstid",
    language: "Språk",
    lang_auto: "Automatiskt",
    next_golden: "Gyllene timmen kl. {time}",
    next_sunset: "Solnedgång kl. {time}",
    next_sunrise: "Soluppgång kl. {time}",
    daylight_tile: "Dagsljus",
    dawn_dusk: "Gryning · skymning",
    details: "Detaljer",
    details_option: "Detaljavsnitt",
    details_collapsed: "Hopfällt",
    details_expanded: "Utfällt",
    details_hidden: "Dolt",
    show_tiles: "Visa rutorna",
    polar_day_short: "Midnattssol",
    polar_night_short: "Polarnatt",
    moon_age_label: "Månens ålder",
    zoom: "Detaljknapp",
    zoom_helper: "Knapp uppe till höger som växlar minikortet till hela kortet och tillbaka",
    zoom_in: "Visa hela kortet",
    zoom_out: "Visa det kompakta kortet",
    illustration: "Illustrerad rubrik",
    illustration_theme: "Illustrationstema",
    theme_auto: "Automatiskt (sol, sedan mörkt tema)",
    theme_day: "Dag",
    theme_night: "Natt",
  },
  bg: {
    title: "Небе",
    title_option: "Заглавие (по избор)",
    phase_day: "Ден",
    phase_golden: "Златен час",
    phase_blue: "Син час",
    phase_night: "Нощ",
    dawn: "Зазоряване",
    sunrise: "Изгрев",
    solar_noon: "Слънчево пладне",
    sunset: "Залез",
    dusk: "Свечеряване",
    elevation: "Височина",
    azimuth: "Азимут",
    vs_yesterday: "{delta} спрямо вчера",
    same_as_yesterday: "Като вчера",
    section_season: "Сезон",
    moon_new_moon: "Новолуние",
    moon_waxing_crescent: "Растящ сърп",
    moon_first_quarter: "Първа четвърт",
    moon_waxing_gibbous: "Растяща луна",
    moon_full_moon: "Пълнолуние",
    moon_waning_gibbous: "Намаляваща луна",
    moon_last_quarter: "Последна четвърт",
    moon_waning_crescent: "Намаляващ сърп",
    moon_lit: "{pct} осветена",
    moonrise: "Изгрев на луната",
    moonset: "Залез на луната",
    next_full: "Пълнолуние",
    next_new: "Новолуние",
    computed: "Частично изчислено от картата",
    season_spring: "Пролет",
    season_summer: "Лято",
    season_autumn: "Есен",
    season_winter: "Зима",
    event_spring: "Пролетно равноденствие",
    event_summer: "Лятно слънцестоене",
    event_autumn: "Есенно равноденствие",
    event_winter: "Зимно слънцестоене",
    season_astronomical: "Астрономически (слънцестоения и равноденствия)",
    season_meteorological: "Метеорологичен (1 март, юни, септември, декември)",
    no_location: "Няма обект sun.sun и местоположение на дома: настройте интеграцията Слънце.",
    show_title: "Показване на заглавието",
    show_subtitle: "Показване на подзаглавието",
    show_sky: "Показване на небето",
    animations: "Анимации",
    season_type: "Вид сезон",
    language: "Език",
    lang_auto: "Автоматично",
    next_golden: "Златен час в {time}",
    next_sunset: "Залез в {time}",
    next_sunrise: "Изгрев в {time}",
    daylight_tile: "Дневна светлина",
    dawn_dusk: "Зазоряване · здрач",
    details: "Подробности",
    details_option: "Раздел подробности",
    details_collapsed: "Свит",
    details_expanded: "Разгънат",
    details_hidden: "Скрит",
    show_tiles: "Показване на плочките",
    polar_day_short: "Среднощно слънце",
    polar_night_short: "Полярна нощ",
    moon_age_label: "Възраст на луната",
    zoom: "Бутон за детайли",
    zoom_helper: "Бутон горе вдясно, който превключва мини картата към пълната карта и обратно",
    zoom_in: "Показване на пълната карта",
    zoom_out: "Показване на компактната карта",
    illustration: "Илюстрирана заглавка",
    illustration_theme: "Тема на илюстрацията",
    theme_auto: "Автоматично (слънце, после тъмна тема)",
    theme_day: "Ден",
    theme_night: "Нощ",
  },
  ru: {
    title: "Небо",
    title_option: "Заголовок (необязательно)",
    phase_day: "День",
    phase_golden: "Золотой час",
    phase_blue: "Синий час",
    phase_night: "Ночь",
    dawn: "Рассвет",
    sunrise: "Восход",
    solar_noon: "Солнечный полдень",
    sunset: "Закат",
    dusk: "Конец сумерек",
    elevation: "Высота",
    azimuth: "Азимут",
    vs_yesterday: "{delta} по сравнению со вчера",
    same_as_yesterday: "Как вчера",
    section_season: "Сезон",
    moon_new_moon: "Новолуние",
    moon_waxing_crescent: "Растущий серп",
    moon_first_quarter: "Первая четверть",
    moon_waxing_gibbous: "Растущая луна",
    moon_full_moon: "Полнолуние",
    moon_waning_gibbous: "Убывающая луна",
    moon_last_quarter: "Последняя четверть",
    moon_waning_crescent: "Убывающий серп",
    moon_lit: "Освещено {pct}",
    moonrise: "Восход луны",
    moonset: "Заход луны",
    next_full: "Полнолуние",
    next_new: "Новолуние",
    computed: "Частично рассчитано карточкой",
    season_spring: "Весна",
    season_summer: "Лето",
    season_autumn: "Осень",
    season_winter: "Зима",
    event_spring: "Весеннее равноденствие",
    event_summer: "Летнее солнцестояние",
    event_autumn: "Осеннее равноденствие",
    event_winter: "Зимнее солнцестояние",
    season_astronomical: "Астрономический (солнцестояния и равноденствия)",
    season_meteorological: "Метеорологический (1 марта, июня, сентября, декабря)",
    no_location: "Нет сущности sun.sun и местоположения дома: настройте интеграцию «Солнце».",
    show_title: "Показывать заголовок",
    show_subtitle: "Показывать подзаголовок",
    show_sky: "Показывать небо",
    animations: "Анимации",
    season_type: "Тип сезона",
    language: "Язык",
    lang_auto: "Автоматически",
    next_golden: "Золотой час в {time}",
    next_sunset: "Закат в {time}",
    next_sunrise: "Восход в {time}",
    daylight_tile: "Световой день",
    dawn_dusk: "Рассвет · сумерки",
    details: "Подробности",
    details_option: "Раздел подробностей",
    details_collapsed: "Свёрнут",
    details_expanded: "Развёрнут",
    details_hidden: "Скрыт",
    show_tiles: "Показывать плитки",
    polar_day_short: "Полярный день",
    polar_night_short: "Полярная ночь",
    moon_age_label: "Возраст Луны",
    zoom: "Кнопка подробностей",
    zoom_helper: "Кнопка в правом верхнем углу, переключающая мини-карточку на полную и обратно",
    zoom_in: "Показать полную карточку",
    zoom_out: "Показать компактную карточку",
    illustration: "Иллюстрированный заголовок",
    illustration_theme: "Тема иллюстрации",
    theme_auto: "Автоматически (солнце, затем тёмная тема)",
    theme_day: "День",
    theme_night: "Ночь",
  },
  uk: {
    title: "Небо",
    title_option: "Заголовок (необов'язково)",
    phase_day: "День",
    phase_golden: "Золота година",
    phase_blue: "Синя година",
    phase_night: "Ніч",
    dawn: "Світанок",
    sunrise: "Схід сонця",
    solar_noon: "Сонячний полудень",
    sunset: "Захід сонця",
    dusk: "Кінець сутінків",
    elevation: "Висота",
    azimuth: "Азимут",
    vs_yesterday: "{delta} порівняно з учора",
    same_as_yesterday: "Як учора",
    section_season: "Пора року",
    moon_new_moon: "Молодик",
    moon_waxing_crescent: "Молодий місяць",
    moon_first_quarter: "Перша чверть",
    moon_waxing_gibbous: "Прибуваючий місяць",
    moon_full_moon: "Повня",
    moon_waning_gibbous: "Спадний місяць",
    moon_last_quarter: "Остання чверть",
    moon_waning_crescent: "Старий місяць",
    moon_lit: "Освітлено {pct}",
    moonrise: "Схід місяця",
    moonset: "Захід місяця",
    next_full: "Повня",
    next_new: "Молодик",
    computed: "Частково обчислено карткою",
    season_spring: "Весна",
    season_summer: "Літо",
    season_autumn: "Осінь",
    season_winter: "Зима",
    event_spring: "Весняне рівнодення",
    event_summer: "Літнє сонцестояння",
    event_autumn: "Осіннє рівнодення",
    event_winter: "Зимове сонцестояння",
    season_astronomical: "Астрономічна (сонцестояння та рівнодення)",
    season_meteorological: "Метеорологічна (1 березня, червня, вересня, грудня)",
    no_location: "Немає сутності sun.sun і розташування дому: налаштуйте інтеграцію «Сонце».",
    show_title: "Показувати заголовок",
    show_subtitle: "Показувати підзаголовок",
    show_sky: "Показувати небо",
    animations: "Анімації",
    season_type: "Тип пори року",
    language: "Мова",
    lang_auto: "Автоматично",
    next_golden: "Золота година о {time}",
    next_sunset: "Захід сонця о {time}",
    next_sunrise: "Схід сонця о {time}",
    daylight_tile: "Світловий день",
    dawn_dusk: "Світанок · сутінки",
    details: "Подробиці",
    details_option: "Розділ подробиць",
    details_collapsed: "Згорнутий",
    details_expanded: "Розгорнутий",
    details_hidden: "Прихований",
    show_tiles: "Показувати плитки",
    polar_day_short: "Полярний день",
    polar_night_short: "Полярна ніч",
    moon_age_label: "Вік Місяця",
    zoom: "Кнопка деталей",
    zoom_helper: "Кнопка у правому верхньому куті, що перемикає міні-картку на повну й назад",
    zoom_in: "Показати повну картку",
    zoom_out: "Показати компактну картку",
    illustration: "Ілюстрований заголовок",
    illustration_theme: "Тема ілюстрації",
    theme_auto: "Автоматично (сонце, потім темна тема)",
    theme_day: "День",
    theme_night: "Ніч",
  },
  hu: {
    title: "Égbolt",
    title_option: "Cím (nem kötelező)",
    phase_day: "Nappal",
    phase_golden: "Arany óra",
    phase_blue: "Kék óra",
    phase_night: "Éjszaka",
    dawn: "Hajnal",
    sunrise: "Napkelte",
    solar_noon: "Delelés",
    sunset: "Napnyugta",
    dusk: "Alkonyat",
    elevation: "Magasság",
    azimuth: "Azimut",
    vs_yesterday: "{delta} a tegnapihoz képest",
    same_as_yesterday: "Ugyanannyi, mint tegnap",
    section_season: "Évszak",
    moon_new_moon: "Újhold",
    moon_waxing_crescent: "Növő sarló",
    moon_first_quarter: "Első negyed",
    moon_waxing_gibbous: "Növő hold",
    moon_full_moon: "Telihold",
    moon_waning_gibbous: "Fogyó hold",
    moon_last_quarter: "Utolsó negyed",
    moon_waning_crescent: "Fogyó sarló",
    moon_lit: "{pct} megvilágítva",
    moonrise: "Holdkelte",
    moonset: "Holdnyugta",
    next_full: "Telihold",
    next_new: "Újhold",
    computed: "Részben a kártya számolta",
    season_spring: "Tavasz",
    season_summer: "Nyár",
    season_autumn: "Ősz",
    season_winter: "Tél",
    event_spring: "Tavaszi napéjegyenlőség",
    event_summer: "Nyári napforduló",
    event_autumn: "Őszi napéjegyenlőség",
    event_winter: "Téli napforduló",
    season_astronomical: "Csillagászati (napfordulók és napéjegyenlőségek)",
    season_meteorological: "Meteorológiai (március, június, szeptember, december 1.)",
    no_location: "Nincs sun.sun entitás és otthoni hely: állítsa be a Nap integrációt.",
    show_title: "Cím megjelenítése",
    show_subtitle: "Alcím megjelenítése",
    show_sky: "Égbolt megjelenítése",
    animations: "Animációk",
    season_type: "Évszak típusa",
    language: "Nyelv",
    lang_auto: "Automatikus",
    next_golden: "Aranyóra: {time}",
    next_sunset: "Napnyugta: {time}",
    next_sunrise: "Napkelte: {time}",
    daylight_tile: "Nappali fény",
    dawn_dusk: "Hajnal · szürkület",
    details: "Részletek",
    details_option: "Részletek szakasz",
    details_collapsed: "Összecsukva",
    details_expanded: "Kinyitva",
    details_hidden: "Rejtve",
    show_tiles: "Csempék megjelenítése",
    polar_day_short: "Éjféli nap",
    polar_night_short: "Sarki éjszaka",
    moon_age_label: "Hold kora",
    zoom: "Részletek gomb",
    zoom_helper: "Jobb felső gomb, amely a mini kártyát a teljes kártyára váltja és vissza",
    zoom_in: "Teljes kártya megjelenítése",
    zoom_out: "Kompakt kártya megjelenítése",
    illustration: "Illusztrált fejléc",
    illustration_theme: "Illusztráció témája",
    theme_auto: "Automatikus (nap, majd sötét téma)",
    theme_day: "Nappal",
    theme_night: "Éjszaka",
  },
  sk: {
    title: "Obloha",
    title_option: "Názov (voliteľné)",
    phase_day: "Deň",
    phase_golden: "Zlatá hodinka",
    phase_blue: "Modrá hodinka",
    phase_night: "Noc",
    dawn: "Úsvit",
    sunrise: "Východ slnka",
    solar_noon: "Slnečné poludnie",
    sunset: "Západ slnka",
    dusk: "Súmrak",
    elevation: "Výška",
    azimuth: "Azimut",
    vs_yesterday: "{delta} oproti včerajšku",
    same_as_yesterday: "Rovnako ako včera",
    section_season: "Ročné obdobie",
    moon_new_moon: "Nov",
    moon_waxing_crescent: "Dorastajúci kosák",
    moon_first_quarter: "Prvá štvrť",
    moon_waxing_gibbous: "Dorastajúci mesiac",
    moon_full_moon: "Spln",
    moon_waning_gibbous: "Cúvajúci mesiac",
    moon_last_quarter: "Posledná štvrť",
    moon_waning_crescent: "Cúvajúci kosák",
    moon_lit: "Osvetlené {pct}",
    moonrise: "Východ mesiaca",
    moonset: "Západ mesiaca",
    next_full: "Spln",
    next_new: "Nov",
    computed: "Čiastočne vypočítané kartou",
    season_spring: "Jar",
    season_summer: "Leto",
    season_autumn: "Jeseň",
    season_winter: "Zima",
    event_spring: "Jarná rovnodennosť",
    event_summer: "Letný slnovrat",
    event_autumn: "Jesenná rovnodennosť",
    event_winter: "Zimný slnovrat",
    season_astronomical: "Astronomické (slnovraty a rovnodennosti)",
    season_meteorological: "Meteorologické (1. marca, júna, septembra, decembra)",
    no_location: "Žiadna entita sun.sun ani poloha domova: nastavte integráciu Slnko.",
    show_title: "Zobraziť názov",
    show_subtitle: "Zobraziť podnázov",
    show_sky: "Zobraziť oblohu",
    animations: "Animácie",
    season_type: "Typ ročného obdobia",
    language: "Jazyk",
    lang_auto: "Automaticky",
    next_golden: "Zlatá hodinka o {time}",
    next_sunset: "Západ slnka o {time}",
    next_sunrise: "Východ slnka o {time}",
    daylight_tile: "Denné svetlo",
    dawn_dusk: "Svitanie · súmrak",
    details: "Podrobnosti",
    details_option: "Sekcia podrobností",
    details_collapsed: "Zbalená",
    details_expanded: "Rozbalená",
    details_hidden: "Skrytá",
    show_tiles: "Zobraziť dlaždice",
    polar_day_short: "Polnočné slnko",
    polar_night_short: "Polárna noc",
    moon_age_label: "Vek Mesiaca",
    zoom: "Tlačidlo detailov",
    zoom_helper: "Tlačidlo vpravo hore, ktoré prepína mini kartu na úplnú kartu a späť",
    zoom_in: "Zobraziť úplnú kartu",
    zoom_out: "Zobraziť kompaktnú kartu",
    illustration: "Ilustrovaná hlavička",
    illustration_theme: "Téma ilustrácie",
    theme_auto: "Automaticky (slnko, potom tmavá téma)",
    theme_day: "Deň",
    theme_night: "Noc",
  },
  cs: {
    title: "Obloha",
    title_option: "Název (volitelné)",
    phase_day: "Den",
    phase_golden: "Zlatá hodinka",
    phase_blue: "Modrá hodinka",
    phase_night: "Noc",
    dawn: "Svítání",
    sunrise: "Východ slunce",
    solar_noon: "Sluneční poledne",
    sunset: "Západ slunce",
    dusk: "Soumrak",
    elevation: "Výška",
    azimuth: "Azimut",
    vs_yesterday: "{delta} oproti včerejšku",
    same_as_yesterday: "Stejně jako včera",
    section_season: "Roční období",
    moon_new_moon: "Nov",
    moon_waxing_crescent: "Dorůstající srpek",
    moon_first_quarter: "První čtvrť",
    moon_waxing_gibbous: "Dorůstající měsíc",
    moon_full_moon: "Úplněk",
    moon_waning_gibbous: "Couvající měsíc",
    moon_last_quarter: "Poslední čtvrť",
    moon_waning_crescent: "Couvající srpek",
    moon_lit: "Osvětleno {pct}",
    moonrise: "Východ měsíce",
    moonset: "Západ měsíce",
    next_full: "Úplněk",
    next_new: "Nov",
    computed: "Částečně vypočteno kartou",
    season_spring: "Jaro",
    season_summer: "Léto",
    season_autumn: "Podzim",
    season_winter: "Zima",
    event_spring: "Jarní rovnodennost",
    event_summer: "Letní slunovrat",
    event_autumn: "Podzimní rovnodennost",
    event_winter: "Zimní slunovrat",
    season_astronomical: "Astronomické (slunovraty a rovnodennosti)",
    season_meteorological: "Meteorologické (1. března, června, září, prosince)",
    no_location: "Žádná entita sun.sun ani poloha domova: nastavte integraci Slunce.",
    show_title: "Zobrazit název",
    show_subtitle: "Zobrazit podnázev",
    show_sky: "Zobrazit oblohu",
    animations: "Animace",
    season_type: "Typ ročního období",
    language: "Jazyk",
    lang_auto: "Automaticky",
    next_golden: "Zlatá hodinka v {time}",
    next_sunset: "Západ slunce v {time}",
    next_sunrise: "Východ slunce v {time}",
    daylight_tile: "Denní světlo",
    dawn_dusk: "Svítání · soumrak",
    details: "Podrobnosti",
    details_option: "Sekce podrobností",
    details_collapsed: "Sbalená",
    details_expanded: "Rozbalená",
    details_hidden: "Skrytá",
    show_tiles: "Zobrazit dlaždice",
    polar_day_short: "Půlnoční slunce",
    polar_night_short: "Polární noc",
    moon_age_label: "Stáří Měsíce",
    zoom: "Tlačítko detailu",
    zoom_helper: "Tlačítko vpravo nahoře, které přepíná mini kartu na úplnou kartu a zpět",
    zoom_in: "Zobrazit úplnou kartu",
    zoom_out: "Zobrazit kompaktní kartu",
    illustration: "Ilustrovaná hlavička",
    illustration_theme: "Motiv ilustrace",
    theme_auto: "Automaticky (slunce, pak tmavý motiv)",
    theme_day: "Den",
    theme_night: "Noc",
  },
  sl: {
    title: "Nebo",
    title_option: "Naslov (neobvezno)",
    phase_day: "Dan",
    phase_golden: "Zlata ura",
    phase_blue: "Modra ura",
    phase_night: "Noč",
    dawn: "Zora",
    sunrise: "Sončni vzhod",
    solar_noon: "Sončno poldne",
    sunset: "Sončni zahod",
    dusk: "Mrak",
    elevation: "Višina",
    azimuth: "Azimut",
    vs_yesterday: "{delta} glede na včeraj",
    same_as_yesterday: "Enako kot včeraj",
    section_season: "Letni čas",
    moon_new_moon: "Mlaj",
    moon_waxing_crescent: "Naraščajoči srp",
    moon_first_quarter: "Prvi krajec",
    moon_waxing_gibbous: "Naraščajoča luna",
    moon_full_moon: "Ščip",
    moon_waning_gibbous: "Pojemajoča luna",
    moon_last_quarter: "Zadnji krajec",
    moon_waning_crescent: "Pojemajoči srp",
    moon_lit: "Osvetljeno {pct}",
    moonrise: "Lunin vzhod",
    moonset: "Lunin zahod",
    next_full: "Ščip",
    next_new: "Mlaj",
    computed: "Delno izračunala kartica",
    season_spring: "Pomlad",
    season_summer: "Poletje",
    season_autumn: "Jesen",
    season_winter: "Zima",
    event_spring: "Spomladansko enakonočje",
    event_summer: "Poletni sončni obrat",
    event_autumn: "Jesensko enakonočje",
    event_winter: "Zimski sončni obrat",
    season_astronomical: "Astronomski (sončna obrata in enakonočji)",
    season_meteorological: "Meteorološki (1. marec, junij, september, december)",
    no_location: "Ni entitete sun.sun in lokacije doma: nastavite integracijo Sonce.",
    show_title: "Prikaži naslov",
    show_subtitle: "Prikaži podnaslov",
    show_sky: "Prikaži nebo",
    animations: "Animacije",
    season_type: "Vrsta letnega časa",
    language: "Jezik",
    lang_auto: "Samodejno",
    next_golden: "Zlata ura ob {time}",
    next_sunset: "Sončni zahod ob {time}",
    next_sunrise: "Sončni vzhod ob {time}",
    daylight_tile: "Dnevna svetloba",
    dawn_dusk: "Zora · mrak",
    details: "Podrobnosti",
    details_option: "Razdelek podrobnosti",
    details_collapsed: "Strnjen",
    details_expanded: "Razprt",
    details_hidden: "Skrit",
    show_tiles: "Prikaži ploščice",
    polar_day_short: "Polnočno sonce",
    polar_night_short: "Polarna noč",
    moon_age_label: "Starost Lune",
    zoom: "Gumb za podrobnosti",
    zoom_helper: "Gumb zgoraj desno, ki preklopi mini kartico na celotno kartico in nazaj",
    zoom_in: "Prikaži celotno kartico",
    zoom_out: "Prikaži kompaktno kartico",
    illustration: "Ilustrirana glava",
    illustration_theme: "Tema ilustracije",
    theme_auto: "Samodejno (sonce, nato temna tema)",
    theme_day: "Dan",
    theme_night: "Noč",
  },
  lv: {
    title: "Debesis",
    title_option: "Virsraksts (neobligāts)",
    phase_day: "Diena",
    phase_golden: "Zelta stunda",
    phase_blue: "Zilā stunda",
    phase_night: "Nakts",
    dawn: "Rītausma",
    sunrise: "Saullēkts",
    solar_noon: "Saules pusdienlaiks",
    sunset: "Saulriets",
    dusk: "Vakara krēsla",
    elevation: "Augstums",
    azimuth: "Azimuts",
    vs_yesterday: "{delta} salīdzinot ar vakardienu",
    same_as_yesterday: "Tāpat kā vakar",
    section_season: "Gadalaiks",
    moon_new_moon: "Jauns mēness",
    moon_waxing_crescent: "Augošs sirpis",
    moon_first_quarter: "Pirmais ceturksnis",
    moon_waxing_gibbous: "Augošs mēness",
    moon_full_moon: "Pilnmēness",
    moon_waning_gibbous: "Dilstošs mēness",
    moon_last_quarter: "Pēdējais ceturksnis",
    moon_waning_crescent: "Dilstošs sirpis",
    moon_lit: "Apgaismoti {pct}",
    moonrise: "Mēness lēkts",
    moonset: "Mēness riets",
    next_full: "Pilnmēness",
    next_new: "Jauns mēness",
    computed: "Daļēji aprēķinājusi kartīte",
    season_spring: "Pavasaris",
    season_summer: "Vasara",
    season_autumn: "Rudens",
    season_winter: "Ziema",
    event_spring: "Pavasara ekvinokcija",
    event_summer: "Vasaras saulgrieži",
    event_autumn: "Rudens ekvinokcija",
    event_winter: "Ziemas saulgrieži",
    season_astronomical: "Astronomisks (saulgrieži un ekvinokcijas)",
    season_meteorological: "Meteoroloģisks (1. marts, jūnijs, septembris, decembris)",
    no_location: "Nav sun.sun vienības un mājas atrašanās vietas: iestatiet integrāciju Saule.",
    show_title: "Rādīt virsrakstu",
    show_subtitle: "Rādīt apakšvirsrakstu",
    show_sky: "Rādīt debesis",
    animations: "Animācijas",
    season_type: "Gadalaika veids",
    language: "Valoda",
    lang_auto: "Automātiski",
    next_golden: "Zelta stunda {time}",
    next_sunset: "Saulriets {time}",
    next_sunrise: "Saullēkts {time}",
    daylight_tile: "Dienas gaisma",
    dawn_dusk: "Rītausma · krēsla",
    details: "Sīkāka informācija",
    details_option: "Sīkākas informācijas sadaļa",
    details_collapsed: "Sakļauta",
    details_expanded: "Izvērsta",
    details_hidden: "Paslēpta",
    show_tiles: "Rādīt flīzes",
    polar_day_short: "Pusnakts saule",
    polar_night_short: "Polārā nakts",
    moon_age_label: "Mēness vecums",
    zoom: "Detaļu poga",
    zoom_helper: "Poga augšējā labajā stūrī, kas pārslēdz mini kartīti uz pilno kartīti un atpakaļ",
    zoom_in: "Rādīt pilno kartīti",
    zoom_out: "Rādīt kompakto kartīti",
    illustration: "Ilustrēta galvene",
    illustration_theme: "Ilustrācijas motīvs",
    theme_auto: "Automātiski (saule, tad tumšais motīvs)",
    theme_day: "Diena",
    theme_night: "Nakts",
  },
  el: {
    title: "Ουρανός",
    title_option: "Τίτλος (προαιρετικός)",
    phase_day: "Μέρα",
    phase_golden: "Χρυσή ώρα",
    phase_blue: "Μπλε ώρα",
    phase_night: "Νύχτα",
    dawn: "Αυγή",
    sunrise: "Ανατολή",
    solar_noon: "Ηλιακό μεσημέρι",
    sunset: "Δύση",
    dusk: "Σούρουπο",
    elevation: "Ύψος",
    azimuth: "Αζιμούθιο",
    vs_yesterday: "{delta} σε σχέση με χθες",
    same_as_yesterday: "Όπως χθες",
    section_season: "Εποχή",
    moon_new_moon: "Νέα σελήνη",
    moon_waxing_crescent: "Αύξων μηνίσκος",
    moon_first_quarter: "Πρώτο τέταρτο",
    moon_waxing_gibbous: "Αύξουσα αμφίκυρτη",
    moon_full_moon: "Πανσέληνος",
    moon_waning_gibbous: "Φθίνουσα αμφίκυρτη",
    moon_last_quarter: "Τελευταίο τέταρτο",
    moon_waning_crescent: "Φθίνων μηνίσκος",
    moon_lit: "{pct} φωτισμένη",
    moonrise: "Ανατολή σελήνης",
    moonset: "Δύση σελήνης",
    next_full: "Πανσέληνος",
    next_new: "Νέα σελήνη",
    computed: "Εν μέρει υπολογισμένο από την κάρτα",
    season_spring: "Άνοιξη",
    season_summer: "Καλοκαίρι",
    season_autumn: "Φθινόπωρο",
    season_winter: "Χειμώνας",
    event_spring: "Εαρινή ισημερία",
    event_summer: "Θερινό ηλιοστάσιο",
    event_autumn: "Φθινοπωρινή ισημερία",
    event_winter: "Χειμερινό ηλιοστάσιο",
    season_astronomical: "Αστρονομική (ηλιοστάσια και ισημερίες)",
    season_meteorological: "Μετεωρολογική (1 Μαρτίου, Ιουνίου, Σεπτεμβρίου, Δεκεμβρίου)",
    no_location: "Δεν υπάρχει οντότητα sun.sun ούτε τοποθεσία σπιτιού: ρυθμίστε την ενσωμάτωση Ήλιος.",
    show_title: "Εμφάνιση τίτλου",
    show_subtitle: "Εμφάνιση υπότιτλου",
    show_sky: "Εμφάνιση ουρανού",
    animations: "Κινούμενα σχέδια",
    season_type: "Τύπος εποχής",
    language: "Γλώσσα",
    lang_auto: "Αυτόματη",
    next_golden: "Χρυσή ώρα στις {time}",
    next_sunset: "Δύση ηλίου στις {time}",
    next_sunrise: "Ανατολή ηλίου στις {time}",
    daylight_tile: "Φως ημέρας",
    dawn_dusk: "Αυγή · σούρουπο",
    details: "Λεπτομέρειες",
    details_option: "Ενότητα λεπτομερειών",
    details_collapsed: "Συμπτυγμένη",
    details_expanded: "Ανεπτυγμένη",
    details_hidden: "Κρυφή",
    show_tiles: "Εμφάνιση πλακιδίων",
    polar_day_short: "Ήλιος του μεσονυκτίου",
    polar_night_short: "Πολική νύχτα",
    moon_age_label: "Ηλικία της Σελήνης",
    zoom: "Κουμπί λεπτομερειών",
    zoom_helper: "Κουμπί πάνω δεξιά που αλλάζει τη μίνι κάρτα στην πλήρη κάρτα και πίσω",
    zoom_in: "Εμφάνιση πλήρους κάρτας",
    zoom_out: "Εμφάνιση συμπαγούς κάρτας",
    illustration: "Εικονογραφημένη κεφαλίδα",
    illustration_theme: "Θέμα εικονογράφησης",
    theme_auto: "Αυτόματο (ήλιος, μετά σκοτεινό θέμα)",
    theme_day: "Ημέρα",
    theme_night: "Νύχτα",
  },
};

// ---------------------------------------------------------------------------
// Icons (24 × 24): inner SVG markup
// ---------------------------------------------------------------------------

const ICONS = {
  sunrise: '<path d="M2 18h20v2H2zm5-1a5 5 0 0 1 10 0h-2a3 3 0 0 0-6 0zm5-15 4 4h-3v4h-2V6H8z"/>',
  sunset: '<path d="M2 18h20v2H2zm5-1a5 5 0 0 1 10 0h-2a3 3 0 0 0-6 0zm5-6-4-4h3V3h2v4h3z"/>',
  twilight: '<path d="M2 18h20v2H2zm4-1a6 6 0 0 1 12 0zM3.5 10.9l1.4-1.4 1.8 1.8-1.4 1.4zm17 0-1.4-1.4-1.8 1.8 1.4 1.4zM11 5h2v3.2h-2z"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M11 1.5h2v3h-2zm0 18h2v3h-2zM1.5 11h3v2h-3zm18 0h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4zM4.2 18.4l2.1-2.1 1.4 1.4-2.1 2.1zm12.1-12.1 2.1-2.1 1.4 1.4-2.1 2.1z"/>',
  moon: '<path d="M12.3 2.5a9.5 9.5 0 1 0 9.2 11.8A7.5 7.5 0 0 1 12.3 2.5z"/>',
  calendar: '<path fill-rule="evenodd" d="M6 2h2v2h8V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1zM5 9v11h14V9z"/>',
  chevron_down: '<path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/>',
  expand: '<path d="M10 21v-2H6.41l4.5-4.5-1.41-1.41-4.5 4.5V14H3v7zm4.5-10.09 4.5-4.5V10h2V3h-7v2h3.59l-4.5 4.5z"/>',
  collapse: '<path d="M19.5 3.09 15 7.59V4h-2v7h7V9h-3.59l4.5-4.5zM4 13v2h3.59l-4.5 4.5 1.41 1.41L9 16.41V20h2v-7z"/>',
};

// The dawn · dusk tile's icon: the half sun rising and setting on the horizon, its rays coming and going.
const TWILIGHT_ANIM =
  '<svg class="icon tw" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18h20v2H2z"/><path class="tw-sun" d="M6 17a6 6 0 0 1 12 0z"/>' +
  '<path class="tw-rays" d="M3.5 10.9l1.4-1.4 1.8 1.8-1.4 1.4zm17 0-1.4-1.4-1.8 1.8 1.4 1.4zM11 5h2v3.2h-2z"/></svg>';
const svgIcon = (name, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

// ---------------------------------------------------------------------------
// Astronomy
// ---------------------------------------------------------------------------

const RAD = Math.PI / 180;
const DAY_MS = 86400e3;
const SYNODIC = 29.530588853;
// Terrestrial time runs about 69 s ahead of universal time in the 2020s.
const TT_UT_DAYS = 69 / 86400;
const sinD = (d) => Math.sin(d * RAD);
const cosD = (d) => Math.cos(d * RAD);
const norm360 = (d) => ((d % 360) + 360) % 360;
const julian = (ms) => ms / DAY_MS + 2440587.5;
const fromJulian = (jd) => (jd - 2440587.5) * DAY_MS;

// Sun: declination and equation of time (minutes), NOAA's solar equations (Meeus, chapters 25 and 28).
function sunCoords(ms) {
  const T = (julian(ms) - 2451545) / 36525;
  const L0 = norm360(280.46646 + T * (36000.76983 + T * 0.0003032));
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = sinD(M) * (1.914602 - T * (0.004817 + 0.000014 * T)) + sinD(2 * M) * (0.019993 - 0.000101 * T) + sinD(3 * M) * 0.000289;
  const omega = 125.04 - 1934.136 * T;
  const lambda = L0 + C - 0.00569 - 0.00478 * sinD(omega);
  const eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * cosD(omega);
  const y = Math.tan((eps / 2) * RAD) ** 2;
  return {
    longitude: norm360(lambda),
    decl: Math.asin(sinD(eps) * sinD(lambda)) / RAD,
    eot: (4 / RAD) * (y * sinD(2 * L0) - 2 * e * sinD(M) + 4 * e * y * sinD(M) * cosD(2 * L0) - 0.5 * y * y * sinD(4 * L0) - 1.25 * e * e * sinD(2 * M)),
  };
}

// Elevation and azimuth of the sun, in degrees, seen from (lat, lon) at `ms` (no refraction).
function sunPosition(ms, lat, lon) {
  const { decl, eot } = sunCoords(ms);
  const minutes = (((ms % DAY_MS) + DAY_MS) % DAY_MS) / 60000;
  const ha = (minutes + eot + 4 * lon) / 4 - 180;
  const cz = Math.max(-1, Math.min(1, sinD(lat) * sinD(decl) + cosD(lat) * cosD(decl) * cosD(ha)));
  const elevation = 90 - Math.acos(cz) / RAD;
  const azimuth = norm360(Math.atan2(sinD(ha), cosD(ha) * sinD(lat) - Math.tan(decl * RAD) * cosD(lat)) / RAD + 180);
  return { elevation, azimuth };
}

// Moon: ecliptic longitude, latitude (degrees) and distance (km) with the main terms of Meeus' chapter 47.
function moonEcliptic(ms) {
  const T = (julian(ms) - 2451545) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const lon =
    Lp +
    6.288774 * sinD(Mp) +
    1.274027 * sinD(2 * D - Mp) +
    0.658314 * sinD(2 * D) +
    0.213618 * sinD(2 * Mp) -
    0.185116 * sinD(M) -
    0.114332 * sinD(2 * F) +
    0.058793 * sinD(2 * D - 2 * Mp) +
    0.057066 * sinD(2 * D - M - Mp) +
    0.053322 * sinD(2 * D + Mp) +
    0.045758 * sinD(2 * D - M) -
    0.040923 * sinD(M - Mp) -
    0.03472 * sinD(D) -
    0.030383 * sinD(M + Mp);
  const lat =
    5.128122 * sinD(F) + 0.280602 * sinD(Mp + F) + 0.277693 * sinD(Mp - F) + 0.173237 * sinD(2 * D - F) + 0.055413 * sinD(2 * D - Mp + F) + 0.046271 * sinD(2 * D - Mp - F);
  const dist = 385000.56 - 20905.355 * cosD(Mp) - 3699.111 * cosD(2 * D - Mp) - 2955.968 * cosD(2 * D) - 569.925 * cosD(2 * Mp);
  return { lon: norm360(lon), lat, dist, T };
}

// Illuminated fraction of the moon's disc (0–1), from the sun–moon elongation (Meeus, chapter 48).
function moonIllumination(ms) {
  const m = moonEcliptic(ms);
  const psi = Math.acos(cosD(m.lat) * cosD(m.lon - sunCoords(ms).longitude));
  const au = 149597870.7;
  const i = Math.atan2(au * Math.sin(psi), m.dist - au * Math.cos(psi));
  return (1 + Math.cos(i)) / 2;
}

// Geocentric altitude of the moon, in degrees; it rises and sets when it crosses +0.125° (parallax, refraction and
// half-diameter together).
function moonAltitude(ms, lat, lon) {
  const m = moonEcliptic(ms);
  const eps = 23.439291 - 0.0130042 * m.T;
  const ra = Math.atan2(sinD(m.lon) * cosD(eps) - Math.tan(m.lat * RAD) * sinD(eps), cosD(m.lon)) / RAD;
  const dec = Math.asin(sinD(m.lat) * cosD(eps) + cosD(m.lat) * sinD(eps) * sinD(m.lon)) / RAD;
  const gmst = 280.46061837 + 360.98564736629 * (julian(ms) - 2451545) + 0.000387933 * m.T * m.T;
  return Math.asin(sinD(lat) * sinD(dec) + cosD(lat) * cosD(dec) * cosD(gmst + lon - ra)) / RAD;
}

// Time of the new moon (k integer) or full moon (k + 0.5) number k counted from January 2000 (Meeus, chapter 49).
// [new moon coefficient, full moon coefficient, argument, power of E]
const PHASE_TERMS = [
  [-0.4072, -0.40614, "Mp", 0],
  [0.17241, 0.17302, "M", 1],
  [0.01608, 0.01614, "2Mp", 0],
  [0.01039, 0.01043, "2F", 0],
  [0.00739, 0.00734, "Mp-M", 1],
  [-0.00514, -0.00515, "Mp+M", 1],
  [0.00208, 0.00209, "2M", 2],
  [-0.00111, -0.00111, "Mp-2F", 0],
  [-0.00057, -0.00057, "Mp+2F", 0],
  [0.00056, 0.00056, "2Mp+M", 1],
  [-0.00042, -0.00042, "3Mp", 0],
  [0.00042, 0.00042, "M+2F", 1],
  [0.00038, 0.00038, "M-2F", 1],
  [-0.00024, -0.00024, "2Mp-M", 1],
  [-0.00017, -0.00017, "O", 0],
];
function moonPhaseTime(k) {
  const full = k % 1 !== 0;
  const T = k / 1236.85;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = 2.5534 + 29.1053567 * k - 0.0000014 * T * T;
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T ** 3;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T * T;
  const O = 124.7746 - 1.56375588 * k + 0.0020672 * T * T;
  const arg = {
    Mp,
    M,
    "2Mp": 2 * Mp,
    "2F": 2 * F,
    "Mp-M": Mp - M,
    "Mp+M": Mp + M,
    "2M": 2 * M,
    "Mp-2F": Mp - 2 * F,
    "Mp+2F": Mp + 2 * F,
    "2Mp+M": 2 * Mp + M,
    "3Mp": 3 * Mp,
    "M+2F": M + 2 * F,
    "M-2F": M - 2 * F,
    "2Mp-M": 2 * Mp - M,
    O,
  };
  for (const [a, b, name, e] of PHASE_TERMS) jde += (full ? b : a) * E ** e * sinD(arg[name]);
  return fromJulian(jde - TT_UT_DAYS);
}
const lunation = (ms) => Math.floor((julian(ms) - 2451550.09766) / 29.530588861);
// The next new (full = false) or full moon after `ms`, and the last new moon before it.
function nextMoonPhase(ms, full) {
  for (let k = lunation(ms) - 1 + (full ? 0.5 : 0); ; k++) {
    const t = moonPhaseTime(k);
    if (t > ms) return t;
  }
}
function lastNewMoon(ms) {
  for (let k = lunation(ms) + 1; ; k--) {
    const t = moonPhaseTime(k);
    if (t <= ms) return t;
  }
}

// Equinoxes and solstices (Meeus, chapter 27): event i of `year`, 0 March equinox, 1 June solstice, 2 September
// equinox, 3 December solstice. [A, B, C] periodic terms, then the mean values for the years 2000 to 3000.
const SEASON_TERMS = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];
const SEASON_MEAN = [
  [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
];
function solsticeEquinox(year, i) {
  const Y = (year - 2000) / 1000;
  const [a, b, c, d, e] = SEASON_MEAN[i];
  const jde0 = a + b * Y + c * Y * Y + d * Y ** 3 + e * Y ** 4;
  const T = (jde0 - 2451545) / 36525;
  const W = 35999.373 * T - 2.47;
  const dl = 1 + 0.0334 * cosD(W) + 0.0007 * cosD(2 * W);
  const S = SEASON_TERMS.reduce((s, [A, B, C]) => s + A * cosD(B + C * T), 0);
  return fromJulian(jde0 + (0.00001 * S) / dl - TT_UT_DAYS);
}

// The times `fn` (degrees over time) crosses `h0` between `start` and `end`: sampled every 10 minutes, each crossing
// then narrowed down to the second. { up: [ms], down: [ms] }
function crossings(fn, start, end, h0) {
  const step = 10 * 60e3;
  const up = [];
  const down = [];
  let t0 = start;
  let a0 = fn(t0) - h0;
  for (let t1 = start + step; t0 < end; t1 = Math.min(end, t1 + step)) {
    const a1 = fn(t1) - h0;
    if (a0 < 0 !== a1 < 0) {
      let lo = t0;
      let hi = t1;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (fn(mid) - h0 < 0 === a0 < 0) lo = mid;
        else hi = mid;
      }
      (a1 > a0 ? up : down).push(Math.round((lo + hi) / 2));
    }
    t0 = t1;
    a0 = a1;
  }
  return { up, down };
}

// Thresholds of the sun's elevation: sunrise and sunset (upper limb with refraction), civil twilight, the edge
// between the blue and golden hours, the top of the golden hour.
const H_HORIZON = -0.833;
const H_CIVIL = -6;
const H_BLUE = -4;
const H_GOLDEN = 6;

// The sun's day between `start` and `end` (a local day): events, golden and blue hours, the elevation curve.
function sunDay(start, end, lat, lon) {
  const elev = (t) => sunPosition(t, lat, lon).elevation;
  const at = (h) => crossings(elev, start, end, h);
  const rise = at(H_HORIZON);
  const civil = at(H_CIVIL);
  const golden = at(H_GOLDEN);
  const blue = at(H_BLUE);
  const curve = [];
  for (let i = 0; i <= 96; i++) {
    const t = start + ((end - start) * i) / 96;
    curve.push([t, elev(t)]);
  }
  // Solar noon: the highest sample, narrowed down by ternary search.
  let [noon] = curve.reduce((a, b) => (b[1] > a[1] ? b : a));
  let lo = noon - 20 * 60e3;
  let hi = noon + 20 * 60e3;
  for (let i = 0; i < 30; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (elev(m1) < elev(m2)) lo = m1;
    else hi = m2;
  }
  noon = Math.round((lo + hi) / 2);
  const sunrise = rise.up[0] ?? null;
  const sunset = rise.down.find((t) => !sunrise || t > sunrise) ?? rise.down[0] ?? null;
  const noonElevation = elev(noon);
  const polar = sunrise || sunset ? null : noonElevation > H_HORIZON ? "day" : "night";
  return {
    dawn: civil.up[0] ?? null,
    sunrise,
    noon,
    sunset,
    dusk: civil.down.find((t) => !sunset || t > sunset) ?? civil.down[0] ?? null,
    goldenAM: [blue.up[0] ?? null, golden.up[0] ?? null],
    goldenPM: [golden.down[0] ?? null, blue.down.find((t) => !sunset || t > sunset) ?? blue.down[0] ?? null],
    blueAM: [civil.up[0] ?? null, blue.up[0] ?? null],
    bluePM: [blue.down.find((t) => !sunset || t > sunset) ?? null, civil.down.find((t) => !sunset || t > sunset) ?? null],
    noonElevation,
    polar,
    daylight: sunrise && sunset ? sunset - sunrise : polar === "day" ? end - start : polar === "night" ? 0 : null,
    curve,
  };
}

// Moonrise and moonset of a local day (either may be missing: the moon rises about 50 minutes later each day).
function moonDay(start, end, lat, lon) {
  const c = crossings((t) => moonAltitude(t, lat, lon), start, end, 0.125);
  return { rise: c.up[0] ?? null, set: c.down[0] ?? null };
}

// The phase name of the Moon integration for a moon `age` days old, on its 0–28 scale: new, quarters and full last
// about a day each.
const MOON_PHASES = ["new_moon", "waxing_crescent", "first_quarter", "waxing_gibbous", "full_moon", "waning_gibbous", "last_quarter", "waning_crescent"];
const MOON_BOUNDS = [0.5, 6.5, 7.5, 13.5, 14.5, 20.5, 21.5, 27.5];
const phaseOfAge = (age) => {
  const d = (age / SYNODIC) * 28;
  const i = MOON_BOUNDS.findIndex((b) => d < b);
  return i < 0 ? "new_moon" : MOON_PHASES[i];
};

// ---------------------------------------------------------------------------
// Time zones
// ---------------------------------------------------------------------------

const PARTS_FMT = {};
const tzParts = (ms, tz) => {
  const f = (PARTS_FMT[tz || ""] ??= new Intl.DateTimeFormat("en-US", {
    timeZone: tz || undefined,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }));
  const o = {};
  for (const p of f.formatToParts(ms)) if (p.type !== "literal") o[p.type] = Number(p.value);
  return o;
};
// Offset of `tz` from UTC at `ms`, in milliseconds.
const tzOffset = (ms, tz) => {
  const p = tzParts(ms, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
};
// Midnight of the local day of `ms` in `tz` (DST included).
const dayStart = (ms, tz) => {
  const p = tzParts(ms, tz);
  const base = Date.UTC(p.year, p.month - 1, p.day);
  const first = base - tzOffset(base, tz);
  return base - tzOffset(first, tz);
};
const nextDay = (start, tz) => dayStart(start + 36 * 3600e3, tz);
const sameDay = (a, b, tz) => a !== null && b !== null && dayStart(a, tz) === dayStart(b, tz);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: Home Assistant's full locale (keeps its region) when its base matches the card language, else
// that language; a bare "pt" (European Portuguese for Home Assistant) becomes "pt-PT".
const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const valid = (s) => !!s && !["unknown", "unavailable", ""].includes(s.state);
const num = (v) => {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
};
const parseTime = (v) => {
  if (v === null || v === undefined || v === "" || v === "unknown" || v === "unavailable") return null;
  const ms = Date.parse(v);
  return Number.isFinite(ms) ? ms : null;
};

// The time zone of the displayed times: Home Assistant's own when the user profile asks for the server's, else the
// browser's (as everywhere in Home Assistant).
const timeZone = (hass) => (hass?.locale?.time_zone === "server" ? hass?.config?.time_zone || undefined : undefined);

const FMT = {};
const fmtCache = (key, make) => (FMT[key] ??= make());
const hour12 = (hass) => {
  const f = hass?.locale?.time_format;
  return f === "12" ? true : f === "24" ? false : undefined;
};
const fmtTime = (ms, L, tz, h12) =>
  ms === null || ms === undefined
    ? "—"
    : fmtCache(`t|${L}|${tz}|${h12}`, () => new Intl.DateTimeFormat(L, { hour: "2-digit", minute: "2-digit", hour12: h12, timeZone: tz })).format(ms);
const fmtDay = (ms, L, tz) =>
  fmtCache(`d|${L}|${tz}`, () => new Intl.DateTimeFormat(L, { weekday: "short", month: "short", day: "numeric", timeZone: tz })).format(ms);
const fmtUnit = (v, unit, L) => fmtCache(`u|${L}|${unit}`, () => new Intl.NumberFormat(L, { style: "unit", unit, unitDisplay: "short" })).format(v);
const fmtRelDays = (n, L) => fmtCache(`r|${L}`, () => new Intl.RelativeTimeFormat(L, { numeric: "auto" })).format(n, "day");
// Integer percentages, in the way of the language ("78%", "78 %").
const fmtPct = (v, L) => fmtCache(`p|${L}`, () => new Intl.NumberFormat(L, { style: "percent", maximumFractionDigits: 0 })).format(Math.round(v) / 100);
const fmtDeg = (v, L) => `${Math.round(v).toLocaleString(L)}°`;

// A length of daylight: "9 h 17 min".
const fmtHours = (ms, L) => {
  const min = Math.round(ms / 60000);
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return fmtUnit(m, "minute", L);
  return m ? `${fmtUnit(h, "hour", L)} ${fmtUnit(m, "minute", L)}` : fmtUnit(h, "hour", L);
};
// A change of the daylight: "+2 min 41 s", "−38 s".
const fmtDelta = (ms, L) => {
  const s = Math.round(Math.abs(ms) / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  const u = (v, unit) => fmtCache(`n|${L}|${unit}`, () => new Intl.NumberFormat(L, { style: "unit", unit, unitDisplay: "narrow" })).format(v);
  const body = m ? (r ? `${u(m, "minute")} ${u(r, "second")}` : u(m, "minute")) : u(r, "second");
  return `${ms < 0 ? "−" : "+"}${body}`;
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// ---------------------------------------------------------------------------
// Sources: the entities the card reads
// ---------------------------------------------------------------------------

// Entity keys that can be given by hand (`entities` option), each one replacing what the card finds itself.
const ENTITY_KEYS = ["sun", "moon_phase", "lunar_phase", "moonrise", "moonset", "illumination", "moon_age", "next_full_moon", "next_new_moon", "season"];

// Lunar Phase sensors: translation key, else the end of the entity id (`sensor.<location>_moon_rise`…).
const LUNAR_KEYS = {
  moonrise: [["moonrise", "moon_rise"], /_moon_?rise$/],
  moonset: [["moonset", "moon_set"], /_moon_?set$/],
  illumination: [["illumination_fraction", "illumination"], /_illumination(_fraction)?$/],
  moon_age: [["moon_age"], /_moon_age$/],
  next_full_moon: [["next_full_moon"], /_next_full_moon$/],
  next_new_moon: [["next_new_moon"], /_next_new_moon$/],
};

const _registry = new WeakMap();
// What the registries tell, once per registry object: the Sun, Moon and Season entities and the Lunar Phase sensors.
const scanRegistry = (hass) => {
  const reg = hass.entities;
  if (!reg || typeof reg !== "object") return { lunar: [] };
  if (_registry.has(reg)) return _registry.get(reg);
  const found = { lunar: [] };
  for (const e of Object.values(reg)) {
    const id = e?.entity_id;
    if (!id) continue;
    if (e.platform === "sun" && id.startsWith("sun.")) found.sun ??= id;
    else if (e.platform === "moon" && id.startsWith("sensor.")) found.moon_phase ??= id;
    else if (e.platform === "season" && id.startsWith("sensor.")) found.season ??= id;
    else if (e.platform === "lunar_phase" && id.startsWith("sensor.")) found.lunar.push(e);
  }
  _registry.set(reg, found);
  return found;
};

// The entity ids the card reads: { sun, moon_phase, lunar_phase, moonrise, … } (missing keys: not found).
const resolve = (hass, config) => {
  const st = hass.states || {};
  const reg = scanRegistry(hass);
  const out = {};
  const exists = (id) => !!id && !!st[id];
  out.sun = reg.sun || (exists("sun.sun") ? "sun.sun" : undefined);
  out.moon_phase = reg.moon_phase || ["sensor.moon_phase", "sensor.moon"].find((id) => MOON_PHASES.includes(st[id]?.state));
  out.season = reg.season || (exists("sensor.season") ? "sensor.season" : undefined);
  // Lunar Phase: its phase sensor carries everything as attributes; the separate sensors come next.
  for (const e of reg.lunar) {
    const s = st[e.entity_id];
    if (!out.lunar_phase && s?.attributes && "illumination_fraction" in s.attributes) out.lunar_phase = e.entity_id;
    for (const [key, [tks, re]] of Object.entries(LUNAR_KEYS)) {
      if (!out[key] && (tks.includes(e.translation_key) || re.test(e.entity_id))) out[key] = e.entity_id;
    }
  }
  const given = config?.entities || {};
  for (const key of ENTITY_KEYS) if (given[key]) out[key] = given[key];
  return out;
};

const homeLocation = (hass) => {
  const lat = num(hass?.config?.latitude);
  const lon = num(hass?.config?.longitude);
  return lat === null || lon === null ? null : { lat, lon };
};

// ---------------------------------------------------------------------------
// The model: everything a render shows, computed once per minute
// ---------------------------------------------------------------------------

// The light of the moment, from the sun's elevation: day above the golden hour, golden hour from +6° to −4°, blue
// hour from −4° to −6° (civil twilight's end), night below.
const phaseOf = (elevation) =>
  elevation === null ? "day" : elevation >= H_GOLDEN ? "day" : elevation >= H_BLUE ? "golden" : elevation >= H_CIVIL ? "blue" : "night";

const SEASONS = ["spring", "summer", "autumn", "winter"];
// Season starting at each event (March equinox, June solstice, September equinox, December solstice).
const SEASON_AT = { north: ["spring", "summer", "autumn", "winter"], south: ["autumn", "winter", "spring", "summer"] };

// The season boundaries around `now`: astronomical (solstices and equinoxes) or meteorological (1st of March,
// June, September and December, local midnight). { prev, next } of { at, season, index }.
function seasonBounds(now, tz, type, south) {
  const year = tzParts(now, tz).year;
  const list = [];
  for (let y = year - 1; y <= year + 1; y++) {
    for (let i = 0; i < 4; i++) {
      const at = type === "meteorological" ? dayStart(Date.UTC(y, 2 + 3 * i, 1, 12), tz) : solsticeEquinox(y, i);
      list.push({ at, index: i, season: SEASON_AT[south ? "south" : "north"][i] });
    }
  }
  list.sort((a, b) => a.at - b.at);
  const n = list.findIndex((e) => e.at > now);
  return { prev: list[n - 1], next: list[n] };
}

function skyModel(hass, config, now = Date.now()) {
  const ids = resolve(hass, config);
  const st = (id) => (id ? hass.states?.[id] : undefined);
  const loc = homeLocation(hass);
  const sunState = st(ids.sun);
  if (!loc && !sunState) return { error: "no_location" };
  const tz = timeZone(hass);
  const start = dayStart(now, tz);
  const end = nextDay(start, tz);
  const a = sunState?.attributes || {};

  // ── Sun ──
  const computed = loc ? sunDay(start, end, loc.lat, loc.lon) : null;
  const sun = { ...(computed || { goldenAM: [null, null], goldenPM: [null, null], blueAM: [null, null], bluePM: [null, null], curve: null }) };
  // Sun's own times win for today: they are Home Assistant's.
  for (const [key, attr] of [
    ["dawn", "next_dawn"],
    ["sunrise", "next_rising"],
    ["noon", "next_noon"],
    ["sunset", "next_setting"],
    ["dusk", "next_dusk"],
  ]) {
    const v = parseTime(a[attr]);
    if (v !== null && sameDay(v, now, tz)) sun[key] = v;
    else sun[key] ??= null;
  }
  if (!computed && sun.sunrise && sun.sunset) sun.daylight = sun.sunset - sun.sunrise;
  if (computed) {
    const yStart = dayStart(start - 12 * 3600e3, tz);
    const yesterday = sunDay(yStart, start, loc.lat, loc.lon);
    if (computed.daylight !== null && yesterday.daylight !== null && !computed.polar && !yesterday.polar) sun.delta = computed.daylight - yesterday.daylight;
    sun.yesterdaySunset = yesterday.sunset;
  }
  // Yesterday's sunset and tomorrow's sunrise frame the night; without a home location, sun.sun's next times a day
  // apart stand in for them.
  const tomorrow = loc ? sunDay(end, nextDay(end, tz), loc.lat, loc.lon) : null;
  const nextRising = parseTime(a.next_rising);
  const nextSetting = parseTime(a.next_setting);
  sun.tomorrowSunrise = tomorrow?.sunrise ?? (nextRising !== null && !sameDay(nextRising, now, tz) ? nextRising : sun.sunrise !== null ? sun.sunrise + DAY_MS : null);
  sun.yesterdaySunset = sun.yesterdaySunset ?? (sun.sunset !== null ? sun.sunset - DAY_MS : nextSetting !== null ? nextSetting - DAY_MS : null);
  const pos = loc ? sunPosition(now, loc.lat, loc.lon) : null;
  sun.elevation = num(a.elevation) ?? pos?.elevation ?? null;
  sun.azimuth = num(a.azimuth) ?? pos?.azimuth ?? null;
  // Drawn on the computed curve, so that the sun sits on its path.
  sun.drawnElevation = pos ? pos.elevation : sun.elevation;
  sun.start = start;
  sun.end = end;
  sun.entity = ids.sun;
  const phase = phaseOf(sun.elevation);
  sun.up = sun.elevation !== null ? sun.elevation > H_HORIZON : sunState ? sunState.state === "above_horizon" : true;
  // The arc of the sky band: today's path of the sun from sunrise to sunset by day, the night from sunset to
  // sunrise otherwise (the moon crossing it); none on a polar day or night.
  if (sun.sunrise !== null && sun.sunset !== null && now >= sun.sunrise && now <= sun.sunset) sun.arc = { mode: "day", from: sun.sunrise, to: sun.sunset };
  else if (sun.polar) sun.arc = null;
  else {
    const from = sun.sunset !== null && now > sun.sunset ? sun.sunset : sun.yesterdaySunset;
    const to = sun.sunrise !== null && now < sun.sunrise ? sun.sunrise : sun.tomorrowSunrise;
    sun.arc = from !== null && to !== null && to > from ? { mode: "night", from, to } : null;
  }
  if (sun.arc) sun.arc.progress = clamp((now - sun.arc.from) / (sun.arc.to - sun.arc.from), 0, 1);
  // The next event, for the subtitle: the first to come of the evening golden hour, the sunset and the next sunrise.
  sun.next =
    [
      [sun.goldenPM[0], "next_golden"],
      [sun.sunset, "next_sunset"],
      [sun.sunrise, "next_sunrise"],
      [sun.tomorrowSunrise, "next_sunrise"],
    ]
      .filter(([at]) => at !== null && at !== undefined && at > now)
      .sort((x, y) => x[0] - y[0])[0] || null;

  // ── Moon ──
  const lunar = st(ids.lunar_phase);
  const la = valid(lunar) ? lunar.attributes || {} : {};
  const sensor = (key) => (valid(st(ids[key])) ? st(ids[key]).state : undefined);
  const moonState = st(ids.moon_phase);
  const lastNew = lastNewMoon(now);
  const moon = { computed: [] };
  const illum = num(sensor("illumination") ?? la.illumination_fraction);
  moon.illumination = illum !== null ? clamp(illum / 100, 0, 1) : moonIllumination(now);
  if (illum === null) moon.computed.push("illumination");
  const age = num(sensor("moon_age") ?? la.moon_age);
  moon.age = age ?? (now - lastNew) / DAY_MS;
  if (age === null) moon.computed.push("age");
  const future = (v) => {
    const ms = parseTime(v);
    return ms !== null && ms > now - 60e3 ? ms : null;
  };
  moon.nextFull = future(sensor("next_full_moon") ?? la.next_full_moon);
  moon.nextNew = future(sensor("next_new_moon") ?? la.next_new_moon);
  if (moon.nextFull === null || moon.nextNew === null) moon.computed.push("next");
  moon.nextFull ??= nextMoonPhase(now, true);
  moon.nextNew ??= nextMoonPhase(now, false);
  const rise = parseTime(sensor("moonrise") ?? la.moonrise);
  const set = parseTime(sensor("moonset") ?? la.moonset);
  if (ids.moonrise || ids.moonset || "moonrise" in la || "moonset" in la) {
    moon.rise = rise;
    moon.set = set;
  } else if (loc) {
    Object.assign(moon, moonDay(start, end, loc.lat, loc.lon));
    moon.computed.push("times");
  } else {
    moon.rise = moon.set = null;
  }
  const named = [moonState, lunar].find((s) => valid(s) && MOON_PHASES.includes(s.state));
  moon.phase = named ? named.state : phaseOfAge(moon.age);
  if (!named) moon.computed.push("phase");
  // Waxing until the full moon: the full moon comes before the new one.
  moon.waxing = ["waxing_crescent", "first_quarter", "waxing_gibbous"].includes(moon.phase)
    ? true
    : ["waning_gibbous", "last_quarter", "waning_crescent"].includes(moon.phase)
      ? false
      : moon.nextFull < moon.nextNew;
  moon.entity = valid(lunar) ? ids.lunar_phase : valid(moonState) ? ids.moon_phase : undefined;
  moon.altitude = loc ? moonAltitude(now, loc.lat, loc.lon) : null;
  moon.up = moon.altitude !== null ? moon.altitude > 0.125 : moon.rise !== null && moon.set !== null && (moon.rise < moon.set ? now > moon.rise && now < moon.set : now > moon.rise || now < moon.set);
  // Seen from the southern hemisphere, the moon is lit on the other side.
  moon.flip = !!loc && loc.lat < 0;

  // ── Season ──
  const seasonState = st(ids.season);
  const type = config?.season_type === "meteorological" ? "meteorological" : "astronomical";
  const { prev, next } = seasonBounds(now, tz, type, !!loc && loc.lat < 0);
  const season = {
    key: valid(seasonState) && SEASONS.includes(seasonState.state) ? seasonState.state : prev.season,
    computed: !(valid(seasonState) && SEASONS.includes(seasonState.state)),
    entity: ids.season,
    type,
    next,
    days: Math.round((dayStart(next.at, tz) - start) / DAY_MS),
    day: Math.floor((now - prev.at) / DAY_MS) + 1,
    total: Math.round((next.at - prev.at) / DAY_MS),
    progress: clamp((now - prev.at) / (next.at - prev.at), 0, 1),
  };
  return { ids, loc, tz, now, sun, phase, moon, season };
}

// ---------------------------------------------------------------------------
// Pictures
// ---------------------------------------------------------------------------

// The lit part of the moon: a half disc on the lit side closed by the terminator, an ellipse whose half-width is
// |1 − 2k| r for an illuminated fraction k, bulging towards the lit side for a crescent and the dark side past the
// quarter. Waxing, the right side is lit seen from the northern hemisphere; `flip` mirrors it for the southern one.
function moonLitPath(cx, cy, r, k, waxing, flip) {
  if (k <= 0.004) return "";
  if (k >= 0.996) return `<circle class="lit" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const right = waxing !== flip;
  const rx = (Math.abs(1 - 2 * k) * r).toFixed(2);
  const outer = right ? 1 : 0;
  const term = k < 0.5 === right ? 0 : 1;
  return `<path class="lit" d="M${cx} ${cy - r}A${r} ${r} 0 0 ${outer} ${cx} ${cy + r}A${rx} ${r} 0 0 ${term} ${cx} ${cy - r}Z"/>`;
}

const CRATERS = [
  [-0.32, -0.3, 0.16],
  [0.28, -0.12, 0.12],
  [-0.05, 0.36, 0.2],
  [0.38, 0.38, 0.09],
  [-0.45, 0.12, 0.08],
];
// The moon as it looks today: a dark disc, its lit part and a few craters.
const moonDisc = (cx, cy, r, moon) =>
  `<g class="moon-disc"><circle class="dark" cx="${cx}" cy="${cy}" r="${r}"/>${moonLitPath(cx, cy, r, moon.illumination, moon.waxing, moon.flip)}${CRATERS.map(
    ([x, y, s]) => `<circle class="crater" cx="${(cx + x * r).toFixed(2)}" cy="${(cy + y * r).toFixed(2)}" r="${(s * r).toFixed(2)}"/>`,
  ).join("")}</g>`;

const moonSvg = (moon, cls = "") =>
  `<svg class="moon-pic ${cls}" viewBox="0 0 40 40" aria-hidden="true" style="--mg:${moon.illumination.toFixed(2)}"><circle class="m-glow" cx="20" cy="20" r="20"/>${moonDisc(20, 20, 17, moon)}</svg>`;

// Sky colors (top, middle, bottom) at a few elevations of the sun, blended in between: deep night, the blue hour,
// the golden hour around the horizon, then the day.
const SKY_STOPS = [
  [-12, ["#03061a", "#0a1233", "#18204a"]],
  [-6, ["#0b1640", "#1d2f6e", "#3c4f96"]],
  [-4, ["#1f3577", "#4a5ea8", "#9a7fb0"]],
  [0, ["#3a4f9a", "#c47a8e", "#ffb067"]],
  [6, ["#4f7fc8", "#e8a571", "#ffd59a"]],
  [12, ["#3f84d6", "#79b4ea", "#cfe9fb"]],
  [25, ["#2b6fca", "#5ea3e6", "#b8def9"]],
];
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbHex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
const skyColors = (elevation) => {
  const e = elevation ?? 25;
  const i = SKY_STOPS.findIndex(([at]) => e < at);
  if (i === 0) return SKY_STOPS[0][1];
  if (i < 0) return SKY_STOPS.at(-1)[1];
  const [a, ca] = SKY_STOPS[i - 1];
  const [b, cb] = SKY_STOPS[i];
  const k = (e - a) / (b - a);
  return ca.map((c, j) => rgbHex(hexRgb(c).map((v, n) => v + (hexRgb(cb[j])[n] - v) * k)));
};
// How bright the stars are: none while the sun is up, all of them once it is 10° under the horizon.
const starLight = (elevation) => (elevation === null ? 0 : clamp(-elevation / 10, 0, 1));

const STARS = [
  [22, 16, 1],
  [46, 38, 0.7],
  [74, 12, 0.9],
  [102, 30, 0.6],
  [128, 10, 1.1],
  [154, 34, 0.7],
  [184, 18, 0.9],
  [212, 42, 0.6],
  [238, 12, 0.8],
  [268, 32, 1],
  [296, 14, 0.7],
  [62, 58, 0.5],
  [226, 62, 0.5],
  [146, 56, 0.6],
  [304, 52, 0.5],
  [12, 50, 0.6],
];
const STAR = "M0 -3L.8 -.8L3 0L.8 .8L0 3L-.8 .8L-3 0L-.8 -.8Z";
const starsSvg = (list, opacity) =>
  opacity > 0
    ? `<g class="stars" opacity="${opacity.toFixed(2)}">${list.map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="star" d="${STAR}"/></g>`).join("")}</g>`
    : "";
const skyGradient = (id, elevation) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${skyColors(elevation)
    .map((c, i) => `<stop offset="${[0, 0.55, 1][i]}" style="stop-color:${c}"/>`)
    .join("")}</linearGradient>`;

// The band: 320 × 116, horizon at HY, the arc from X0 to X1 rising to ARC_TOP at its highest.
const W = 320;
const H = 116;
const HY = 88;
const X0 = 26;
const X1 = 294;
const ARC_TOP = 20;
const f1 = (v) => v.toFixed(1);

// Points of the arc, `n` steps from its start to `upTo` (0–1) of its length in time. By day the height follows the
// sun's real elevation, scaled to its highest of the day; by night, and without a home location, a plain arch.
function arcPoints(m, upTo = 1, n = 48) {
  const { arc } = m.sun;
  const span = arc.to - arc.from;
  const real = arc.mode === "day" && m.loc;
  const elev = (t) => sunPosition(t, m.loc.lat, m.loc.lon).elevation;
  const peak = real ? Math.max(1, elev(m.sun.noon ?? (arc.from + arc.to) / 2)) : 1;
  const pts = [];
  const steps = Math.max(1, Math.round(n * upTo));
  for (let i = 0; i <= steps; i++) {
    const k = (upTo * i) / steps;
    const h = real ? clamp((elev(arc.from + span * k) - H_HORIZON) / (peak - H_HORIZON), 0, 1) : Math.sin(Math.PI * k);
    pts.push([X0 + (X1 - X0) * k, HY - (HY - ARC_TOP) * h]);
  }
  return pts;
}
const pathOf = (pts) => `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}`;

// The sun's disc (rays by day, low and orange in the golden hour) or the moon with its phase, drawn around 0 0.
// `sfx` ends the gradients' ids: the header's scene has its own, apart from the band's.
const sunBody = (phase, sfx = "") =>
  `<circle class="glow" r="${phase === "day" ? 20 : 26}" fill="url(#sk-glow${sfx})"/>` +
  (phase === "day"
    ? `<g class="rays">${Array.from({ length: 8 }, (_, i) => {
        const an = (i * Math.PI) / 4;
        const p = (k) => `${(8 * k * Math.cos(an)).toFixed(2)} ${(8 * k * Math.sin(an)).toFixed(2)}`;
        return `<path d="M${p(1.4)}L${p(1.85)}"/>`;
      }).join("")}</g>`
    : "") +
  `<circle class="sun-disc" r="8" fill="url(#${phase === "day" ? "sk-sun" : "sk-sunlow"}${sfx})"/>`;
const moonBody = (moon, sfx = "") => `<circle class="halo" r="20" fill="url(#sk-halo${sfx})"/>${moonDisc(0, 0, 9, moon)}`;

const bandDefs = (sfx = "") =>
  `<radialGradient id="sk-sun${sfx}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffd54f"/><stop offset="1" stop-color="#ffa000"/></radialGradient>` +
  `<radialGradient id="sk-sunlow${sfx}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff1c1"/><stop offset=".5" stop-color="#ffb74d"/><stop offset="1" stop-color="#f4511e"/></radialGradient>` +
  `<radialGradient id="sk-glow${sfx}"><stop offset=".35" stop-color="#ffd54f" stop-opacity=".55"/><stop offset="1" stop-color="#ffd54f" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="sk-horizon${sfx}"><stop offset="0" stop-color="#ffcc80" stop-opacity=".8"/><stop offset="1" stop-color="#ff8a65" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="sk-halo${sfx}"><stop offset=".45" stop-color="#fff9c4" stop-opacity=".35"/><stop offset="1" stop-color="#fff9c4" stop-opacity="0"/></radialGradient>`;

// The sky band: its colors follow the sun's elevation, the arc of the day (or of the night) inside it, dashed from
// end to end and solid up to now, the sun (or the moon) where it is, stars by night, clouds drifting by day.
function bandSvg(m, still) {
  const { sun, moon, phase } = m;
  const arc = sun.arc;
  const e = sun.elevation;
  const night = arc ? arc.mode === "night" : !sun.up;
  let curve = "";
  let body = "";
  if (arc) {
    const done = arcPoints(m, arc.progress);
    const [x, y] = done.at(-1);
    curve =
      `<path class="arc" d="${pathOf(arcPoints(m))}"/>` +
      (arc.progress > 0.002 ? `<path class="arc done" pathLength="1" d="${pathOf(done)}"/>` : "") +
      `<circle class="end" cx="${X0}" cy="${HY}" r="2.2"/><circle class="end" cx="${X1}" cy="${HY}" r="2.2"/>`;
    // The body travels the solid part of the arc (CSS offset-path): it slides to where it is when the card appears.
    body = `<g class="body ${night ? "moon" : "sun"}" data-x="${f1(x)}" data-y="${f1(y)}" style="offset-path:path('${pathOf(done)}')">${night ? moonBody(moon) : sunBody(phase)}</g>`;
  } else {
    // Polar day or night: the sun or the moon high in the middle of the band.
    body = `<g class="body still-body" transform="translate(${W / 2} ${ARC_TOP + 16})">${night ? moonBody(moon) : sunBody(phase)}</g>`;
  }
  const clouds =
    phase === "day"
      ? '<g class="clouds"><g class="cloud"><ellipse cx="78" cy="40" rx="20" ry="5.5"/><ellipse cx="88" cy="36" rx="11" ry="6.5"/></g>' +
        '<g class="cloud late"><ellipse cx="236" cy="56" rx="22" ry="5.5"/><ellipse cx="226" cy="52" rx="11" ry="6"/></g></g>'
      : "";
  const gx = arc ? (night ? (arc.progress < 0.5 ? X0 : X1) : X0 + (X1 - X0) * arc.progress) : W / 2;
  const glow = phase === "golden" || phase === "blue" ? `<ellipse class="horizon-glow" cx="${f1(gx)}" cy="${HY}" rx="110" ry="36" fill="url(#sk-horizon)"/>` : "";
  const shooting = phase === "night" ? '<path class="shooting" d="M250 10L214 32"/>' : "";
  // A flock of birds crossing the day sky now and then.
  const bird = (x, y, late) => `<g transform="translate(${x} ${y})"><path class="bird${late ? " late" : ""}" d="M-3 0Q-1.5 -2 0 0Q1.5 -2 3 0"/></g>`;
  const birds = phase === "day" ? `<g class="birds">${bird(0, 0)}${bird(-9, 4, 1)}${bird(-7, -5, 1)}</g>` : "";
  // In the golden hour: clouds tinted by the low sun and its reflection rippling on the ground under it.
  const goldenClouds =
    phase === "golden"
      ? '<g class="clouds golden"><g class="cloud"><ellipse cx="96" cy="34" rx="22" ry="4.5"/><ellipse cx="104" cy="30" rx="10" ry="5"/></g>' +
        '<g class="cloud late"><ellipse cx="214" cy="48" rx="18" ry="4"/></g></g>'
      : "";
  const reflect =
    phase === "golden" && !night
      ? `<g class="reflect"><ellipse cx="${f1(gx)}" cy="${HY + 6}" rx="16" ry="1.4"/><ellipse class="late" cx="${f1(gx)}" cy="${HY + 12}" rx="10" ry="1.1"/></g>`
      : "";
  // In the blue hour: the evening (or morning) star shining over the horizon on the sun's side.
  const vx = gx < W / 2 ? gx + 56 : gx - 56;
  const star = phase === "blue" ? `<g class="evening-star" transform="translate(${f1(vx)} ${HY - 12})"><circle class="v-glow" r="5"/><circle r="1.6"/></g>` : "";
  // At night: a thin veil of cloud slowly passing.
  const veil = phase === "night" ? '<g class="veil"><ellipse cx="120" cy="46" rx="46" ry="2.2"/><ellipse cx="146" cy="50" rx="30" ry="1.6"/></g>' : "";
  return (
    `<svg class="band-svg p-${phase}${still ? " still" : ""}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">` +
    `<defs>${skyGradient("sk-sky", e)}${bandDefs()}<clipPath id="sk-above"><rect width="${W}" height="${HY}"/></clipPath></defs>` +
    `<rect class="sky-fill" width="${W}" height="${H}" fill="url(#sk-sky)"/>${starsSvg(STARS, starLight(e))}${shooting}${star}${veil}${clouds}${goldenClouds}${birds}${glow}` +
    `<rect class="ground" y="${HY}" width="${W}" height="${H - HY}"/><path class="horizon" d="M0 ${HY}H${W}"/>${reflect}` +
    `${curve}<g clip-path="url(#sk-above)">${body}</g></svg>`
  );
}

// The mini card's strip: the same sky in a thin band, the day (or night) as a line and the sun (or moon) on it,
// drawn in HTML so that the discs stay round whatever the card's width.
function stripHtml(m, still) {
  const { sun, moon, phase } = m;
  const arc = sun.arc;
  const night = arc ? arc.mode === "night" : !sun.up;
  const p = arc ? arc.progress : 0.5;
  const [c0, c1, c2] = skyColors(sun.elevation);
  const at = `left:calc(10px + (100% - 20px) * ${p.toFixed(4)})`;
  const dot = night
    ? `<svg class="dot-body moon" viewBox="-8 -8 16 16" style="${at}">${moonDisc(0, 0, 7, moon)}</svg>`
    : `<svg class="dot-body sun" viewBox="-8 -8 16 16" style="${at}"><circle r="7" fill="url(#sk-strip-sun)"/><defs><radialGradient id="sk-strip-sun" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe6"/><stop offset=".55" stop-color="#ffd54f"/><stop offset="1" stop-color="${phase === "day" ? "#ffa000" : "#f4511e"}"/></radialGradient></defs></svg>`;
  const stars = starsSvg(
    [
      [30, 7, 0.6],
      [70, 16, 0.5],
      [110, 6, 0.7],
      [150, 15, 0.5],
      [182, 8, 0.6],
    ],
    starLight(sun.elevation),
  );
  return (
    `<div class="strip p-${phase}${still ? " still" : ""}" style="background:linear-gradient(180deg, ${c0}, ${c1} 55%, ${c2})">` +
    (stars ? `<svg class="strip-stars" viewBox="0 0 200 24" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${stars}</svg>` : "") +
    `<span class="track"></span>${arc ? `<span class="track done" style="width:calc((100% - 20px) * ${p.toFixed(4)})"></span>` : ""}${dot}</div>`
  );
}
// ---------------------------------------------------------------------------
// The illustrated header
// ---------------------------------------------------------------------------

// A 200 × 80 scene at the right of the 90 px header, standing on its 10 px lawn strip: the arc of the day (or of the
// night), the sun (or the moon in its phase) where it is on it, setting behind the hills; and the band's own touches
// by phase: clouds and birds by day, tinted clouds and the horizon's glow in the golden hour, the evening star in the
// blue hour, stars, a shooting star and a veil of cloud at night. `uid` keeps each card's gradient ids apart.
const HS_ARC = [
  [20, 74],
  [100, -6],
  [180, 74],
];
const HS_STARS = [
  [12, 8, 0.45],
  [44, 18, 0.35],
  [96, 6, 0.45],
  [132, 24, 0.3],
  [168, 10, 0.45],
  [190, 30, 0.35],
  [70, 30, 0.3],
  [150, 42, 0.3],
];
const qPoint = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
function headerScene(m, uid, still) {
  const { sun, moon, phase } = m;
  const arc = sun.arc;
  const night = arc ? arc.mode === "night" : !sun.up;
  const sfx = `-h${uid}`;
  const [[x0, y0], [cx, cy], [x2, y2]] = HS_ARC;
  const t = arc ? clamp(arc.progress, 0, 1) : 0.5;
  // The arc up to now: the curve cut at `t` (de Casteljau), the path the body travels as in the band.
  const x = qPoint(t, x0, cx, x2);
  const y = qPoint(t, y0, cy, y2);
  const done = `M${x0} ${y0}Q${f1(x0 + (cx - x0) * t)} ${f1(y0 + (cy - y0) * t)} ${f1(x)} ${f1(y)}`;
  const inner = `<g transform="scale(${night ? 0.85 : 0.72})">${night ? moonBody(moon, sfx) : sunBody(phase, sfx)}</g>`;
  const body = arc
    ? `<g class="body ${night ? "moon" : "sun"}" style="offset-path:path('${done}')">${inner}</g>`
    : `<g class="body still-body" transform="translate(100 30)">${inner}</g>`;
  const stars = starsSvg(HS_STARS, sun.up ? 0 : Math.max(0.45, starLight(sun.elevation)));
  const cloud = (cx1, cy1, s, late) =>
    `<g transform="translate(${cx1} ${cy1}) scale(${s})"><g class="cloud${late ? " late" : ""}"><ellipse cx="0" cy="4" rx="14" ry="4"/><ellipse cx="6" cy="0" rx="8" ry="4.8"/></g></g>`;
  const clouds = phase === "day" ? `<g class="clouds">${cloud(56, 18, 0.9)}${cloud(150, 30, 0.7, 1)}</g>` : phase === "golden" ? `<g class="clouds golden">${cloud(64, 22, 0.9)}${cloud(146, 34, 0.7, 1)}</g>` : "";
  const bird = (bx, by, late) => `<g transform="translate(${bx} ${by})"><path class="bird${late ? " late" : ""}" d="M-3 0Q-1.5 -2 0 0Q1.5 -2 3 0"/></g>`;
  const birds = phase === "day" ? `<g class="birds">${bird(0, 0)}${bird(-9, 4, 1)}${bird(-7, -5, 1)}</g>` : "";
  const glow = phase === "golden" || phase === "blue" ? `<ellipse class="horizon-glow" cx="${f1(clamp(night ? (t < 0.5 ? x0 : x2) : x, 64, 136))}" cy="74" rx="64" ry="26" fill="url(#sk-horizon${sfx})"/>` : "";
  const vx = x < 100 ? x + 44 : x - 44;
  const star = phase === "blue" ? `<g class="evening-star" transform="translate(${f1(vx)} 52)"><circle class="v-glow" r="4"/><circle r="1.3"/></g>` : "";
  const nightSky = phase === "night" ? '<path class="shooting" d="M176 6L148 22"/><g class="veil"><ellipse cx="80" cy="40" rx="34" ry="1.8"/><ellipse cx="100" cy="44" rx="22" ry="1.3"/></g>' : "";
  return (
    `<svg class="hs-svg p-${phase}${still ? " still" : ""}" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">` +
    `<defs>${bandDefs(sfx)}</defs>${stars}${nightSky}${star}${clouds}${birds}${glow}` +
    `<path class="hs-arc" d="M${x0} ${y0}Q${cx} ${cy} ${x2} ${y2}"/>${arc && t > 0.002 ? `<path class="hs-arc done" d="${done}"/>` : ""}${body}` +
    '<path class="hs-hill far" d="M0,80 C30,70 60,64 100,66 C140,68 170,60 200,62 L200,80Z"/>' +
    '<g class="hs-peaks"><path d="M120 74l8 -12l8 12z"/><path d="M134 74l10 -16l10 16z"/></g>' +
    '<path class="hs-hill" d="M0,80 C40,74 90,75 200,72 L200,80Z"/></svg>'
  );
}

// The season's own picture: a flower swaying in spring, the summer sun's turning rays, leaves falling in autumn, a
// turning snowflake and falling snow in winter.
const SEASON_ART = {
  spring:
    '<path class="stem" d="M24 44V24"/><path class="leaf-s" d="M24 36c-6 0-9-3-10-7 5 0 9 2 10 7z"/>' +
    `<g class="flower">${[0, 72, 144, 216, 288].map((r) => `<ellipse class="petal" cx="24" cy="11.5" rx="4.2" ry="6.5" transform="rotate(${r} 24 18)"/>`).join("")}<circle class="heart" cx="24" cy="18" r="3.6"/></g>`,
  summer: `<circle class="s-glow" cx="24" cy="24" r="20"/><g class="s-rays">${Array.from({ length: 8 }, (_, i) => `<path d="M24 4.5V10" transform="rotate(${i * 45} 24 24)"/>`).join("")}</g><circle class="s-disc" cx="24" cy="24" r="10"/>`,
  autumn:
    '<g class="big-leaf"><path class="leaf-a" d="M24 6c9 7 13 15 8 23-2 3-5 5-8 5s-6-2-8-5c-5-8-1-16 8-23z"/><path class="vein" d="M24 12v28"/></g>' +
    '<path class="leaf-a fall" d="M10 6c3 2 4 5 2 8-1 1-2 1-3 1s-2-1-2-2c-1-3 0-5 3-7z"/><path class="leaf-a fall late" d="M38 10c3 2 4 5 2 8-1 1-2 1-3 1s-2-1-2-2c-1-3 0-5 3-7z"/>',
  winter: `<g class="flake">${Array.from({ length: 6 }, (_, i) => `<path d="M24 8V40M24 13l-4-4M24 13l4-4M24 35l-4 4M24 35l4 4" transform="rotate(${i * 30} 24 24)"/>`).join("")}</g>${[8, 18, 32, 41]
    .map((x, i) => `<circle class="snow${i % 2 ? " late" : ""}" cx="${x}" cy="${4 + (i % 3) * 3}" r="1.6"/>`)
    .join("")}`,
};
const seasonSvg = (key, still) => `<svg class="season-pic s-${key}${still ? " still" : ""}" viewBox="0 0 48 48" aria-hidden="true">${SEASON_ART[key] || SEASON_ART.spring}</svg>`;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const BASE_STYLE = `
  :host { --sk-accent: #ffa000; --sk-day: #f5a623; --sk-golden: #ff7a1a; --sk-blue: #3d6fe0; --sk-night: #5c6bc0;
          --sk-idle: var(--disabled-text-color, #9e9e9e); }
  ha-card { overflow: hidden; container-type: inline-size; }
  :host { display: block; min-width: 0; --sk-natural-width: 400px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--sk-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--sk-accent)); outline-offset: 2px; border-radius: 6px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .ph-day { --c: var(--sk-day); } .ph-golden { --c: var(--sk-golden); } .ph-blue { --c: var(--sk-blue); } .ph-night { --c: var(--sk-night); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c) 15%, transparent); color: color-mix(in srgb, var(--c) 50%, var(--primary-text-color));
          flex: none; box-sizing: border-box; transition: background-color .6s ease, color .6s ease; }
  .chip-text { white-space: nowrap; }
  .header { display: flex; align-items: flex-start; gap: 10px; padding: 12px 12px 0; min-width: 0; }
  .header > .chip { margin-top: 11px; }
  .header > .zoom { margin-top: 8px; }
  .header:has(.sub) > .chip { margin-top: 3px; }
  .header:has(.sub) > .zoom { margin-top: 1px; }
  .titles { flex: 1 1 0; min-width: 0; min-height: 40px; display: flex; flex-direction: column; justify-content: center; }
  :host([hide-title]) .titles > .name { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; line-height: 15px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .type-icon { position: relative; display: flex; flex: none; width: 40px; height: 40px; border-radius: 50%; align-items: center; justify-content: center;
               background: color-mix(in srgb, var(--c, var(--sk-accent)) 16%, transparent); transition: background-color .6s ease; }
  .type-icon .icon { width: 24px; height: 24px; fill: color-mix(in srgb, var(--c, var(--sk-accent)) 75%, var(--primary-text-color)); }
  .icon.a-sun { animation: sk-spin 6s linear infinite; }
  .icon.a-moon { animation: sk-rock 6s ease-in-out infinite; }
  @keyframes sk-rock { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
  .warning { padding: 16px; color: color-mix(in srgb, var(--sk-golden) 50%, var(--primary-text-color)); }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin-right: -4px; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--sk-idle) 10%, transparent); border: 1px solid color-mix(in srgb, var(--sk-idle) 25%, transparent); }
  .zoom .icon { width: 14px; height: 14px; }
  .zoom:hover { background: color-mix(in srgb, var(--sk-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--sk-accent)); outline-offset: 1px; }
  .moon-pic { width: 100%; height: 100%; overflow: visible; }
  .moon-disc .dark { fill: #3a3e52; }
  .moon-disc .lit { fill: #fdf3c8; }
  .moon-disc .crater { fill: #1b1e2c; opacity: .14; }
  .moon-pic .m-glow { fill: #fdf3c8; opacity: calc(var(--mg, 1) * .1); animation: sk-moonglow 3s ease-in-out infinite; }
  @keyframes sk-moonglow { 0%, 100% { opacity: calc(var(--mg, 1) * .1); } 50% { opacity: calc(var(--mg, 1) * .4); } }
  .stars .star { fill: #fffde7; transform-box: fill-box; transform-origin: center; animation: sk-twinkle 3s ease-in-out infinite; }
  .stars g:nth-child(3n) .star { animation-delay: -1s; }
  .stars g:nth-child(3n+1) .star { animation-delay: -2s; }
  .stars { transition: opacity 2s ease; }
  @keyframes sk-twinkle { 0%, 100% { opacity: .35; transform: scale(.7); } 50% { opacity: 1; transform: scale(1.1); } }
  .still *, .still { animation: none !important; }
  /* Narrow cards: the pill keeps its dot only, its label stays in its tooltip, so that it never leaves the card. */
  @container (max-width: 280px) {
    .chip { padding: 4px; }
    .chip-text { display: none; }
    .header { gap: 6px; }
    .header > .chip { margin-top: 14px; }
    .header:has(.sub) > .chip { margin-top: 6px; }
  }
`;

const BAND_STYLE = `
  .band { position: relative; border-radius: 16px; overflow: hidden; line-height: 0; background: #0b1230; }
  .band-svg { display: block; width: 100%; height: auto; aspect-ratio: ${W} / ${H}; }
  .band-svg stop { transition: stop-color 2s ease; }
  .band .corner { position: absolute; bottom: 6px; display: inline-flex; align-items: center; gap: 3px; line-height: 1.2;
                  font-size: 12px; font-weight: 500; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.45); white-space: nowrap; }
  .band .corner .icon { width: 15px; height: 15px; color: #ffd27a; filter: drop-shadow(0 1px 1px rgba(0,0,0,.35)); }
  .band .corner.left { left: 10px; } .band .corner.right { right: 10px; }
  .band-svg .ground { fill: #000; opacity: .18; }
  .band-svg .horizon { stroke: rgba(255,255,255,.35); stroke-width: 1; }
  .band-svg .arc { fill: none; stroke: rgba(255,255,255,.55); stroke-width: 1.4; stroke-dasharray: 3 4; stroke-linecap: round; }
  .band-svg .arc.done { stroke: #fff3c4; stroke-width: 2.4; stroke-dasharray: 1; stroke-dashoffset: 0; opacity: .95;
                        animation: sk-draw 1.6s cubic-bezier(.3, .1, .3, 1) both; }
  .band-svg.p-night .arc.done, .band-svg.p-blue .arc.done { stroke: #c9d6ff; }
  .band-svg .end { fill: rgba(255,255,255,.7); }
  :is(.band-svg, .hs-svg) .body { offset-distance: 100%; offset-rotate: 0deg; animation: sk-travel 1.6s cubic-bezier(.3, .1, .3, 1) both; }
  :is(.band-svg, .hs-svg) .body.still-body { animation: none; }
  :is(.band-svg, .hs-svg) .glow { transform-box: fill-box; transform-origin: center; animation: sk-breathe 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .rays path { stroke: #ffd54f; stroke-width: 2.2; stroke-linecap: round; }
  :is(.band-svg, .hs-svg) .rays { animation: sk-spin 6s linear infinite; }
  :is(.band-svg, .hs-svg) .halo { animation: sk-halo 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .cloud { fill: #fff; opacity: .75; animation: sk-drift 6s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .cloud.late { animation-delay: -3s; }
  :is(.band-svg, .hs-svg) .golden .cloud { fill: #ffc9a3; opacity: .7; }
  :is(.band-svg, .hs-svg) .birds { transform: translate(-40px, 52px); animation: sk-fly 12s linear infinite; }
  :is(.band-svg, .hs-svg) .bird { fill: none; stroke: #2a3a5a; stroke-width: 1; stroke-linecap: round; opacity: .6;
                    transform-box: fill-box; transform-origin: center bottom; animation: sk-flap .5s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .bird.late { animation-delay: -.25s; }
  :is(.band-svg, .hs-svg) .reflect ellipse { fill: #ffcc80; opacity: .6; transform-box: fill-box; transform-origin: center; animation: sk-ripple 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .reflect .late { animation-delay: -1.5s; }
  :is(.band-svg, .hs-svg) .evening-star circle { fill: #fffde7; }
  :is(.band-svg, .hs-svg) .evening-star .v-glow { opacity: .25; transform-box: fill-box; transform-origin: center; animation: sk-breathe 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .veil ellipse { fill: #c9d6ff; opacity: .16; animation: sk-veil 6s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .horizon-glow { animation: sk-shimmer 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .shooting { fill: none; stroke: #fffde7; stroke-width: 1.4; stroke-linecap: round; stroke-dasharray: 10 60; stroke-dashoffset: 70;
                        animation: sk-shoot 6s linear infinite; }
  @keyframes sk-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes sk-travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }
  @keyframes sk-breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.82); opacity: .7; } }
  @keyframes sk-spin { to { transform: rotate(45deg); } }
  @keyframes sk-halo { 0%, 100% { opacity: .7; } 50% { opacity: 1; } }
  @keyframes sk-drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
  @keyframes sk-fly { 0% { transform: translate(-20px, 52px); } 50% { transform: translate(340px, 36px); } 100% { transform: translate(340px, 36px); } }
  @keyframes sk-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(-.4); } }
  @keyframes sk-ripple { 0%, 100% { transform: scaleX(.75); opacity: .35; } 50% { transform: scaleX(1.15); opacity: .7; } }
  @keyframes sk-veil { 0%, 100% { transform: translateX(-24px); } 50% { transform: translateX(24px); } }
  @keyframes sk-shimmer { 0%, 100% { opacity: .7; } 50% { opacity: 1; } }
  @keyframes sk-shoot { 0%, 70% { stroke-dashoffset: 70; opacity: 0; } 72% { opacity: 1; } 86% { stroke-dashoffset: -10; opacity: 0; } 100% { stroke-dashoffset: -10; opacity: 0; } }
`;

const SEASON_STYLE = `
  .season-pic { width: 100%; height: 100%; overflow: visible; }
  .s-spring .stem { stroke: #66bb6a; stroke-width: 2.4; stroke-linecap: round; fill: none; }
  .s-spring .leaf-s { fill: #81c784; }
  .s-spring .petal { fill: #f48fb1; }
  .s-spring .heart { fill: #ffd54f; }
  .s-spring .flower { transform-origin: 24px 44px; animation: sk-sway 3s ease-in-out infinite; }
  .s-summer .s-glow { fill: #ffd54f; opacity: .22; transform-origin: 24px 24px; animation: sk-breathe 3s ease-in-out infinite; }
  .s-summer .s-rays path { stroke: #ffb300; stroke-width: 2.6; stroke-linecap: round; }
  .s-summer .s-rays { transform-origin: 24px 24px; animation: sk-spin 6s linear infinite; }
  .s-summer .s-disc { fill: #ffc107; }
  .s-autumn .leaf-a { fill: #ef6c00; }
  .s-autumn .vein { stroke: #ffcc80; stroke-width: 1.4; stroke-linecap: round; }
  .s-autumn .big-leaf { transform-origin: 24px 40px; animation: sk-sway 3s ease-in-out infinite; }
  .s-autumn .fall { fill: #f9a825; transform-box: fill-box; transform-origin: center; animation: sk-fall 3s ease-in infinite; }
  .s-autumn .fall.late { fill: #d84315; animation-delay: -1.5s; }
  .s-winter .flake path { stroke: #64b5f6; stroke-width: 2; stroke-linecap: round; fill: none; }
  .s-winter .flake { transform-origin: 24px 24px; animation: sk-spin60 6s linear infinite; }
  .s-winter .snow { fill: #90caf9; animation: sk-snow 3s linear infinite; }
  .s-winter .snow.late { animation-delay: -1.5s; }
  @keyframes sk-sway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
  @keyframes sk-fall { 0% { transform: translate(0, -4px) rotate(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translate(4px, 30px) rotate(160deg); opacity: 0; } }
  @keyframes sk-snow { 0% { transform: translateY(-4px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(40px); opacity: 0; } }
  @keyframes sk-spin60 { to { transform: rotate(60deg); } }
`;

const FULL_STYLE = `
  .content { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .tile { display: grid; grid-template-columns: 34px minmax(0, 1fr); align-items: center; gap: 10px; padding: 10px; border-radius: 12px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .tile .pic { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%;
               background: color-mix(in srgb, var(--c, var(--sk-accent)) 14%, transparent); }
  .tile .pic .icon { width: 20px; height: 20px; fill: color-mix(in srgb, var(--c, var(--sk-accent)) 75%, var(--primary-text-color)); }
  .tile .pic .moon-pic, .tile .pic .season-pic { width: 26px; height: 26px; }
  .tile .k { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .v { font-size: 15px; font-weight: 500; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .s { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .s.longer { color: color-mix(in srgb, var(--sk-day) 60%, var(--primary-text-color)); }
  .tile .s.shorter { color: color-mix(in srgb, var(--sk-blue) 60%, var(--primary-text-color)); }
  .t-moon { --c: #9fa8da; } .t-dawn { --c: var(--sk-golden); }
  .tile .tw .tw-sun { animation: sk-rise 6s ease-in-out infinite; }
  .tile .tw .tw-rays { animation: sk-rays 6s ease-in-out infinite; }
  @keyframes sk-rise { 0%, 100% { transform: translateY(2.5px); } 50% { transform: translateY(0); } }
  @keyframes sk-rays { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }
  .season-spring { --c: #66bb6a; } .season-summer { --c: #ffb300; } .season-autumn { --c: #ef6c00; } .season-winter { --c: #42a5f5; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); padding: 2px 0; }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title.toggle { cursor: pointer; user-select: none; }
  .section-title .chevron { margin-left: auto; width: 16px; height: 16px; transition: transform .2s ease; }
  .section-title.toggle[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .details { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; margin-top: 8px; }
  .detail { display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; border-radius: 10px; min-width: 0;
            background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .detail .k { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .detail .v { font-size: 13px; font-weight: 500; line-height: 1.35; overflow-wrap: anywhere; }
  .detail .v small { font-size: 11px; font-weight: 400; color: var(--secondary-text-color); }
  @container (max-width: 300px) {
    .tile { grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 8px; }
    .tile .pic { width: 28px; height: 28px; }
    .tile .pic .moon-pic, .tile .pic .season-pic { width: 22px; height: 22px; }
    .tile .v { font-size: 14px; }
    .tile .s { white-space: normal; }
    .band .corner { font-size: 11px; bottom: 4px; }
    .band .corner .icon { width: 13px; height: 13px; }
  }
`;

const MINI_STYLE = `
  :host { --sk-natural-width: 320px; }
  .content { padding: 10px 12px 12px; }
  .mini { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; }
  .mini .t { display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
  .mini .t .icon { width: 16px; height: 16px; color: var(--sk-golden); }
  .strip { position: relative; flex: 1 1 auto; min-width: 40px; height: 24px; border-radius: 12px; overflow: hidden; }
  .strip-stars { position: absolute; inset: 0; width: 100%; height: 100%; }
  .strip .track { position: absolute; left: 10px; right: 10px; top: 11.5px; height: 1px; background: rgba(255,255,255,.45); }
  .strip .track.done { right: auto; height: 2px; top: 11px; background: #fff3c4; }
  .strip.p-night .track.done, .strip.p-blue .track.done { background: #c9d6ff; }
  .strip .dot-body { position: absolute; top: 5px; width: 14px; height: 14px; margin-left: -7px; overflow: visible; transition: left 1s ease; }
  .strip .dot-body.sun { animation: sk-sunpulse 3s ease-in-out infinite; }
  .strip .dot-body.moon { animation: sk-moonpulse 3s ease-in-out infinite; }
  @keyframes sk-sunpulse { 0%, 100% { filter: drop-shadow(0 0 1px #ffd54f); } 50% { filter: drop-shadow(0 0 4px #ffd54f); } }
  @keyframes sk-moonpulse { 0%, 100% { filter: drop-shadow(0 0 1px #fff9c4); } 50% { filter: drop-shadow(0 0 3px #fff9c4); } }
  .mini .sunrow { display: flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; border-radius: 12px; }
  .mini .mm { flex: none; width: 24px; height: 24px; }
  @container (max-width: 230px) {
    .mini .t .icon { display: none; }
    .mini { gap: 6px; font-size: 12px; }
  }
`;

// The illustrated header: 90 px high, the title on the sky at its left, the scene at its right standing on a 10 px
// lawn strip drawn edge to edge, day and night. Its sky is tinted by the phase (golden, blue hour).
const BANNER_STYLE = `
  .banner { position: relative; overflow: hidden; height: 90px; color: #0d2a45; --sk-sub: #3b5b78; --sk-scene-w: min(200px, 62%);
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.p-golden { background: linear-gradient(90deg, #f4f8ff 0%, #e6f0fb 34%, #f5ddc4 72%, #f7c89a 100%); }
  .banner.p-blue { background: linear-gradient(90deg, #eff1fc 0%, #dfe4f8 34%, #c5c8ee 72%, #b2b3e2 100%); }
  .banner.night { color: #fff; --sk-sub: rgba(255,255,255,.78);
                  background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .banner.night.p-blue { background: linear-gradient(90deg, #22355e 0%, #1f2f58 36%, #262d5e 72%, #33326a 100%); }
  .banner.night.p-golden { background: linear-gradient(90deg, #1f3054 0%, #1d2b4c 36%, #3a2f4a 72%, #5a3a46 100%); }
  .hs-svg { position: absolute; right: 0; bottom: 10px; width: var(--sk-scene-w); height: calc(100% - 10px); overflow: hidden; }
  .hs-svg .hs-arc { fill: none; stroke: #fff; stroke-width: 1; stroke-dasharray: 2 3; opacity: .9; }
  .hs-svg .hs-arc.done { stroke: #fff3c4; stroke-width: 1.6; stroke-dasharray: none; }
  .night .hs-svg .hs-arc { stroke: #4a5a7a; opacity: 1; }
  .night .hs-svg .hs-arc.done { stroke: #8fa2cc; }
  .hs-svg .hs-hill.far { fill: #a7d39f; } .hs-svg .hs-hill { fill: #86c27f; } .hs-svg .hs-peaks { fill: #9cc3a0; }
  .night .hs-svg .hs-hill.far { fill: #1d3a4a; } .night .hs-svg .hs-hill { fill: #17303d; } .night .hs-svg .hs-peaks { fill: #22324d; }
  .night .hs-svg .cloud { opacity: .14; }
  .lawn { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: repeating-linear-gradient(90deg, #5aa83d 0 22px, #6cbb4c 22px 44px); }
  .night .lawn { background: repeating-linear-gradient(90deg, #1f4a2a 0 22px, #245433 22px 44px); }
  /* The text may run over the scene's open left edge (x < 30 of 200: sky and the foot of the arc). */
  .htext { position: absolute; z-index: 1; left: 12px; top: 0; bottom: 10px; right: calc(var(--sk-scene-w) * .85);
           display: flex; align-items: center; gap: 10px; min-width: 0; }
  .banner .titles { min-height: 0; gap: 1px; }
  .banner .name { font-size: 16px; font-weight: 500; }
  .banner .sub { font-size: 13px; line-height: 17px; color: var(--sk-sub); }
  .banner .type-icon { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px rgba(47,128,237,.18); }
  .banner.night .type-icon { background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .banner .type-icon .icon { fill: color-mix(in srgb, var(--c) 82%, #0d2a45); }
  .banner.night .type-icon .icon { fill: color-mix(in srgb, var(--c) 70%, #fff); }
  .banner .zoom { position: absolute; z-index: 2; top: 6px; right: 6px; margin: 0; color: #10283f; background: rgba(255,255,255,.55); border-color: rgba(16,40,63,.12); }
  .banner.night .zoom { color: #fff; background: rgba(10,20,40,.45); border-color: rgba(255,255,255,.16); }
  /* Narrow card: the scene shrinks so that the title keeps its room, then only the sky and the lawn stay. */
  @container (max-width: 400px) { .banner { --sk-scene-w: 46%; } }
  @container (max-width: 300px) { .hs-svg { display: none; } .htext { right: 12px; } .banner:has(.zoom) .htext { right: 40px; } .banner .sub { font-size: 12px; } }
`;

// ---------------------------------------------------------------------------
// DOM patching, folding back, presses
// ---------------------------------------------------------------------------

// Patches `root` to the markup `html` in place: elements that stay keep their identity, so that their CSS
// animations go on instead of restarting (and the focus stays where it is).
const morphNode = (from, to) => {
  if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName) {
    from.replaceWith(to);
    return;
  }
  if (from.nodeType !== 1) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue;
    return;
  }
  for (const a of [...from.attributes]) if (!to.hasAttribute(a.name)) from.removeAttribute(a.name);
  for (const a of [...to.attributes]) if (from.getAttribute(a.name) !== a.value) from.setAttribute(a.name, a.value);
  morphChildren(from, to);
};
const morphChildren = (from, to) => {
  const a = [...from.childNodes];
  const b = [...to.childNodes];
  b.forEach((node, i) => {
    if (a[i]) morphNode(a[i], node);
    else from.appendChild(node);
  });
  for (let i = b.length; i < a.length; i++) a[i].remove();
};
const morph = (root, html) => {
  if (!root.childNodes?.length || typeof document.createElement("template").content === "undefined") {
    root.innerHTML = html;
    return;
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  morphChildren(root, tpl.content);
};

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere", caught on the pointer: on iOS a tap on something that is not clickable sends no click to the
// page. It counts when both the press and the release are outside the card; keyboard clicks come as click events.
const watchOutside = (card, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOutside(card, ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOutside(card, ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOutside(card, ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};

// No rewrite between a press and its click: a render arriving meanwhile is left pending (`_dirty`) and drawn at the
// click, or right after the release when no click follows (a drag, a scroll).
const holdUnderPress = (card, render) => {
  const root = card.shadowRoot;
  const release = () => {
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
  };
  card._onPressEnd = () => {
    release();
    setTimeout(() => {
      card._pressing = false;
      if (!card._dirty) return;
      card._dirty = false;
      render();
    }, 0);
  };
  card._dropPress = () => {
    card._pressing = false;
    card._dirty = false;
    release();
  };
  root.addEventListener?.("pointerdown", () => {
    card._pressing = true;
    window.addEventListener?.("pointerup", card._onPressEnd, true);
    window.addEventListener?.("pointercancel", card._onPressEnd, true);
  });
  card._pressClick = () => {
    card._pressing = false;
  };
  root.addEventListener?.("click", card._pressClick, true);
};

const sameDeps = (a, b) => !!a && a.length === b.length && a.every((d, i) => d === b[i]);
const DETAILS = ["collapsed", "expanded", "hidden"];

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

// Numbers the cards, so that the ids in each header's scene stay apart.
let skUid = 0;

class SkyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this._uid = ++skUid;
    holdUnderPress(this, () => this._update());
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    // Enter / Space on an element with the button role acts as a click.
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
  }

  static getConfigElement() {
    return document.createElement("sky-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  // Home Assistant pushes a new hass on every state change: the card is only redrawn when something it shows changed.
  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const ids = Object.values(resolve(h, this._config));
    return [h.entities, h.language, h.locale, h.config, h.themes?.darkMode, this._minute, ...ids.map((id) => h.states?.[id])];
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  connectedCallback() {
    this._outside ??= watchOutside(this, () => {
      if (this._open === undefined) return;
      this._open = undefined;
      this._update();
    });
    this._outside.on();
    if (this._hass && this._config) this._update();
    // The sun moves: redrawn every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / 60000);
      if (this._hass) this.hass = this._hass;
    }, 60000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._outside?.off();
    this._dropPress();
    // Left (another view, a conditional card hidden): back to the default folding.
    this._open = undefined;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.entities !== undefined && (typeof config.entities !== "object" || config.entities === null || Array.isArray(config.entities))) {
      throw new Error("entities must be a map of keys to entity ids");
    }
    if (config.details !== undefined && !DETAILS.includes(config.details)) throw new Error(`details must be one of ${DETAILS.join(", ")}`);
    if (config.illustration_theme !== undefined && !["auto", "day", "night"].includes(config.illustration_theme)) throw new Error("illustration_theme must be one of auto, day, night");
    this._config = { ...config };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this._html = "";
    this._lastDeps = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _time(ms) {
    return fmtTime(ms, this._locale(), this._m.tz, hour12(this._hass));
  }

  _update() {
    if (!this._hass || !this._config) return;
    if (this._pressing) {
      this._dirty = true;
      return;
    }
    this._dirty = false;
    const html = this._render();
    if (html !== this._html) {
      this._html = html;
      morph(this.shadowRoot, html);
    }
  }

  _onClick(ev) {
    const el = ev.composedPath().find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    const { action, entity } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
    if (action === "toggle_details") {
      this._open = !this._detailsOpen();
      return this._update();
    }
    if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  _detailsOpen() {
    return this._open ?? this._config.details === "expanded";
  }

  _still() {
    return this._config.animations === false;
  }

  // `animations: false` keeps the whole card still: the header badge and the tiles' icons as well as the band.
  _stillAttr() {
    return this._still() ? ' class="still"' : "";
  }

  // Attributes of an element opening the more-info dialog of `id` (none without an entity).
  _more(id, label) {
    return id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"${label ? ` aria-label="${esc(label)}"` : ""}` : '"';
  }

  // ---- Parts -------------------------------------------------------------

  _illustrated() {
    return this._config.illustration !== false;
  }

  // Night picture: forced by illustration_theme, else the sun under the horizon, else Home Assistant's dark mode.
  _night() {
    const theme = this._config.illustration_theme;
    if (theme === "night") return true;
    if (theme === "day") return false;
    const up = this._m.sun.up;
    return typeof up === "boolean" ? !up : !!this._hass?.themes?.darkMode;
  }

  // The round icon, coloured by the phase (day, golden hour, blue hour, night): the sun turning while it is up, the
  // moon rocking once it is down. A click opens the sun's more-info dialog.
  _typeIcon() {
    const m = this._m;
    const elev = m.sun.elevation !== null ? ` · ${fmtDeg(m.sun.elevation, this._locale())}` : "";
    const label = this._t(`phase_${m.phase}`) + elev;
    return `<span class="type-icon ph-${m.phase}${this._more(m.sun.entity, label)} title="${esc(label)}">${svgIcon(m.sun.up ? "sun" : "moon", m.sun.up ? "a-sun" : "a-moon")}</span>`;
  }

  // The illustrated header: the title on the sky, the scene of the sun (or the moon) on its arc, the lawn strip.
  _banner() {
    const m = this._m;
    const sub = this._config.show_subtitle === false ? "" : this._subtitle();
    return `<div class="banner p-${m.phase}${this._night() ? " night" : ""}">${headerScene(m, this._uid, this._still())}<div class="lawn"></div>
        <div class="htext">${this._typeIcon()}
          <div class="titles">
            <div class="name">${esc(this._config.title || this._t("title"))}</div>
            ${sub ? `<div class="sub">${esc(sub)}</div>` : ""}
          </div>
        </div>
        ${this._zoomButton()}
      </div>`;
  }

  _header() {
    if (this._illustrated()) return this._banner();
    const m = this._m;
    const text = this._t(`phase_${m.phase}`);
    const elev = m.sun.elevation !== null ? ` · ${fmtDeg(m.sun.elevation, this._locale())}` : "";
    const chip = `<span class="chip ph-${m.phase}${this._more(m.sun.entity)} title="${esc(text + elev)}"><span class="dot"></span><span class="chip-text">${esc(text)}</span></span>`;
    const sub = this._config.show_subtitle === false ? "" : this._subtitle();
    return `<div class="header">
        <span class="type-icon ph-${m.phase}">${svgIcon(m.sun.up ? "sun" : "moon", m.sun.up ? "a-sun" : "a-moon")}</span>
        <div class="titles">
          <div class="name">${esc(this._config.title || this._t("title"))}</div>
          ${sub ? `<div class="sub">${esc(sub)}</div>` : ""}
        </div>
        ${chip}
        ${this._zoomButton()}
      </div>`;
  }

  // The next event ("Sunset at 17:21"), or the polar day or night.
  _subtitle() {
    const { sun } = this._m;
    if (sun.next) return this._t(sun.next[1], { time: this._time(sun.next[0]) });
    if (sun.polar) return this._t(sun.polar === "day" ? "polar_day_short" : "polar_night_short");
    return "";
  }

  _zoomButton() {
    return "";
  }

  _errorCard(key) {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(this._t(key))}</div></ha-card>`;
  }

  // The sky band with the sunrise and sunset (sunset and sunrise by night) in its bottom corners.
  _band() {
    const m = this._m;
    const { sun } = m;
    const night = sun.arc ? sun.arc.mode === "night" : !sun.up;
    const corner = (side, icon, at, key) =>
      at === null || at === undefined ? "" : `<span class="corner ${side}" title="${esc(this._t(key))}">${svgIcon(icon)}${esc(this._time(at))}</span>`;
    const corners = sun.arc
      ? night
        ? corner("left", "sunset", sun.arc.from, "sunset") + corner("right", "sunrise", sun.arc.to, "sunrise")
        : corner("left", "sunrise", sun.arc.from, "sunrise") + corner("right", "sunset", sun.arc.to, "sunset")
      : "";
    return `<div class="band${this._more(sun.entity, this._t(`phase_${m.phase}`))}>${bandSvg(m, this._still())}${corners}</div>`;
  }

  _tile(cls, pic, label, value, sub, id, subCls = "") {
    return `<div class="tile ${cls}${this._more(id, label)}><span class="pic">${pic}</span><div class="txt"><div class="k">${esc(label)}</div><div class="v">${esc(value)}</div>${sub ? `<div class="s ${subCls}">${esc(sub)}</div>` : ""}</div></div>`;
  }

  _moonName() {
    return this._t(`moon_${this._m.moon.phase}`);
  }

  // When an event comes, in days: "in 4 days", "tomorrow".
  _inDays(at) {
    const { tz, now } = this._m;
    return fmtRelDays(Math.round((dayStart(at, tz) - dayStart(now, tz)) / DAY_MS), this._locale());
  }

  // Daylight, the moon, dawn and dusk, the season.
  _tiles() {
    const { sun, moon, season } = this._m;
    const L = this._locale();
    let length = "—";
    let sub = "";
    let subCls = "";
    if (sun.polar) length = this._t(sun.polar === "day" ? "polar_day_short" : "polar_night_short");
    else if (sun.daylight !== null && sun.daylight !== undefined) length = fmtHours(sun.daylight, L);
    if (sun.delta !== undefined) {
      const same = Math.abs(sun.delta) < 1000;
      sub = same ? this._t("same_as_yesterday") : this._t("vs_yesterday", { delta: fmtDelta(sun.delta, L) });
      subCls = same ? "" : sun.delta > 0 ? "longer" : "shorter";
    }
    const daylight = this._tile("t-day", svgIcon("sun", "a-sun"), this._t("daylight_tile"), length, sub, sun.entity, subCls);
    const [nextAt, nextKey] = moon.nextFull < moon.nextNew ? [moon.nextFull, "next_full"] : [moon.nextNew, "next_new"];
    const moonTile = this._tile(
      "t-moon",
      moonSvg(moon),
      this._moonName(),
      this._t("moon_lit", { pct: fmtPct(moon.illumination * 100, L) }),
      `${this._t(nextKey)} ${this._inDays(nextAt)}`,
      moon.entity,
    );
    const dawn = this._tile(
      "t-dawn",
      TWILIGHT_ANIM,
      this._t("dawn_dusk"),
      `${this._time(sun.dawn)} · ${this._time(sun.dusk)}`,
      sun.noon !== null ? `${this._t("solar_noon")} ${this._time(sun.noon)}` : "",
      sun.entity,
    );
    const next = season.next;
    const seasonTile = this._tile(
      `season-${season.key}`,
      seasonSvg(season.key, this._still()),
      this._t("section_season"),
      this._t(`season_${season.key}`),
      `${this._t(`season_${next.season}`)} ${this._inDays(next.at)}`,
      season.entity,
    );
    return `<div class="grid">${daylight}${moonTile}${dawn}${seasonTile}</div>`;
  }

  _detail(label, value, id) {
    return `<div class="detail${this._more(id, label)}><div class="k">${esc(label)}</div><div class="v">${value}</div></div>`;
  }

  _range([a, b]) {
    if (a === null && b === null) return "—";
    return `${esc(this._time(a))} – ${esc(this._time(b))}`;
  }

  // Everything else, in a collapsible section: golden and blue hours, solar noon, the sun's position, the moon's
  // times, age and next phases, the next season's date.
  _details() {
    const { sun, moon, season, tz, loc } = this._m;
    const L = this._locale();
    const open = this._detailsOpen();
    const title = `<div class="section-title toggle" role="button" tabindex="0" data-action="toggle_details" aria-expanded="${open}">${svgIcon("calendar")}<span>${esc(this._t("details"))}</span>${svgIcon("chevron_down", "chevron")}</div>`;
    if (!open) return `<div class="section">${title}</div>`;
    const id = sun.entity;
    const day = (at) => `${esc(fmtDay(at, L, tz))} <small>${esc(this._time(at))}</small>`;
    const list = [];
    if (loc) {
      list.push(
        this._detail(this._t("phase_golden"), `${this._range(sun.goldenAM)}<br>${this._range(sun.goldenPM)}`),
        this._detail(this._t("phase_blue"), `${this._range(sun.blueAM)}<br>${this._range(sun.bluePM)}`),
      );
    }
    list.push(this._detail(this._t("solar_noon"), `${esc(this._time(sun.noon))}${sun.noonElevation !== undefined ? ` <small>${esc(fmtDeg(sun.noonElevation, L))}</small>` : ""}`, id));
    if (sun.elevation !== null) list.push(this._detail(this._t("elevation"), esc(fmtDeg(sun.elevation, L)), id));
    if (sun.azimuth !== null) list.push(this._detail(this._t("azimuth"), esc(fmtDeg(sun.azimuth, L)), id));
    list.push(
      this._detail(this._t("moonrise"), esc(this._time(moon.rise)), moon.entity),
      this._detail(this._t("moonset"), esc(this._time(moon.set)), moon.entity),
      this._detail(this._t("moon_age_label"), esc(fmtUnit(Math.round(moon.age * 10) / 10, "day", L)), moon.entity),
      this._detail(this._t("next_full"), day(moon.nextFull), moon.entity),
      this._detail(this._t("next_new"), day(moon.nextNew), moon.entity),
    );
    const next = season.next;
    const event = season.type === "meteorological" ? this._t(`season_${next.season}`) : this._t(`event_${next.season}`);
    list.push(this._detail(event, esc(fmtDay(next.at, L, tz)), season.entity));
    const computed = moon.computed.length || season.computed ? ` title="${esc(this._t("computed"))}"` : "";
    return `<div class="section">${title}<div class="details"${computed}>${list.join("")}</div></div>`;
  }

  _style(extra = "") {
    return `<style>${BASE_STYLE}${BAND_STYLE}${SEASON_STYLE}${FULL_STYLE}${this._illustrated() ? BANNER_STYLE : ""}${extra}</style>`;
  }

  _model() {
    const m = skyModel(this._hass, this._config);
    this._m = m;
    return m;
  }

  _body() {
    const c = this._config;
    const parts = [];
    if (c.show_sky !== false) parts.push(this._band());
    if (c.show_tiles !== false) parts.push(this._tiles());
    if (c.details !== "hidden") parts.push(this._details());
    return `<div class="content">${parts.join("")}</div>`;
  }

  _render() {
    const m = this._model();
    if (m.error) return this._errorCard(m.error);
    return `${this._style()}<ha-card${this._stillAttr()}>${this._header()}${this._body()}</ha-card>`;
  }
}

// The mini card: the sky strip between the sunrise and the sunset, and the moon; its detail button (top right,
// `zoom: false` removes it) shows the full card's content, and a click anywhere else brings the compact view back.
class SkyMiniCard extends SkyCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("sky-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${!!z}">${svgIcon(z ? "collapse" : "expand")}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector?.(".zoom")?.focus({ preventScroll: true });
  }

  _render() {
    if (this._zoomed) return super._render();
    const m = this._model();
    if (m.error) return this._errorCard(m.error);
    const { sun, moon } = m;
    const L = this._locale();
    const time = (icon, at, key) => `<span class="t" title="${esc(this._t(key))}">${svgIcon(icon)}${esc(this._time(at))}</span>`;
    const moonLabel = `${this._moonName()} · ${this._t("moon_lit", { pct: fmtPct(moon.illumination * 100, L) })}`;
    // By night the strip runs from the sunset to the next sunrise, as the full card's band.
    const ends = sun.arc?.mode === "night" ? [time("sunset", sun.arc.from, "sunset"), time("sunrise", sun.arc.to, "sunrise")] : [time("sunrise", sun.sunrise, "sunrise"), time("sunset", sun.sunset, "sunset")];
    return `${this._style(MINI_STYLE)}<ha-card${this._stillAttr()}>${this._header()}
        <div class="content"><div class="mini">
          <span class="sunrow${this._more(sun.entity, this._t(`phase_${m.phase}`))}>${ends[0]}${stripHtml(m, this._still())}${ends[1]}</span>
          <span class="mm${this._more(moon.entity, moonLabel)} title="${esc(moonLabel)}">${moonSvg(moon)}</span>
        </div></div></ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------

const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

// Keeps the YAML minimal: drops empty values and options left at their default.
const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (const [k, v] of Object.entries(config)) {
    const empty = v === "" || v === undefined || v === null || (Array.isArray(v) && !v.length);
    if (empty || (k in defaults && JSON.stringify(v) === JSON.stringify(defaults[k]))) delete config[k];
  }
  return config;
};

class SkyCardEditor extends HTMLElement {
  // [name, default]
  static get toggles() {
    return [
      ["illustration", true],
      ["show_title", true],
      ["show_subtitle", true],
      ["show_sky", true],
      ["show_tiles", true],
      ["animations", true],
    ];
  }

  static get defaults() {
    return { details: "collapsed", season_type: "astronomical", illustration_theme: "auto" };
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    return [
      { name: "title", selector: { text: {} } },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      { name: "illustration_theme", selector: { select: { mode: "dropdown", options: ["auto", "day", "night"].map((value) => ({ value, label: tr(`theme_${value}`) })) } } },
      { name: "details", selector: { select: { mode: "dropdown", options: DETAILS.map((value) => ({ value, label: tr(`details_${value}`) })) } } },
      {
        name: "season_type",
        selector: { select: { mode: "dropdown", options: ["astronomical", "meteorological"].map((value) => ({ value, label: tr(`season_${value}`) })) } },
      },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _label(name) {
    return t(this._hass, this._config, name === "title" ? "title_option" : name === "details" ? "details_option" : name);
  }

  _render() {
    if (!this._hass || !this._config) return;
    const toggles = this.constructor.toggles;
    const defaults = { ...Object.fromEntries(toggles), ...this.constructor.defaults };
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => this._label(s.name);
      this._form.computeHelper = (s) => (s.name === "zoom" ? t(this._hass, this._config, "zoom_helper") : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = cleanConfig(ev.detail.value, defaults);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    if (this._dataFor !== this._config) {
      this._dataFor = this._config;
      this._form.data = { ...defaults, ...this._config };
    }
    const l = lang(this._hass, this._config);
    if (this._schemaLang !== l) {
      this._schemaLang = l;
      this._form.schema = this._schema();
    }
  }
}

// The mini card's editor: the full card's options (its detailed view) and the detail button.
class SkyMiniCardEditor extends SkyCardEditor {
  static get toggles() {
    return [...SkyCardEditor.toggles, ["zoom", true]];
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
};
define("sky-card", SkyCard);
define("sky-mini-card", SkyMiniCard);
define("sky-card-editor", SkyCardEditor);
define("sky-mini-card-editor", SkyMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "sky-card",
    name: "Sky Card",
    description: "Sky band following the sun's elevation with its arc from sunrise to sunset, daylight and its change since yesterday, moon phase and illumination, dawn and dusk, the season, golden and blue hours.",
  },
  { type: "sky-mini-card", name: "Sky Mini Card", description: "A sky strip between sunrise and sunset and the moon phase at a glance, with a detail button showing the full card." },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-sky-card" });
}

console.info(`%c SKY-CARD %c v${VERSION} `, "color: white; background: #ffa000; font-weight: 700;", "color: #ffa000; background: white; font-weight: 700;");
