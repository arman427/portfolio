import type { Metadata, Viewport } from "next";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { TransitionOverlay } from "@/widgets/page-transition";
import { fontVariables } from "@/shared/config/fonts";
import { localeBootScript } from "@/shared/i18n/config";
import { siteConfig } from "@/shared/config/site";
import { AppProviders, LocaleBoundary } from "./_providers";
import "./globals.css";

/** The whole portfolio is static: every route must prerender completely. */
export const ensureStatic = "navigation";

const title = `${siteConfig.name} — ${siteConfig.role}`;

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s — ${siteConfig.name}` },
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        siteName: siteConfig.name,
        title,
        description: siteConfig.description,
    },
    twitter: {
        card: "summary_large_image",
        title,
        description: siteConfig.description,
    },
};

export const viewport: Viewport = {
    themeColor: "#161513",
    colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={fontVariables} suppressHydrationWarning>
            <head>
                {/* Applies a stored non-default locale before the first paint (see shared/i18n/config). */}
                <script
                    dangerouslySetInnerHTML={{ __html: localeBootScript }}
                />
            </head>
            <body>
                <AppProviders>
                    <Header />
                    <LocaleBoundary>
                        <main>{children}</main>
                        <Footer />
                    </LocaleBoundary>
                    <TransitionOverlay />
                </AppProviders>
            </body>
        </html>
    );
}
