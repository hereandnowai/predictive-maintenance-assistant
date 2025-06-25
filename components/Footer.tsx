import React from 'react';

const SocialIcon: React.FC<{ href: string; title: string; children: React.ReactNode }> = ({ href, title, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={title}
    title={title}
    className="text-slate-400 hover:text-brand-primary transition-colors duration-200"
  >
    {children}
  </a>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-slate-400 text-center py-8 border-t-2 border-slate-700">
      <div className="container mx-auto px-4">
        <div className="mb-6 space-x-6 flex justify-center items-center">
          <SocialIcon href="https://hereandnowai.com/blog" title="Blog">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>
          </SocialIcon>
          <SocialIcon href="https://www.linkedin.com/company/hereandnowai/" title="LinkedIn">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </SocialIcon>
          <SocialIcon href="https://instagram.com/hereandnow_ai" title="Instagram">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.947-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </SocialIcon>
          <SocialIcon href="https://github.com/hereandnowai" title="GitHub">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </SocialIcon>
          <SocialIcon href="https://x.com/hereandnow_ai" title="X (Twitter)">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </SocialIcon>
          <SocialIcon href="https://youtube.com/@hereandnow_ai" title="YouTube">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 7.303C21.327 6.33 20.59 5.592 19.618 5.337C17.892 4.818 12 4.818 12 4.818C12 4.818 6.108 4.818 4.382 5.337C3.41 5.592 2.673 6.33 2.418 7.303C1.899 9.028 1.899 12 1.899 12C1.899 12 1.899 14.972 2.418 16.697C2.673 17.67 3.41 18.408 4.382 18.663C6.108 19.182 12 19.182 12 19.182C12 19.182 17.892 19.182 19.618 18.663C20.59 18.408 21.327 17.67 21.582 16.697C22.101 14.972 22.101 12 22.101 12C22.101 12 22.101 9.028 21.582 7.303ZM9.899 14.818V9.182L14.101 12L9.899 14.818Z"/></svg>
          </SocialIcon>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} HERE AND NOW AI. All rights reserved.
        </p>
        <p className="text-xs mt-3 text-slate-300 italic">
          designed with passion for innovation
        </p>
        <p className="text-xs mt-3 text-slate-500">
          Developed by R Kawshik [ AI Products Engineering Team ]
        </p>
        <p className="text-xs mt-3 text-slate-500">
          Powered by Gemini API. For demonstration purposes only.
        </p>
      </div>
    </footer>
  );
};