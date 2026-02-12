/**
 * TemplateRenderer
 * ─────────────────
 * Selects and renders the correct template component based on `templateId`.
 * ConfigContext must already be provided by the parent (SurprisePage / PreviewPage).
 *
 * To add a new template:
 *   1. Create  src/templates/template-N/index.jsx
 *   2. Import it below and add an entry to TEMPLATES.
 */

import Template5 from './template-5/index.jsx';

const TEMPLATES = {
    'template-5': Template5,
    // 'template-1': Template1,   ← add future templates here
};

/**
 * @param {{ templateId?: string }} props
 */
export default function TemplateRenderer({ templateId = 'template-5' }) {
    const Component = TEMPLATES[templateId] ?? Template5;
    return <Component />;
}
