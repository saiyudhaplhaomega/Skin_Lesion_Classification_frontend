# Graph Report - C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend  (2026-05-20)

## Corpus Check
- 4 files · ~22,472 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 7 nodes · 4 edges · 4 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `submitImage()` - 2 edges
2. `analyzeImage()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `submitImage()` --calls--> `analyzeImage()`  [INFERRED]
  C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend\app\page.tsx → C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend\lib\api.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 1.0
Nodes (0): 

### Community 1 - "Community 1"
Cohesion: 1.0
Nodes (1): submitImage()

### Community 2 - "Community 2"
Cohesion: 1.0
Nodes (1): analyzeImage()

### Community 3 - "Community 3"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 0`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 1`** (2 nodes): `page.tsx`, `submitImage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (2 nodes): `analyzeImage()`, `api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `submitImage()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `analyzeImage()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._