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

        {/* Featured Post */}
        <div className="mb-12">
          <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-[4/3] lg:aspect-auto bg-muted overflow-hidden">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Neuester Artikel
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blogPosts[0].date).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{blogPosts[0].readTime}</span>
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors duration-200">
                  {blogPosts[0].title}
                </CardTitle>
                
                <CardDescription className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {blogPosts[0].description}
                </CardDescription>
                
                <Button 
                  size="lg"
                  className="self-start group/btn"
                >
                  Jetzt lesen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Pinterest-style Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Weitere Artikel</h2>
          
          <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
            {blogPosts.slice(1).map((post, index) => (
              <Card 
                key={post.id} 
                className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 break-inside-avoid mb-8 ${
                  index % 3 === 0 ? 'bg-gradient-to-br from-primary/5 to-secondary/5' : 
                  index % 3 === 1 ? 'bg-gradient-to-br from-secondary/5 to-accent/5' : 
                  'bg-card'
                }`}
              >
                <div className={`${index % 4 === 0 ? 'aspect-[3/2]' : index % 4 === 1 ? 'aspect-square' : index % 4 === 2 ? 'aspect-[4/3]' : 'aspect-[3/4]'} bg-muted rounded-t-lg overflow-hidden`}>
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-2">
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
                  
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {post.description}
                  </CardDescription>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="p-0 h-auto font-semibold text-primary hover:text-primary/80 group/btn"
                  >
                    Weiterlesen
                    <ArrowRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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