import React from 'react';

interface JsonLdProps {
  data: object | object[] | null;
}

/**
 * A reusable component for rendering JSON-LD structured data
 * 
 * @param data - The structured data object or array of objects to be rendered
 * @returns A script element with the structured data or null if no data is provided
 */
export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;
  
  // Sanitize the data to prevent XSS attacks
  const sanitizedData = JSON.stringify(data).replace(/</g, '\u003c');
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedData }}
    />
  );
}