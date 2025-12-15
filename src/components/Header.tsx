
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full pt-4 px-4 bg-transparent">
      <header className="container mx-auto bg-secondary rounded-[12px] py-4 px-6">
        <div className="flex justify-between items-center">
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
    </div>
  );
};

export default Header;
