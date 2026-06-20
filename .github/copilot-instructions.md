- Never use IIFEs (`(() => { ... })()`) inside JSX to introduce local variables or conditional rendering.
  - Instead, extract a named sub-component
  - Named sub-components are appended to the end of the file, after the main component.

- Avoid inline styling
  - Instead, use CSS modules or styled-components for styling

- when writing test cases
  - Use 'Assert', 'Arrange', 'Act' comments to structure the test cases
  - objects passed to mockResolvedValue should be assigned to a variable first