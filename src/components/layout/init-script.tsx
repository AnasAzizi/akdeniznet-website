"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

/**
 * Runs before the first paint: adds `motion-ok` when motion is allowed, so
 * scroll-reveal content can start hidden. If the app never boots
 * (`motion-ready` missing after 4s), the class is removed again, so content
 * never stays invisible.
 */
const script = `(function(){var r=document.documentElement;try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){r.classList.add("motion-ok");setTimeout(function(){if(!r.classList.contains("motion-ready"))r.classList.remove("motion-ok")},4000)}}catch(e){}})()`;

/**
 * Inserts the script into the server-rendered HTML only, so React never
 * renders a <script> on the client.
 */
export function InitScript() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
  });

  return null;
}
