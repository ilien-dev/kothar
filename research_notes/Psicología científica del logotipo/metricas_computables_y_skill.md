# Computable metrics for psychologically relevant logo properties, and where they plug into the kothar skill

Scope notes for the report writer:

- **Colour is out of scope** (coordinator decision during the task): no colour metrics are catalogued and no colour plug-in points are proposed. The repository itself is monochrome by design. Section B only notes which files touch colour.
- **Verification status.** Every citation below had its title, authors, year, journal and DOI confirmed against a fetched Crossref record (or the publisher/PubMed page). "Metadata only" means the bibliographic record was confirmed but the paper's content was not read; any statement about its content then comes from a second paper that describes it, and that second paper is the linked source. Items I could not confirm are marked **UNVERIFIED**.
- **Implementation sketches are mine**, not from the papers. They are written against helpers that already exist in `src/raster.ts` (`renderAlpha`, `threshold`, `count`, `bbox`, `components`, `topology`, `silhouette`, `edt`, `open`, `resample`) so that most need no new dependency.
- The brief described the skill as having "a searchable library of 1,400+ SVG logos, test sheets, presentation boards, export variants". **That is not what is in this repository.** Those words match a different installed plugin (`logo-design`). The repository at `C:\Users\jesus\Documents\Projects\kothar` contains one skill, `kothar`, with a similarity index (not a searchable library), a localhost page, and an exporter. Section B describes what is really there.

---

## 1. Visual complexity: which computable measures track human complexity ratings?

### Takeaway
Three cheap raster measures have repeated validation against human ratings: compressed file size, edge density / perimeter, and (for binary shapes) perimetric complexity. Reported correlations sit around r = .6 to .8 for single measures, and the largest gain on abstract black-and-white patterns comes from adding mirror symmetry as a second predictor, not from a better complexity measure. None of these studies used logos, and none supplies a threshold.

### Cited Findings

Compression as a proxy
- Donderi (2006), "Visual complexity: A review", *Psychological Bulletin* 132(1), 73-97, DOI 10.1037/0033-2909.132.1.73. Metadata only. — [Crossref/DOI](https://doi.org/10.1037/0033-2909.132.1.73)
- Donderi (2006), "An Information Theory Analysis of Visual Complexity and Dissimilarity", *Perception* 35(6), 823-835, DOI 10.1068/p5249. Metadata only (the DOI I first tried was wrong; this one was returned by a Crossref bibliographic search). — [Crossref/DOI](https://doi.org/10.1068/p5249)
- Forsythe, Nadal, Sheehy, Cela-Conde & Sawey (2011), "Predicting beauty: Fractal dimension and visual complexity in art", *British Journal of Psychology* 102(1), 49-70, DOI 10.1348/000712610X498958. Abstract: "Contrary to previous findings the most successful predictor of visual complexity was Gif compression." Stimuli were artworks, not logos. No correlation value is given in the abstract. — [PubMed 21241285](https://pubmed.ncbi.nlm.nih.gov/21241285/)
- The rationale: Kolmogorov complexity (length of the shortest program that produces the image) "can be approximated by the resulting file size when applying compression algorithms like ZIP or JPEG". — [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- File compression "can be different for the original and an image rotated by 90 degrees", so Gartus & Leder average the compression ratio of both orientations. — [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)

Edge density and compression error on 800 images
- Machado, Romero, Nadal, Santos, Correia & Carballal (2015), "Computerized measures of visual complexity", *Acta Psychologica* 160, 43-57, DOI 10.1016/j.actpsy.2015.06.005. 800 images (abstract/representational, artistic/non-artistic, photographs), each rated by 30 participants. Single features reached up to rs = .771 ("Estimates based on edge detection yield correlations of up to rs = .771"); a machine-learning combination reached rs = .832; "Overall, edge density and compression error were the strongest predictors of human complexity ratings." They used Canny and Sobel filters, JPEG and fractal compression, and Zipf's-law metrics. — [ScienceDirect abstract](https://www.sciencedirect.com/science/article/abs/pii/S0001691815300160)
- Same paper, caveat: the correlation between compression and ratings "might be sensitive to the process used to assemble the stimuli set, including the way complexity is defined and manipulated ..., the range of complexity represented in the set". — [search snippet of the ScienceDirect full text](https://www.sciencedirect.com/science/article/pii/S0001691815300160)

Icons (the closest stimulus class to logos)
- Forsythe, Sheehy & Sawey (2003), "Measuring icon complexity: An automated analysis", *Behavior Research Methods, Instruments, & Computers* 35(2), 334-342, DOI 10.3758/BF03202562. Six image-processing properties were correlated with published human complexity norms for icons: icon foreground, number of objects, number of holes in those objects, two edge calculations, and homogeneity of structure. "The strongest correlates with human judgments of perceived icon complexity (McDougall et al., 1999) were structural variability (rs = .65) and edge information (rs = .64)." — [Springer](https://link.springer.com/article/10.3758/BF03202562)

Abstract black-and-white patterns (two-factor model)
- Gartus & Leder (2017), "Predicting perceived visual complexity of abstract patterns using computational measures: The influence of mirror symmetry on complexity perception", *PLOS ONE* 12(11), e0185276, DOI 10.1371/journal.pone.0185276. Twenty predictors were computed: compression ratio (compressed bytes / pixel count) for GIF, PNG, TIFF-LZW and JPEG-90; four edge images (phase congruency, Canny, perimeter via `bwperim`, RMS contrast) summarised by mean, SD, mean x SD, and by the GIF size of the edge image. Patterns were rated by 29 to 64 participants. — [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- Best single predictor in stimulus set 1: GIF-compressed RMS-contrast image, r = .634 (40.2% of variance). Mirror symmetry alone: r = -.578. The two are nearly uncorrelated (r = -.087). Together: 67.7% of variance (r = .823). After raising each axis's symmetry score to the power 20, so that small breaks of symmetry count heavily: 81.6% (r = .903). Random forest on all predictors: at most 89.1%. — [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- Familiarity biases the rating: Gartus & Leder report that prior work on icons "found a negative correlation of judgments of familiarity with ratings of complexity". A computed score cannot see this. — [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)

Clutter measures
- Rosenholtz, Li & Nakano (2007), "Measuring visual clutter", *Journal of Vision* 7(2):17, DOI 10.1167/7.2.17. Three measures: Feature Congestion (local variability of colour, luminance contrast and orientation, from a saliency model), Subband Entropy (Shannon entropy of the coefficients in each subband of a wavelet-like decomposition), Edge Density (share of pixels marked by a Canny detector; they used thresholds 0.11 / 0.27, sigma 1). — [Journal of Vision](https://jov.arvojournals.org/article.aspx?articleid=2122001)
- What they were validated against is **search performance, not complexity ratings**: correlation with mean log search time over 19 backgrounds was r = .74/.76 (Feature Congestion), .75/.77 (Subband Entropy), .83 (Edge Density); none differ significantly. With contrast thresholds: .93, .68, .83. — [Journal of Vision](https://jov.arvojournals.org/article.aspx?articleid=2122001)
- The same article relays Mack & Oliva (2004): edge density alone correlated r = .83 with mean subjective complexity rankings of indoor scenes, while agreement between human subjects was only r = .61. — [Journal of Vision](https://jov.arvojournals.org/article.aspx?articleid=2122001)

Perimetric complexity (binary shapes)
- Watson (2012), "Perimetric Complexity of Binary Digital Images", *The Mathematica Journal* 14, DOI 10.3888/tmj.14-5. Definition: "the sum of inside and outside perimeters of the foreground, squared, divided by the foreground area, divided by 4π" (the constant was dropped by the page extraction; the text states the normalisation makes a disc equal 1). A disc is the lowest-complexity shape; a unit square with a half-side square hole is "about three times as complex as the square". First introduced as "dispersion" by Attneave and Arnoult; its inverse is "compactness". — [The Mathematica Journal](https://www.mathematica-journal.com/2012/02/17/perimetric-complexity-of-binary-digital-images/)
- Same article: on digital images the perimeter has no unique definition (pixel-edge count vs. polygon through pixel centres give different lengths), and Watson proposes a "visual perimetric complexity" that blurs first to mimic the eye. — [The Mathematica Journal](https://www.mathematica-journal.com/2012/02/17/perimetric-complexity-of-binary-digital-images/)
- Pelli, Burns, Farell & Moore-Page (2006), "Feature detection and letter identification", *Vision Research* 46(28), 4646-4674, DOI 10.1016/j.visres.2006.04.023. Metadata only. Watson describes it as showing that "the efficiency of letter identification was nearly proportional to perimetric complexity". **Direction not confirmed**: the relation is usually stated as inverse (more complex letters, lower efficiency); the fetched sentence does not say "inversely" and I did not read Pelli et al. — [Crossref/DOI](https://doi.org/10.1016/j.visres.2006.04.023); description from [Watson 2012](https://www.mathematica-journal.com/2012/02/17/perimetric-complexity-of-binary-digital-images/)

Feature vs design complexity
- Pieters, Wedel & Batra (2010), "The Stopping Power of Advertising: Measures and Effects of Visual Complexity", *Journal of Marketing* 74(5), 48-60, DOI 10.1509/jmkg.74.5.048. Metadata only. As described by Dew et al.: feature complexity "refers to variation in basic features like color and edges, and is measured by variance at the pixel level" (operationalised in the literature through compressed file size), while design complexity "is measured by six general principles: the quantity, irregularity, dissimilarity, and detail of objects, and the asymmetry and irregularity of object arrangement". — [Crossref/DOI](https://doi.org/10.1509/jmkg.74.5.048); description from [Dew, Ansari & Toubia working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)

Complexity measures used on real logos
- Dew, Ansari & Toubia use, for logos: "the number of distinct colors, the number of segments, the perimetric complexity (the ratio of edge pixels to interior area), and the greyscale entropy (the average variance of pixel intensities across sliding windows)". In their descriptive analysis, "High entropy, a measure of complexity ... is generally associated with low perceptions across the board" of brand personality. — [Dew et al. working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Logo complexity has behavioural effects beyond liking: van Grinsven & Das (2016), "Logo design in marketing communications: Brand logo complexity moderates exposure effects on brand recognition and brand attitude", *Journal of Marketing Communications* 22(3), 256-270, DOI 10.1080/13527266.2013.866593. Metadata only; the title states the finding (complexity moderates exposure effects). — [Crossref/DOI](https://doi.org/10.1080/13527266.2013.866593)

Other
- Marin & Leder (2013), "Examining Complexity across Domains ...", *PLoS ONE* 8(8), e72412, DOI 10.1371/journal.pone.0072412. Metadata only. Gartus & Leder summarise it as showing that the relation of objective complexity measures to perceived complexity "might to some extent be domain-specific". — [Crossref/DOI](https://doi.org/10.1371/journal.pone.0072412); description from [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- Miniukovich & De Angeli (2014), "Quantification of interface visual complexity", AVI '14, 153-160, DOI 10.1145/2598153.2598173. Metadata only. — [Crossref/DOI](https://doi.org/10.1145/2598153.2598173)

### Inferences
- Ranking by evidence for a one-ink logo: (1) compression ratio of the rasterised mark and (2) edge/perimeter density are the two with the most replications; (3) perimetric complexity is the natural form of (2) for a binary shape and is scale-free in principle; (4) counts (pieces, holes, path nodes) are the "quantity of objects" half of Pieters's design complexity and of Forsythe's icon properties. Feature Congestion and Subband Entropy are built for colour photographs and maps and were validated against search time; on a flat one-ink mark most of their inputs (colour variability, multi-scale texture) are constant, so they add little.
- For a flat binary mark the edge-density, perimeter and compression measures will be strongly inter-correlated (Gartus & Leder say "many predictors are highly correlated with each other"). One of them is enough; the second predictor worth adding is symmetry, because it is the one that is nearly orthogonal and adds about 27 to 41 points of explained variance in that study.
- Failure modes to expect on logos: (a) compression depends on codec, resolution and orientation, so the render size must be fixed and both orientations averaged; (b) anti-aliasing inflates entropy and file size, so compress the thresholded mask or a fixed greyscale render, never an arbitrary PNG; (c) perimetric complexity grows with resolution on jagged edges and is undefined for hairlines; (d) all of these call a familiar shape as complex as an unfamiliar one; (e) SVG byte size and node count measure how the file was authored, not what is seen (the same circle can be 1 element or 40 nodes).
- Sketch, zero new dependencies (Node `zlib` is already imported in `src/raster.ts`):

```ts
// compression complexity: bytes per pixel of the deflated mask, averaged over two orientations
import zlib from 'node:zlib';
function compressionComplexity(m: Uint8Array, w: number, h: number): number {
  const rot = new Uint8Array(m.length);                       // 90-degree rotation
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) rot[x * h + (h - 1 - y)] = m[y * w + x];
  const z = (b: Uint8Array) => zlib.deflateSync(b, { level: 9 }).length;
  return (z(m) + z(rot)) / 2 / (w * h);
}
// perimetric complexity: P^2 / (4*pi*A), P = ink pixels with a 4-neighbour that is background
function perimetricComplexity(m: Uint8Array, w: number, h: number): number {
  let P = 0, A = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!m[y * w + x]) continue; A++;
    if (x === 0 || y === 0 || x === w - 1 || y === h - 1 || !m[y * w + x - 1] || !m[y * w + x + 1] || !m[(y - 1) * w + x] || !m[(y + 1) * w + x]) P++;
  }
  return A ? (P * P) / (4 * Math.PI * A) : 0;
}
```
  Use a fixed render (the audit already renders at `REF = 512` in `measure.ts`). Edge density is `P / (w*h)`.

### Gaps
- No study found that validates any of these measures against human complexity ratings **of logos**. The nearest stimulus classes are icons (Forsythe 2003) and abstract binary patterns (Gartus & Leder 2017).
- No source gives a complexity threshold above which recognition or liking drops. Any cut-off would have to be calibrated locally.
- Forsythe et al. (2011): the size of the GIF correlation is not in the abstract and the full text was not accessible.
- Machado et al. (2015): full text (which feature reached .771, per-category results) was behind a paywall; ResearchGate was blocked by a fingerprinting wall.
- Donderi's two 2006 papers and Pieters et al. (2010) were confirmed bibliographically only.

---

## 2. Symmetry and balance: computational scores and their validity

### Takeaway
Mirror symmetry (weighted pixel matching across an axis) and balance (distance of the ink's centre of mass from the frame centre, DCM) are both simple to compute and both have been compared with human ratings. DCM tracked rated balance at least as well as the eight-part APB score, but validity is shown only for sparse pictures of seven dots, and failed to transfer to calligraphy. For logos, the evidence that symmetry *matters* is good, while the evidence that more symmetry is *better* is not: asymmetry suits "exciting" brands.

### Cited Findings

Mirror symmetry score
- Formula used by both Gartus & Leder (2017) and Hübner & Fillinger (2016), attributed to Bauerly & Liu (2006): for an axis, count corresponding pixel pairs on the two sides that have the same value, weighting pairs near the axis more; normalise to 0..1; do this for four axes (vertical, horizontal, both diagonals); MS = 100 x mean of the four. — [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276); [Hübner & Fillinger 2016](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- MS correlates r = -.578 with rated complexity of abstract patterns, and "small deviations from symmetry do not only lead to a decreased liking, but also considerably increase perceived visual complexity"; a linear MS under-weights this, hence the power-20 transform per axis. — [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- Dew et al. compute logo symmetry differently: "measures of both horizontal and vertical symmetry, computed by looking at the correlation between halves of the image". — [Dew et al. working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)

APB score
- Wilson & Chatterjee (2005), "The Assessment of Preference for Balance: Introducing a New Test", *Empirical Studies of the Arts* 23(2), 165-180, DOI 10.2190/B1LR-MVF3-F36X-XR64. Metadata verified; algorithm as restated by Hübner & Fillinger: split the picture into four equal strips A1..A4 along an axis; with f() the count of black pixels and N the total, h = |[f(A1)+f(A2)] - [f(A3)+f(A4)]| / N x 100 (left vs right) and h_io = |[f(A1)+f(A4)] - [f(A2)+f(A3)]| / N x 100 (outer vs inner). Repeat for the horizontal axis and the two diagonals; APB = mean of the eight. Low = balanced. The test images are seven black circles, hexagons or squares of varying size on a 750 x 750 white square. — [Crossref/DOI](https://doi.org/10.2190/B1LR-MVF3-F36X-XR64); algorithm from [Hübner & Fillinger 2016](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)

DCM and the comparison
- Hübner & Fillinger (2016), "Comparison of Objective Measures for Predicting Perceptual Balance and Visual Aesthetic Preference", *Frontiers in Psychology* 7:335, DOI 10.3389/fpsyg.2016.00335. DCM = Euclidean distance between the centre of "mass" of the black pixels (normalised coordinates, frame centre at 0.5, 0.5) and the geometric centre, in percent. — [Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- Results: "DCM scores accounted better for balance ratings than APB scores, whereas the opposite held with respect to preference", because "aesthetic preference does not only depend on balance but also on homogeneity, and ... the APB measure takes this feature into account". Mean per-participant correlations with balance ratings were about -.47 (APB) vs -.49 (DCM), not significantly different; on mean ratings, R² was .615 for APB and .675 for DCM; re-weighting APB's eight parts raised R² to .751, with the left/right component carrying "by far the largest weight" and the inner/outer components explaining almost nothing. — [Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- The pixel-wise mirror symmetry score "had the weakest relation to the ratings" of balance and preference in these sparse pictures. Individual differences were large: per-participant correlations between APB and liking ranged from -.863 to +.339. — [Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- Homogeneity score: relative Shannon entropy of the black-pixel distribution over 10 bins per axis, HG in percent; attributed to interface-evaluation work by Ngo et al. — [Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- Limits of APB reported there: Gershoni & Hochstein (2011) "found only small correlations between this measure and ratings for Japanese calligraphy"; Silvia & Barona (2009), with a subset of the stimuli, found "no substantial correlation between APB scores and liking"; and an APB ordering of three pictures contradicted both intuition and the ratings while DCM ordered them correctly. — [Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- McManus, Stöver & Kim (2011), "Arnheim's Gestalt Theory of Visual Balance: Examining the Compositional Structure of Art Photographs and Abstract Images", *i-Perception* 2(6), 615-647, DOI 10.1068/i0445aap. Metadata only. Hübner & Fillinger: "McManus et al.'s (2011) physical interpretation of perceptual 'mass' was not successful" for complex pictures. — [Crossref/DOI](https://doi.org/10.1068/i0445aap); description from [Frontiers](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)

Aesthetic-measure tradition
- Birkhoff (1932) "argued that beauty increased with order and decreased with complexity", defining order by repetition and redundancy and complexity by numerousness; Eysenck's tests "suggested that both order and complexity contribute positively to the appreciation of beauty", i.e. against the ratio form. — [Machado et al. 2015, introduction](https://www.sciencedirect.com/science/article/abs/pii/S0001691815300160)
- Ngo, Teo & Byrne (2003), "Modelling interface aesthetics", *Information Sciences* 152, 25-46, DOI 10.1016/S0020-0255(02)00404-8. Metadata only. — [Crossref/DOI](https://doi.org/10.1016/S0020-0255(02)00404-8)
- Miniukovich & De Angeli (2015), "Computation of Interface Aesthetics", CHI '15, 1163-1172, DOI 10.1145/2702123.2702575; Oulasvirta et al. (2018), "Aalto Interface Metrics (AIM)", UIST '18 Adjunct, 16-19, DOI 10.1145/3266037.3266087. Metadata only for both. — [Crossref/DOI](https://doi.org/10.1145/2702123.2702575); [Crossref/DOI](https://doi.org/10.1145/3266037.3266087)
- Mayer & Landwehr (2018), "Quantifying visual aesthetics based on processing fluency theory: Four algorithmic measures for antecedents of aesthetic preferences", *Psychology of Aesthetics, Creativity, and the Arts* 12(4), 399-431, DOI 10.1037/aca0000187. Metadata only; abstract not retrievable (elided by the publisher in Semantic Scholar, wrong record on PsycNet). Which four measures and what validity: **UNVERIFIED**. — [Crossref/DOI](https://doi.org/10.1037/aca0000187)

Symmetry in logo research
- Luffarelli, Stamatogiannakis & Yang (2019), "The Visual Asymmetry Effect: An Interplay of Logo Design and Brand Personality on Brand Equity", *Journal of Marketing Research* 56(1), 89-103, DOI 10.1177/0022243718820548. Abstract: "compared with symmetrical logos, asymmetrical logos tend to be more arousing, leading to increased perceptions of excitement", so they are seen as "more congruent with brands that have an exciting personality"; the interplay "occurs only for the personality of excitement and the visual property of asymmetry". Five studies plus secondary data. — [Semantic Scholar record](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1177/0022243718820548?fields=title,abstract,year,venue)
- Dew et al., descriptive: "Horizontally symmetric logos tend to be perceived better along almost all dimensions, except intelligent." — [Dew et al. working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Bajaj & Bond (2018), "Beyond Beauty: Design Symmetry and Brand Personality", *Journal of Consumer Psychology* 28(1), 77-98, DOI 10.1002/jcpy.1009. Metadata only. — [Crossref/DOI](https://doi.org/10.1002/jcpy.1009)
- Henderson & Cote (1998), "Guidelines for Selecting or Modifying Logos", *Journal of Marketing* 62(2), 14-30, DOI 10.1177/002224299806200202. Metadata only. Dew et al. describe its dimensions: naturalness, harmony ("the extent of its symmetry and balance"), elaborateness ("complexity as measured by the number and heterogeneity of logo elements"). These were human-rated, not computed. Cross-national test: van der Lans et al. (2009), *Marketing Science* 28(5), 968-985, DOI 10.1287/mksc.1080.0462, metadata only. — [Crossref/DOI](https://doi.org/10.1177/002224299806200202); [Crossref/DOI](https://doi.org/10.1287/mksc.1080.0462); description from [Dew et al.](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)

### Inferences
- A logo is one or a few solid shapes centred in a frame, unlike seven scattered dots. DCM is then mostly "is the ink's centroid at the centre of the bounding box", which the repository already computes as `balanceOffset` (see section 9). The literature gives no reason to make it stricter: validity is shown only for sparse dot pictures, and per-person correlations range from strongly negative to positive.
- Rotational symmetry was requested but I found **no validated computational score with human ratings** in the sources read. A defensible sketch by analogy with the mirror score: rotate the centred mask by 360/n degrees for n = 2, 3, 4, 5, 6, 8 and take the best intersection-over-union with the original; report the order n and the IoU. This is an inference, not a cited measure.
- Symmetry should be reported, not rewarded. The cited findings pull in different directions: symmetric patterns look simpler and (in Dew's descriptive data) score better on most traits; asymmetric logos read as more exciting and suit exciting brands. That is a mapping to the product's traits, not a quality gate. The skill already records traits (`excitement`, `energy`, `calm`, `trust` in `assets/traits.json`), so a note such as "symmetric mark, product weighted towards excitement" is where this evidence can speak.
- Failure modes: pixel-matching symmetry is inflated by empty background (two blank halves match perfectly), so compute it on the tight bounding box and on ink pixels (IoU of mask and mirrored mask), not on the full canvas; it is sensitive to a one-pixel centring error, so centre on the bounding box or search a few pixels of shift; a nearly symmetric mark scores ~0.95 yet is perceived as "broken" (Gartus & Leder), so near-miss values in roughly the 0.85 to 0.98 band deserve their own message.
- Sketch:

```ts
// mirror symmetry as IoU between the tight mask and its reflection; axes: 'v' (left/right), 'h', and diagonals on a squared canvas
function mirrorIoU(m: Uint8Array, w: number, h: number, axis: 'v' | 'h'): number {
  let inter = 0, union = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const a = m[y * w + x], b = axis === 'v' ? m[y * w + (w - 1 - x)] : m[(h - 1 - y) * w + x];
    if (a && b) inter++; if (a || b) union++;
  }
  return union ? inter / union : 0;
}
// APB: eight |difference| / N terms over four strips per axis; DCM: hypot(cx/w - .5, cy/h - .5) * 100
```
  `similarity.ts` already has a private `flipH` for 24 x 24 descriptors; the same idea at 256 px gives the score.

### Gaps
- No validated rotational-symmetry measure found.
- No study validating APB, DCM or MS on logos or on single solid shapes.
- Wilson & Chatterjee's own reported correlations were not read (only Hübner & Fillinger's restatement that APB "highly correlated with perceptual balance and preference").
- Contents of Bajaj & Bond (2018), Mayer & Landwehr (2018), Ngo et al. (2003), Miniukovich & De Angeli (2015) and AIM were not accessible; they are listed so the writer does not attribute findings to them.

---

## 3. Curvature vs angularity: how it is quantified

### Takeaway
The preference for curved over angular contours is one of the better-replicated effects here (meta-analytic Hedges' g = 0.39 over 61 studies) but it is moderated by task, stimulus type, expertise and exposure time. Most experiments manipulate it categorically (curved vs angular versions of the same shape); validated continuous image measures are recent, chiefly edge-orientation entropy and contour-based turning measures. In logo studies the proxy is a corner count.

### Cited Findings
- Bar & Neta (2006), "Humans Prefer Curved Visual Objects", *Psychological Science* 17(8), 645-648, DOI 10.1111/j.1467-9280.2006.01759.x. Metadata only. — [Crossref/DOI](https://doi.org/10.1111/j.1467-9280.2006.01759.x)
- Bertamini, Palumbo, Gheorghes & Galatsidas (2016), "Do observers like curvature or do they dislike angularity?", *British Journal of Psychology* 107(1), 154-178, DOI 10.1111/bjop.12132. Abstract: with abstract shapes differing in contour type and complexity, experiment 1 "confirmed a preference for curvature not linked to perceived complexity"; curved lines were liked more than both angular and straight lines, so "angles are not necessary to generate a preference for curved shapes"; an implicit task found "only a pattern of approach for curvature", not avoidance of angularity. Curvature was a categorical manipulation of matched stimuli, not a computed score. — [Semantic Scholar record](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1111/bjop.12132?fields=title,abstract,year,venue)
- Palumbo, Ruta & Bertamini (2015), "Comparing Angular and Curved Shapes in Terms of Implicit Associations and Approach/Avoidance Responses", *PLOS ONE* 10(10), e0140043, DOI 10.1371/journal.pone.0140043. Metadata only. — [Crossref/DOI](https://doi.org/10.1371/journal.pone.0140043)
- Gómez-Puerto, Munar & Nadal (2016), "Preference for Curvature: A Historical and Conceptual Framework", *Frontiers in Human Neuroscience* 9:712, DOI 10.3389/fnhum.2015.00712. Metadata only. — [Crossref/DOI](https://doi.org/10.3389/fnhum.2015.00712)
- Chuquichambi, Vartanian, Skov, Corradi, Nadal, Silvia & Munar (2022), "How universal is preference for visual curvature? A systematic review and meta-analysis". 61 studies, 106 independent samples, 309 effect sizes; three-level random-effects Hedges' g = 0.39; moderated by presentation time, stimulus type, expertise and task; "a reliable but not universal phenomenon". PubMed ID 36285721; published DOI 10.1111/nyas.14919 (the journal name was not on the fetched excerpt; the DOI prefix is that of *Annals of the New York Academy of Sciences*; the preprint DOI 10.31234/osf.io/tw8v3 is confirmed in Crossref with these seven authors). — [PubMed 36285721](https://pubmed.ncbi.nlm.nih.gov/36285721/)
- Watier (2024), "Measures of angularity in digital images", *Behavior Research Methods* 56(7), 7126-7151, DOI 10.3758/s13428-024-02412-5. Reviews and implements image measures: (a) **first-order edge-orientation entropy**, the Shannon entropy of the histogram of edge orientations over the whole image, maximal when all orientations are equally present; (b) **second-order edge-orientation entropy**, the entropy of the histogram of orientation differences between pairs of nearby edges; "angular polygons and isolated lines had lower edge orientation entropies compared with their curvilinear counterparts" (Grebenkina et al. 2018, after Redies et al. 2017); (c) a **contour measure h_L** computed at sampled boundary points with a chord of L points, where "angular segments yield greater absolute values of h_L compared with curvilinear segments". The two entropies "are not independent from one another". — [Springer](https://link.springer.com/article/10.3758/s13428-024-02412-5)
- In logos: Dew et al. measure angularity as "the number of corners ... computed via the Harris corner detector", and classify the convex hull shape. Descriptively, "Angularity, as captured by the number of corners, is positively associated with down-to-earth and tough logos, and negatively related to the others", and "A circular hull is positively associated with cheerful, daring, spirited, but negatively associated with intelligence". — [Dew et al. working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Jiang, Gorn, Galli & Chattopadhyay (2016), "Does Your Company Have the Right Logo? How and Why Circular- and Angular-Logo Shapes Influence Brand Attribute Judgments", *Journal of Consumer Research* 42(5), 709-726, DOI 10.1093/jcr/ucv049. Metadata only. Dew et al.: it "showed that the circularity or angularity of the logo affects customer perceptions of hardness or softness, which in turn influence attribute judgments about products"; circularity with "comfortableness and customer sensitivity", angularity with "durability". — [Crossref/DOI](https://doi.org/10.1093/jcr/ucv049); description from [Dew et al.](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Curvature and balance interact with shape in the APB stimuli: Silvia & Barona found pictures with circles "were indeed preferred to those with hexagons". — [Hübner & Fillinger 2016](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)

### Inferences
- Like symmetry, this is a **fit** variable, not a quality variable: round reads as soft, warm, comfortable; angular as tough, durable. With g = 0.39 and four moderators, a general "rounder is better" rule is not supported for a brand mark. Report the value and relate it to the product's traits.
- Two computation routes for an SVG:
  1. **From path data** (exact, but needs a real path parser; the repository has none, `pathNodes` in `src/svg.ts` only counts command letters). Normalise every shape to absolute cubic segments, then report: share of outline length lying on curved segments vs straight ones; number of corners, i.e. joins where the tangent turns by more than about 30 degrees; the distribution of those turn angles (sharp < 60 degrees interior, right, obtuse); and length-weighted mean absolute curvature, with curvature of a Bézier at t being |x'y'' - y'x''| / (x'² + y'²)^1.5. Libraries confirmed on npm: `svg-path-commander` 2.3.5 (MIT, TypeScript, parse/normalise/convert to curves, one dependency), `svgpath` 2.6.0 (MIT, transforms, no dependencies), `bezier-js` 6.1.4 (MIT, curve maths), `svg-path-properties` 2.2.0 (ISC, length and point-at-length; requires Node >= 22, while this repo declares Node >= 20). — [npm registry](https://registry.npmjs.org/svg-path-commander/latest); [npm registry](https://registry.npmjs.org/svgpath/latest); [npm registry](https://registry.npmjs.org/bezier-js/latest); [npm registry](https://registry.npmjs.org/svg-path-properties/latest)
  2. **From the raster** (what the eye gets; handles strokes, transforms, masks, `evenodd`, `<circle>`/`<rect rx>` for free). Trace the boundary of the 512 px mask, smooth, and compute the turning angle over a fixed arc length at each boundary point; report the share of boundary length where the turn exceeds a corner threshold, plus Watier's first-order edge-orientation entropy from a gradient-orientation histogram of boundary pixels (16 to 24 bins).
- Failure modes: path-based counts are fooled by authoring (a circle drawn as a 64-gon is all "straight"; a rounded corner of radius 0.2 units is formally curved but looks sharp at any real size; a stroke's outline and its `stroke-linejoin` are invisible to path maths). Raster measures depend on render size and smoothing window and miss corners inside very small features. A polygon with many sides has high orientation entropy and is read as round by the entropy measure. Corner counts scale with complexity, so normalise by perimeter or report alongside complexity (Bertamini et al. took care to separate the two).
- The raster route matches how this repository already works ("Pixel-measured rules", header of `src/measure.ts`) and adds no dependency.

### Gaps
- Bar & Neta (2006) content not read; no claim about its stimuli is made here.
- Watier (2024): the numerical agreement of each measure with human angularity ratings was not in the fetched excerpt.
- No validated mapping from a continuous curvature score to brand-trait perception; logo studies use binary round/angular versions.
- Leder, Tinio & Bar (2011) on valence and curvature: the DOI I tried resolved to an unrelated paper; **UNVERIFIED**, not used.

---

## 4. Figure-ground and whitespace, number of elements and repetition, orientation, diagonality and implied motion

### Takeaway
These properties are easy to compute but thinly validated. Whitespace share, segment count and edge-direction histograms are used as logo features by Dew et al.; number of objects and holes correlate with icon complexity. Orientation and implied motion have experimental support in logo research, but the experiments manipulate whole designs and offer no computed score.

### Cited Findings
- Whitespace as a logo feature: "Percent whitespace captures the percentage of pixels that are white (background), within the convex hull of the logo." — [Dew et al. working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Number of elements: Dew et al. segment each logo "into regions that are separated either by color or by background" and use "the number of segments" and the number of marks as features; Forsythe et al. measured "the number of objects in an icon, the number of holes in those objects". — [Dew et al.](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf); [Forsythe et al. 2003](https://link.springer.com/article/10.3758/BF03202562)
- Complexity has "a quantitative dimension that increases complexity through number of elements, and a structural dimension representing order negatively related to complexity". — [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- Edge direction: "Edge gradients capture directionality of edges in the logo, and are computed by computing numerical gradients sliding over a black and white version of the logo." Descriptively, "A high proportion of upward diagonal edge gradients appears positively related with cheerful, spirited firms". — [Dew et al.](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Schlosser, Rikhi & Dagogo-Jack (2016), "The ups and downs of visual orientation: The effects of diagonal orientation on product judgment", *Journal of Consumer Psychology* 26(4), 496-509, DOI 10.1016/j.jcps.2016.01.003. Metadata only. Dew et al.: "upward diagonals convey greater activity than downward diagonals, leading to more positive reactions". — [Crossref/DOI](https://doi.org/10.1016/j.jcps.2016.01.003); description from [Dew et al.](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Cian, Krishna & Elder (2014), "This Logo Moves Me: Dynamic Imagery from Static Images", *Journal of Marketing Research* 51(2), 184-197, DOI 10.1509/jmr.13.0023. Metadata only. Dew et al.: "the horizontal orientation of a logo or the positioning of its elements can evoke the idea of movement to influence consumers' engagement and attitudes". — [Crossref/DOI](https://doi.org/10.1509/jmr.13.0023); description from [Dew et al.](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Homogeneity of ink distribution (relative entropy over 10 bins per axis) relates to liking independently of balance. — [Hübner & Fillinger 2016](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- Global scene statistics: orientation distributions are diagnostic at image level ("vertical and horizontal orientations tend to dominate in scenes of human-made environments"). — [Watier 2024](https://link.springer.com/article/10.3758/s13428-024-02412-5)

### Inferences
- Computable now from the mask: ink share of the bounding box (already `density`), ink share of the convex hull (Dew's whitespace, needs a hull: Andrew's monotone chain over boundary pixels, about 20 lines), count of pieces and holes (already `pieces`, `holes`), ratio of the largest piece's area to total ink (dominance), and a figure-ground ambiguity hint: hole area / ink area close to 1 means the counters carry as much weight as the ink.
- Repetition: no validated measure found. A workable proxy is the number of pieces whose normalised 24 x 24 descriptors correlate above a threshold with another piece (reusing `describe`/`correlate` logic from `similarity.ts` per component). This is an inference.
- Orientation: a 180-degree histogram of boundary gradient directions in four bands (horizontal, vertical, rising diagonal, falling diagonal) gives "diagonality" and "rising vs falling" shares. Second-moment principal axis of the ink gives a single tilt angle and elongation. Implied motion has no computable definition in the sources; rising-diagonal share and a left-to-right asymmetry of mass are at most hints.
- Failure modes: a rising diagonal in a left-to-right reading culture is a falling one when mirrored, and the cited experiments are from left-to-right readers; edge-direction shares are dominated by the longest straight edges, so a square frame hides a diagonal motif; whitespace in the hull is meaningless for a ring or a letter with large counters unless holes are reported separately.

### Gaps
- No computed, human-validated score for implied motion or for repetition.
- Schlosser et al. and Cian et al. were not read; only Dew et al.'s one-sentence descriptions are relied on.
- No evidence on an optimal whitespace ratio for marks. The repository's 12% and 95% density limits are house rules, not literature values.

---

## 5. Data-driven logo research and memorability models

### Takeaway
Dew, Ansari & Toubia is the reference large-scale study: 706 brands, a hand-built image-processing feature dictionary, and a multimodal variational autoencoder linking features to text, industry and Aaker personality ratings. Its own conclusion limits what a metric can promise: logo features are predictable from what a brand is, but consumer perception is hard to predict from the logo alone. MIT's memorability models are trained on photographs; I found no verified evidence that they transfer to logos.

### Cited Findings
- Dew, Ansari & Toubia (2022), "Letting Logos Speak: Leveraging Multiview Representation Learning for Data-Driven Branding and Logo Design", *Marketing Science* 41(2), 401-425, DOI 10.1287/mksc.2021.1326. Published abstract: "a novel logo feature extraction algorithm that uses modern image processing tools to decompose pixel-level image data into meaningful features and a multiview representation learning framework that links these visual features to textual descriptions, consumer ratings of brand personality, and other high-level tags describing firms." — [INFORMS abstract](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1326); metadata via [Crossref/DOI](https://doi.org/10.1287/mksc.2021.1326)
- The details below are from the **November 2019 working-paper version** hosted by Columbia; the published version may differ in numbers.
  - Data: brands from Interbrand Top 100 (2016), Brand Finance top 500 US brands (2016) and the Forbes 500 (2016); 715 brands, 706 after text filtering; website text; 34 Crunchbase industry labels; Aaker's 42 personality traits rated by 20 Mechanical Turk respondents per brand who saw **both the logo and the text**. — [working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
  - Pipeline in four stages: summarisation (global features), segmentation (regions separated by colour or background), character identification (template matching against a font collection covering the Vox-ATypI classes), tokenisation (clustering hull shapes and mark shapes into dictionaries: six hull classes, 14 mark classes). — [working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
  - Non-colour features: presence and number of marks, aspect ratio, convex-hull class, mark class, font class / weight / style / width, percent whitespace in the hull, number of Harris corners, number of segments, perimetric complexity ("ratio of edge pixels to interior area"), greyscale entropy, horizontal and vertical symmetry (correlation between image halves), mark position relative to the text, edge-gradient direction shares. — [working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
  - Continuous features are discretised into "bottom quartile" and "top quartile" flags because "it is difficult for a designer to attempt designing a logo with 22 corners, but relatively easier to design one with 'many' corners or 'few' corners", and because it improved model fit. — [working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
  - Descriptive associations with personality (differences between brands with and without a feature, not causal): symmetric better on almost all traits except intelligent; high entropy lower across the board; rising diagonals with cheerful and spirited; many corners with down-to-earth and tough; circular hull with cheerful, daring, spirited and less intelligent. — [working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
  - Limits stated by the authors: "we also find that it is generally difficult to predict how consumers will evaluate brands based solely on logos", and single features are ambiguous (black logos score high on both "upper class" and "tough"), which "highlights the need for understanding the whole combination of logo features, jointly". — [working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Logo datasets for machine learning exist but carry no psychological ratings: Sage, Timofte, Agustsson & Van Gool (2018), "Logo Synthesis and Manipulation with Clustered Generative Adversarial Networks", CVPR 2018, 5879-5888, DOI 10.1109/CVPR.2018.00616 (the paper that introduced the Large Logo Dataset; dataset details not read). Metadata only. — [Crossref/DOI](https://doi.org/10.1109/CVPR.2018.00616)
- Memorability, photographs: Khosla, Raju, Torralba & Oliva (2015), "Understanding and Predicting Image Memorability at a Large Scale", ICCV 2015, 2390-2398, DOI 10.1109/ICCV.2015.275. LaMem has 60,000 images "from diverse sources"; fine-tuned CNN features reach rank correlation 0.64 against a human consistency of 0.68. — [Semantic Scholar record](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1109/ICCV.2015.275?fields=title,abstract,year,venue)
- Isola, Xiao, Torralba & Oliva (2011), "What makes an image memorable?", CVPR 2011, 145-152, DOI 10.1109/CVPR.2011.5995721; Bylinskii, Isola, Bainbridge, Torralba & Oliva (2015), "Intrinsic and extrinsic effects on image memorability", *Vision Research* 116, 165-178, DOI 10.1016/j.visres.2015.03.005; Borkin et al. (2013), "What Makes a Visualization Memorable?", *IEEE TVCG* 19(12), 2306-2315, DOI 10.1109/TVCG.2013.234. Metadata only for all three. — [Crossref/DOI](https://doi.org/10.1109/CVPR.2011.5995721); [Crossref/DOI](https://doi.org/10.1016/j.visres.2015.03.005); [Crossref/DOI](https://doi.org/10.1109/TVCG.2013.234)
- Memory for a real logo is poor even with massive exposure, by title: Blake, Nazarian & Castel (2015), "The Apple of the mind's eye: Everyday attention, metamemory, and reconstructive memory for the Apple logo", *Quarterly Journal of Experimental Psychology* 68(5), 858-865, DOI 10.1080/17470218.2014.1002798. Metadata only. — [Crossref/DOI](https://doi.org/10.1080/17470218.2014.1002798)
- A paper titled "A New Method for Measurement and Prediction of Memorability from Logo Images using Characteristics of Color and Shape" appeared in search results (ResearchGate, blocked). Authors, venue, method and results: **UNVERIFIED**. — [search result only](https://www.researchgate.net/publication/304471052_A_New_Method_for_Measurement_and_Prediction_of_Memorability_from_Logo_Images_using_Characteristics_of_Color_and_Shape)

### Inferences
- Dew et al.'s feature list is the best available checklist of "what a logo metric module should emit", and almost every non-colour, non-font item on it is computable with the raster helpers this repository already has. Their quartile discretisation is a practical answer to "what do I tell the designer": compare a mark with a reference distribution and say "many corners" or "few", instead of printing 22.
- That suggests a use for the existing reference index in `~/.kothar` (about 21,000 shapes, of which the Simple Icons set are real brand marks): compute each advisory metric over the brand subset once at `setup --refs` and report a candidate's **percentile**, which sidesteps the absence of published thresholds. This is my proposal, not something the paper did with icon sets.
- The personality associations are observational, from large successful US-listed brands rated with text alongside the logo. They are weak grounds for a rule and reasonable grounds for a hint tied to the product's traits.
- LaMem-type models should not be used to score logos: the training images are photographs, the 0.64 rank correlation is within that domain, and I found nothing validating transfer to flat vector marks. The skill's blind judges already collect a 1 to 5 "could you sketch it from memory" rating, which is closer to the construct than a photograph-trained network.

### Gaps
- Published-version numbers for Dew et al. (hold-out accuracy by feature, final brand count) were not read: the publisher PDF could not be parsed and only the 2019 working paper was readable, up to the model section.
- No WIPO or USPTO trademark study relating image features to perception was found or verified. Searches were limited by the tool-call budget.
- Whether LLD, Logo-2K+ or similar sets carry any human ratings: not checked beyond the one citation.
- Isola 2011, Bylinskii 2015, Borkin 2013 and Blake 2015 were confirmed bibliographically only.

---

## 6. Small-size legibility and recognisability

### Takeaway
There is no validated "logo legible at 16 px" metric in the literature I could reach. What exists is vision science that justifies the ingredients: recognition is limited by feature spacing (crowding, the Bouma law) more than by size, and identification efficiency depends on perimetric complexity. The repository already implements the engineering proxies (sub-pixel ink, closing gaps, shape survival, topology change); the literature suggests two additions, a spacing check and a structural-similarity comparison.

### Cited Findings
- Pelli & Tillman (2008), "The uncrowded window of object recognition", *Nature Neuroscience* 11(10), 1129-1135, DOI 10.1038/nn.2187. Abstract: "vision is usually limited by object spacing rather than size"; crowding "occurs when objects are too close together and features from several objects are combined into a jumbled percept"; "The critical spacing required to prevent crowding is equal for all objects, although the effect is weaker between dissimilar objects"; critical spacing "is proportional to object distance from fixation". — [Semantic Scholar record](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1038/nn.2187?fields=title,abstract,year,venue)
- Bouma (1970), "Interaction Effects in Parafoveal Letter Recognition", *Nature* 226, 177-178, DOI 10.1038/226177a0. Metadata only. — [Crossref/DOI](https://doi.org/10.1038/226177a0)
- Perimetric complexity relates to identification efficiency and Watson adds a blurred, "visual" variant to account for the eye's optics. — [Watson 2012](https://www.mathematica-journal.com/2012/02/17/perimetric-complexity-of-binary-digital-images/)
- Global shape first: Dew et al. cite Navon (1977) for "global features are processed more readily and fully than local ones". — [Dew et al. working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- Structural similarity for image comparison: Wang, Bovik, Sheikh & Simoncelli (2004), "Image quality assessment: from error visibility to structural similarity", *IEEE Transactions on Image Processing* 13(4), 600-612, DOI 10.1109/TIP.2003.819861. Metadata only. A JavaScript implementation exists: `ssim.js` 3.5.0, MIT, last published 2020. — [Crossref/DOI](https://doi.org/10.1109/TIP.2003.819861); [npm registry](https://registry.npmjs.org/ssim.js/latest)
- Icon complexity is computable from foreground, objects, holes and edges, and tracks human judgments at rs around .65. — [Forsythe et al. 2003](https://link.springer.com/article/10.3758/BF03202562)

### Inferences
- The four proxies named in the brief, mapped to what can be justified:
  - **Downsample-and-compare**: render at 16 px, upsample, compare with the large render. The repository does this with IoU of thresholded masks (`iou` in `measure.ts`). SSIM on the unthresholded coverage maps would be gentler on anti-aliased thin strokes; it is a general image-quality index, not validated for logo recognition.
  - **Minimum stroke width in px**: the repository measures the share of ink thinner than one device pixel by morphological opening (`open` in `raster.ts`). A direct number can be had from the same distance transform: twice the maximum of `edt(invert(M))` along the medial ridge, taking a low percentile (5th) as "minimum stroke". Reporting it in pixels at 16 px is more actionable than a percentage.
  - **Minimum gap**: same on the inverted mask, already covered by `gapLost`.
  - **Crowding-based spacing**: the Bouma law concerns peripheral vision, where critical spacing grows with eccentricity. A favicon in a tab strip is typically seen off fixation, so internal parts that are closer than the critical spacing fuse. No source gives a pixel rule for icons; a conservative proxy is the ratio of the smallest gap between separate pieces to the size of the smaller piece, flagged when well under 1. Treat as advisory.
  - **Spatial-frequency content**: share of the mark's spectral energy above the Nyquist limit of a 16 px grid (8 cycles per image). Cheap proxy without an FFT: 1 minus the correlation between the 512 px render and its 16 px area-average re-expanded (the `resample` helper does the averaging). No validation for logos found.
- What the literature cannot provide, and the repository gets from its blind judges instead: whether the shape is still *recognised as the intended thing* at 16 px (`recognisedSmall` in `judge.ts`).
- Failure modes: thresholding a 16 px render at 0.5 coverage discards the grey pixels that real anti-aliasing uses to carry thin strokes, so IoU is pessimistic for hairlines and optimistic for shapes that sit on pixel boundaries; results shift with sub-pixel phase (where the artwork lands on the grid), so average over a few offsets; device pixel ratio 2 doubles everything, so "16 px" is the worst case, not the common one.

### Gaps
- No peer-reviewed study validating any small-size logo or icon legibility metric against recognition data was found.
- Pelli & Tillman's quantitative critical-spacing constant (commonly given as about half the eccentricity) is not in the abstract I fetched; do not quote a number from this note.
- Wang et al. (2004) was confirmed bibliographically only.

---

## 7. Colour metrics

### Takeaway
Removed from scope by the coordinator during the task. Nothing is catalogued here and nothing is proposed.

### Cited Findings
- The skill delivers logos "in black, white and greys" and leaves colour "to whoever designs the site, the README or the app later". — [skills/kothar/SKILL.md](file:///C:/Users/jesus/Documents/Projects/kothar/skills/kothar/SKILL.md)

### Inferences
- None.

### Gaps
- Not researched, by instruction.

---

## 8. Which metrics are robust enough to gate a design, and which should only be reported?

### Takeaway
On the evidence read, nothing in the psychological literature supports a hard gate: every validated measure explains part of a *rating*, on non-logo stimuli, with no thresholds, and several (symmetry, curvature, orientation) are about fit to a brand's character, where the desirable direction depends on the product. Gates are defensible only for physical facts about rendering (does ink survive the pixel grid) and for extreme outliers; everything else belongs in an advisory profile, ideally expressed as a percentile against real brand marks and tied to the product's traits.

### Cited Findings
- Single measures explain roughly 40% of the variance in rated complexity of abstract patterns (r = .634); the best two-predictor model 68 to 82%. — [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- Correlations depend on how the stimulus set was assembled and on domain. — [Machado et al. 2015 (snippet)](https://www.sciencedirect.com/science/article/pii/S0001691815300160); [Gartus & Leder 2017](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0185276)
- Agreement between human raters themselves is limited (r = .61 between subjects for scene complexity; .70 for map clutter). — [Rosenholtz et al. 2007](https://jov.arvojournals.org/article.aspx?articleid=2122001)
- Individual correlations between a balance score and liking range from -.86 to +.39. — [Hübner & Fillinger 2016](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00335/full)
- The curvature preference is "reliable but not universal" (g = 0.39, four moderators). — [Chuquichambi et al. 2022](https://pubmed.ncbi.nlm.nih.gov/36285721/)
- Asymmetry helps brands with an exciting personality; symmetry is not uniformly better. — [Luffarelli et al. 2019](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1177/0022243718820548?fields=title,abstract,year,venue)
- Perception is hard to predict from the logo alone, and single features are ambiguous. — [Dew et al. working paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/26108/Ansari_Toubia_Logos.pdf)
- The repository's own rule for itself: "A new feature, a fix or a change to how something works goes in only when it is measured and the numbers show it adds value", and for a change to a measurement, "`kothar audit` on the same logos on main and on your branch". — [CONTRIBUTING.md](file:///C:/Users/jesus/Documents/Projects/kothar/CONTRIBUTING.md)

### Inferences
Proposed classification (mine). "Gate" means a `fail` finding, "warn" a visible warning, "info" a reported number.

| Metric | Evidence | Proposed level | Reason |
|---|---|---|---|
| Sub-pixel ink, closing gaps, shape survival, topology change at target size (exist) | Engineering fact about rasterisation; crowding literature supports the concern | Gate (as today) | Deterministic; a lost stroke is lost for every viewer |
| Smallest separate element in px (exists) | Same | Gate (as today) | Same |
| Minimum stroke / gap in px at 16 px (new number from the same transform) | Same | Info beside the existing gate | Makes the existing `size` finding actionable |
| Compression complexity, perimetric complexity, edge density | r about .6 to .8 with rated complexity; icons rs about .65; no thresholds | Info; warn only as an extreme percentile against brand marks | Validated direction, no validated cut-off |
| Pieces, holes (exist), path nodes (exists) | Count of objects correlates with icon complexity | Keep `pieces` as is; treat `complexity-nodes` as an authoring-hygiene rule, not a perceptual one | Node count measures the file, not the percept |
| Mirror symmetry per axis, near-miss band | Strong second factor in perceived complexity; fit effects in logo studies | Info, plus a specific note for "almost symmetric" | Direction of "good" depends on brand traits |
| Rotational symmetry order | No validation found | Info | Descriptive only |
| Balance: DCM (exists as `balanceOffset`), APB | Valid for sparse dot pictures; failed on calligraphy; large individual differences | Info (as today) | Already at the right level |
| Curved-contour share, corner count, edge-orientation entropy | Preference effect moderate and moderated; trait associations observational | Info, phrased against product traits | Fit variable |
| Whitespace in hull, dominance of largest piece | Used as features; no outcome validation | Info | Descriptive |
| Diagonality, rising vs falling share | Experimental support in logo research (not read directly), culture-dependent | Info | Fit variable |
| Small-size SSIM, high-frequency share, crowding ratio | No logo validation | Info, possibly warn after local calibration | Unvalidated proxies |
| Photograph-trained memorability score | Out of domain | Do not add | No evidence of transfer |

- A gate added on psychological grounds would also conflict with a principle the skill states: "Do not chase a number with tricks ... The measurements exist to predict what a person sees". Advisory metrics cannot be gamed into a pass because they do not pass or fail.
- The cheapest way to make advisory numbers meaningful is a local reference distribution (percentiles over the Simple Icons brand subset of the existing index) and a calibration set of the project's own logos, which is also what CONTRIBUTING.md demands before a measurement changes.

### Gaps
- No source states gate thresholds for any of these properties. The table is a reasoned proposal.
- No test of how these metrics correlate with the skill's own blind-judge scores (legibility, distinctiveness, memorability). That data exists in each workspace's `audit.json` and would be the natural local validation.

---

## 9. Deliverable B: inventory of the repository and plug-in points

### Takeaway
The repository is a TypeScript CLI (Node >= 20, zero runtime npm dependencies in the package; two lazily installed into `~/.kothar`: `@resvg/resvg-js` and `opentype.js`) plus one skill document set. It already measures small-size survival, element size, density, piece count, aspect, centring, balance offset, shape similarity to about 21,000 reference shapes, and blind-judge recognition. It has no symmetry, curvature, orientation or perceptual-complexity measure, and the only "psychology" data file drives font choice. The clean insertion point for new metrics is `measure()` in `src/measure.ts`, which already holds the 512 px mask every proposed metric needs.

### Cited Findings

Layout and build
- Package `kothar` 0.1.0, ESM, MIT, `engines.node >= 20`, `bin.kothar = skills/kothar/scripts/kothar.js`; scripts `build` (`tsc -p tsconfig.json && tsc -p tsconfig.web.json`) and `test` (`npm run build && node --test tests/core.test.js`); devDependencies only `typescript ^7.0.2` and `@types/node ^26.6.6`. — [package.json](file:///C:/Users/jesus/Documents/Projects/kothar/package.json)
- Source is `src/*.ts` (18 files, about 2,700 lines) compiled to `skills/kothar/scripts/*.js`, and `src/web/app.ts` compiled to `skills/kothar/assets/app.js`. Compiled files are committed; CI fails if they differ from `src/` (`git diff --exit-code -- skills/`). Project instructions: "Edit `src/*.ts`, never `skills/kothar/scripts/*.js`". — [CLAUDE.md](file:///C:/Users/jesus/Documents/Projects/kothar/CLAUDE.md); [.github/workflows/ci.yml](file:///C:/Users/jesus/Documents/Projects/kothar/.github/workflows/ci.yml)
- Runtime dependencies are declared in code, `DEPS = { '@resvg/resvg-js': '^2.6.2', 'opentype.js': '^1.3.4' }`, installed by `kothar setup` into `~/.kothar` (`HOME`, overridable with `KOTHAR_HOME`) and loaded through `need(name)`. — [src/util.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/util.ts)
- Plugin manifests: `.claude-plugin/plugin.json` and `marketplace.json` (name `kothar`, category design), `.codex-plugin/plugin.json`. One skill: `skills/kothar/` with `SKILL.md` (148 lines), `references/` (`logo-rules.md`, `judges.md`, `identity.md`, `wordmarks.md`, `naming.md`, `animation.md`), `assets/` (`traits.json`, `fonts.json`, `strings.json`, `judge-instructions.md`, `app.css`, `app.js`), `scripts/` (compiled). — [.claude-plugin/plugin.json](file:///C:/Users/jesus/Documents/Projects/kothar/.claude-plugin/plugin.json)
- Tests: `tests/core.test.js`, 10 tests with `node:test` against the compiled scripts (lint, 16 px survival, sub-pixel speck, colorize, inks, workspace upgrade, split, names, animation lint, type psychology). Evals: `evals/evals.json`, three prompts with expected outputs. — [tests/core.test.js](file:///C:/Users/jesus/Documents/Projects/kothar/tests/core.test.js); [evals/evals.json](file:///C:/Users/jesus/Documents/Projects/kothar/evals/evals.json)
- Untracked at the time of reading: `assets/readme/`, `reports/` (listed, appeared empty), `research_notes/`.

What the skill instructs
- Flow: terminal questions, then a localhost page in three steps (01 name and font, 02 logo, 03 identity report); "Scripts decide what is good enough, not your impression"; "A step cannot be published while a check fails". Logos are produced in three concept kinds (name, product, fusion), audited, then judged blind by at least three fresh agents, at most two judged rounds. — [skills/kothar/SKILL.md](file:///C:/Users/jesus/Documents/Projects/kothar/skills/kothar/SKILL.md)
- Step 0.3 asks the agent to weigh product traits 1 to 3 (sincerity, excitement, competence, sophistication, ruggedness, trust, calm, joy, energy, nature, warmth, creativity, heritage, technical) and a kind (functional, sensory-social, both). The skill says: "This is what the fonts for the name are chosen from". Traits are **not** used for the mark. — [skills/kothar/SKILL.md](file:///C:/Users/jesus/Documents/Projects/kothar/skills/kothar/SKILL.md); [skills/kothar/assets/traits.json](file:///C:/Users/jesus/Documents/Projects/kothar/skills/kothar/assets/traits.json)
- Drawing rules in `references/logo-rules.md`: one ink through `currentColor`, optional `data-ink="accent"`, real holes, no text/raster/gradients/filters/`<style>`, small integer viewBox; design advice "Two to five bold shapes", strokes and gaps at least 1/10 of width, "Roughly square ... under 2:1", "Silhouette first"; a table of every audit rule with its fix; an originality section. There are no statements about symmetry, curvature, balance (beyond the info rule), orientation or perceptual complexity, and no literature citations. — [skills/kothar/references/logo-rules.md](file:///C:/Users/jesus/Documents/Projects/kothar/skills/kothar/references/logo-rules.md)
- The only cited research in the repository is in `assets/fonts.json` under `psychology.sources` (Shaikh, Chaparro & Fox 2006; Henderson, Giese & Cote 2004; Grohmann, Giese & Parkman 2013; plus "convention", weighted 0.7), mapping typeface classes to trait weights. I did not verify those three citations; they are outside this task. — [skills/kothar/assets/fonts.json](file:///C:/Users/jesus/Documents/Projects/kothar/skills/kothar/assets/fonts.json)

Scripts and what they measure (all TypeScript, all through one CLI, `COMMANDS` in `src/kothar.ts`)
- `kothar check <file.svg> [--role small|full|wordmark]`: runs `lint`, `measure`, `query` on one file and writes two PNG previews (large, and real pixels at 16 px enlarged 12 times). This is the nearest thing to a "test sheet". — [src/kothar.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/kothar.ts)
- `kothar audit`: `runAudit(ws, id)` in `src/audit.ts` runs everything over the workspace and writes `.kothar/audit.json` (`Audit` with per-concept `Result { level, findings, metrics, nearest }`). — [src/audit.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/audit.ts)
- `lint(parsed, kind)` in `src/svg.ts` (static, from the XML): viewBox present; file size (warn > 8,000 bytes, fail > 24,000); more than 3 decimals; forbidden elements; SMIL; `<style>`; event attributes; external references; duplicate ids; opacity; fill/stroke other than `currentColor`/`none`; `complexity-nodes` (path command count via `pathNodes`, warn > 160, fail > 400 for marks; 600 for wordmarks). Returns `stats { bytes, nodes, shapes, accents }`. There is **no path geometry parser**: `pathNodes` is a regular expression over command letters. — [src/svg.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/svg.ts)
- `measure(src, role)` in `src/measure.ts` (raster): tightens the viewBox to the ink (`tighten`), renders coverage at `REF = 512`, thresholds to mask `M`, then for each size in the role (small: 16, 24, 32, 48, 64, 128): `inkLost` (ink removed by a morphological opening of one device pixel), `gapLost` (same on the inverted, padded mask), `iou` (thresholded small render vs reference), `pieces`/`holes` and `topologyKept`. Derived findings: `size`, `topology`, `elements` (side of the smallest connected piece in px at target; fail < 1, warn < 1.5), `density` (ink / bounding box; warn < 0.12 or > 0.95), `pieces` (warn > 12, fail > 24), `aspect` (warn > 2, fail > 3), `clipped`, `off-centre` (warn > 4% of viewBox), `balance` (info when the ink centroid is more than 10% from the bounding-box centre). `Metrics` holds `role, sizes, minCleanSize, pieces, holes, aspect, viewBoxFill, smallestElementPx, density, balanceOffset`. Limits live in the exported `LIMITS` object. — [src/measure.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/measure.ts)
- `src/raster.ts`: `render` (resvg), `renderAlpha`, `tighten`, `threshold`, `count`, `invert`, `bbox`, `pad`, `edt` (exact Euclidean distance transform), `open`, `components`, `topology`, `silhouette`, `resample`, `encodePng` (uses `node:zlib`), `pixelPreview`, `encodeIco`. — [src/raster.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/raster.ts)
- `src/similarity.ts`: `describe(src)` builds two 24 x 24 blurred descriptors (ink, silhouette); `query(src)` takes the Pearson correlation against an index built by `buildIndex()` from six npm packages (`simple-icons`, `lucide-static`, `@tabler/icons`, `bootstrap-icons`, `@phosphor-icons/core`, `@twemoji/svg`), plain and horizontally mirrored; `LIMITS = { inkFail: 0.88, inkWarn: 0.76, silWarn: 0.95, silInkFloor: 0.45, sibling: 0.8, plainFont: 0.75 }`; `siblings(items)` compares the options with each other; `plainFontScore` compares a drawn name with the font render on a 96 x 24 descriptor. The index stores descriptors only (`refs-index.bin`, `refs-index.json`); the SVGs are deleted after indexing unless `--keep`. It is a nearest-neighbour check, **not a searchable library by type, technique or industry**. — [src/similarity.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/similarity.ts)
- `src/judge.ts`: `pack(ws, id)` builds an anonymised packet and three prompts; `score(ws, id, round)` scores answers: recognition against `depicts` words at 16 px and large, shared lookalikes, read rate for drawn names, and medians of the judges' 1 to 5 `legibility`, `distinctiveness`, `memorability`. — [src/judge.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/judge.ts); [skills/kothar/assets/judge-instructions.md](file:///C:/Users/jesus/Documents/Projects/kothar/skills/kothar/assets/judge-instructions.md)
- `src/identity.ts`: `Identity` state, `gate(step, id, ws)` and `auditGate`, which block a step when any finding in `audit.json` has level `fail` or when the audit is stale. `Level = 'pass' | 'info' | 'warn' | 'fail'`; `info` ranks with `pass`. — [src/identity.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/identity.ts); [src/util.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/util.ts)
- `src/typography.ts`: `rankClasses(traits, kind)`, `aligned`, `nextFonts`, `pick`: the one place where product traits already drive a design decision. — [src/typography.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/typography.ts)
- `src/exporter.ts` (`exportFinal`, `composeLockup`, `baselineAnimation`) and `src/deliver.ts` (`deliver`): export variants (mark and lockup SVGs for light, dark and single ink; PNG sizes; favicon; link-preview image; animated mark; `tokens.json`; README). `src/server.ts` (`buildState`, `page`, `serve`, `writeStatic`) and `src/web/app.ts` (`step2`, `report`, `explain`, `fact`): the localhost page and the static `report.html`, which is the "presentation board". `src/names.ts`, `src/fonts.ts`: naming and font checks. — [src/exporter.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/exporter.ts); [src/server.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/server.ts)
- Files that handle colour (noted factually, nothing proposed): `src/color.ts` (`INKS`, the two inks per ground), `colorize()` in `src/svg.ts`, the `INK` constant in `src/web/app.ts`, the `upgrade()` function in `src/identity.ts` that strips palettes from old workspaces, and the tones written by `src/exporter.ts` / `src/deliver.ts`. — [src/color.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/color.ts)

How a metric reaches the user today
- `measure()` returns `metrics`; `auditFile()` merges them into `Result.metrics`; `buildState()` in `src/server.ts` forwards only `minClean`, `smallest` and `nearest` to the page; `step2()` in `src/web/app.ts` shows them with `fact()`; findings other than `info` are listed through `explain()`, which looks up `rule.<name>` in `assets/strings.json` (English and Spanish built in) and falls back to the raw message. `info` findings are filtered out of the page list (`x.level !== 'info'`). `printable()` in `src/audit.ts` prints all non-pass findings in the terminal. — [src/server.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/server.ts); [src/web/app.ts](file:///C:/Users/jesus/Documents/Projects/kothar/src/web/app.ts)

### Inferences

What already overlaps with the catalogue
- Balance: `balanceOffset` in `measure()` is a DCM variant, taken against the ink's bounding-box centre instead of the frame centre and using the larger of the two axis offsets instead of the Euclidean distance. It is already `info` level, which matches the evidence.
- Quantity side of complexity: `pieces`, `holes`, and `nodes`/`bytes` from `lint`. Missing: any perceptual complexity score (compression, perimeter), and the structural side (symmetry).
- Whitespace: `density` is ink over bounding box, not over convex hull.
- Small size: the engineering proxies are all present; missing are a stroke width in pixels, an unthresholded similarity, and a spacing ratio.
- Symmetry, curvature/angularity, orientation/diagonality, repetition: absent. The only mirror operation is the private `flipH` in `similarity.ts`, used for matching.

Where new metric code could plug in (by file and function)
1. **A new module `src/profile.ts`** exporting something like `profile(m: Mask, w: number, h: number): Profile`, with pure functions over a mask: `compressionComplexity`, `perimetricComplexity`, `edgeDensity`, `mirrorSymmetry` (four axes plus near-miss flag), `rotationalSymmetry`, `apb`, `convexHullFill`, `dominance`, `orientationShares`, `curvature` (boundary trace and turning angle, edge-orientation entropy), `minStrokePx`. All can be written on `edt`, `components`, `bbox`, `resample` and `node:zlib`, with **no new dependency**, which fits a package that ships zero runtime dependencies and installs only two on setup.
2. **Call site: `measure()` in `src/measure.ts`**, in the `if (role !== 'wordmark')` block where `M`, `ref.w`, `ref.h`, `ink` and `refTopo` are in scope and `density` and `balanceOffset` are computed. Extend the `Metrics` interface with a `profile?: Profile` field and push findings with `add(rule, 'info', msg)`. Because `auditFile()` spreads `m.metrics` into the result, the numbers land in `audit.json` without touching `src/audit.ts`.
3. **Thresholds: the `LIMITS` object in `src/measure.ts`** is where any future warn level would be declared, next to the existing ones.
4. **Single-file feedback: the `check` command in `src/kothar.ts`** prints one summary line (`clean from ... · smallest element ... · N path nodes`); a second line with the profile is the lowest-cost way for the drawing agent to see it after each drawing.
5. **Page: `buildState()` in `src/server.ts`** must forward the new fields inside each concept's `audit` object, and **`step2()` in `src/web/app.ts`** would add `fact(...)` rows. New labels and `rule.<name>` texts go in **`skills/kothar/assets/strings.json`** for both `en` and `es`; other locales are translated on demand through `kothar strings`, and `strings save` rejects translations with missing keys, so new keys affect saved translations in `~/.kothar/strings/`. Note the page hides `info` findings, so advisory metrics need `fact()` rows or a change to that filter to be visible.
6. **Percentiles against real brand marks: `buildIndex()` in `src/similarity.ts`** iterates every reference SVG and already calls `describe()`; computing the profile there for `kind === 'brand'` entries and storing summary quantiles in `refs-index.json` would give each advisory number a reference distribution. Cost: the index is built once per machine, so existing users would need `kothar setup --refs --force`, and `loadIndex()` must tolerate an index without the new field.
7. **Path-geometry route for curvature (optional)**: would need a parser. Either add one to `DEPS` in `src/util.ts` (installed into `~/.kothar`, loaded with `need()`, as resvg is) or write a small one next to `pathNodes` in `src/svg.ts`. `svg-path-properties` requires Node >= 22 and conflicts with `engines.node >= 20`. The raster route avoids all of this.
8. **Tests: `tests/core.test.js`** already defines `BOLD` and `HAIR` fixtures and a `svg()` helper; property tests fit the same pattern (a disc has perimetric complexity near 1 and full symmetry; a square with a hole is about three times a square; a left-heavy shape has low left/right symmetry). CI runs `kothar setup` first, so resvg is available.

Where evidence-based rules could plug in (documents and data)
1. **`skills/kothar/references/logo-rules.md`**, section 3 table ("Each audit rule and how to fix it"): one row per new finding. Section 2 ("Designing for the measurements") is where guidance on symmetry, curvature and orientation would sit; today it has five bullets, none about those properties.
2. **A trait-to-form data file modelled on `assets/fonts.json` `psychology`** (classes with `traits` weights and a `source` key, with a lower weight for `convention`). The same shape would carry statements such as "asymmetry: excitement (Luffarelli 2019)", "angular: ruggedness (Dew 2022, observational)", with their sources. `rankClasses()` in `src/typography.ts` is the existing scoring pattern to copy, and `kothar traits` in `src/kothar.ts` is the command that already exposes the vocabulary.
3. **`skills/kothar/SKILL.md`, step 2 ("Logos")**: the place to tell the agent to read the profile and relate it to `product.traits` when writing each concept's `rationale`. Step 0.3 currently says the traits only choose fonts; that sentence would need to change if traits also inform the mark.
4. **`Concept` in `src/identity.ts`** has `title, rationale, depicts, mark, compact`. If the agent is to state intended form (for example symmetric or not), a field there, documented in `references/identity.md`, is the hook; `gate()` is where a mismatch could be surfaced. On the evidence in section 8 this should not be a `fail`.
5. **`skills/kothar/references/judges.md` and `assets/judge-instructions.md`**: the judges' `memorability` and `distinctiveness` scores are the only human-like ratings in the system. Logging the computed profile next to them in `audit.json` would, over time, give the local validation data the literature lacks. No change to the judge prompt is needed for that.
6. **`evals/evals.json`** has no eval that exercises measurement quality; a fourth eval or a fixture set of known logos is what CONTRIBUTING.md's "Measurement" section would require for any change to a measurement.

Constraints that shape any addition
- Every source change needs `npm run build` and a commit of the regenerated `skills/kothar/scripts/*.js`; CI checks the diff.
- A change to a measurement must be shown with `kothar audit` on the same logos before and after (CONTRIBUTING.md).
- `fail` findings block the step through `auditGate()`; `warn` findings are shown to the user beside the logo; `info` findings appear only in the terminal. So the level chosen for a new metric decides who sees it.
- Wordmarks skip the density, pieces, aspect and balance block (`role !== 'wordmark'`); a profile for drawn names would need its own decision.

### Gaps
- I did not run the CLI, the build or the tests (read-only by instruction), so runtime behaviour is inferred from source. The compiled `.js` files were not compared line by line with `src/`.
- `src/exporter.ts`, `src/deliver.ts`, `src/names.ts`, `src/fonts.ts`, `src/server.ts` and `src/web/app.ts` were read at the level of exported functions and selected sections, not in full.
- The size and makeup of the brand subset inside a built reference index were not checked (no index was inspected); "about 21,000 shapes" is the repository's own figure.
- Whether `reports/` is meant to hold anything is unknown; it listed as empty.
- The three typography citations in `assets/fonts.json` were not verified.
