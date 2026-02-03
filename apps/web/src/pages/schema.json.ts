import type { APIRoute } from "astro";
import schema from "statecharts.sh/schema.json";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(schema, null, 2), {
    headers: {
      "Content-Type": "application/schema+json",
    },
  });
};
