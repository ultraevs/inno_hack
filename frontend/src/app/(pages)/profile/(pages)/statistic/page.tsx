"use client"

import { Gantt } from "@/components/Gantt";
import { withAuth } from "@/hoc/withAuth";

const Settings = () => {
  return (
    <div>
      <Gantt />
    </div>
  );
};

export default withAuth(Settings);
