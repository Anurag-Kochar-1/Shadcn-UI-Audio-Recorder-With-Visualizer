import { AudioRecorder } from "@/components/audio-recorder-and-visualizer";
import { ThemeDropdownMenu } from "@/components/theme-dropdown-menu";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-10">
        <ThemeDropdownMenu />
        <AudioRecorder />
    </main>
  );
}
