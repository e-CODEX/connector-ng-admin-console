/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Card } from "@heroui/react";

interface MessageConsolePanelProps {
  content?: string;
}

export function MessageConsolePanel({
  content = "Ready.",
}: MessageConsolePanelProps) {
  return (
    <Card className="border border-separator">
      <div className="border-b border-separator px-4 py-3">
        <h3 className="text-sm font-semibold">Console logs</h3>
      </div>

      <div className="p-0">
        <pre className="h-56 overflow-y-auto bg-black px-4 py-4 font-mono text-xs text-green-400">
          {content}
        </pre>
      </div>
    </Card>
  );
}