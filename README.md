# Merwede Architecture

This repository contains the Merwede Architecture website codebase.

## Mobile Performance Optimization

A systematic series of optimizations were applied to resolve mobile performance bottlenecks and maximize the Google PageSpeed Insights Mobile configuration score. The goal was to drastically improve the Mobile Performance Score without affecting the 100/100 SEO and Best Practices scores or causing Layout Shifts (CLS).

### 1. Eliminating Render-Blocking Resources
**Objective:** Address the 3.8s delay caused by styles and scripts blocking the browser from painting the initial view.

*   **FontAwesome Optimization (Cloudflare CDN):** 
    Previously, the FontAwesome stylesheet was loaded synchronously, meaning the browser paused HTML rendering until the external CSS file was fully downloaded and parsed. 
    *   **Action Taken:** Modified the `<link>` tag to use a `preload` approach:
        ```html
        <link rel="preload" href=".../all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link rel="stylesheet" href=".../all.min.css"></noscript>
        ```
        *This tells the browser to fetch the file in the background without pausing the rendering, and injects it as a stylesheet as soon as it's ready.*
*   **ContentSquare Analytics:** 
    *   **Action Taken:** Added the `defer` attribute to the ContentSquare `<script>` tag. This instructs the browser to download the script in the background but only execute it *after* the HTML document is fully parsed.
*   **Google Fonts:** 
    *   **Action Taken:** Audited the Google Fonts request. The URL already properly included `&display=swap`. This ensures the `font-display: swap` CSS property is active, instructing the browser to use a fallback system font immediately and swap it to the custom font once loaded, preventing "invisible text" flashes.

### 2. Reducing Main-Thread Work & JS Execution
**Objective:** Lower the Total Blocking Time (TBT) from 1,250ms to under 200ms by minimizing the work the browser has to do on the main thread.

*   **JavaScript Deferral:** 
    *   **Action Taken:** Added the `defer` attribute to the local `script.js` file at the bottom of the HTML documents.
*   **JavaScript Minification:** 
    *   **Action Taken:** Utilized a Node.js package called `terser` to parse, compress, and mangle `script.js`. This stripped out all comments, shortened variables where safe, and eliminated white spaces. This reduced the script size by nearly 45%, significantly speeding up JS compilation and execution times.
*   **CSS Minification:**
    *   **Action Taken:** Processed `styles.css` using a custom script to collapse all excessive whitespace, remove inline CSS comments, and strip spaces around delimiters. The file size dropped from **57KB down to 39KB**, making the CSS Object Model (CSSOM) generation substantially faster.

### 3. Optimizing Network Payloads (The 4.1MB Issue)
**Objective:** Resolve the massive page weight caused by loading uncompressed `.jpg` and `.png` images initially.

*   **Implementing "Lazy Loading":**
    *   **Action Taken:** Injected the `loading="lazy"` attribute into every `<img>` tag that sits below the fold across all HTML files. 
    *   *Result:* The browser no longer downloads the heavy portfolio gallery images on initial load. It waits until the user scrolls close to them. This immediately resolved the bulk of the 4.1MB payload problem.
    *   *Exception:* Above the fold images like the logo and hero banner were excluded from lazy loading to ensure they render instantly, preventing Largest Contentful Paint (LCP) delays.
*   **Aggressive Image Compression (WebP Conversion):**
    *   **Action Taken:** A custom Node.js/Headless Browser script was used to fetch all local `.jpg` and `.png` images and draw them to an HTML5 canvas to output highly compressed `.webp` formats. HTML files were then programmatically updated to reference the `.webp` files, significantly dropping file size across all galleries.

### 4. Ensuring Zero Visual Regressions (CLS: 0)
**Objective:** Guarantee that the aggressive speed optimizations didn't break the layout.

*   **Action Taken:** Kept all existing CSS dimensional constraints intact (`.fc-stage-img`, etc.). Because the images either have explicit dimensions or parent containers governing their aspect ratio, adding `loading="lazy"` prevents layout shifts since the structural space is reserved before the WebP images finish loading. 
