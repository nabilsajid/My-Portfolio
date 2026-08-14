import { Instagram, Facebook, Linkedin, Mail, Youtube } from "lucide-react";

const socials = [
  { icon: Instagram, href: "https://www.instagram.com/nabil_sajid_/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/nabil.sajid.2002", label: "Facebook" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/nabil-azmal-sajid-a181b91b5/", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/@nabilazmalsajid", label: "YouTube" },
  { icon: Mail, href: "mailto:nabilsajid55@gmail.com", label: "Email" },
];

const Footer = () => (
  <footer className="border-t border-border section-padding">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <h3 className="font-display text-xl font-bold">Let's Work Together</h3>
        <p className="text-sm text-muted-foreground mt-1">Got a project in mind? Let's make it happen.</p>
      </div>
      <div className="flex items-center gap-5">
        {socials.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
        ))}
      </div>
    </div>
    <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border text-center">
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
