
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full py-4 bg-secondary">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-[20px] font-semibold text-foreground">
          MehrDrin
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/about" className="text-[20px] text-foreground hover:text-primary transition-colors">
            Über uns
          </Link>
          <Link to="/blog" className="text-[20px] text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
          <Button 
            onClick={() => navigate("/questionnaire")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-[20px] px-6 py-2 rounded-full"
          >
            Start
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
