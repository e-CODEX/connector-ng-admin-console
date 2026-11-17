/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AttachmentsAdminPage from "./page";
import { saveFile, toastError } from "@/utils";
import { type ConnectorAttachmentResponse } from "@/types/response/attachments";
import { anAttachment, ATTACHMENT_ID } from "@test/fixtures/attachments";
import { mockList } from "@test/helpers/mock-paged-list";
import type * as Utils from "@/utils";

const { downloadAttachment } = vi.hoisted(() => ({
    downloadAttachment: vi.fn(),
}));

vi.mock("@/hooks/use-http-service", () => ({
    useAttachmentService: () => ({
        listAttachments: vi.fn(),
        downloadAttachment,
    }),
}));

vi.mock("@/hooks/use-paged-list");
vi.mock("@/utils", async (importOriginal) => ({
    ...(await importOriginal<typeof Utils>()),
    saveFile: vi.fn(),
    toastError: vi.fn(),
}));
vi.mock("@/components/common/load-error-state", () => ({
    LoadErrorState: ({
        title,
        onRetry,
    }: {
        title: string;
        onRetry: () => void;
    }) => (
        <div>
            <p>{title}</p>
            <button onClick={onRetry}>retry</button>
        </div>
    ),
}));

describe("AttachmentsAdminPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("table rendering", () => {
        it("should_show_empty_state_when_no_attachments", () => {
            mockList<ConnectorAttachmentResponse>();
            render(<AttachmentsAdminPage />);
            expect(
                screen.getByText("No attachment available"),
            ).toBeInTheDocument();
        });

        it("should_render_a_row_per_attachment", () => {
            mockList<ConnectorAttachmentResponse>({
                items: [
                    anAttachment(),
                    anAttachment({ identifier: "att-2", name: "Form_B.pdf" }),
                ],
                totalElements: 2,
            });
            render(<AttachmentsAdminPage />);
            expect(screen.getByText("Form_A.pdf")).toBeInTheDocument();
            expect(screen.getByText("Form_B.pdf")).toBeInTheDocument();
        });
    });

    describe("refresh", () => {
        it("should_refresh_the_list_when_refresh_button_is_clicked", async () => {
            const state = mockList<ConnectorAttachmentResponse>();

            render(<AttachmentsAdminPage />);

            await userEvent.click(
                screen.getByRole("button", { name: /refresh/i }),
            );

            expect(state.refresh).toHaveBeenCalled();
        });
    });

    describe("details", () => {
        it("should_open_attachment_details_when_details_button_is_clicked", async () => {
            mockList<ConnectorAttachmentResponse>({
                items: [anAttachment()],
                totalElements: 1,
            });

            render(<AttachmentsAdminPage />);

            await userEvent.click(
                screen.getByRole("button", { name: /details/i }),
            );

            const dialog = await screen.findByRole("dialog");

            expect(
                within(dialog).getByText("Attachment Details"),
            ).toBeInTheDocument();

            expect(within(dialog).getByText("Identifier")).toBeInTheDocument();
            expect(within(dialog).getByText("Name")).toBeInTheDocument();
            expect(
                within(dialog).getByText("Content type"),
            ).toBeInTheDocument();
            expect(within(dialog).getByText("Description")).toBeInTheDocument();
            expect(within(dialog).getByText("Size")).toBeInTheDocument();
            expect(within(dialog).getByText("Storage")).toBeInTheDocument();
            expect(within(dialog).getByText("Type")).toBeInTheDocument();
            expect(within(dialog).getByText("Status")).toBeInTheDocument();
            expect(within(dialog).getByText("Created at")).toBeInTheDocument();
            expect(within(dialog).getByText("Updated at")).toBeInTheDocument();

            expect(within(dialog).getByText("Form_A.pdf")).toBeInTheDocument();
        });
    });

    describe("download", () => {
        it("should_disable_download_when_attachment_is_deleted", () => {
            mockList<ConnectorAttachmentResponse>({
                items: [anAttachment({ deletedAt: "2026-11-01T00:00:00Z" })],
                totalElements: 1,
            });
            render(<AttachmentsAdminPage />);
            expect(
                screen.getByRole("button", { name: /download/i }),
            ).toBeDisabled();
        });

        it("should_not_download_when_attachment_is_deleted", async () => {
            mockList<ConnectorAttachmentResponse>({
                items: [
                    anAttachment({
                        deletedAt: "2026-11-01T00:00:00Z",
                    }),
                ],
                totalElements: 1,
            });

            render(<AttachmentsAdminPage />);

            const downloadButton = screen.getByRole("button", {
                name: /download/i,
            });

            expect(downloadButton).toBeDisabled();

            await userEvent.click(downloadButton);

            expect(downloadAttachment).not.toHaveBeenCalled();
            expect(saveFile).not.toHaveBeenCalled();
        });

        it("should_download_and_save_file_when_download_is_clicked", async () => {
            const file = new Blob(["content"]);
            downloadAttachment.mockResolvedValue(file);
            mockList<ConnectorAttachmentResponse>({
                items: [anAttachment()],
                totalElements: 1,
            });
            render(<AttachmentsAdminPage />);

            await userEvent.click(
                screen.getByRole("button", { name: /download/i }),
            );

            expect(downloadAttachment).toHaveBeenCalledWith(
                ATTACHMENT_ID,
                "Form_A.pdf",
            );
            expect(saveFile).toHaveBeenCalledWith(file);
        });

        it("should_not_save_file_when_download_fails", async () => {
            downloadAttachment.mockRejectedValue(new Error("Download failed"));

            mockList<ConnectorAttachmentResponse>({
                items: [anAttachment()],
                totalElements: 1,
            });

            render(<AttachmentsAdminPage />);

            await userEvent.click(
                screen.getByRole("button", { name: /download/i }),
            );

            expect(downloadAttachment).toHaveBeenCalledWith(
                ATTACHMENT_ID,
                "Form_A.pdf",
            );

            expect(saveFile).not.toHaveBeenCalled();
            expect(toastError).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Download failed",
                }),
            );
        });
    });

    describe("error handling", () => {
        it("should_show_retry_when_load_fails", async () => {
            const state = mockList<ConnectorAttachmentResponse>({
                loadError: new Error("boom"),
            } as never);
            render(<AttachmentsAdminPage />);
            expect(
                screen.getByText("Could not load attachments"),
            ).toBeInTheDocument();
            await userEvent.click(
                screen.getByRole("button", { name: /retry/i }),
            );
            expect(state.retry).toHaveBeenCalled();
        });
    });
});
