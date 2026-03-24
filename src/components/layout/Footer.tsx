import Link from "next/link";
import { Github, Heart, ArrowUpRight } from "lucide-react";

const links = [
  { href: "/about/", label: "关于" },
  { href: "/projects/", label: "项目" },
  { href: "/kb/", label: "知识库" },
  { href: "/blog/", label: "博客" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />

      <div className="container relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold gradient-text">Jerry Xu</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              热爱技术与生活的开发者。专注于 AI Agent 系统开发，同时享受音乐剧、F1 和游戏带来的乐趣。
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Jrx2003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              导航
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              联系方式
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.sjtu.edu.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                >
                  上海交通大学
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cuhk.edu.hk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                >
                  即将前往香港中文大学
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li className="text-xs pt-2 text-muted-foreground">
                通过 GitHub 联系
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Jerry Xu. Built with{" "}
            <Heart className="inline w-3 h-3 text-red-500 fill-red-500" /> and Next.js
          </p>
          <p className="text-xs text-muted-foreground/60">
            Designed & Developed by Jerry
          </p>
        </div>
      </div>
    </footer>
  );
}
