import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/signin", "/signup", "/terms", "/privacy"],
            disallow: ["/dashboard", "/transfer", "/transactions", "/api"],
        },
        sitemap: "https://ledgerline-green.vercel.app/sitemap.xml",
    };
}
