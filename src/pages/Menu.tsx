import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, ArrowLeft, Search } from "lucide-react";
import MenuCard from "@/components/MenuCard";
import { categories } from "@/data/menuData";
import { supabase } from "@/integrations/supabase/client";
import type { MenuItem } from "@/data/menuData";

const Menu = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "cn">("en");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage") as "en" | "cn" | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching menu items:", error);
    } else if (data) {
      const transformedData: MenuItem[] = data.map((item) => ({
        id: item.id,
        categoryEn: item.category_en,
        categoryCn: item.category_cn,
        nameEn: item.name_en,
        nameCn: item.name_cn,
        price: Number(item.price),
        images: item.image_urls || ["/placeholder.svg"],
        ingredientsEn: item.ingredients_en || "",
        ingredientsCn: item.ingredients_cn || "",
      }));
      setMenuItems(transformedData);
    }
    setLoading(false);
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "cn" : "en";
    setLanguage(newLang);
    localStorage.setItem("selectedLanguage", newLang);
  };

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.categoryEn === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameCn.includes(searchQuery) ||
      (item.ingredientsEn && item.ingredientsEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ingredientsCn && item.ingredientsCn.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

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

      {/* Search and Category Filter */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === "en" ? "Search menu items..." : "搜索菜品..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          
          {/* Category Filter */}
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
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {language === "en" ? "Loading menu..." : "加载菜单..."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredMenu.map((item) => (
                <MenuCard key={item.id} item={item} language={language} />
              ))}
            </div>

            {filteredMenu.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  {language === "en" 
                    ? searchQuery 
                      ? "No items match your search" 
                      : "No items found in this category"
                    : searchQuery
                      ? "没有找到匹配的菜品"
                      : "此类别中没有项目"}
                </p>
              </div>
            )}
          </>
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
