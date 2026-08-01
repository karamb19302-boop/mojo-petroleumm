import Image from "next/image";
import mascotSrc from "../mojomascotnbg.png";
import "./globals.css";
import "./theme.css";
import "./light-surfaces.css";
import type { Metadata } from "next";
import { Footer, Nav } from "./ui";
import { AnimatedBackground } from "./animated-background";
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.mojopetroleum.com"), title: { default: "Mojo Petroleum | Fuel Systems Infrastructure", template: "%s | Mojo Petroleum" }, description: "Bay Area petroleum infrastructure, compliance, repair, and construction services.", icons: { icon: "/mojomascotnbg.png", shortcut: "/mojomascotnbg.png", apple: "/mojomascotnbg.png" }, alternates:{canonical:"/"} };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en" data-scroll-behavior="smooth"><body><AnimatedBackground /><div className="mascot-decor" aria-hidden="true"><Image src={mascotSrc} alt="Mojo Petroleum mascot" fill sizes="120px" style={{objectFit:'contain'}} priority={false} /></div><div className="site-shell"><Nav/>{children}<Footer/></div></body></html>; }
