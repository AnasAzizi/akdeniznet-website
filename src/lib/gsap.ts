import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The only place GSAP plugins are registered. Only the lazily loaded motion
 * runtime imports this, so GSAP never weighs on the first paint.
 */
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "expo.out", duration: 0.9 });

export { gsap, ScrollTrigger };
