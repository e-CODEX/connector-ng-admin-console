/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client";

import { Button } from "@heroui/react";

interface MessageActionBarProps {
  isPending?: boolean;
  onSend?: () => void;
  onSaveAsXml?: () => void;
}

export function MessageActionBar({
  isPending = false,
  onSend,
  onSaveAsXml,
}: MessageActionBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="primary"
        isPending={isPending}
        onPress={onSend}
      >
        {isPending ? "Sending..." : "Send message"}
      </Button>

      <Button
        variant="secondary"
        isDisabled={isPending}
        onPress={onSaveAsXml}
      >
        Save as XML
      </Button>
    </div>
  );
}