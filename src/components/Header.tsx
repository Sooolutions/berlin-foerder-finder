
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full py-4 border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-berlin-blue">
          DrinFürDich
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-berlin-blue">
                Start
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-berlin-blue">
                Über uns
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
