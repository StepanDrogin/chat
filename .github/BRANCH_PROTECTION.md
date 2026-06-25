# Branch Protection

GitHub branch protection and rulesets are repository settings, not files that GitHub auto-applies from the repo. Use this checklist for `main`.

1. Open `Settings -> Rules -> Rulesets`.
2. Create a branch ruleset targeting `main`.
3. Block force pushes.
4. Block branch deletion.
5. Require a pull request before merge.
6. Require status checks before merge.
7. Select `Quality gate` from the `CI` workflow.
8. Save the ruleset as active.

This keeps the deployed branch protected while still allowing the GitHub Pages deploy workflow to publish from successful `main` builds.
