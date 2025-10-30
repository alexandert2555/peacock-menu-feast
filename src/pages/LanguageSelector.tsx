import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LanguageSelector = () => {
  const navigate = useNavigate();

  const selectLanguage = (lang: "en" | "cn") => {
    localStorage.setItem("selectedLanguage", lang);
    navigate("/menu");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-4">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Peacock London
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            孔雀餐厅
          </p>
        </div>

        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="space-y-3">
          <p className="text-lg text-muted-foreground">Select Your Language</p>
          <p className="text-lg text-muted-foreground">选择您的语言</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => selectLanguage("en")}
            size="lg"
            className="min-w-[200px] h-14 text-lg bg-primary hover:bg-primary/90 shadow-elegant transition-all hover:scale-105"
          >
            English
          </Button>
          <Button
            onClick={() => selectLanguage("cn")}
            size="lg"
            className="min-w-[200px] h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant transition-all hover:scale-105"
          >
            中文
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
