// @/middleware.ts

/**
 * Middleware to add a Content-Security-Policy directive that allows the
 * JavaScript provided by Google ReCaptcha to be loaded.  Based on:
 *
 * https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function middlewareBu(request: NextRequest) {
  /*
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    // Removed example script-src, added new frame-src and script-src at the bottom
    const cspHeader = `
    default-src 'self';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    frame-src 'self' 'www.google.com';
    script-src 'self' 'recaptcha.net' 'www.gstatic.com' 'www.google.com';
`
*/
  const cspHeader = `
    default-src 'self';
    base-uri 'self';
    font-src 'self' https: data:;
    form-action 'self';
    frame-ancestors 'self';
    frame-src 'self' 'www.google.com';
    img-src 'self' data:;
    object-src 'none';
    script-src 'self' 'recaptcha.net' 'www.gstatic.com' 'www.google.com';
    script-src-attr 'none';
    style-src 'self' https: 'unsafe-inline';
    upgrade-insecure-requests;
`;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  //    requestHeaders.set('x-nonce', nonce)

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}
