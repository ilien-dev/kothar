# Logo shape and structure: peer-reviewed evidence on consumer responses

Conventions used throughout:

- **Verification.** Every citation below was confirmed against a fetched record (Crossref and/or Semantic Scholar/OpenAlex/PubMed metadata: title, authors, year, journal, DOI). "Abstract" means the claim is in the abstract I fetched; "full text" means I read it in a fetched author/repository copy; "snippet" means only a search-result snippet of the publisher/JSTOR page was seen. Anything else is flagged **UNVERIFIED**.
- **Grade.** strong = replicated / meta-analytic; moderate = multi-study single paper (or large multi-country single paper); weak = single study, abstract-only detail, or contested.
- **SVG measurement** lines are my own operationalisation proposals (inference), not something the cited papers prescribe, unless stated.

---

## 1. What did Henderson & Cote (1998) find about naturalness, harmony, elaborateness; which guidelines; was it replicated cross-culturally?

### Takeaway
Henderson & Cote reduced 13 rated design characteristics of 195 unfamiliar logos to three dimensions (elaborateness, naturalness, harmony) plus objective elements (repetition, proportion, parallelism) and derived goal-specific guidelines; the dimensional structure and most effects were reproduced in China/Singapore (2003) and across ten countries (2009). Design explains a lot of variance in liking (28-84%) but very little in true recognition (3-10%), so the "design for memorability" part is far weaker than the "design for liking" part.

### Cited Findings

**F1.1 - Original guidelines (Henderson & Cote 1998).**
- Citation: Henderson, P. W., & Cote, J. A. (1998). Guidelines for Selecting or Modifying Logos. *Journal of Marketing*, 62(2), 14-30. DOI 10.1177/002224299806200202 (APA lists the JSTOR DOI 10.2307/1252158). Metadata: [Crossref](https://api.crossref.org/works/10.1177/002224299806200202); [APA PsycNet record](https://psycnet.apa.org/record/1998-04536-002).
- Design: stimulus-level correlational/regression study; 195 logos "calibrated on 13 design characteristics"; logos were unfamiliar, without text (taken from a book of foreign logos and Yellow Pages, per the 2009 follow-up) - abstract via [OpenAlex](https://api.openalex.org/works/doi:10.1177/002224299806200202); stimulus description in [van der Lans et al. 2009, repository full text](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf).
- Sample: independent rater groups incl. university students (per APA summary snippet); exact N and country (US) **UNVERIFIED** - full text not retrievable (JSTOR/SAGE paywalled).
- Findings (abstract, verbatim sense): "High-recognition logos (accurate recognition created by high investment) should be very natural, very harmonious, and moderately elaborate. Low-investment logos (false sense of knowing and positive affect) should be less natural and very harmonious. High image logos (professional look and strong positive image) must be moderately elaborate and natural." - [OpenAlex abstract](https://api.openalex.org/works/doi:10.1177/002224299806200202).
- Additional guideline detail (snippet only, JSTOR page): high-recognition = "high in natural and harmony, moderately high elaborateness, repeated elements combined with extensive exposure"; low-investment = "below average on natural, high harmony, moderately high elaborateness, parallel lines, and good proportion" - [JSTOR stable 1252158](https://www.jstor.org/stable/1252158) (snippet-level).
- Shape of elaborateness effect: later authors summarise H&C 1998 as finding "a reverse-U shaped effect of logo elaborateness ... on affect toward the logo" - [Miceli et al. 2014, repository full text](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf).
- Dimension definitions: "Elaborateness refers to a design's richness and its ability to capture the essence of an object; natural designs depict commonly experienced objects; and harmony refers to the congruency of the patterns and parts of a design." Subjective elements feeding the dimensions: complexity, activeness, depth, representativeness, organicity, roundness, symmetry, balance; objective elements: repetition (number of times identical shapes are repeated), proportion (width/height ratio), parallelism (number of parallel lines) - [van der Lans et al. 2009 full text](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf). Elaborateness = "a factor combining VC [visual complexity], depth, and activeness" - [Miceli et al. 2014](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf).
- Effect sizes: not available to me for the 1998 paper (**UNVERIFIED**; see F1.3 for the re-analysis coefficients on the same 195 logos).
- Moderators: goal of the logo (recognition vs low-investment vs image); logos without words and unfamiliar only.
- Grade: **strong for the three-dimension structure and the affect effects** (reproduced in F1.2, F1.3); **weak for the exact "moderately elaborate" optimum** (later large studies found a mostly positive linear effect).
- Rule: aim for natural (representative/organic), harmonious (balanced/symmetric), moderately-to-fairly elaborate marks; add repetition of elements only if a recall budget exists.
- SVG measure: naturalness = share of path length made of curves (C/S/Q/A commands) vs straight segments plus a classifier/human rating of representativeness; harmony = mirror-symmetry score (IoU of the filled raster with its reflection about the best axis) and balance (distance between ink centroid and bounding-box centre / diagonal); elaborateness = node count, sub-path count, perimeter^2/area, compressed raster size; repetition = number of congruent sub-paths after normalising translation/rotation/scale; proportion = bbox width/height; parallelism = count of segment pairs with equal direction.

**F1.2 - Asia replication (China, Singapore).**
- Citation: Henderson, P. W., Cote, J. A., Leong, S. M., & Schmitt, B. (2003). Building strong brands in Asia: selecting the visual components of image to maximize brand strength. *International Journal of Research in Marketing*, 20(4), 297-313. DOI 10.1016/j.ijresmar.2003.03.001. Metadata: [Crossref](https://api.crossref.org/works/10.1016/j.ijresmar.2003.03.001).
- Design/sample: logo evaluations in China and Singapore; N **UNVERIFIED** (publisher abstract not retrievable; the SSRN text is a "description of the paper and not the actual abstract").
- Findings: "Significant relationships were found between design elements and ... positive affect, quality perceptions, recognition, consensus in meaning, and geomancy [feng shui]. Chinese and Singaporean respondents held similar design perceptions and reacted similarly ... elaborate, natural, and harmonious logo designs may be employed to create positive affect, quality perceptions, clear meaning, true recognition, and favorable geomancy. As many of these relationships also hold in the U.S., the visual aspects of branding may apply across international borders." - [SSRN description](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=348520).
- Later summary: 2003 and 2009 studies "found that logo elaborateness has a generally positive effect on attitude toward the logo" (i.e., not the inverted U of 1998) - [Miceli et al. 2014](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf).
- Grade: moderate. Rule: the natural/harmonious/elaborate recipe transfers to East Asian audiences. SVG measure: as F1.1.

**F1.3 - Ten-country individual-level replication.**
- Citation: van der Lans, R., Cote, J. A., Cole, C. A., Leong, S. M., Smidts, A., Henderson, P. W., Bluemelhuber, C., Bottomley, P. A., Doyle, J. R., Fedorikhin, A., Janakiraman, M., Ramaseshan, B., & Schmitt, B. H. (2009). Cross-National Logo Evaluation Analysis: An Individual-Level Approach. *Marketing Science*, 28(5), 968-985. DOI 10.1287/mksc.1080.0462. Metadata: [Crossref](https://api.crossref.org/works/10.1287/mksc.1080.0462). Read in the accepted-version repository copy: [ERIM ERS-2008-055-MKT](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf).
- Design: same 195 unfamiliar wordless logos; Bayesian finite-mixture structural-equation model with measurement-invariance testing; responses = affect, shared meaning, subjective familiarity, true and false recognition.
- Sample: Argentina, Australia, China, Germany, Great Britain, India, Netherlands, Russia, Singapore, USA; each logo rated on affect/familiarity by "twenty to seventy respondents (about forty on average)" per country; complexity rated by five groups of ~40 undergraduates per country; total N not stated in the passages I read.
- Findings (full text, results section):
  - Ten countries collapse to three response clusters: West (Australia, GB, Germany, Netherlands, US), Asia (China, India, Singapore), Russia; Argentina straddles West/Asia. "elaborateness, naturalness, and harmony are universal design dimensions."
  - Affect: design explains 84% of variance (Asia), 62% (West), 28% (Russia). "In all clusters, affect increases as the design dimensions (harmony, elaborateness, and naturalness) increase." Elaborateness path: .70 Asia, .54 West, .19 Russia. Effects of parallelism, proportion, repetition on affect "are small."
  - Subjective familiarity: 24% (West), 35% (Russia), 41% (Asia) explained; harmony and naturalness positive everywhere; elaborateness positive in West (.26) and Asia (.41), negative in Russia.
  - Shared meaning: ~19-23% explained; "Naturalness increases shared meaning, while elaborateness reduces shared meaning in all three clusters."
  - True recognition: only 10% (Asia), 6% (Russia), 3% (West) explained; naturalness positive (.10/.07/.06); harmony, parallelism, repetition non-significant.
  - False recognition: 6% (Asia), 7% (West), 23% (Russia); "naturalness decreases false recognition, while elaborateness and harmony increase false recognition."
- Moderators: culture cluster (uncertainty avoidance offered as explanation for Russia's lower tolerance of elaborate marks); stimulus set = unfamiliar, wordless symbols.
- Grade: **strong** (multi-country reproduction of the 1998 structure on the same stimulus set; note same logos and overlapping author team, so not an independent-lab, new-stimulus replication).
- Rule: for liking, maximise harmony and naturalness and do not be afraid of some elaborateness (except for audiences like the Russian cluster); do not expect shape alone to buy recognition - true recognition is ~90%+ unexplained by design.
- SVG measure: as F1.1; bbox aspect ratio and parallel-segment count can be computed but had small/near-zero effects.

**F1.4 - Naturalness sub-types (organic vs cultural vs abstract).**
- Citation: Machado, J. C., de Carvalho, L. V., Torres, A., & Costa, P. (2015). Brand logo design: examining consumer response to naturalness. *Journal of Product & Brand Management*, 24(1), 78-87. DOI 10.1108/JPBM-05-2014-0609. Metadata: [Crossref](https://api.crossref.org/works/10.1108/JPBM-05-2014-0609).
- Design/sample: survey, 96 logos pre-classified as abstract / cultural / organic; two studies, 220 participants, Portugal.
- Findings (abstract): "natural logos are clearly preferred to abstract logos ... within natural logos, organic designs are favored over cultural designs"; "affect toward unknown organic logos is at the same level as affect toward well-known abstract logos." - [OpenAlex abstract](https://api.openalex.org/works/doi:10.1108/jpbm-05-2014-0609). Effect sizes not in abstract.
- Grade: weak-to-moderate (single country, single paper; consistent with F1.1-F1.3).
- Rule: prefer organic/representational forms over purely abstract geometry when liking at zero familiarity is the goal.
- SVG measure: curve-segment share; variance of curvature along the outline (organic shapes have continuously varying curvature, geometric ones piecewise-constant: lines = 0, arcs = constant).

### Inferences
- The most replicated claim in the logo-shape literature is dimensional (three perceptual dimensions) and affective (natural + harmonious = liked). The widely repeated practitioner claim that "good design makes a logo memorable" has weak support in these data: design dimensions explain 3-10% of true recognition.
- "Moderate elaborateness" (1998) versus "more elaborate is better" (2003, 2009) is an unresolved internal inconsistency; Section 4 shows exposure count is a plausible moderator.
- Harmony and elaborateness raise *false* recognition ("feels familiar"), useful for low-budget brands but a risk for distinctiveness.

### Gaps
- Could not retrieve the 1998 full text: exact rater Ns, factor loadings, regression R2 and the mapping of "round" (reported as a separate characteristic in secondary sources) are UNVERIFIED.
- No independent-lab replication with a *new* logo set and modern (wordmark-inclusive, flat) logos was found.

---

## 2. Round vs angular logos: warmth/comfort vs competence/durability

### Takeaway
A general preference for curved over angular contours is meta-analytically supported (Hedges' g = 0.39) but is moderated by exposure time, stimulus type, task and expertise. For logos specifically, the key causal paper (Jiang et al. 2016) shows shape changes *attribute inferences* (circular -> soft/comfortable/caring; angular -> hard/durable) with small-to-medium effects (partial eta-squared ~.07-.09), and the effect disappears under visual load or when copy states a conflicting attribute. No independent pre-registered replication of the logo-specific effect was found.

### Cited Findings

**F2.1 - Curvature preference, basic effect.**
- Citation: Bar, M., & Neta, M. (2006). Humans Prefer Curved Visual Objects. *Psychological Science*, 17(8), 645-648. DOI 10.1111/j.1467-9280.2006.01759.x. [PubMed 16913943](https://pubmed.ncbi.nlm.nih.gov/16913943/).
- Design: lab experiment, like/dislike snap judgments of objects/patterns with curved vs sharp-angled contours. Sample N/country (US) not in abstract - **UNVERIFIED**.
- Finding (abstract): "sharp transitions in contour might convey a sense of threat, and therefore trigger a negative bias ... The type of contour a visual object possesses ... has a critical influence on people's attitude toward that object." No statistic in abstract.
- Companion: Bar, M., & Neta, M. (2007). Visual elements of subjective preference modulate amygdala activation. *Neuropsychologia*, 45(10), 2191-2200. DOI 10.1016/j.neuropsychologia.2007.03.008. fMRI: amygdala "significantly more active for everyday sharp objects ... compared with their curved contour counterparts" - [PubMed 17462678](https://pubmed.ncbi.nlm.nih.gov/17462678/).
- Grade: strong for the behavioural effect (see F2.2); weak for the threat mechanism (see F2.3).

**F2.2 - Meta-analysis of curvature preference.**
- Citation: Chuquichambi, E. G., Vartanian, O., Skov, M., Corradi, G. B., Nadal, M., Silvia, P. J., & Munar, E. (2022). How universal is preference for visual curvature? A systematic review and meta-analysis. *Annals of the New York Academy of Sciences*, 1518(1), 151-165. DOI 10.1111/nyas.14919. Open access; read via [Europe PMC full text PMC10091794](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10091794/fullTextXML).
- Design: three-level random-effects meta-analysis; "61 studies which provided 106 independent samples and 309 effect sizes."
- Effect: "g = 0.39, t = 5.66, p < 0.001, 95% CI [0.25, 0.52]"; ignoring dependency g = 0.32 [0.26, 0.38]. Funnel plot "does not indicate asymmetry, nor ... evidence of publication bias."
- Moderators: presentation time (limited display, 84-7000 ms: g = 0.75 [0.52, 0.99], k = 50; unlimited/until response: g = 0.32 [0.17, 0.46], k = 259), stimulus type (real objects k=123, meaningless k=83, spatial design k=73, symbolic design k=30), expertise, task. Authors: "a reliable but not universal phenomenon."
- Grade: **strong**.
- Rule: default to curved contours when the only goal is immediate liking, especially for glance-speed contexts (favicons, app icons); expect the advantage to shrink with deliberate viewing and with expert audiences.
- SVG measure: curvature ratio = length of curved segments / total path length; corner count = number of vertices where tangent direction changes by more than ~30 degrees with zero corner radius; mean absolute curvature; share of corners with rounding (arc joins).

**F2.3 - Liking curves vs disliking angles (mechanism).**
- Citation: Bertamini, M., Palumbo, L., Gheorghes, T. N., & Galatsidas, M. (2016). Do observers like curvature or do they dislike angularity? *British Journal of Psychology*, 107(1), 154-178. DOI 10.1111/bjop.12132. Abstract via [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1111/bjop.12132?fields=abstract).
- Design: four experiments with abstract shapes. Findings: preference for curvature "not linked to perceived complexity"; curved lines "liked more than either angular or straight lines. Therefore, angles are not necessary to generate a preference"; manikin task showed "only a pattern of approach for curvature," not avoidance of angles. "The threat association hypothesis cannot fully explain the curvature effect."
- Citation: Palumbo, L., Ruta, N., & Bertamini, M. (2015). Comparing Angular and Curved Shapes in Terms of Implicit Associations and Approach/Avoidance Responses. *PLOS ONE*, 10(10), e0140043. DOI 10.1371/journal.pone.0140043. Abstract via [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1371/journal.pone.0140043?fields=abstract): IAT - "curved polygons were associated with safe and positive concepts and with female names, whereas angular polygons were associated with danger and negative concepts and with male names."
- Sample: UK (Liverpool) lab samples; N not in abstracts.
- Grade: moderate (two multi-experiment papers, same lab).
- Rule: angularity signals danger/masculinity/hardness at the association level but does not reliably provoke avoidance; use it deliberately as a meaning cue, not as something to fear.
- SVG measure: as F2.2.

**F2.4 - Circular vs angular logos and attribute inferences (the core logo paper).**
- Citation: Jiang, Y., Gorn, G. J., Galli, M., & Chattopadhyay, A. (2016). Does Your Company Have the Right Logo? How and Why Circular- and Angular-Logo Shapes Influence Brand Attribute Judgments. *Journal of Consumer Research*, 42(5), 709-726. DOI 10.1093/jcr/ucv049. Metadata: [Crossref](https://api.crossref.org/works/10.1093/jcr/ucv049). Read in the author-hosted copy: [amitavac.com PDF](https://static.amitavac.com/2016/02/Jiang-Gorn-Galli-and-Chattopadhyay_2016_JCR.pdf).
- Design: five between-subjects experiments with fictitious brands (sports shoe, sofa, airline scenario), manipulating only logo outline (circular vs angular, plus no-logo control in Exp. 1).
- Samples (full text): Exp. 1 undergraduates N = 109; Exp. 2 undergraduates N = 69; load experiment US MTurk N = 306 (posttest undergraduates N = 165); shape-priming experiment US MTurk N = 95 (58 men, 37 women, mean age 33). Country of the undergraduate samples not stated in passages read (authors at Hong Kong PolyU / INSEAD).
- Statistics (full text, Exp. 2 sofa): logo shape x attribute interaction F(1, 67) = 9.77, p < .01; with the circular logo the sofa was rated more comfortable, F(1, 67) = 5.10, p < .05, partial eta-squared = .071, and less durable (M = 3.43 vs 4.19), F(1, 67) = 6.29, p < .05, partial eta-squared = .086. Load experiment: shape x attribute interaction present with no load, F(1, 300) = 14.48, p < .001, and under cognitive load, F(1, 300) = 13.69, but absent under visual load.
- Mechanism/boundaries (abstract): shapes "activate softness and hardness associations ... through a resource-demanding imagery-generation process that utilizes the visuospatial sketchpad"; "no logo shape effects ... when the visuospatial sketchpad ... is constrained by irrelevant visual imagery, when people have a lower disposition to generate imagery ..., and when the headline of the ad highlights a product attribute that differs from the inference drawn from the logo shape." Effects also arise from incidental shape priming (service context: customer sensitivity).
- Grade: **moderate** (five studies, one paper; small cells; no independent replication located).
- Rule: use round outlines to cue comfort/softness/care/customer sensitivity, angular outlines to cue durability/hardness/toughness - but treat it as a weak nudge that explicit copy overrides.
- SVG measure: circularity of the outer silhouette = 4*pi*area / perimeter^2 (1 = circle); convex-hull corner count and mean interior angle; curvature ratio.

**F2.5 - Redesigning angular logos to rounder ones (brand commitment).**
- Citation A: Walsh, M. F., Winterich, K. P., & Mittal, V. (2010). Do logo redesigns help or hurt your brand? The role of brand commitment. *Journal of Product & Brand Management*, 19(2), 76-84. DOI 10.1108/10610421011033421. Abstract read on [Emerald](https://doi.org/10.1108/10610421011033421).
- Design/sample: field experiment, 632 respondents, two athletic shoe brands (New Balance, Adidas); country not in abstract (US presumed, UNVERIFIED).
- Finding (abstract): "The greater the degree of change in the roundedness of a previously angular logo, the more likely it is that strongly committed consumers will evaluate the redesigned logo more negatively ... Conversely, weakly committed consumers react positively to such changes." Logo evaluation partially mediates the effect on brand attitude. Statistics not in abstract.
- Citation B: Walsh, M. F., Winterich, K. P., & Mittal, V. (2011). How re-designing angular logos to be rounded shapes brand attitude: consumer brand commitment and self-construal. *Journal of Consumer Marketing*, 28(6), 438-447. DOI 10.1108/07363761111165958. Abstract via [OpenAlex](https://api.openalex.org/works/doi:10.1108/07363761111165958).
- Design: two field experiments (mall intercepts, general public; undergraduates). Finding: commitment increases negative thoughts about the rounded redesign; the negative effect "is attenuated when ... rounded logo ... is congruent with the consumers' self-construal (i.e. interdependent self-construal)."
- Grade: moderate (three field experiments, same team; the effect is about *change* for committed customers, partly confounded with change per se).
- Rule: rounding an established angular mark pleases weakly attached prospects and irritates loyal customers; change shape in small steps for brands with a committed base.
- SVG measure: delta in curvature ratio / corner-radius between old and new mark; Hausdorff or IoU distance between old and new silhouettes as "degree of change."

**F2.6 - Roundness outside logos (packaging/graphics) and smile-like curves.**
- Citation: Westerman, S. J., Gardner, P. H., Sutherland, E. J., White, T., Jordan, K., Watts, D., & Wells, S. (2012). Product Design: Preference for Rounded versus Angular Design Elements. *Psychology & Marketing*, 29(8), 595-605. DOI 10.1002/mar.20546. Abstract read on [Wiley](https://onlinelibrary.wiley.com/doi/10.1002/mar.20546): two experiments (chocolate pack; water and bleach bottles) - "a preference for rounded designs that extended to self-report purchase likelihood - with additive effects of contour and graphics shape that could not be accounted for by design typicality or perceived ease of use." UK (Leeds); N not in abstract.
- Citation: Salgado-Montejo, A., Tapia Leon, I., Elliot, A. J., Salgado, C. J., & Spence, C. (2015). Smiles over Frowns: When Curved Lines Influence Product Preference. *Psychology & Marketing*, 32(7), 771-781. DOI 10.1002/mar.20817. Abstract via [OpenAlex](https://api.openalex.org/works/doi:10.1002/mar.20817): same within-participants experiment run in the UK and Colombia; products rated more positively and chosen more often "when they displayed a concave [smile-like] line relative to a convex [frown-like] line."
- Grade: moderate (direct cross-country repetition in the second paper). 
- Rule: upward-opening (smile-like) arcs beat downward-opening ones; rounded graphics and rounded container outlines add up.
- SVG measure: sign of curvature of dominant open arcs relative to the vertical axis (concave-up vs concave-down).

**F2.7 - Shape and brand gender.**
- Citation: Lieven, T., Grohmann, B., Herrmann, A., Landwehr, J. R., & van Tilburg, M. (2015). The effect of brand design on brand gender perceptions and brand preference. *European Journal of Marketing*, 49(1/2), 146-169. DOI 10.1108/EJM-08-2012-0456. Abstract via [OpenAlex](https://api.openalex.org/works/doi:10.1108/ejm-08-2012-0456): four studies, fictitious and real brands; "Brand design elements [logo shape, brand name, type font and color] consistently influenced brand masculinity and femininity perceptions. These, in turn, significantly related to consumer preferences and brand equity." The direction (heavier/angular = masculine; slender/round = feminine) is my recollection and consistent with F2.3, but is **UNVERIFIED** against the abstract.
- Grade: moderate. Rule: shape is a gender cue. SVG measure: stroke weight / ink density plus curvature ratio.

### Inferences
- Two different effects are often conflated: (a) hedonic preference for curves (meta-analytic, g ~0.4, shrinks with viewing time) and (b) semantic inference from shape (soft/warm vs hard/durable; single paper, eta-p2 ~.07-.09). The task's "warmth vs competence" framing is an extrapolation: Jiang et al. measured comfortableness, durability and customer sensitivity, not Fiske-style warmth/competence scales.
- Because copy that names a conflicting attribute cancels the shape effect, logo shape matters most where the mark appears alone (icons, signage, packaging fronts).

### Gaps
- No pre-registered or independent replication of Jiang et al. (2016) was found (Crossref search returned only conceptual extensions, e.g. a 2020 *Sustainability* paper on circular logos and green buying, not read).
- Bar & Neta (2006) sample size and test statistics not verified (abstract contains none).

---

## 3. Asymmetry and excitement/arousal; symmetry and liking/fluency

### Takeaway
Symmetry reliably raises fluency and (implicit) liking in basic research, while two independent marketing teams converge on the claim that asymmetry raises arousal and makes a brand look more "exciting" - beneficial only for brands whose personality is excitement. The marketing evidence rests on two multi-study papers; effect sizes were not retrievable.

### Cited Findings

**F3.1 - Visual asymmetry effect.**
- Citation: Luffarelli, J., Stamatogiannakis, A., & Yang, H. (2019). The Visual Asymmetry Effect: An Interplay of Logo Design and Brand Personality on Brand Equity. *Journal of Marketing Research*, 56(1), 89-103. DOI 10.1177/0022243718820548. Abstract read on [SAGE](https://journals.sagepub.com/doi/abs/10.1177/0022243718820548) and [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1177/0022243718820548?fields=abstract).
- Design: "Five studies using a variety of experimental approaches and secondary data sets" (reference list includes Interbrand Best Global Brands 2011, i.e. financial brand valuations). Sample Ns/countries: **UNVERIFIED** (paywalled full text).
- Findings (abstract): "compared with symmetrical logos, asymmetrical logos tend to be more arousing, leading to increased perceptions of excitement ... consumers tend to perceive asymmetrical logos as more congruent with brands that have an exciting personality. This can boost consumers' evaluations and the market's financial valuations of such brands." Boundary: "occurs only for the personality of excitement and the visual property of asymmetry."
- Grade: moderate (five studies incl. secondary data; conceptually corroborated by F3.2).
- Rule: use an asymmetrical mark only when the intended personality is exciting (daring, spirited, imaginative, up to date); otherwise symmetry is the safer default.
- SVG measure: asymmetry = 1 - max over axes (vertical, horizontal, two diagonals) of IoU(raster, mirrored raster); also centroid offset from bbox centre.

**F3.2 - Symmetry and brand personality.**
- Citation: Bajaj, A., & Bond, S. D. (2018). Beyond Beauty: Design Symmetry and Brand Personality. *Journal of Consumer Psychology*, 28(1), 77-98. DOI 10.1002/jcpy.1009. Abstract read on [Wiley](https://myscp.onlinelibrary.wiley.com/doi/abs/10.1002/jcpy.1009).
- Design: four experiments; samples (US, Georgia Tech authors) and statistics not in abstract - UNVERIFIED.
- Finding (abstract): "asymmetry in visual brand elements is associated by consumers with brand excitement, and ... the effect is driven in part by the experience of subjective arousal."
- Grade: moderate. Together with F3.1 this is a convergent finding from two independent author teams (the strongest shape -> personality link in the logo literature besides round/angular).
- Rule/SVG measure: as F3.1.

**F3.3 - Symmetry -> implicit positive affect via fluency.**
- Citation: Makin, A. D. J., Pecchinenda, A., & Bertamini, M. (2012). Implicit affective evaluation of visual symmetry. *Emotion*, 12(5), 1021-1030. DOI 10.1037/a0026924. [PubMed 22251051](https://pubmed.ncbi.nlm.nih.gov/22251051/).
- Design: IAT experiments with dot patterns (UK). Findings: reflection patterns implicitly associated with positive words; "a reflected pattern was preferred to a rotation or translation, and a rotational pattern was preferred to random patterns"; "implicit preferences were always predicted by the speed at which patterns could be identified ... an automatic affective response produced by perceptual fluency." Implicit and explicit preferences sometimes disagreed.
- Grade: moderate (multi-experiment; consistent with the Reber et al. review, Section 5).
- Rule: mirror (bilateral) symmetry > rotational > translational > none for immediate positive affect.
- SVG measure: separate scores for reflection symmetry, n-fold rotational symmetry (IoU after rotating by 360/n), and translational repetition.

**F3.4 - Symmetry/balance inside "harmony".**
- In the Henderson & Cote framework symmetry and balance are among the eight subjective elements; high-harmony designs "universally increase positive affect, subjective familiarity, and false recognition, while not affecting shared meaning or true recognition" - [van der Lans et al. 2009](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf). Grade: strong (10 countries).
- Rule: symmetry/balance buys liking and a feeling of familiarity, not actual memorability.

**F3.5 - Other structural "tension" cues (related, not symmetry proper).**
- Unstable-looking logos: Rahinel, R., & Nelson, N. M. (2016). When Brand Logos Describe the Environment: Design Instability and the Utility of Safety-Oriented Products. *Journal of Consumer Research*, 43(3), 478-496. DOI 10.1093/jcr/ucw039. Five experiments: unstable-looking logos make consumers infer an unsafe environment, which "increases the perceived utility of safety-oriented products" - [OpenAlex abstract](https://api.openalex.org/works/doi:10.1093/jcr/ucw039). Grade: moderate.
- Implied motion: Cian, L., Krishna, A., & Elder, R. S. (2014). This Logo Moves Me: Dynamic Imagery from Static Images. *Journal of Marketing Research*, 51(2), 184-197. DOI 10.1509/jmr.13.0023. Perceived movement in a static logo raises engagement (self-report and eye tracking) and brand attitude, "moderated by the congruence between perceived movement and brand characteristics" - [OpenAlex abstract](https://api.openalex.org/works/doi:10.1509/jmr.13.0023). Grade: moderate.
- Incompleteness: Hagtvedt, H. (2011). The Impact of Incomplete Typeface Logos on Perceptions of the Firm. *Journal of Marketing*, 75(4), 86-93. DOI 10.1509/jmkg.75.4.86. Three studies: incomplete typeface logos lower perceived trustworthiness (via clarity) and raise perceived innovativeness (via interestingness); overall attitude is hurt only for prevention-focused consumers - [OpenAlex abstract](https://api.openalex.org/works/doi:10.1509/jmkg.75.4.86). Grade: moderate.
- Frames: Fajardo, T. M., Zhang, J., & Tsiros, M. (2016). The Contingent Nature of the Symbolic Associations of Visual Design Elements: The Case of Brand Logo Frames. *Journal of Consumer Research*, 43(4), 549-566. DOI 10.1093/jcr/ucw048. Six studies: a frame reads as protecting under high perceived risk (raises purchase intent) and as confining under low risk (lowers it) - [OpenAlex abstract](https://api.openalex.org/works/doi:10.1093/jcr/ucw048). Grade: moderate.
- Active white space: Sharma, N., & Varki, S. (2018). Active White Space (AWS) in Logo Designs: Effects on Logo Evaluations and Brand Communication. *Journal of Advertising*, 47(3), 270-281. DOI 10.1080/00913367.2018.1463880. Three studies: adding space between logo elements improves visual evaluation and perceived clarity of brand communication; benefits sophisticated personalities most, no effect for rugged - [OpenAlex abstract](https://api.openalex.org/works/doi:10.1080/00913367.2018.1463880). Grade: moderate.
- Rules: closed, complete, stable, framed forms -> trust/safety/protection; open, incomplete, tilted, unframed, dynamic forms -> innovation/excitement/freedom. Match to positioning.
- SVG measures: stability = whether the ink centroid projects inside the base of support and principal-axis tilt from vertical/horizontal; incompleteness = gaps in letter contours (open sub-paths, missing strokes vs reference font); frame = presence of an enclosing closed path containing >= ~90% of other geometry; white space = minimum gap between sub-shapes / bbox size.

### Inferences
- The fluency account (symmetry = easy = liked) and the arousal account (asymmetry = arousing = exciting) are compatible: symmetry optimises valence, asymmetry optimises arousal. A design tool should score both and compare with the intended personality instead of treating symmetry as "good".
- Trust-related evidence in this cluster comes from clarity/completeness (Hagtvedt) and frames/stability, not from symmetry studies directly.

### Gaps
- Effect sizes and Ns for Luffarelli et al. (2019) and Bajaj & Bond (2018) not verified (paywall). No independent replication located.
- No meta-analysis of symmetry preference was located in this session (search engines returned noise); the claim "symmetry -> liking" rests here on Makin et al. (2012), Reber et al. (2004) and the harmony results.

---

## 4. Complexity: simple or moderately complex, and how does repeated exposure change it?

### Takeaway
There is no single winner: visually more complex/elaborate logos are liked more at first sight but lose with repetition, while conceptually richer (multi-meaning) logos start worse and gain with repetition; for recognition, simple logos win short-term and complex ones catch up or win with many exposures. "Design" complexity (elaborate, structured) helps and "feature" clutter hurts - shown for ads, not logos.

### Cited Findings

**F4.1 - Complexity x repetition x spacing.**
- Citation: Janiszewski, C., & Meyvis, T. (2001). Effects of Brand Logo Complexity, Repetition, and Spacing on Processing Fluency and Judgment. *Journal of Consumer Research*, 28(1), 18-32. DOI 10.1086/321945. Metadata: [Crossref](https://api.crossref.org/works/10.1086/321945); abstract via [OpenAlex](https://api.openalex.org/works/doi:10.1086/321945).
- Design: four experiments; samples (US, Florida) and statistics not in abstract - UNVERIFIED.
- Finding (abstract): "stimulus characteristics and presentation factors will interact with repetition to determine the amount of processing fluency ... Four studies are used to test whether two-factor theory or dual-process theory provides a better account." Result as summarised by a later paper: "mono-meaning logos (i.e., logos in which verbal and pictorial elements both convey the same meaning) are initially preferred to multi-meaning logos ..., whereas as the number of exposures increases multi-meaning logos are relatively preferred" - [Miceli et al. 2014](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf). The same source notes J&M "have not empirically tested the mediating role of fluency."
- Grade: moderate (four studies; conceptually replicated by F4.2).
- Rule: if the logo will be seen rarely, make word and picture say the same thing; if it will be seen often, a second layer of meaning pays off.
- SVG measure: not measurable from geometry alone (semantic congruence needs human or model rating).

**F4.2 - Visual vs conceptual complexity across 1, 4, 9 exposures.**
- Citation: Miceli, G. N., Scopelliti, I., Raimondo, M. A., & Donato, C. (2014). Breaking Through Complexity: Visual and Conceptual Dimensions in Logo Evaluation across Exposures. *Psychology & Marketing*, 31(10), 886-899. DOI 10.1002/mar.20741. Read in accepted version: [City Research Online](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf).
- Design: "hybrid experimental study" - real logos pre-rated on visual complexity (VC) and conceptual complexity (CC); participants exposed to a target logo 1, 4 or 9 times among decoys; regression with heteroskedasticity-consistent errors; mediation via perceptual/conceptual fluency.
- Sample: N = 505 (56.2% female; mean age 33.5); cells N = 162 / 178 / 165. Country not stated in passages read (Italian/UK/NL authors).
- Statistics (standardised): VC x exposures = -.41, p < .01; CC x exposures = .38, p < .01. Effect of VC on attitude: +.29 (p < .01) at 1 exposure, +.06 (ns) at 4, -.32 (p < .01) at 9. Effect of CC: -.28 (p < .01) at 1, +.03 (ns) at 4, +.23 (p < .01) at 9. Perceptual fluency -> attitude b ~ .48-.49; conceptual fluency -> attitude b ~ .13-.16.
- Grade: moderate (one large study; single paper).
- Rule: visual richness is a first-impression asset and a long-run liability; semantic depth is the reverse. For a heavily exposed brand, simplify the drawing and keep the idea layered.
- SVG measure (VC): node count, number of sub-paths, number of distinct fills/strokes, perimeter^2/area, number of distinct element types (heterogeneity), PNG/zip size of a fixed-size render.

**F4.3 - Complexity x exposure on recognition and attitude.**
- Citation: van Grinsven, B., & Das, E. (2016). Logo design in marketing communications: Brand logo complexity moderates exposure effects on brand recognition and brand attitude. *Journal of Marketing Communications*, 22(3), 256-270. DOI 10.1080/13527266.2013.866593 (online 2014). Abstract read on [Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/13527266.2013.866593).
- Design/sample: Exp. 1 (N = 68): six unfamiliar logos, 2 (simple vs complex) x 2 (one vs four exposures) mixed design, recognition speed in ms. Exp. 2 (N = 164): eight familiar logos, 2 (complexity) x 2 (well-established vs recently established) within-subjects. Netherlands (author affiliations; not stated in abstract).
- Finding (abstract): "increases in exposure led to an increase in brand recognition and to more positive attitudes in particular for complex brand logos, suggesting short-term benefits for simple brand logos, and long-term benefits for complex logos." Statistics not in abstract.
- Grade: weak-to-moderate (two small experiments; few logos per cell; Exp. 2 is quasi-experimental).
- Rule: low-budget/new brands benefit from simple marks (fast recognition); complexity only pays back with sustained exposure.
- Note the apparent conflict with F4.2 on *attitude* (complex gains vs complex loses with exposure): different complexity operationalisations (stimulus sets of 6-8 logos vs continuous VC ratings), different exposure counts (4 vs 9) and real-world familiarity confounds. Treat as unresolved.

**F4.4 - Feature complexity vs design complexity (ads).**
- Citation: Pieters, R., Wedel, M., & Batra, R. (2010). The Stopping Power of Advertising: Measures and Effects of Visual Complexity. *Journal of Marketing*, 74(5), 48-60. DOI 10.1509/jmkg.74.5.048. Abstract read on [SAGE](https://journals.sagepub.com/doi/10.1509/jmkg.74.5.048).
- Design/sample: 249 advertisements tested with eye tracking (participant N and country not in abstract).
- Finding (abstract): "feature complexity hurts attention to the brand and attitude toward the ad, whereas design complexity helps attention to both the pictorial and the advertisement as a whole, its comprehensibility, and attitude toward the ad." Feature complexity = "dense perceptual features"; design complexity = "elaborate creative design." Objective measures are proposed (feature complexity via compressed file size is my recollection - **UNVERIFIED** against the abstract).
- Grade: moderate for ads; **indirect for logos** (generalisation is an inference).
- Rule: add structure (distinct objects, deliberate irregularity, detail in shape) rather than pixel-level clutter (texture, gradients, noise).
- SVG measure: feature complexity = compressed size (PNG/JPEG/gzip) of a normalised raster; design complexity = count of objects, irregularity of object shape and arrangement, asymmetry, dissimilarity among objects.

**F4.5 - Objective complexity + prototypicality predict market outcomes (cars).**
- Citation: Landwehr, J. R., Labroo, A. A., & Herrmann, A. (2011). Gut Liking for the Ordinary: Incorporating Design Fluency Improves Automobile Sales Forecasts. *Marketing Science*, 30(3), 416-429. DOI 10.1287/mksc.1110.0633. Abstract via [OpenAlex](https://api.openalex.org/works/doi:10.1287/mksc.1110.0633).
- Design: 28 car models; prototypicality = "car-to-morph Euclidian proximity", complexity = "size of a compressed image file"; adding both "improves [sales] prediction by up to 19%"; "prototypical but complex car designs feel surprisingly fluent." Germany (market context; UNVERIFIED in abstract).
- Grade: moderate; indirect for logos.
- Rule: typical-for-category silhouette + rich detail beats both "odd and complex" and "typical and plain."
- SVG measure: compressed raster size; prototypicality = distance of the mark's raster/embedding from the category mean (e.g., mean of competitor logos).

**F4.6 - Simple/flat vs complex logos and behaviour.**
- Citation: Bossel, V., Geyskens, K., & Goukens, C. (2019). Facing a trend of brand logo simplicity: The impact of brand logo design on consumption. *Food Quality and Preference*, 71, 129-135. DOI 10.1016/j.foodqual.2018.06.009. Abstract via [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1016/j.foodqual.2018.06.009?fields=abstract).
- Design: two experiments on actual food intake. Finding: people "consume more from a product which features a simple, flat logo"; moderator: "for non-prestigious products simple brand logos increase consumption, the opposite occurs for prestigious food products." N/country not in abstract.
- Grade: weak (two studies, one category).
- Rule: flat/simple for mass-market, more elaborate for prestige positioning.

**F4.7 - Elaborateness in the Henderson-Cote line.** Inverted U in 1998, positive linear in 2003/2009 at single exposure (see F1.1-F1.3); elaborateness raises affect but lowers shared meaning and raises false recognition - [van der Lans et al. 2009](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf). Grade: strong for the single-exposure positive effect on affect.

**F4.8 - Descriptiveness (semantic simplicity).**
- Citation: Luffarelli, J., Mukesh, M., & Mahmood, A. (2019). Let the Logo Do the Talking: The Influence of Logo Descriptiveness on Brand Equity. *Journal of Marketing Research*, 56(5), 862-878. DOI 10.1177/0022243719845000. Abstract via [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1177/0022243719845000?fields=abstract).
- Design: six studies, multimethod, plus analysis of 597 brand logos. Finding: more descriptive logos "positively influence brand evaluations, purchase intentions, and brand performance ... because [they] are easier to process and thus elicit stronger impressions of authenticity." Moderators: "considerably attenuated for brands that are familiar ... and reversed (i.e., negative) for brands that market a type of product/service linked with negatively ... valenced associations."
- Grade: moderate. Rule: new/unknown brands should show what they sell. SVG measure: not geometric (needs category-recognition model or human naming agreement).

### Inferences
- Reconciling the set: at zero/low exposure, moderate-to-high *visual* elaborateness helps liking (arousal/interest) while low *conceptual* complexity (clear, shared, descriptive meaning) helps; at high exposure, visual simplicity and conceptual depth win. This matches the lifecycle seen in practice (start descriptive and detailed, simplify as equity grows) but that lifecycle claim itself is inference.
- Montoya et al.'s meta-analytic inverted-U for exposure (Section 5) implies any exposure benefit eventually saturates/reverses; complexity plausibly shifts the peak later, but this was not directly tested for logos in what I read.

### Gaps
- No meta-analysis of logo complexity exists as far as I could find. Kim & Lim (2019), *Journal of Marketing Management*, 35(13-14), 1291-1365, DOI 10.1080/0267257X.2019.1604563, is a narrative review of 124 studies ([abstract](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1080/0267257X.2019.1604563?fields=abstract)), not a quantitative synthesis.
- Janiszewski & Meyvis and van Grinsven & Das statistics not verified (abstract/secondary only).
- Bornstein's (1989) conclusion that complex stimuli show larger exposure effects is my recollection; the abstract only says "stimulus complexity ... influence[s] the magnitude of the exposure effect" ([PsycNet](https://psycnet.apa.org/doi/10.1037/0033-2909.106.2.265)) - direction UNVERIFIED.

---

## 5. Processing-fluency and mere-exposure foundations: implications and evidence strength

### Takeaway
Fluency theory (Reber, Schwarz & Winkielman 2004) is an integrative review, not a single test: it explains why symmetry, figure-ground contrast, prototypicality, figural goodness and repetition raise liking. The mere-exposure effect is meta-analytically robust but follows an inverted U for visual stimuli. Fluency is the mechanism most logo papers invoke, but it is often assumed rather than measured.

### Cited Findings

**F5.1 - Fluency theory of aesthetic pleasure.**
- Citation: Reber, R., Schwarz, N., & Winkielman, P. (2004). Processing Fluency and Aesthetic Pleasure: Is Beauty in the Perceiver's Processing Experience? *Personality and Social Psychology Review*, 8(4), 364-382. DOI 10.1207/s15327957pspr0804_3. [PubMed 15582859](https://pubmed.ncbi.nlm.nih.gov/15582859/). (Note: the similar-looking DOI ...pspr0803_3 is a different paper; use 0804_3.)
- Design: theoretical review. Claim (abstract): "The more fluently perceivers can process an object, the more positive their aesthetic response. We review variables known to influence aesthetic judgments, such as figural goodness, figure-ground contrast, stimulus repetition, symmetry, and prototypicality, and trace their effects to changes in processing fluency." Beauty is "grounded in the processing experiences of the perceiver, which are in part a function of stimulus properties."
- Grade: strong as a framework (many converging effects), but it is a narrative review with no pooled effect size.
- Rule: maximise figure-ground contrast, good Gestalt (closure, continuity), symmetry and category prototypicality when the goal is immediate liking.
- SVG measure: WCAG-style luminance contrast between mark and background; number of disconnected components; symmetry score; smallest feature size relative to bbox (legibility at 16 px).

**F5.2 - Prototypicality -> fluency -> attractiveness.**
- Citation: Winkielman, P., Halberstadt, J., Fazendeiro, T., & Catty, S. (2006). Prototypes Are Attractive Because They Are Easy on the Mind. *Psychological Science*, 17(9), 799-806. DOI 10.1111/j.1467-9280.2006.01785.x. Metadata [Crossref](https://api.crossref.org/works/10.1111/j.1467-9280.2006.01785.x); abstract via [OpenAlex](https://api.openalex.org/works/doi:10.1111/j.1467-9280.2006.01785.x).
- Design: three experiments with random-dot and common geometric patterns (plus facial EMG). Finding: "prototypicality was a predictor of both fluency (categorization speed) and attractiveness ... fluency mediated the effect of prototypicality on attractiveness, although some effect of prototypicality remained when fluency was controlled."
- Grade: moderate. Rule: stay near the category prototype for liking; depart from it for distinctiveness (trade-off, inference). SVG measure: distance to mean shape of a reference set.

**F5.3 - Mere exposure, modern meta-analysis.**
- Citation: Montoya, R. M., Horton, R. S., Vevea, J. L., Citkowicz, M., & Lauber, E. A. (2017). A re-examination of the mere exposure effect: The influence of repeated exposure on recognition, familiarity, and liking. *Psychological Bulletin*, 143(5), 459-498. DOI 10.1037/bul0000085. [PubMed 28263645](https://pubmed.ncbi.nlm.nih.gov/28263645/).
- Design: meta-analysis of "268 curve estimates drawn from 81 articles." Finding: "a positive slope and negative quadratic effect consistent with an inverted-U shaped curve ... associated with (a) all visual, but not auditory stimuli; (b) exposure durations shorter than 10 s and longer than 1 min; (c) both homogeneous and heterogeneous presentation types; and (d) ratings that were taken after all stimuli were presented." "Existing models for the mere exposure effect do not adequately account for the findings."
- Grade: **strong**.
- Rule: familiarity breeds liking up to a point, then boredom/satiation; no shape choice substitutes for exposure, and over-exposure of a very simple mark can backfire.

**F5.4 - Mere exposure, classic meta-analysis.**
- Citation: Bornstein, R. F. (1989). Exposure and affect: Overview and meta-analysis of research, 1968-1987. *Psychological Bulletin*, 106(2), 265-289. DOI 10.1037/0033-2909.106.2.265. Abstract read on [APA PsycNet](https://psycnet.apa.org/doi/10.1037/0033-2909.106.2.265).
- Finding (abstract): "Stimulus type, stimulus complexity, presentation sequence, exposure duration, stimulus recognition, age of subject, delay between exposure and ratings, and maximum number of stimulus presentations all influence the magnitude of the exposure effect." The often-quoted pooled r of about .26 is **UNVERIFIED** here (not in the abstract).
- Grade: strong.

**F5.5 - Fluency operationalised algorithmically.**
- Citation: Mayer, S., & Landwehr, J. R. (2018). Quantifying visual aesthetics based on processing fluency theory: Four algorithmic measures for antecedents of aesthetic preferences. *Psychology of Aesthetics, Creativity, and the Arts*, 12(4), 399-431. DOI 10.1037/aca0000187. Metadata: [Crossref](https://api.crossref.org/works/10.1037/aca0000187). Abstract not retrievable; that the four measures are visual simplicity, symmetry, contrast and self-similarity is my recollection - **UNVERIFIED**.
- Relevance: a peer-reviewed precedent for scoring images automatically on fluency antecedents, i.e. exactly what an SVG audit would do.

**F5.6 - Fluency as measured mediator in logos.** In Miceli et al. (2014) perceptual fluency predicted logo attitude at b = .48-.49 and conceptual fluency at b = .13-.16 (N = 505) - [full text](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf). In Luffarelli, Mukesh & Mahmood (2019) ease of processing mediates the descriptiveness effect - [abstract](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1177/0022243719845000?fields=abstract). Grade: moderate.

### Inferences
- Fluency predicts *valence* at low elaboration. It does not predict excitement, innovativeness or distinctiveness, which several logo papers show come from disfluent features (asymmetry, incompleteness, complexity). A scoring tool should not collapse everything into one "fluency = good" number.
- Mere exposure dominates design: design explained 3-10% of true recognition (F1.3) while exposure effects on recognition/familiarity are meta-analytically robust.

### Gaps
- I did not find (in this session) a meta-analysis that pools perceptual-fluency -> liking effects or a multi-lab replication of fluency effects on aesthetic liking; replication status of the fluency -> liking link specifically is therefore "broadly convergent, not formally meta-analysed here." A Crossref search surfaced a 2025 PsyArXiv preprint revisiting discrepant perceptual fluency and *truth* judgments (Aktepe & Heck, DOI 10.31234/osf.io/rcehz_v3), not read and not about liking.

---

## 6. Golden ratio / grid construction: credible evidence or myth?

### Takeaway
As a universal aesthetic preference the golden ratio is not supported: a replication of Fechner found no peak, population-level rectangle preferences are weak with large idiosyncratic individual differences, and implicit tests show no automatic preference. One logo-specific survey paper reports a preference for 1:1.618 in natural-form logos, but for geometric logos 1:1 won, and in the ten-country logo study proportion had small or null effects. No peer-reviewed evidence was found that constructing a logo on a golden-ratio or circle grid improves consumer response.

### Cited Findings

**F6.1 - Replication of Fechner.**
- Citation: Hoge, H. (1997). The Golden Section Hypothesis - Its Last Funeral. *Empirical Studies of the Arts*, 15(2), 233-255. DOI 10.2190/2PNH-8TT0-EMC5-FTW5. Metadata [Crossref](https://api.crossref.org/works/10.2190/2pnh-8tt0-emc5-ftw5); abstract via [OpenAlex](https://api.openalex.org/works/doi:10.2190/2pnh-8tt0-emc5-ftw5).
- Design: three experiments re-running Fechner's rectangle choice (white cards on black), Germany. Finding: "regardless of the conditions under which the choices were made, the golden section did not turn out to be the preferred proportion ... the nice peak of preference Fechner reported ... seems to be either an artifact or ... an effect of still unknown factors ... It is concluded that the golden section hypothesis is a myth."
- Grade: moderate (three experiments).

**F6.2 - Weak population preference, strong idiosyncratic preferences.**
- Citation: McManus, I. C. (1980). The aesthetics of simple figures. *British Journal of Psychology*, 71(4), 505-524. DOI 10.1111/j.2044-8295.1980.tb01763.x. [PubMed 7437674](https://pubmed.ncbi.nlm.nih.gov/7437674/): prior effects "were dubious, either due to methodological limitations or inadvertent experimenter bias"; individuals show "highly significant and temporally stable, but somewhat idiosyncratic" preferences; "Two clear factors ... one based on the square, and the other upon a proportion similar to that of the golden section."
- Citation: McManus, I. C., Cook, R., & Hunt, A. (2010). Beyond the Golden Section and normative aesthetics: Why do individuals differ so much in their aesthetic preferences for rectangles? *Psychology of Aesthetics, Creativity, and the Arts*, 4(2), 113-126. DOI 10.1037/a0017316. Abstract on [APA PsycNet](https://psycnet.apa.org/doi/10.1037/a0017316): N = 79; "a century of subsequent experimental work suggests it [the Golden Section] has little normative role in rectangle preferences"; "weak population preferences but strong and varied individual rectangle preferences"; individual-difference measures "showed no correlation at all with rectangle preferences."
- Grade: strong (the 2010 study reproduces the 1980 pattern).

**F6.3 - No automatic preference.**
- Citation: Stieger, S., & Swami, V. (2015). Time to let go? No automatic aesthetic preference for the golden ratio in art pictures. *Psychology of Aesthetics, Creativity, and the Arts*, 9(1), 91-100. DOI 10.1037/a0038506. Abstract on [APA PsycNet](https://psycnet.apa.org/doi/10.1037/a0038506).
- Design: three studies, IAT plus explicit ratings, art images with the focal object at the golden ratio vs centred vs 3/4. Finding: "Both explicit and implicit evaluations did not reveal a clear preference for the golden ratio over other ratios. A possible preference ... may, rather, be driven by art expertise."
- Grade: moderate.

**F6.4 - The dissenting review.**
- Citation: Green, C. D. (1995). All That Glitters: A Review of Psychological Research on the Aesthetics of the Golden Section. *Perception*, 24(8), 937-968. DOI 10.1068/p240937. [PubMed 8848362](https://pubmed.ncbi.nlm.nih.gov/8848362/): "there seems to be, in fact, real psychological effects associated with the golden section, but ... they are relatively sensitive to careless methodological practices."
- Grade: narrative review; it is the main scholarly source for "there is something there," and even it calls the effect fragile.

**F6.5 - The one logo-specific study.**
- Citation: Pittard, N., Ewing, M., & Jevons, C. (2007). Aesthetic theory and logo design: examining consumer response to proportion across cultures. *International Marketing Review*, 24(4), 457-473. DOI 10.1108/02651330710761026. Abstract via [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1108/02651330710761026?fields=abstract).
- Design/sample: survey in Australia, Singapore and South Africa; N not in abstract. Finding: "there is universal preference for the divine proportion across cultures. Logos based on forms found in nature that were expressed in the divine proportion were most preferred, but for artificially constructed logos, a 1:1 ratio was preferred." Stated limitation: "A limited set of ratios were considered."
- Grade: **weak/contested** - single survey, few ratios compared, not replicated, and its own result reverses for geometric logos; it conflicts with F6.1-F6.3.

**F6.6 - Proportion in the large logo studies.** Proportion = bbox width/height ratio. "The effects of parallelism, proportion, and repetition on affect are small"; on subjective familiarity "not significant"; on true recognition proportion was negative in Russia (-0.17) and insignificant in Asia (0.04) and the West (-.01) - [van der Lans et al. 2009](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf). Grade: strong (as a null/small effect).

- Rule (from F6.1-F6.6): do not use golden-ratio conformity as a quality criterion. Choose aspect ratio for the container (1:1 for icons/avatars; wider lockups for headers) and for legibility; a compact 1:1 symbol is at least as defensible empirically as 1.618:1.
- SVG measure: bbox width/height; if desired, report distance to 1.0 and to 1.618 as descriptive only, with zero weight in any quality score.

### Inferences
- "Grid construction" (overlapping circles, phi-spirals shown in brand case studies) has no consumer-response evidence in the peer-reviewed sources found; any benefit would have to come indirectly through properties that *are* supported (regular curvature, harmony, symmetry, repetition/parallelism), and even repetition/parallelism showed small effects on affect.

### Gaps
- No peer-reviewed study testing grid-constructed vs freely drawn versions of the same logo was found.
- Pittard et al. sample size and the exact ratios tested were not verified (abstract only).
- A 2024 MDPI *Symmetry* paper ("Implicit and Explicit Preferences for Golden Ratio", 16(3), 333) and a 2022 PMC paper on the golden ratio as an "ecological affordance" appeared in search results but were not read; they may add nuance.

---

## 7. Which effects failed to replicate or are very small?

### Takeaway
No formal failed replication of a named logo-shape paper was found, but equally almost none have been independently replicated; the honest status of most logo-specific shape effects is "unreplicated single-paper findings with small-to-medium effects and strong boundary conditions." The clearly weak or debunked items are the golden-ratio preference, design effects on true recognition, and the objective elements (repetition, proportion, parallelism).

### Cited Findings
- **Golden ratio as universal preference: not supported** - Hoge 1997 quasi-replication of Fechner found no peak ([abstract](https://api.openalex.org/works/doi:10.2190/2pnh-8tt0-emc5-ftw5)); McManus et al. 2010 "little normative role" ([PsycNet](https://psycnet.apa.org/doi/10.1037/a0017316)); Stieger & Swami 2015 no implicit or explicit preference ([PsycNet](https://psycnet.apa.org/doi/10.1037/a0038506)); contradicted in part by Pittard et al. 2007 ([abstract](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1108/02651330710761026?fields=abstract)) and Green 1995 ([PubMed](https://pubmed.ncbi.nlm.nih.gov/8848362/)).
- **Design -> true recognition is tiny**: design dimensions and elements explain 3% (West), 6% (Russia), 10% (Asia) of true recognition; harmony, parallelism, repetition non-significant - [van der Lans et al. 2009](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf).
- **Repetition, proportion, parallelism**: effects on affect "small"; on familiarity "not significant" - [same source](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf). This undercuts the 1998 guideline text recommending repeated elements/parallel lines/good proportion.
- **"Moderate elaborateness is optimal" did not reproduce as an inverted U** in the 2003 and 2009 studies, which found a generally positive effect - [Miceli et al. 2014 summary](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf); and the elaborateness effect is culture-dependent (.70 Asia vs .19 Russia; negative for familiarity in Russia) - [van der Lans et al. 2009](https://repub.eur.nl/pub/13181/ERS-2008-055-MKT.pdf).
- **Curvature preference is real but "not universal"**: g = 0.39 overall, dropping to g = 0.32 with unlimited viewing time; moderated by stimulus type, task, expertise - [Chuquichambi et al. 2022](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10091794/fullTextXML).
- **Threat explanation of the curvature effect is contested**: no avoidance of angular shapes, only approach to curved ones - [Bertamini et al. 2016](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1111/bjop.12132?fields=abstract); [Palumbo et al. 2015](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1371/journal.pone.0140043?fields=abstract); versus Bar & Neta's threat account ([PubMed](https://pubmed.ncbi.nlm.nih.gov/17462678/)).
- **Round/angular logo inference is fragile by the authors' own tests**: eliminated under visual load, for low imagers, and when the headline names a conflicting attribute; reported effects partial eta-squared = .071 and .086 with N = 69 - [Jiang et al. 2016](https://static.amitavac.com/2016/02/Jiang-Gorn-Galli-and-Chattopadhyay_2016_JCR.pdf).
- **Complexity x exposure findings conflict on attitude**: visual complexity turns negative by nine exposures in Miceli et al. (beta = -.32) ([full text](https://openaccess.city.ac.uk/id/eprint/4267/1/Breaking%20through%20Complexity%20PM%20repository.pdf)) but complex logos gain in attitude with exposure in van Grinsven & Das (Ns 68 and 164) ([abstract](https://www.tandfonline.com/doi/full/10.1080/13527266.2013.866593)).
- **Mere exposure is not monotonic**: inverted-U across 268 curve estimates - [Montoya et al. 2017](https://pubmed.ncbi.nlm.nih.gov/28263645/).
- **Asymmetry -> excitement is specific**: "occurs only for the personality of excitement and the visual property of asymmetry" - [Luffarelli et al. 2019](https://journals.sagepub.com/doi/abs/10.1177/0022243718820548).

### Inferences
- Evidence ranking for a design rule set (my synthesis): Tier A (meta-analytic or multi-country): curves liked more (g ~0.4); natural + harmonious liked more; mere exposure with inverted U; golden ratio not a universal preference; design barely affects true recognition. Tier B (multi-study single papers, convergent teams): asymmetry -> arousal/excitement; round -> soft/comfort, angular -> hard/durable; incomplete -> innovative but less trustworthy; frames -> protection vs confinement; descriptiveness helps unknown brands; visual vs conceptual complexity trade places with exposure. Tier C (single/small/contested): golden-ratio logos preferred (Pittard); complex logos gain attitude with exposure (van Grinsven & Das); simple logos raise consumption (Bossel).
- Typical samples are students or MTurk workers judging fictitious brands after a single exposure; external validity to real brands with prior equity is limited (the secondary-data studies by Luffarelli et al. are the exception).

### Gaps
- Searches for registered/pre-registered replications of Jiang et al. (2016), Luffarelli et al. (2019), Bajaj & Bond (2018), Hagtvedt (2011) and Janiszewski & Meyvis (2001) returned nothing; absence of evidence here is partly a search limitation (general web search engines were degraded during the session; OSF/PsyArXiv were not searched directly).
- Effect sizes for Luffarelli et al. 2019, Bajaj & Bond 2018, Walsh et al. 2010/2011, Janiszewski & Meyvis 2001, van Grinsven & Das 2016, Pittard et al. 2007 and Henderson & Cote 1998 could not be verified (paywalled full texts); only directions and designs from abstracts are reported.
- Trust specifically (as opposed to liking, familiarity or personality) is thinly covered by shape research: the only direct trust result found is Hagtvedt (2011) on incompleteness.
