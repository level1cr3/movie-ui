declare module "sonner" {
  export * from "sonner/dist";
}

/*

This is effectively a re-export of types, so TypeScript thinks "sonner" resolves cleanly.
At runtime nothing changes — it’s only for type-checking.

🔑 Difference from a normal re-export

A normal re-export (export * from ...) actually runs at runtime.

A .d.ts shim only exists at type level — it doesn’t emit JS.

So it’s zero-cost glue just for TypeScript.


📖 The word itself

“Shim” isn’t an acronym — it comes from carpentry / mechanics.
A shim is a thin piece of material used to fill small gaps between parts so they fit snugly.

In software, a shim = a thin compatibility layer.
*/
