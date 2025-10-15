// NOTE: This file is auto-generated from the latest Canva design.
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, CheckCircle2, ClipboardCheck, Wrench, Workflow, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PBE_GREEN = "#00a651";

type Part = { id: string; name: string; qty?: string };
type Item = {
  id: string;
  title: string;
  notes?: string;
  techDone: boolean;
  siteVerified: boolean;
  parts: Part[];
  techName?: string;
  siteChecker?: string;
};
type SubAssetKey = "CSS092" | "CSS068" | "CSS023";
type SubAsset = { id: SubAssetKey; name: string; items: Item[] };

const seed: Record<SubAssetKey, Omit<SubAsset, "id">> = {
  CSS092: {
    name: "Sub #1 – CSS092",
    items: [
      { id: "i1", title: "Sleeve damaged LV cables from transformer to LV board", techDone: false, siteVerified: false, parts: [] },
      { id: "i2", title: "Install/secure all cable glands to backing plates", techDone: false, siteVerified: false, parts: [] },
      { id: "i3", title: "Re-terminate fan cable into fan motor", techDone: false, siteVerified: false, parts: [] },
      { id: "i4", title: "Busbar – add screws to secure any loose plates", techDone: false, siteVerified: false, parts: [] },
      { id: "i5", title: "General clean-up of area", techDone: false, siteVerified: false, parts: [] },
    ],
  },
  CSS068: {
    name: "Sub #2 – CSS068",
    items: [
      { id: "i1", title: "Repair damaged control cables", techDone: false, siteVerified: false, parts: [] },
      { id: "i2", title: "Repair/replace broken trunking", techDone: false, siteVerified: false, parts: [] },
      { id: "i3", title: "Replace hinges in ABB section", techDone: false, siteVerified: false, parts: [] },
      { id: "i4", title: "General clean-up of area", techDone: false, siteVerified: false, parts: [] },
    ],
  },
  CSS023: {
    name: "Sub #3 – CSS023",
    items: [
      { id: "i1", title: "Reinstall internal light", techDone: false, siteVerified: false, parts: [] },
      { id: "i2", title: "Fix/secure conduit for light", techDone: false, siteVerified: false, parts: [] },
      { id: "i3", title: "General clean-up of area", techDone: false, siteVerified: false, parts: [] },
    ],
  },
};

const uid = () => Math.random().toString(36).slice(2, 9);
const STORAGE_KEY = "pbe-sub-repair-app-v4";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function saveState(state: Record<SubAssetKey, SubAsset>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function subProgress(sub: SubAsset) {
  const total = sub.items.length;
  const done = sub.items.filter((i) => i.techDone && i.siteVerified).length;
  return total ? Math.round((done / total) * 100) : 0;
}

const App: React.FC = () => {
  const [siteName] = useState("T2D Precast Facility");
  const [dateStr, setDateStr] = useState(() => new Date().toLocaleString());
  const [subs, setSubs] = useState<Record<SubAssetKey, SubAsset>>(() => {
    const loaded = loadState();
    if (loaded) return loaded;
    return {
      CSS092: { id: "CSS092", ...seed.CSS092 },
      CSS068: { id: "CSS068", ...seed.CSS068 },
      CSS023: { id: "CSS023", ...seed.CSS023 },
    };
  });
  useEffect(() => {
    saveState(subs);
  }, [subs]);

  const containerRef = useRef<HTMLDivElement>(null);

  const updateItem = useCallback((which: SubAssetKey, id: string, patch: Partial<Item>) => {
    setSubs((prev) => {
      const copy = { ...prev };
      copy[which] = { ...copy[which], items: copy[which].items.map((i) => (i.id === id ? { ...i, ...patch } : i)) };
      return copy;
    });
  }, []);

  const addItem = useCallback((which: SubAssetKey) => {
    setSubs((prev) => {
      const copy = { ...prev };
      copy[which].items.push({ id: uid(), title: "New item – describe work required", techDone: false, siteVerified: false, parts: [] });
      return copy;
    });
  }, []);

  const overallPct = useMemo(() => {
    const subsArray = Object.values(subs);
    const avg = subsArray.reduce((acc, s) => acc + subProgress(s), 0) / subsArray.length;
    return Math.round(avg);
  }, [subs]);

  const allComplete = useMemo(() => {
    const everySubComplete = Object.values(subs).every((s) => s.items.every((i) => i.techDone && i.siteVerified));
    return everySubComplete;
  }, [subs]);

  // ---------------- PDF EXPORT ----------------
  const exportPDF = useCallback(async () => {
    if (!containerRef.current) return;

    // Keep timestamp fresh
    setDateStr(new Date().toLocaleString());

    const node = containerRef.current;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 18; // pt
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight - margin * 2) {
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    } else {
      // slice into multiple pages
      let sY = 0;
      const ratio = imgWidth / canvas.width;
      const usableHeight = pageHeight - margin * 2;

      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.floor(usableHeight / ratio);

      while (sY < canvas.height) {
        const sliceHeight = Math.min(pageCanvas.height, canvas.height - sY);
        pageCtx!.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx!.drawImage(
          canvas,
          0,
          sY,
          canvas.width,
          sliceHeight,
          0,
          0,
          pageCanvas.width,
          sliceHeight
        );
        const sliceData = pageCanvas.toDataURL("image/png");
        if (sY > 0) pdf.addPage();
        pdf.addImage(sliceData, "PNG", margin, margin, imgWidth, (sliceHeight * imgWidth) / canvas.width);
        sY += sliceHeight;
      }
    }

    pdf.save(`PBE-Sub-Repair-${new Date().toISOString().slice(0, 10)}.pdf`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6" ref={containerRef}>
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow mb-6 border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: PBE_GREEN }}>
              <span className="text-white font-bold">PBE</span>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Sub Damage Rectification</div>
              <div className="text-xl font-semibold text-zinc-800">Technician Checklist & Site Verification</div>
              <div className="text-[11px] text-zinc-500">Site: {siteName} • {dateStr}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={exportPDF}
              disabled={!allComplete}
              className={`rounded-xl ${allComplete ? "bg-green-600 hover:bg-green-700" : "bg-gray-200 text-gray-500"}`}
              title={allComplete ? "Export completed report as PDF" : "Complete all items (Tech + Verify) to enable PDF"}
            >
              <FileDown className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Overall progress */}
        <Card className="mb-6 border-zinc-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-700">
                <Workflow className="h-5 w-5" />
                <span className="text-sm">Overall Project Completion</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-zinc-200">
                <div className="text-xs text-zinc-600">{overallPct}%</div>
                <Progress value={overallPct} className="w-52" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs per Sub */}
        <Tabs defaultValue="CSS092">
          <TabsList className="bg-white text-zinc-700 mb-4 border border-zinc-200 rounded-xl">
            <TabsTrigger value="CSS092">CSS092</TabsTrigger>
            <TabsTrigger value="CSS068">CSS068</TabsTrigger>
            <TabsTrigger value="CSS023">CSS023</TabsTrigger>
          </TabsList>

          {(["CSS092", "CSS068", "CSS023"] as SubAssetKey[]).map((key) => {
            const sub = subs[key];
            const pct = subProgress(sub);
            return (
              <TabsContent value={key} key={key}>
                <Card className="shadow border-zinc-200">
                  <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>{sub.name}</CardTitle>
                      <div className="text-xs text-zinc-500">Mark items as completed, then request Site Verification for each before final sign-off.</div>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-zinc-200">
                      <div className="text-xs text-zinc-600">{pct}%</div>
                      <Progress value={pct} className="w-40" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    {sub.items.map((it) => (
                      <div key={it.id} className={`grid grid-cols-12 gap-4 p-4 rounded-xl border ${it.techDone && it.siteVerified ? "border-green-500 bg-green-50" : "border-zinc-200 bg-white"}`}>
                        <div className="col-span-12 lg:col-span-6">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <Wrench className="h-4 w-4" /> {it.title}
                          </div>
                          <Textarea className="mt-2" placeholder="Notes / anomaly details" value={it.notes || ""} onChange={(e) => updateItem(key, it.id, { notes: e.target.value })} />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
                          <div className="text-xs font-medium">Technician action</div>
                          <Button onClick={() => updateItem(key, it.id, { techDone: !it.techDone })} className={`w-full ${it.techDone ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700 text-white"}`}>
                            {it.techDone ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <ClipboardCheck className="mr-2 h-4 w-4" />}
                            {it.techDone ? "Marked Done" : "Mark Done"}
                          </Button>
                          <label className="text-xs text-zinc-500">Technician Name</label>
                          <Input value={it.techName || ""} onChange={(e) => updateItem(key, it.id, { techName: e.target.value })} placeholder="Type full name of person who completed work" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
                          <div className="text-xs font-medium">Site verification</div>
                          <Button onClick={() => updateItem(key, it.id, { siteVerified: !it.siteVerified })} disabled={!it.techDone} className={`w-full ${it.siteVerified ? "bg-green-600 text-white hover:bg-green-700" : "bg-white border border-red-300 text-red-700 hover:bg-red-50"}`}>
                            {it.siteVerified ? "Verified" : "Verify (after Tech)"}
                          </Button>
                          <label className="text-xs text-zinc-500">Checked By (Site)</label>
                          <Input value={it.siteChecker || ""} onChange={(e) => updateItem(key, it.id, { siteChecker: e.target.value })} placeholder="Type full name of site verifier" />
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <Button onClick={() => addItem(key)} className="rounded-xl bg-white border border-zinc-200 hover:bg-gray-50 text-zinc-700">
                        <Plus className="h-4 w-4 mr-1" /> Add New Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="mt-8 text-center text-xs text-zinc-400">© {new Date().getFullYear()} Pyott Boone Electronics – Sub Repair & Verification • CSS092 • CSS068 • CSS023</div>
      </div>
    </div>
  );
};

export default App;