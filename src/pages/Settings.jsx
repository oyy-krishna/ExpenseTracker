import { useRef, useState } from "react";
import { Download, Moon, Sparkles, Sun, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { CURRENCIES } from "@/data/defaults";

export default function Settings() {
  const { settings, setSettings, transactions, exportData, importData, loadSampleData, clearAll } = useFinance();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(settings.name || "");
  const fileRef = useRef(null);

  const saveName = () => {
    const trimmed = name.trim().slice(0, 30);
    if (trimmed === (settings.name || "")) return;
    setSettings((s) => ({ ...s, name: trimmed }));
    toast.success(trimmed ? `Hi ${trimmed}! 💕` : "Name removed");
  };

  const onImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const count = importData(JSON.parse(await file.text()));
      toast.success("Backup restored", { description: `${count} transactions imported` });
    } catch (err) {
      toast.error("Couldn’t import that file", { description: err.message });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-fade-up">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Personalise Bloom and manage your data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile & preferences</CardTitle>
          <CardDescription>Used for greetings and number formatting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              placeholder="What should we call you?"
              value={name}
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          </div>
          <div className="grid gap-2">
            <Label>Currency</Label>
            <Select value={settings.currency} onValueChange={(currency) => setSettings((s) => ({ ...s, currency }))}>
              <SelectTrigger aria-label="Currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} · {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Appearance</Label>
            <Tabs value={theme} onValueChange={setTheme}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="light">
                  <Sun className="h-4 w-4" /> Light
                </TabsTrigger>
                <TabsTrigger value="dark">
                  <Moon className="h-4 w-4" /> Dark
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>
            {transactions.length} transactions stored privately in this browser’s LocalStorage.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={exportData} disabled={!transactions.length}>
            <Download /> Export backup
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload /> Import backup
          </Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} />
          <Button
            variant="outline"
            onClick={() => {
              loadSampleData();
              toast.success("Sample data added ✨");
            }}
          >
            <Sparkles /> Add sample data
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 /> Erase everything
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Erase all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes every transaction and resets categories. Consider exporting a backup first.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my data</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    clearAll();
                    toast.success("All data erased");
                  }}
                >
                  Erase everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <p className="pb-2 text-center text-xs text-muted-foreground">Made with 💗 · Bloom v1.0</p>
    </div>
  );
}
