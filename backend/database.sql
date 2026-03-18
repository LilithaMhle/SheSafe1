DROP DATABASE IF EXISTS shesafe;
CREATE DATABASE shesafe;
USE shesafe;

CREATE TABLE users (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50)  NOT NULL,
  last_name  VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  brand        VARCHAR(80)  NOT NULL,
  category     VARCHAR(60)  DEFAULT 'Sanitary Pad',
  ingredients  TEXT,
  safety_score INT          DEFAULT 0,
  safety_label VARCHAR(60)  DEFAULT 'Unknown',
  description  TEXT,
  price_range  VARCHAR(40)  DEFAULT 'R0-R50',
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, brand, category, ingredients, safety_score, safety_label, description, price_range) VALUES

('Stayfree Ultra Thin', 'Stayfree', 'Sanitary Pad',
'Nonwoven polypropylene cover, Super absorbent polymer (SAP) core, Polyethylene back sheet, Adhesive strips',
48, 'Higher Risk',
'Stayfree (manufactured by Johnson & Johnson SA) was among the brands directly named in the 2026 UFS study on EDCs in SA sanitary products. The NCC has initiated a formal investigation into Johnson & Johnson SA as a result. The brand does not publicly disclose a full ingredient list. EDCs including bisphenols and parabens were detected across the study products. Manufacturers have stated that chemical levels fall within international regulatory limits, but long-term cumulative exposure remains a concern according to UFS researchers.',
'R20-R45'),

('Always Infinity FlexFoam', 'Always', 'Sanitary Pad',
'FlexFoam absorbent core, Nonwoven cover, Polyethylene back sheet, Fragrance, Adhesive strips',
45, 'Higher Risk',
'Always (manufactured by Procter & Gamble SA) was among the brands directly named and tested in the 2026 UFS study. The NCC is investigating Procter & Gamble SA. Always contains added fragrance which can cause irritation for sensitive users and may contain undisclosed fragrance compounds. Bisphenols were detected in 100% of sanitary pads tested in the study. Limited public ingredient transparency.',
'R40-R75'),

('Kotex Natural', 'Kotex', 'Sanitary Pad',
'Organic cotton top layer, Chlorine-free cellulose pulp, Polyethylene back sheet, Hydrogenated mineral oil, No fragrance, Adhesive',
60, 'Moderate Risk',
'Kotex (manufactured by Kimberly-Clark SA) was directly named in the 2026 UFS study and the NCC is investigating Kimberly-Clark SA. The Natural range uses an organic cotton top layer and no added fragrance which is better than conventional options. However, Kotex has been found to contain hydrogenated mineral oil, and bisphenols were detected across all pads tested in the study regardless of organic marketing claims. Prof Visser noted that even products marketed as chemical-free were not verified to be EDC-free.',
'R55-R95'),

('Lil-Lets Ultra', 'Lil-Lets', 'Sanitary Pad',
'Nonwoven cover, Cellulose pulp core, Polyethylene back sheet, Fragrance, Adhesive strips',
50, 'Moderate Risk',
'Lil-Lets (manufactured by Premier Group SA) was directly named in the 2026 UFS study. The NCC is investigating Premier Group as a result. Contains added fragrance. The brand does not fully disclose its ingredient list. Bisphenols were detected in 100% of pads and parabens in over 81% of pads tested in the study. Manufacturers have stated levels are within international regulatory frameworks.',
'R25-R50'),

('Natracare Organic', 'Natracare', 'Sanitary Pad',
'100% GOTS certified organic cotton cover, Ecologically certified cellulose pulp core, Plant starch (corn starch) back sheet, BPA-free medical grade non-toxic glue, No fragrance, No dyes, No chlorine bleach, No plastic, No SAP',
96, 'Very Low Risk',
'Natracare is the gold standard in safe menstrual products. Certified to the Global Organic Textile Standard (GOTS) and independently tested with no detectable heavy metals or chemicals of concern in 2024 lab tests. Explicitly free from phthalates, bisphenols, parabens, plastic, latex, petroleum derivatives, synthetic fragrances and dyes. Uses totally chlorine-free bleaching. Gynaecologist recommended for sensitive skin. Prof Visser of UFS specifically recommends looking for OEKO-TEX Standard 100 certified products — Natracare meets and exceeds this standard.',
'R85-R140'),

('Carefree Panty Liner', 'Carefree', 'Panty Liner',
'Polyester nonwoven cover, Cellulose pulp core, Polyethylene back sheet, Synthetic fragrance, Adhesive',
38, 'Higher Risk',
'Carefree panty liners contain synthetic fragrance and use conventional synthetic materials throughout. The 2026 UFS study found phthalates in 100% of panty liners tested — a higher rate than for pads. Bisphenols were detected in 75% of liners. The brand does not disclose a full ingredient list. Panty liners have prolonged daily contact with sensitive skin, making chemical exposure a greater cumulative concern than with pads used only during menstruation.',
'R25-R45'),

('Twinsaver Regular', 'Twinsaver', 'Sanitary Pad',
'Cellulose fluff pulp core, Nonwoven polypropylene cover, Polyethylene back sheet, Super absorbent polymer (SAP), Adhesive strip, No added fragrance',
65, 'Low-Moderate Risk',
'Twinsaver is a South African brand manufactured by The Lion Match Company. It was not among the nine brands directly named in the 2026 UFS NCC investigation. Contains no added fragrance which reduces one risk factor. Uses conventional synthetic materials including polyethylene and SAP. Reasonable ingredient transparency for a budget brand. A practical mid-range option for students on a tight budget.',
'R12-R28'),

('Clicks Organics', 'Clicks', 'Sanitary Pad',
'Organic cotton cover, Chlorine-free cellulose pulp, No fragrance, No dyes, Biodegradable back sheet, Adhesive',
88, 'Low Risk',
'Clicks Organics is the private label organic range available at Clicks pharmacies across South Africa. Uses organic cotton and chlorine-free processing with no added fragrance or dyes. While not certified to GOTS or independently tested like Natracare, it represents a significantly better option than conventional brands. Not among the brands under NCC investigation. Prof Visser recommends organic and OEKO-TEX certified products as safer alternatives.',
'R65-R105'),

('Caress Regular Maxi', 'Caress', 'Sanitary Pad',
'Cellulose pulp core, Nonwoven polyester top sheet, Polyethylene back sheet, Super absorbent polymer (SAP), Adhesive strip',
52, 'Moderate Risk',
'Caress is a Shoprite private-label brand manufactured locally in South Africa, sold exclusively at Shoprite and Usave stores making it one of the most affordable options available. Features an absorbent core with anti-leak channels. Does not publicly disclose a full ingredient list. Not among the nine brands directly named in the NCC investigation. Uses conventional synthetic construction similar to other budget pads. At R5 per pack it is the most financially accessible option for low-income students.',
'R5-R15'),

(
  'Lil-Lets SmartFit Regular Tampon', 'Lil-Lets', 'Tampon',
  'Absorbent core: Viscose (no chlorine bleach), Cover: Polyester/Polyethylene, String: Cotton/Polyester, Wrapper: Cellophane (compostable)',
  72, 'Low-Moderate Risk',
  'Lil-Lets is a South African brand owned by Premier FMCG, widely available at Clicks, Dis-Chem, Woolworths, Pick n Pay and Spar. The standard SmartFit tampon uses viscose (plant-based rayon) bleached without chlorine — a safer process than traditional chlorine bleaching. No added fragrance. The viscose core comes from FSC certified sustainable forests in Europe. Lil-Lets was among the brands named in the 2026 UFS NCC investigation for their pads range; the tampon range was not specifically named. The SmartFit design expands all the way round for comfort.',
  'R40-R70'
),

(
  'Lil-Lets Organic Cotton Tampon', 'Lil-Lets', 'Tampon',
  '100% GOTS certified organic cotton, No fragrance, No dyes, No chlorine bleach, No synthetic fertilisers or pesticides, Compostable cellophane wrapper',
  94, 'Very Low Risk',
  'Lil-Lets Organic tampons are certified to the Global Organic Textile Standard (GOTS) and approved by the ICEA. Made from 100% pure organic cotton, GM-free, grown without synthetic fertilisers or potentially toxic pesticides. Dermatologically tested and free from all harmful chemicals to OEKO-TEX Standard. 100% plastic-free tampon core. Available at Clicks and Dis-Chem across South Africa. One of the safest tampon options currently available in SA. Prof Visser of UFS specifically recommends OEKO-TEX and organic certified products as the safest choice.',
  'R65-R110'
),

(
  'Tampax Pearl Regular Tampon', 'Tampax', 'Tampon',
  'Absorbent core: Purified cotton and rayon blend, Cover: Polyethylene/polypropylene, LeakGuard braid: Polyester, String: Polyester, Applicator: BPA-free plastic, No fragrance, Elemental chlorine-free bleaching',
  68, 'Low-Moderate Risk',
  'Tampax Pearl is manufactured by Procter & Gamble and available at major SA retailers. The tampon is made without elemental chlorine bleaching and contains no added fragrance. OEKO-TEX Standard 100 certified — tested for over 1000 harmful substances. The rayon-cotton blend core is purified to remove impurities. Procter & Gamble (who also make Always pads) is under NCC investigation for their SA pad range; the tampon range carries the same OEKO-TEX certification. Uses a BPA-free plastic applicator.',
  'R55-R90'
),

(
  'Kotex Regular Tampon', 'Kotex', 'Tampon',
  'Absorbent core: Elemental chlorine-free bleached rayon, Cover: Polyester/Polyethylene, String: Rayon/Polyester, No fragrance, BPA-free',
  70, 'Low-Moderate Risk',
  'Kotex tampons are manufactured by Kimberly-Clark and widely available across South Africa. Made with elemental chlorine-free rayon — a safer bleaching process that does not produce dioxins. Fragrance-free and BPA-free. OEKO-TEX Standard 100 certified, tested against over 1000 harmful substances. Kimberly-Clark is under NCC investigation for their Kotex pad range following the 2026 UFS study; the tampon range carries OEKO-TEX certification. Gynecologist tested.',
  'R45-R80'
);
