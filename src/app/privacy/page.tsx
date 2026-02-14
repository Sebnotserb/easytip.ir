import type { Metadata } from "next";
import PrivacyContent from "@/components/PrivacyContent";

export const metadata: Metadata = {
  title: "حریم خصوصی",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
