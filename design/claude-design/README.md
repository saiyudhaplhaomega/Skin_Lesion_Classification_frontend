# Claude Design Exports

This folder stores visual design references exported from Claude Design.

Do not paste exported HTML or JSX directly into `app/` or `components/`.
Use these files as reference material, then implement the screen in the matching
Next.js route using `DESIGN_TO_CODE_MAP.md`.

Current export:

```text
design/claude-design/xai-skin-lesion-export/
```

Original ZIP is still preserved at the frontend repo root:

```text
XAI_SKIN_Lesion.zip
```

## How To Use

1. Open the exported HTML or screenshot for the screen you want.
2. Open `DESIGN_TO_CODE_MAP.md`.
3. Find the matching Next.js route and component files.
4. Ask Claude Code to create an implementation plan first.
5. Implement one screen at a time.
6. Run `npm run type-check` and `npm run build`.

## High-Value Entry Files

| Screen | Exported reference |
|---|---|
| Landing page | `xai-skin-lesion-export/Landing Page.html` |
| Authentication flow | `xai-skin-lesion-export/Authentication Flow.html` |
| Patient dashboard | `xai-skin-lesion-export/Patient Dashboard.html` |
| Upload and analysis | `xai-skin-lesion-export/Upload & Analysis Flow.html` |
| Grad-CAM viewer | `xai-skin-lesion-export/Grad-CAM Heatmap Viewer.html` |
| Body map | `xai-skin-lesion-export/Body Map.html` |
| Camera capture | `xai-skin-lesion-export/Camera Capture.html` |
| Lab results | `xai-skin-lesion-export/Lab Results Flow.html` |
| Notification center | `xai-skin-lesion-export/Notification Center.html` |
| Consent center | `xai-skin-lesion-export/Consent Management Center.html` |
| Doctor dashboard | `xai-skin-lesion-export/doctor-dashboard/Doctor Dashboard.html` |
| Admin dashboard | `xai-skin-lesion-export/admin-dashboard/Admin Dashboard.html` |
| Research dashboard | `xai-skin-lesion-export/research-dashboard/Research Dashboard.html` |
| Cloud operations | `xai-skin-lesion-export/cloud-ops-dashboard/Cloud Ops Dashboard.html` |
| Extended screens | `xai-skin-lesion-export/extended-screens/` |
| Operator surfaces | `xai-skin-lesion-export/operator-surfaces/` |
| Screenshots | `xai-skin-lesion-export/screenshots/` |

