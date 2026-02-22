function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <span className="app-footer-brand">Store Rating Platform</span>
      <span className="app-footer-credit">Developed by Souvik Banerjee</span>
      <span className="app-footer-year">© {year}</span>
    </footer>
  );
}

export default Footer;
