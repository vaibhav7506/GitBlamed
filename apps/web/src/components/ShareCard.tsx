import { Copy, Download, Share2 } from "lucide-react";
import { shareImageUrl } from "../lib/api";

interface ShareCardProps {
  username: string;
  roastText: string;
}

export function ShareCard({ username, roastText }: ShareCardProps) {
  const imageUrl = shareImageUrl(username);

  async function copyLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/u/${username}`
    );
  }

  function openShare() {
    const shareUrl = `${window.location.origin}/u/${username}`;
    const text = encodeURIComponent(
      `${roastText}\n\nSee your verdict: ${shareUrl}`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
 return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="inline-flex h-11 items-center gap-2 rounded-md bg-[#f78166] px-4 font-bold text-[#0d1117] transition hover:bg-[#ffa28b]"
        onClick={openShare}
        type="button"
      >
        <Share2 size={18} />
        Share
      </button>
      <a
        className="inline-flex h-11 items-center gap-2 rounded-md border border-white/12 px-4 font-semibold text-[#e6edf3] transition hover:bg-white/8"
        href={imageUrl}
        download={`${username}-gitblamed.svg`}
      >
        <Download size={18} />
        SVG
      </a>
      <button
        className="inline-flex h-11 items-center gap-2 rounded-md border border-white/12 px-4 font-semibold text-[#e6edf3] transition hover:bg-white/8"
        onClick={copyLink}
        type="button"
      >
        <Copy size={18} />
        Copy link
      </button>
    </div>
  );
}

