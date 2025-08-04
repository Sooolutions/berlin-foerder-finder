
const Footer = () => {
  return (
    <footer className="w-full py-6 bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © 2025 DrinFürDich. Alle Rechte vorbehalten.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-600 hover:text-berlin-blue">
              Impressum
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-berlin-blue">
              Datenschutz
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-berlin-blue">
              Kontakt
            </a>
          </div>
        </div>
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Diese Plattform dient als Orientierungshilfe. Alle Angaben ohne Gewähr.</p>
          <p className="mt-1">Daten basierend auf öffentlichen Quellen der Berliner und deutschen Verwaltungen.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
