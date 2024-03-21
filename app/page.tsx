import { AudioRecorderWithVisualizer } from "@/components/audio-recorder-with-visualizer";
import { Particles } from "@/components/particles";
import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page";
import { Github } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <div className="container relative flex-1 flex flex-col justify-center items-center min-h-screen">
      <Particles className="absolute inset-0 -z-10 " />
      <PageHeader>
        <PageHeaderHeading>Audio recorder with visualizer.</PageHeaderHeading>
        <AudioRecorderWithVisualizer className="my-12 w-full max-w-full" />
        <PageHeaderDescription>
          Built on top of Shadcn UI. Simply copy the source code by clicking
          below. No npm install required, all in under 400 lines of code
        </PageHeaderDescription>
        <PageActions>
          <Link
            target="_blank"
            rel="noreferrer"
            href={`https://github.com/Anurag-Kochar-1/Shadcn-UI-Audio-Recorder-With-Visualizer`}
          >
            <Button variant={"secondary"} className="border-2">
              {" "}
              <Github className="mr-2" size={20} /> <span>Source code</span>{" "}
            </Button>
          </Link>
        </PageActions>
      </PageHeader>
    </div>
  );
}
