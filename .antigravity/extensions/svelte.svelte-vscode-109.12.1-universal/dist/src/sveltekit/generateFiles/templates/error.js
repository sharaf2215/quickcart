"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const defaultScriptTemplate = `
<script>
    import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error.message}</h1>
`;
const jsSv5ScriptTemplateAppState = `
<script>
    import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error.message}</h1>
`;
const tsScriptTemplate = `
<script lang="ts">
    import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
`;
const tsSv5ScriptTemplateAppState = `
<script lang="ts">
    import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error?.message}</h1>
`;
async function default_1(config) {
    const { withTs, withAppState } = config.kind;
    let template = defaultScriptTemplate;
    if (withAppState && withTs) {
        template = tsSv5ScriptTemplateAppState;
    }
    else if (withAppState && !withTs) {
        template = jsSv5ScriptTemplateAppState;
    }
    else if (!withAppState && withTs) {
        template = tsScriptTemplate;
    }
    else if (!withAppState && !withTs) {
        template = defaultScriptTemplate;
    }
    return template.trim();
}
//# sourceMappingURL=error.js.map