import type { Metadata } from "next";
import TermsContent from "@/components/TermsContent";

export const metadata: Metadata = {
  title: "شرایط استفاده",
};

export default function TermsPage() {
  return <TermsContent />;
}
