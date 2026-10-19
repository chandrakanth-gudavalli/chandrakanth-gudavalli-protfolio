export default function LinkChips({ links, className = "chips", children }) {
  return (
    <div className={`${className} mono`}>
      {links.map(({ label, href }) => {
        const external = href.startsWith("http");
        return (
          <a
            key={label}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {label}
          </a>
        );
      })}
      {children}
    </div>
  );
}
