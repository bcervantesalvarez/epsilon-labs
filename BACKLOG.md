# Follow-on backlog

## High priority: site-grounded search assistant

After the website design is reviewed, implement a responsive, accessible assistant in the bottom-right corner. Retrieve from the site's real public content, generate answers grounded in that retrieved evidence, and provide citations with openable source links. State uncertainty when content does not support an answer. Preserve the existing Pagefind search as a useful fallback.

Keep provider credentials server-side. Evaluate the existing Cloudflare static-assets setup and a small Worker endpoint without changing Astro's static output or build-time native rendering. Select provider/configuration and test retrieval, citations, missing evidence, UI accessibility, and failure states before enabling live generation. Provider costs and production publication require a separate decision. No backend or provider service was provisioned in this design pass.
