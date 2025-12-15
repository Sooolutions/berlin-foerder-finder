
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full pt-4 px-4 bg-transparent">
      <header className="container mx-auto bg-secondary rounded-[12px] py-4 px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-[20px] font-semibold text-foreground">
            <img src={logo} alt="MehrDrin Logo" className="h-8 w-auto" />
            MehrDrin
          </Link>
          <nav className="flex items-center gap-12">
            <Link to="/about" className="text-[20px] text-foreground hover:text-primary transition-colors">
              über uns
            </Link>
            <Link to="/blog" className="text-[20px] text-foreground hover:text-primary transition-colors">
              blog
            </Link>
            <Button 
              onClick={() => navigate("/questionnaire")}
              className="bg-foreground hover:bg-foreground/90 text-background text-[20px] px-6 py-2 rounded-[10px]"
            >
              start
            </Button>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
