import { Greeting } from "@/components/Greeting";
import { ProjectProgress } from "@/components/ProjectProgress";

export default function Profile() {
  return (
    <div>
      <Greeting userName="Kostya" />
      <ProjectProgress projectName="Хакатон" progress={50} />
    </div>
  );
}
