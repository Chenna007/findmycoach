import React from 'react';

const Section = ({ children, style = {} }) => (
  <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto", ...style }}>
    {children}
  </section>
);

export default Section;
