/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useState } from "react";
import { Button } from "@heroui/react";
import { EyeOff } from "lucide-react";
import { Eye } from "@gravity-ui/icons";

export function ConfigurationSecretValue({ value }: { value: string }) {
    const [shown, setShown] = useState(false);
    return (
        <span className="inline-flex items-center gap-2">
      <span className={shown ? undefined : "text-neutral-400"}>{shown ? value : "••••••••••"}</span>
      <Button
          size="sm"
          variant="tertiary"
          aria-label={shown ? "Hide value" : "Reveal value"}
          onPress={() => setShown((s) => !s)}
      >
        {shown ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
      </Button>
    </span>
    );
}
