# FindmyDorm
Repository for the FindmyDorm project; a website to compare dorms in Ireland

1. Project Overview 

Target Area: Ireland (primary), with cultural adaptations for Chinese and German users. 
FindMyDorm is an online student housing marketplace designed as a utility comparison engine. Students can browse, compare, and review dormitory accommodations. The application dynamically adapts its layout, language, colour scheme, and content based on the user's selected language, reflecting the cultural expectations of English, Chinese, and German users. 

Primary Users: Domestic and international college students navigating accommodation for the first time, often under emotional and financial pressure in unfamiliar environments. 

 
2. Cultural Scope 
Supported Languages: English (EN), Chinese Simplified (ZH), German (DE) 
Supported Countries: Ireland (EN), China (ZH), Germany (DE) 
Cultural Models Applied: 
  Hofstede's Cultural Dimensions: Individualism vs Collectivism, High vs Low Uncertainty Avoidance (Phase 1, Section 2.1) 

 

3. Design Rationale 
Key Problem Statements 
    How do we make one application feel culturally native to users from three distinct backgrounds? 
    How do we signal trust to Chinese users through social proof, structure to German users through explicit data, and familiarity to English/Irish users through neutral conventions? 

Shared Hypotheses (Phase 1, Section 5) 

    Hypothesis 1 (German): Implementing constant feedback prompts gives High UA users the clear mental map they need, boosting Karl's confidence and engagement. 

    Hypothesis 2 (German): Explicit technical specifications for each listing give Individualist users (Karl) the precise data they need before committing. 

    Hypothesis 3 (Chinese): Progressive disclosure and vibrant visuals reduce cognitive overload for Low UA users (Wei Chen) and keep them engaged through exploration. 

    Hypothesis 4 (Chinese): Peer reviews and resident validation keep Collectivist users (Wei Chen) engaged and provide the social proof they need before committing. 

    Hypothesis 5 (Chinese): Social features (user count, review snippets) provide the belonging signal Wei Chen's PoV identifies as essential to trust. 

Cultural Influence on UI Elements 

 
| Element    | English                           | Chinese                                                        | German                                              |
|------------|-----------------------------------|----------------------------------------------------------------|-----------------------------------------------------|
| Layout     | Centered single column            | Centered + peer reviews above form, full-bleed login image     | Two-column split login, checklist sidebar on review |
| Navigation | White bar, blue brand             | Orange bar, white text                                         | Charcoal bar, white text                            |
| Colour     | Blue / neutral                    | Orange (#ff6633) — vibrant, entices exploration                | Charcoal (#212529) — structured, authoritative      |
| Imagery    | Standard thumbnail                | Large banner image with overlay, social avatars                | Structured side image, labelled spec list           |
| Language   | English                           | Simplified Chinese                                             | German                                              |
| Symbols    | Yellow stars, blue verified badge | Orange stars, orange verified badge                            | Black stars, monochrome verified badge              | 
 

4. Architecture and Structure 

FindMyDorm/ 
├── app/ 
│   ├── __init__.py              # Flask app factory, Babel initialisation 
│   ├── routes.py                # All URL routes including /setlang/<lang_code> 
│   ├── templates/ 
│   │   ├── about.html            
│   │   ├── base.html            # Shared layout: navbar, footer, language switcher 
│   │   ├── chineseinfo.html            
│   │   ├── germaninfo.html   
│   │   ├── index.html     
│   │   ├── info.html 
│   │   ├── listings.html            
│   │   ├── login.html           # Login page — 3 cultural layouts 
│   │   ├── profile.html             
│   │   └── review.html          # Review page — 3 cultural layouts
│   ├── static/ 
│   │   ├── css/ 
│   │   │   ├── Alex
|   │   │   │   ├── nav-footer-styles.css    # Global navbar/footer theming  
|   │   │   │   ├── components-styles.css    # Shared stars, sticky footer  
│   │   │   ├── Garreth
|   │   │   │   ├── nav-footer-styles.css    # Global navbar/footer theming  
|   │   │   │   ├── components-styles.css    # Shared stars, sticky footer
|   │   │   │   ├── login-styles.css         # Login cultural styles 
│   |   │   │   ├── review-styles.css        # Review cultural styles 
│   │   │   ├── Nate
│   |   │   │   ├── de_listings.css
│   |   │   │   ├── en_listings.css
│   |   │   │   ├── zh_listings.css
│   │   │   ├── Nathan
│   |   │   │   ├── de_infostyles.css
│   |   │   │   ├── en_infostyles.css
│   |   │   │   ├── zh_infostyles.css
│   │   │   ├── Parva
│   |   │   │   ├──home-styles.css
│   │   ├── assets/
│   │   │   ├── image1.jpg
│   │   │   ├── Image2.jpg
│   │   │   ├── image3.jpg
│   │   │   ├── image4.jpg
│   │   │   ├── profile.jpg
│   │   │   ├── de-login-bg.jpg
│   │   │   ├── zh-login-bg.jpg
│   │   │   ├── img/
│   │   │   │   ├── cn-homepage/
│   │   │   │   │   ├── dcu_image.jpg
│   │   │   │   │   ├── galway_image.jpg
│   │   │   │   │   ├── maynooth_image.jpg
│   │   │   │   │   ├── trinity_image.jpg
│   │   │   │   │   ├── tud_image.jpg
│   │   │   │   │   ├── ucc_image.jpg
│   │   │   │   │   ├── ucd_image.jpg
│   │   │   │   │   └── ul_image.jpeg
│   │   │   │   ├── de-homepage/
│   │   │   │   │   ├── dcu_logo.png
│   │   │   │   │   ├── galway_logo.png
│   │   │   │   │   ├── maynooth_logo.png
│   │   │   │   │   ├── trinity_logo.png
│   │   │   │   │   ├── tud_logo.png
│   │   │   │   │   ├── ucc_logo.png
│   │   │   │   │   ├── ucd_logo.png
│   │   │   │   │   └── ul_logo.png
│   │   │   │   ├── de-listings/
│   │   │   │   │   ├── de-dorm-1.jpg
│   │   │   │   │   ├── de-dorm-2.jpg
│   │   │   │   │   ├── de-dorm-3.jpg
│   │   │   │   │   ├── de-dorm-4.jpg
│   │   │   │   │   ├── de-dorm-5.jpg
│   │   │   │   │   ├── de-dorm-6.jpg
│   │   │   │   │   ├── de-dorm-7.jpg
│   │   │   │   │   ├── de-dorm-8.jpg
│   │   │   │   │   ├── de-dorm-9.jpg
│   │   │   │   │   ├── de-dorm-10.jpg
│   │   │   │   │   ├── de-dorm-11.jpg
│   │   │   │   │   ├── de-dorm-12.jpg
│   │   │   │   │   ├── de-dorm-13.jpg
│   │   │   │   │   ├── de-dorm-14.jpg
│   │   │   │   │   ├── de-dorm-15.jpg
│   │   │   │   │   └── de-dorm-16.jpg
│   │   │   │   └── zh-listings/
│   │   │   │       ├── zh-dorm-1.jpg
│   │   │   │       ├── zh-dorm-2.jpg
│   │   │   │       ├── zh-dorm-3.jpg
│   │   │   │       ├── zh-dorm-4.jpg
│   │   │   │       ├── zh-dorm-5.jpg
│   │   │   │       ├── zh-dorm-6.jpg
│   │   │   │       ├── zh-dorm-7.jpg
│   │   │   │       ├── zh-dorm-8.jpg
│   │   │   │       ├── zh-dorm-9.jpg
│   │   │   │       ├── zh-dorm-10.jpg
│   │   │   │       ├── zh-dorm-11.jpg
│   │   │   │       ├── zh-dorm-12.jpg
│   │   │   │       ├── zh-dorm-13.jpg
│   │   │   │       ├── zh-dorm-14.jpg
│   │   │   │       ├── zh-dorm-15.jpg
│   │   │   │       └── zh-dorm-16.jpg
│   │   └── js 
│   │   │   ├── Alex
|   │   │   │   ├── alex.txt      
│   │   │   ├── Garreth
|   │   │   │   ├── garreth.txt      
|   │   │   │   ├── culture-logic.js           
│   │   │   ├── Nate
|   │   │   │   ├── nate.txt      
│   |   │   │   ├── de_listings.js
│   |   │   │   ├── zh_listings.js
│   |   │   │   ├── en_listings.js
│   │   │   ├── Nathan
|   │   │   │   ├── nathan.txt      
│   |   │   │   ├── de_info.js
│   |   │   │   ├── zh_info.js
│   |   │   │   ├── en_info.js
│   │   │   ├── Parva
|   │   │   │   ├── parva.txt      
│   └── translations/ 
│       ├── messages.pot 
│       ├── zh/LC_MESSAGES/messages.po 
│       └── de/LC_MESSAGES/messages.po 
├── babel.cfg 
└── requirements.txt 
 

Template Inheritance: All pages extend base.html (Phase 1, Section 6.5). Individual pages override {% block extra_css %}, {% block main %}, and {% block extra_js %}. 

Static Files: CSS is split by concern — global layout, shared components, and page-specific styles are separate files. Language-specific CSS is loaded conditionally per page via Jinja2 session checks to avoid affecting teammates' pages during integration. 

Dynamic Behaviour: Cultural layout changes use Jinja2 conditionals. CSS theming uses [data-lang] attribute selectors on the <html> tag set server-side from the Flask session. JavaScript handles live checklist updates for German users. 

 

5. Internationalisation and Localisation Strategy 

Tool: Flask-Babel with GNU gettext (Phase 1, Section 6.2) 

How it works: All user-facing strings are wrapped in {{ _('...') }} in Jinja2 templates. Flask-Babel resolves these at render time using compiled .mo translation files. 

Language Switching: The /setlang/<lang_code> route sets session['language'] and redirects back to the referring page. The get_locale() function in __init__.py reads this on every request. 

Default Language: English (en). If no session language is set, get_locale() falls back to request.accept_languages.best_match(['en', 'zh', 'de']). 

Translation Files: 

    translations/messages.pot — master template extracted from source 

    translations/zh/LC_MESSAGES/messages.po — Chinese translations 

    translations/de/LC_MESSAGES/messages.po — German translations 

    .mo files compiled via pybabel compile -d app/translations 

 

6. Cultural Adaptation Mechanisms 

Conditionals: Jinja2 {% if session.get('language') %} blocks render entirely different HTML layouts per language on the login and review pages. 

CSS [data-lang] selectors: The <html data-lang="..."> attribute is set server-side. CSS files use [data-lang="zh"] and [data-lang="de"] prefixes to apply cultural overrides globally without JavaScript. 

JavaScript (culture-logic.js): Live checklist updates as German users complete each section of the review and login forms — direct implementation of Hypothesis 1. 

| UI Element                      | Mechanism                                               | Hypothesis             |
|---------------------------------|---------------------------------------------------------|------------------------|
| Navbar/footer colour            | CSS [data-lang] in nav-footer-styles.css                | H1 (DE), H3 (ZH)       |
| Button colour                   | CSS [data-lang] in login-styles.css / review-styles.css | H1 (DE), H3 (ZH)       |
| Star colour                     | CSS [data-lang] in components-styles.css                | H3 (ZH), H1 (DE)       |
| Login page layout               | Jinja2 conditional in login.html                        | H1 (DE), H3/H4/H5 (ZH) |
| Review page layout              | Jinja2 conditional in review.html                       | H1 (DE), H3/H4 (ZH)    |
| Live checklist (review + login) | Jinja2 conditional + culture-logic.js                   | H1 (DE)                |
| Social proof panel              | Jinja2 conditional, Chinese login only                  | H4, H5 (ZH)            |
| Peer reviews panel              | Jinja2 conditional, Chinese review only                 | H4 (ZH)                |
| Property preview layout         | Jinja2 conditional — banner for ZH, spec list for DE    | H2 (DE), H3 (ZH)       |
| All text strings                | Flask-Babel `_()` with .po files                        | Phase 1 Section 6.2    |
	 

7. Individual Contributions 

Garreth Tarrega (C24451694) — Login Page & Review Page 

Pages / Features Implemented: 

    login.html — three culturally distinct login layouts (EN/ZH/DE) including full-bleed background image for Chinese and Facebook-style split with image for German 

    review.html — three culturally distinct review form layouts (EN/ZH/DE) with culturally adapted property previews and peer reviews panel for Chinese 

    culture-logic.js — live submission progress checklist for German users on both login and review pages (Hypothesis 1) 

    components-styles.css — shared star rating and sticky footer styles 

    login-styles.css — login page cultural colour, layout, and social proof styles 

    review-styles.css — review page cultural colour, checklist, and property preview styles 

    nav-footer-styles.css — global navbar and footer theming for all three languages 

    Flask-Babel translation files (ZH and DE) for login and review pages 

Cultural Dimensions Addressed: 

    High UA + Individualist (German / Karl): Live checklist on login and review provides step-by-step confirmation (Hypothesis 1). German property preview uses an explicit labelled spec list (Hypothesis 2). Structured 50/50 split login layout minimises ambiguity (Phase 1 Section 6.3 Layout). 

    Low UA + Collectivist (Chinese / Wei Chen): Social proof bar on login (Hypotheses 4 and 5). Peer reviews panel above review form (Hypothesis 4). Full-bleed image login with frosted card creates exploratory, visually rich experience (Hypothesis 3). Chinese property preview uses a large banner image with social context (Phase 1 Section 6.3 Images). 

Hypotheses and Where They Appear: 

    Hypothesis 1 — live checklist on review.html and login.html, driven by culture-logic.js 

    Hypothesis 2 — German property preview spec list in review.html 

    Hypothesis 3 — Chinese colour palette, full-bleed login image, banner property preview 

    Hypothesis 4 — peer reviews panel on review.html (Chinese only), social proof bar on login.html (Chinese only) 

Deviations from Group Guidelines: 

    German colour: Phase 1 Section 6.3 specifies blue/neutral grey. Charcoal (#212529) used instead for full monochrome consistency across navbar, footer, buttons, checklist, and stars. The guideline's intent — structured, professional High UA interface — is fully preserved. 

    Language CSS loading: Loaded per-page in {% block extra_css %} rather than globally in base.html, to avoid affecting teammates' pages during integration while still applying correctly on every Garreth-owned page. 

 

Alex Shibu Aikkeriath (C24375301) — About Page & Profile Dashboard 

Pages / Features Implemented: 

    about.html — Three culturally distinct mission layouts including localized terminology for Irish housing concepts. 

    profile.html — Three culturally distinct dashboard layouts (EN/ZH/DE) featuring dynamic bio translation and "Click to Reveal" toggles. 

    profile-styles.css — Cultural color palettes, progressive disclosure styles, and layout stability rules (min-vh-100). 

    about-styles.css — Theming for localized mission statements and "Ask a Resident" pop-up interface. 

    nav-footer-styles.css — Global navbar and footer theming adapted for all three language modes. 

    Flask-Babel translation files (ZH and DE) — Specifically covering the About mission and Profile dashboard labels. 

    Modulo Image System — Logic using loop.index % 4 to cycle profile and saved listing assets for performance and variety. 

Cultural Dimensions Addressed: 

    High UA + Individualist (German / Karl): The Profile page emphasizes Verified Resident badges and precise data points to provide certainty. The About page uses a structured "mental map" of Irish housing to reduce navigation anxiety. 

    Low UA + Collectivist (Chinese / Wei Chen): The Profile page uses a "Click to Reveal" toggle to manage information density and prevent fatigue. The About page incorporates the "Ask a Resident" feature and peer testimonials to satisfy the need for social validation. 

Hypotheses and Where They Appear: 

    Hypothesis 1 — Localized Irish housing terminology (dorms vs. residences) in about.html to provide a clear mental map. 

    Hypothesis 2 — Verified Resident Badges and status indicators on profile.html (German only) for clear-validated specifications. 

    Hypothesis 3 — Progressive Disclosure Toggle ("Click to Reveal") for the bio section on profile.html (Chinese only). 

    Hypothesis 4 — Peer-driven mission statements and social proof testimonials on about.html (Chinese only). 

    Hypothesis 5 — "Ask a Resident" interactive pop-up feature on about.html to facilitate spontaneous social connection. 

Deviations from Group Guidelines: 

    Custom Dark Mode (DE): Used Charcoal (#212529) for the German profile/about theme rather than standard blue/grey to ensure high-contrast professional consistency across all components. 

    Per-Page CSS Loading: Styles are loaded via {% block extra_css %} in the individual templates rather than a single global file. This was done to maintain strict modularity and prevent my cultural layout logic from interfering with other team members' pages during the final integration. 

Nathaniel Dedumo (C24516069) — Dormitory Listings & Interactive Map 

Pages / Features Implemented: 

    listings.html — Substantive information exploration hub with a dynamic layout controller and multi-criteria filter engine. Acts as the central page of the site — all three cultural layouts are served from this single template via Jinja2 conditionals and locale-specific asset injection. 

    en_listings.css / en_listings.js — Booking.com-inspired 3-column card grid with left sidebar filter panel and map thumbnail. Blue palette (#0d6efd), neutral EN conventions. 

    de_listings.css / de_listings.js — High-precision, linear flex-row layout inspired by Trivago.ie for German users. Charcoal palette (#212529), full-width map banner, Amazon-style collapsible sidebar, horizontal cards with explicit spec table. 

    zh_listings.css / zh_listings.js — Non-linear, high-density cards-left / map-right split layout inspired by McDonald's China for Chinese users. Orange palette (#ff6633), vibrant amenity tags, prominent review counts. 

    Leaflet Map Integration — Interactive geographic validation tool providing visceral feedback and a "mental map" of Dublin. All 16 dorm markers shown upfront; map centres on individual dorm on card hover. 

    Multi-Criteria Filter Engine — Client-side filter system supporting property type, price range, location, university, distance, and amenities simultaneously. Filter state is pre-applied from the index page via Flask URL params (?uni=, ?type=, ?search=). 

    Locale Asset Controller — Jinja2 session-based logic dynamically injects the correct CSS and JS pair per locale within {% block extra_css %} and {% block extra_js %}. 

Cultural Dimensions Addressed: 

    High UA + Individualist (German / Karl): Linear, task-centric layout minimises ambiguity. Explicit technical data (room size in m², distance to university in km, contract length in weeks, bills included/excluded) prioritises objective facts over lifestyle imagery. Full-width map banner placed above listings ensures geographic context is established before any card is read. 

    Low UA + Collectivist (Chinese / Wei Chen): High-energy split layout encourages exploratory, non-linear discovery. Persistent right-side map allows simultaneous geographic and card browsing. Emphasis on peer-rating badges and resident review counts provides necessary social validation without requiring interaction. 

Hypotheses and Where They Appear: 

    Hypothesis 1 — Immediate map popups and geographic feedback on listings.html, driven by de_listings.js. Map centres on each dorm on hover, giving Karl a visceral mental map of Dublin. Results count always visible. "Unterkunft ansehen →" CTA provides a clear next-step indicator. 

    Hypothesis 2 — Explicit technical specification table (size, distance, contract, bills) rendered per card in listings.html (DE block) and styled in de_listings.css. High-contrast "Ab €..." pricing in the card aside. 

    Hypothesis 3 — Progressive disclosure via orange hover ring in zh_listings.js reveals map context on interaction rather than upfront. Vibrant orange palette in zh_listings.css entices exploration. Controls information density per Miller's Law. 

    Hypothesis 4 — Resident review counts prominently displayed on every card. Orange amenity tags in zh_listings.css frame community features (bills included, furnished) as social proof rather than dry specs. 

Deviations from Group Guidelines: 

    Verified Badge Colour: Phase 1 Section 6.3 specifies a blue/neutral grey palette. Green (#198754) is used for the "Bestes Angebot" deal badge in the German interface to provide distinct, visceral trust signalling required for High UA financial security decisions. The intent of the guideline — structured, professional interface — is preserved. 

    Asset Loading Strategy: Culturally adapted CSS and JS are loaded within {% block extra_css %} and {% block extra_js %} in listings.html rather than globally in base.html. This ensures locale-specific listing styles only apply to the listings page and do not interfere with teammates' pages during integration. 

 

Parva Brijesh Shah (D24125609) - Landing/Homepage 

 

Pages / Features Implemented 

    index.html - Three culturally distinct homepage layouts (EN / ZH / DE), each with a hero section, Irish university carousel, accommodation cards, how-it-works steps, student reviews, and a call-to-action banner 

    home-styles.css (static/css/Parva/home-styles.css) - All homepage cultural colour schemes, layout rules, carousel styles, and responsive breakpoints for all three language variants 

    University Campus and Logo Images (static/assets/img/cn-homepage/) & (static/assets/img/de-homepage/)  - Eight Irish university campus photos and logos used in the English/Chinese and German carousels respectively 

    Flask-Babel translation entries (ZH and DE .po / .mo files) - Covering all homepage strings including section headings, university descriptions, accommodation specs, review quotes, social ticker messages, and CTA text 

 

Cultural Dimensions Addressed 

High UA + Individualist (German / Karl Schmidt) 

The German homepage is built to eliminate ambiguity and give Karl a clear mental model before he starts searching. 

    A four-step progress bar ("Search › Compare Listings › View Details › Book") sits below the navbar and highlights the active step as the user scrolls - directly addressing Karl's need for constant position feedback 

    The hero is solid black with a trust panel listing four explicit guarantees (Verified Listings, Exact Specifications, Transparent Pricing, 4,800+ Reviews) - facts only, no decorative imagery 

    The university carousel shows one university at a time in a full-width slide with the university logo, star satisfaction rating, average walk time, average rent, listing count, and a description - matching the High UA preference for structured, linear navigation 

    The accommodation slider also shows one listing at a time with an explicit spec table (Room Size, Distance, Contract Length, Bills, Weekly Price) for every property 

    All text is fully translated into German via Babel 

Low UA + Collectivist (Chinese / Wei Chen) 

The Chinese homepage is designed to feel vibrant, social, and explorable - giving Wei Chen the peer validation she needs before committing. 

    A social ticker runs below the navbar showing real-time community activity ("98 students viewed Yugo Dublin today", community events, top-rated listings) - the social proof Wei Chen trusts above any data sheet 

    An Ask a Resident bar sits prominently in the hero, inviting Wei Chen to connect with current residents before deciding 

    The hero mosaic replaces the German trust panel with a 2×3 grid of interactive tiles (Student Reviews, Events, Shared Kitchen, Study Spaces, Transport) encouraging spontaneous exploration 

    The university carousel shows campus life photos rather than logos, making the choice feel social and aspirational 

    Accommodation cards include a peer-validation snippet ("104+ students already living here") targeting the Collectivist decision-making pattern 

    The how-it-works steps are reframed as a community journey: "Explore → Read Reviews → Ask a Resident → Join the Community" 

    All text is fully translated into Mandarin via Babel 

  

Hypotheses and Where They Appear 

Hypothesis 
	

Implementation on Homepage 

Hypothesis 1 - Constant feedback prompts give High UA users a clear mental map 
	

Four-step progress bar (German only), highlights current step in gold as user scrolls 

Hypothesis 2 - Technical specification sections build confidence for Individualist users 
	

Accommodation slider spec table (German only): Room Size, Distance, Contract Length, Bills, Weekly Price 

Hypothesis 3 - Progressive disclosure and layered density reduce cognitive overload for Low UA users 
	

Hero mosaic grid, Ask a Resident bar, campus photo carousel - all encourage discovery over instruction 

Hypothesis 4 - Peer review and social proof content engages Collectivist users 
	

Social ticker, "104+ students already living here" snippets on cards, Chinese-language review section with named student avatars 

Hypothesis 5 - "Ask a Resident" feature satisfies the spontaneous social connection need 
	

Prominent Ask a Resident bar in the Chinese hero, linking to the profile/messaging page 

 

Deviations from Group Guidelines 

German colour scheme: Phase 1 Section 6.3 specifies blue and neutral grey for the German layout. Solid black with gold accents was used instead, as black communicates authority and precision more effectively for a High UA audience. The guideline's intent - structured, professional, trust-building - is fully preserved. 

Per-page CSS loading: home-styles.css is loaded via {% block extra_css %} in index.html rather than globally in base.html, following the team's agreed convention to maintain modularity and prevent styles leaking into teammates' pages. 

Data in template, not routes: All homepage content (university data, accommodation listings, review quotes) is defined as Jinja {% set %} variables inside index.html rather than passed from routes.py. This keeps routes clean and ensures all strings are visible to Babel for translation extraction at compile time. 

 
 

 

 

 

 

 

 

 

Nathan John Paseos (C24380561) — Dorm Info Page 

Pages / Features Implemented: 

    info.html -  
    Master dorm detail page; dispatches to locale-specific sub-templates via a Jinja2 {% include %} conditional based on session['language'] 

    chineseinfo.html - 
    Chinese info layout: media-first, two-column grid (YouTube tour + carousel, TikTok shorts feed + scrollable reviews), with dorm details placed below content 

    germaninfo.html - 
    German info layout: task-centric 50/50 split (carousel left, explicit spec card right), horizontal reviews carousel, and a "Contact a Resident" CTA 

    css/Nathan/en_infostyles.css - 
    Neutral single-column layout for English users 

    css/Nathan/zh_infostyles.css - 
    Orange-accented, media-dense, discovery-oriented layout for Chinese users 

    css/Nathan/de_infostyles.css - 
    Charcoal-accented, structured, data-forward layout for German users 

    js/Nathan/en_info.js - 
     Save/bookmark toggle and horizontal review carousel for English 

    js/Nathan/zh_info.js - 
    Save toggle with Chinese aria-labels (收藏宿舍 / 取消收藏宿舍), TikTok card interactions, vertical review scroll logic 

    js/Nathan/de_info.js - 
    Save toggle with German aria-labels (Unterkunft speichern / entfernen), horizontal reviews carousel with arrow fade, keyboard navigation on Bootstrap carousel 

 

Cultural Dimensions Addressed: 

    High Uncertainty Avoidance + Individualism (German / Karl):  
    The German layout leads with the image carousel alongside an explicit details card displaying location, university, price, and a full amenities checklist -> all visible without any interaction. The "Contact a Resident" link is positioned below the carousel rather than buried in navigation, reducing the ambiguity Karl identifies as a blocker. Reviews are arranged in a horizontal carousel with clear prev/next arrows and opacity feedback to indicate scroll limits, giving a structured, predictable browsing path. 

    Low Uncertainty Avoidance + Collectivism (Chinese / Wei Chen):  
    The Chinese layout opens with social and video content before logistics -> a YouTube dorm tour and a TikTok shorts feed with dorm-specific hashtags appear in row one, peer reviews appear in row two, and factual details only appear below. This mirrors Wei Chen's stated preference for discovering the "vibe" of a community before committing. The orange colour vibrant palette and media-dense two-column grid encourage exploration rather than linear task completion. 

 

Hypotheses and Where They Appear in the UI: 

    Hypothesis 1 (High UA / Karl):  
    Explicit, always-visible spec card in germaninfo.html gives Karl the precise data (location, university, price, amenitie), without requiring any interaction. The structured carousel-plus-card split provides a clear mental model of the page before he scrolls. 

    Hypothesis 2 (Individualist / Karl):  
    The German details card presents a labelled specification list (rather than contextual prose), directly mapping to the "technical specification" design response. A "Contact a Resident" link replaces social proof panels, giving Karl an opt-in, task-directed route to further information. 

    Hypothesis 3 (Low UA / Wei Chen):  
    YouTube embed and TikTok shorts feed in chineseinfo.html implement progressive media disclosure. The rich visual content is surfaced at the top of the page, reducing the need to read specs first. The orange accent palette and zh_infostyles.css density encourage page exploration. 

    Hypothesis 4 (Collectivist / Wei Chen):  
    Chinese reviews (dorm_reviews block, lang == 'zh') are populated with peer names, avatars, and community-oriented comments (e.g., referencing the social atmosphere and the "Ask a Resident" feature). The reviews panel sits in row two of the Chinese layout, directly above the dorm details, reinforcing social proof before factual data. 

 

Deviations from Group Guidelines: 

    Per-page CSS loading:  
    CSS files are loaded inside {% block extra_css %} in info.html rather than globally in base.html. This prevents my locale-specific styles (particularly the .info-body--zh and .info-body--de overrides) from leaking into teammates' pages during integration. The cultural theming still applies correctly on every page to load via the session language check. 

    Sub-template {% include %} pattern:  
    Rather than a single monolithic info template with deeply nested conditionals, locale layouts are split into chineseinfo.html and germaninfo.html and included at dispatch time. This keeps each cultural layout readable and independently editable, at the cost of slightly more template files than the base guideline anticipates. Shared data (dorm variables, reviews) is set once in info.html and passed through Jinja2's template scope. 

 

 

 

8. Setup and Execution Instructions 

Install dependencies: 

pip install -r requirements.txt 
 

Compile translations (required after any .po file changes): 

pybabel compile -d app/translations 
 

Run the application: 

flask run 
 

If Flask does not auto-detect the app package: 

export FLASK_APP=app 
flask run 
 

Testing cultural switching: 

    Navigate to /login or /review 

    Click EN, CN, or DE in the top-right language switcher 

    The page reloads with the correct cultural layout, colours, and language applied 

 

9. Limitations 

    Translations only cover the login and review pages. Other pages remain in English regardless of language selection until teammates add _() wrappers to their templates. 

    The property preview on the review page uses a static image and hardcoded address — in production this would be passed dynamically from the route based on the selected dormitory. 

    Social proof content (review snippets, user count) is hardcoded — a production version would pull live data from a database. 

    The email validation in culture-logic.js uses a basic includes('@') check rather than full format validation — sufficient for live feedback but not for form submission validation. 

    .mo files must be manually recompiled after any .po file edits — there is no auto-compile step on Flask startup. 

    Hypothesis 5's "Ask a Resident" pop-up feature is not implemented on login or review — per Phase 1 Section 6.4, this falls within Parva's contribution pages. 

    German colour deviates from the Phase 1 group guideline (blue/grey specified) — documented and justified in Section 7 above. 

 

 

 

 

 
