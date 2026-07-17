/**
 * Kanoniskt pressmaterial — delas av /press och /en/press så att
 * bios och bildlista aldrig glider isär mellan språken.
 */

export type PressImage = {
  src: string;
  label: { sv: string; en: string };
  filename: string;
};

export const PRESS_IMAGES: PressImage[] = [
  {
    src: "/press/rickard-javanainen-regnrace.jpg",
    label: { sv: "Regnrace (liggande)", en: "Rain race (landscape)" },
    filename: "rickard-javanainen-regnrace.jpg",
  },
  {
    src: "/press/rickard-javanainen-portratt.jpg",
    label: { sv: "Porträtt med pokal (stående)", en: "Portrait with trophy (portrait)" },
    filename: "rickard-javanainen-portratt.jpg",
  },
  {
    src: "/press/rickard-javanainen-podium.jpg",
    label: { sv: "Podium", en: "Podium" },
    filename: "rickard-javanainen-podium.jpg",
  },
];

export const BIO_SHORT_SV =
  "Rickard Javanainen är en svensk hyrkartförare från Dalarna med VM-brons 2016 som främsta merit. Han tävlar för Sverige i Kart World Championship 2026 på Vandel Kart i Danmark, 22 juli–1 augusti, både individuellt och i Nations Cup.";

export const BIO_LONG_SV =
  "Rickard Javanainen (född 1992) började köra gokart i Dalarna 2002, tio år gammal. Efter Racinggymnasiet i Mjölby, en andraplats totalt i Renault Junior Cup 2007, JTCC 2008–2010 och två segrar av sex möjliga som inhoppare i Ginetta G20 Cup 2011, tog hyrkarten över. 2015 vann han första upplagan av SRKC i Linköping och gjorde VM-debut i Italien med en 11:e plats av 127, och körde i Nations Cup, lagtävlingen där man kör för sitt land, en stint från sist till först innan laget gick i mål som femma totalt. 2016 vann han VM-finalen i Italien; eftersom titeln avgörs på hela veckans sammanlagda poäng räckte det till brons totalt (3:e av 102). Ytterligare VM-finaler följde 2017 i Spanien (12:e av 172) och 2018 i Polen (14:e av 131, från 16:e till 9:e i finalracet), samt en andra SRKC-titel i Göteborg 2018. Efter en comeback med en 6:e plats totalt i SRKC 2021 (näst bästa svensk) och 3:e bästa svensk 2026 tävlar han nu i den 20:e upplagan av Kart World Championship på Vandel Kart i Danmark, 22 juli–1 augusti 2026, med 180 förare, i både KWC Individual och Nations Cup för Sverige, som han kört i samtliga sina VM. Satsningen möjliggörs av Primab, partner sedan starten, och Labatus, ny partner för 2026.";

export const BIO_SHORT_EN =
  "Rickard Javanainen is a Swedish rental kart racer from Dalarna whose top achievement is a World Championship bronze in 2016. He races for Sweden at the 2026 Kart World Championship at Vandel Kart, Denmark, 22 July–1 August, both individually and in the Nations Cup.";

export const BIO_LONG_EN =
  "Rickard Javanainen started karting in Dalarna, Sweden, in 2002 at the age of ten. After racing school in Mjölby, a runner-up season in the 2007 Renault Junior Cup, JTCC 2008–2010 and two wins from six races as a mid-season stand-in in the 2011 Ginetta G20 Cup, rental karting took over. In 2015 he won the inaugural SRKC in Linköping and made his Worlds debut in Italy, finishing 11th of 127, and in the Nations Cup drove a stint from last to first before the team finished fifth overall. In 2016 he won the World Championship final in Italy, taking bronze overall (3rd of 102). Further Worlds finals followed in Spain 2017 (12th of 172) and Poland 2018 (14th of 131, climbing from 16th to 9th in the final race), plus a second SRKC title in Gothenburg 2018. After a comeback with 6th overall in the 2021 SRKC (second-best Swede) and 3rd-best Swede in 2026, he now races the 20th edition of the Kart World Championship at Vandel Kart, Denmark, 22 July–1 August 2026, against a field of 180 drivers, in both the KWC Individual championship and the Nations Cup for Sweden, a team event he has raced at every Worlds he has entered. The campaign is made possible by Primab, a partner since the start, and Labatus, new for 2026.";
