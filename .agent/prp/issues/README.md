# `.agent/prp/issues/`

Per-issue artifacts (notes, scratch, draft bodies) created during the lifecycle of an open
implementation issue. One subdirectory per issue, named `<NN>-<slug>/`, or a single markdown file
named `<NN>-<slug>.md`.

This folder is empty until implementation issues land. The bootstrap PRP (`#3`) does not produce
implementation issues here -- it produces a proposed issue map under `.agent/prp/plans/`.
