import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const STORAGE_KEY = "mehrdrin_construction_notice_seen";

/**
 * Hinweis-Pop-up "Seite im Aufbau". Erscheint beim ersten Seitenaufruf einer
 * Browsersitzung. Gespeichert wird nur ein technisches Merkmal im
 * sessionStorage (passt zur Datenschutzerklärung, wird beim Schließen des
 * Tabs gelöscht).
 */
const ConstructionNotice = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* Speicher nicht verfügbar, Hinweis erscheint dann erneut */
      }
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 pt-10 text-center shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Close
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Hinweis schließen"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>

          <div className="mb-4 text-6xl leading-none" role="img" aria-label="Baustelle">
            🚧
          </div>
          <DialogPrimitive.Title className="mb-3 text-2xl font-semibold">
            Hier wird noch gebaut
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-base leading-relaxed text-muted-foreground">
            MehrDrin befindet sich derzeit im Aufbau. Datenbank, Fragebogen und
            Ergebnisdarstellung werden fortlaufend erweitert und geprüft, weshalb
            einzelne Angaben noch unvollständig oder fehlerhaft sein können. Wir
            freuen uns dennoch, wenn du dich schon jetzt umschaust.
          </DialogPrimitive.Description>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ConstructionNotice;
