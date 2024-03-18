import { AudioRecorderWithVisualizer } from "@/components/audio-recorder-with-visualizer";
import { ThemeDropdownMenu } from "@/components/theme-dropdown-menu";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full items-center justify-start p-2 lg:p-24 gap-10">
      <ThemeDropdownMenu />
      <AudioRecorderWithVisualizer />
    </main>
  );
}
