# GitHub Actions budget guardrails

Owner's stated monthly allowance: $12 and 2,000 minutes.

## Policy
- CI runs only on manual `workflow_dispatch`.
- No push, pull-request, schedule, matrix or deployment triggers.
- One Ubuntu job, 12-minute job timeout, cancel any overlapping run.
- Do not run CI just for documentation-only changes.
- Prefer one deliberate validation run after a batch of code changes.
- Check repository Actions usage/billing before repeated runs.
- Keep deployment manual and separate from validation until owner approves.

The workflow configuration reduces automatic consumption; it does not guarantee actual monthly usage or billing. Review GitHub's usage and billing page for authoritative totals.
