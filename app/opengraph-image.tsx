import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#111827",
                    color: "#fff",
                }}
            >
                <div style={{ fontSize: 72, fontWeight: 700 }}>Ledgerline</div>
                <div style={{ fontSize: 28, marginTop: 16, color: "#9ca3af" }}>
                    A concurrency-safe digital wallet
                </div>
            </div>
        ),
        { ...size }
    );
}
