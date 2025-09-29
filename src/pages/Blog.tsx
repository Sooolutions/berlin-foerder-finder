import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "5 Tipps für erfolgreiche Förderanträge in Berlin",
    description: "Erfahren Sie, wie Sie Ihre Chancen auf eine erfolgreiche Förderung in Berlin maximieren können. Von der richtigen Vorbereitung bis zur Antragstellung.",
    image: "/placeholder.svg",
    date: "2024-03-15",
    readTime: "5 Min",
    category: "Förderung"
  },
  {
    id: 2,
    title: "Neue Förderprogramme für Berliner Gründer:innen",
    description: "Die neuesten Entwicklungen bei Berliner Förderprogrammen für Startups und Gründer:innen. Was hat sich 2024 geändert und welche Chancen bieten sich?",
    image: "/placeholder.svg",
    date: "2024-03-12",
    readTime: "7 Min",
    category: "Gründung"
  },
  {
    id: 3,
    title: "Finanzielle Unterstützung für Familien in Berlin",
    description: "Ein umfassender Überblick über alle verfügbaren Familienförderungen, Kindergeld-Zusätze und Unterstützungsmöglichkeiten für Berliner Familien.",
    image: "/placeholder.svg",
    date: "2024-03-10",
    readTime: "6 Min",
    category: "Familie"
  },
  {
    id: 4,
    title: "Weiterbildungsförderung: Investieren Sie in Ihre Zukunft",
    description: "Bildungsschecks, Qualifizierungsprogramme und andere Möglichkeiten der Weiterbildungsförderung in Berlin im Detail erklärt.",
    image: "/placeholder.svg",
    date: "2024-03-08",
    readTime: "8 Min",
    category: "Bildung"
  },
  {
    id: 5,
    title: "Wohnungsförderung in Berlin: Ihr Weg zur eigenen Wohnung",
    description: "Von Wohnberechtigungsschein bis Eigentumsförderung - alle wichtigen Informationen zur Wohnungsförderung in der Hauptstadt.",
    image: "/placeholder.svg",
    date: "2024-03-05",
    readTime: "9 Min",
    category: "Wohnen"
  },
  {
    id: 6,
    title: "Förderungen für Senioren: Aktiv im Alter",
    description: "Spezielle Programme und Unterstützungsmöglichkeiten für ältere Berliner:innen. Vom Ehrenamt bis zur Gesundheitsförderung.",
    image: "/placeholder.svg",
    date: "2024-03-01",
    readTime: "4 Min",
    category: "Senioren"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Förderung & Finanzen Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bleiben Sie auf dem Laufenden mit den neuesten Informationen über Fördermöglichkeiten, 
            Finanzierungstipps und wichtige Änderungen in der Berliner Förderungslandschaft.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                  {post.description}
                </CardDescription>
                
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-semibold text-primary hover:text-primary/80 group/btn"
                >
                  Weiterlesen
                  <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-16">
          <Button size="lg" variant="outline" className="px-8">
            Weitere Artikel laden
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;