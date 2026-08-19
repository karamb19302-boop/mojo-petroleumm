import Link from "next/link"; import { Cta } from "../ui";
const list=[['ust-ast-installation','UST/AST Installation','Professional UST and AST installation services designed to provide safe, reliable, and fully compliant fuel storage solutions from planning through final commissioning.'],['maintenance-repairs','Maintenance & Repairs','Keep your fuel systems operating at peak performance with expert maintenance and repair services. Our experienced technicians provide fast, reliable solutions that minimize downtime, extend equipment life, and ensure regulatory compliance.'],['compliance-testing','Compliance Testing','Ensure your fuel systems remain safe, compliant, and operating at their best with comprehensive compliance testing performed by certified professionals.'],['emergency-service','Emergency Service','When unexpected issues arise, MOJO Petroleum Services is ready to respond. Our emergency service team provides rapid diagnostics and repairs to restore your fuel system safely, efficiently, and with minimal downtime.']];
const tiffImages=[
  '/licenses/license-1.tiff',
  '/licenses/license-2.tiff',
  '/licenses/license-3.tiff',
  '/licenses/license-4.tiff',
  '/licenses/license-5.tiff',
  '/licenses/license-6.tiff',
  '/licenses/license-7.tiff',
  '/licenses/license-9.tiff',
  '/licenses/license-10.jpeg',
  '/licenses/license-11.tiff',
  '/licenses/license-12.tiff',
  '/licenses/license-13.tiff',
  '/licenses/license-14.tiff'
];
export const metadata={title:"Services"};
export default function Services(){
  return <>
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Capabilities</p>
          <h1>Built to Perform. Trusted to Deliver.</h1>
          <p>One accountable team for construction, upgrades, compliance and responsive field service.</p>
        </div>
      </section>

      <section className="section">
        <div className="shell services-header">
          <p className="eyebrow">Our Services</p>
          <h2>Structured, dependable service for every fuel-system need.</h2>
          <p className="services-summary">From installation and repairs to compliance testing and emergency response, MOJO Petroleum delivers responsive support across your operation.</p>
        </div>
        <div className="shell grid cards">
          {list.map(([slug,title,copy]) => (
            <Link className={`card${slug === 'emergency-service' ? ' emergency' : ''}`} href={'/services/'+slug} key={slug}>
              <span className="pill">SERVICE</span>
              <h3>{title} →</h3>
              <p>{copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section showcase">
        <div className="shell">
          <div className="showcase-copy">
            <p className="eyebrow">Service Showcase</p>
            <h2>Fuel equipment service designed to keep your operation moving.</h2>
            <p>Mojo Petroleum provides full-service installation, maintenance, and repair for fuel systems and dispensing equipment from all major manufacturers. We deliver reliable, safety-focused service designed to keep your operations running efficiently and in compliance.</p>
            <p className="showcase-subtext">Trusted by 14 fuel and energy brands across installation, maintenance, and repair.</p>
          </div>
          <div className="showcase-grid">
            {tiffImages.map((src, index) => (
              <div className="showcase-card" key={src}>
                <img src={src} alt={`Logo asset ${index + 1}`} className="showcase-image" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Cta />
  </>;
}
