import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft } from "lucide-react";
import MenuCard from "@/components/MenuCard";
import { menuData, categories } from "@/data/menuData";

const Menu = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "cn">("en");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage") as "en" | "cn" | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "cn" : "en";
    setLanguage(newLang);
    localStorage.setItem("selectedLanguage", newLang);
  };

  const filteredMenu = selectedCategory === "All" 
    ? menuData 
    : menuData.filter(item => item.categoryEn === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Peacock London
              </h1>
              <p className="text-sm text-muted-foreground">孔雀餐厅</p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleLanguage}
              className="border-primary/20 hover:bg-primary/5"
            >
              <Globe className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat.en}
                variant={selectedCategory === cat.en ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.en)}
                className={`flex-shrink-0 ${
                  selectedCategory === cat.en
                    ? "bg-primary hover:bg-primary/90 shadow-elegant"
                    : "hover:bg-muted"
                }`}
              >
                {language === "en" ? cat.en : cat.cn}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredMenu.map((item) => (
            <MenuCard key={item.id} item={item} language={language} />
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {language === "en" ? "No items found in this category" : "此类别中没有项目"}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Peacock London</h2>
          <p className="text-muted-foreground">
            {language === "en" 
              ? "Authentic Chinese Cuisine" 
              : "正宗中国菜"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
