- Never use IIFEs (`(() => { ... })()`) inside JSX to introduce local variables or conditional rendering.
  - Instead, extract a named sub-component
  - Named sub-components are appended to the end of the file, after the main component.

- Avoid inline styling
  - Instead, use CSS modules or styled-components for styling
