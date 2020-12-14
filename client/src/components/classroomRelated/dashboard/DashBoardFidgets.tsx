export function TasksFidget() {
  return (
    <div>
      <b>Tasks</b>
      <p>*2 uncompleted tasks</p>
    </div>
  );
}

export function LessonsFidget() {
  return (
    <div>
      <b>Lessons</b>
      <p>today: css basics</p>
    </div>
  );
}

const mockTasks = [
  {
    title: "React basics",
    deadline: new Date(),
    done: false,
    by: "Guy",
  },
  {
    title: "Spotify app",
    deadline: new Date(),
    done: true,
    by: "Nir",
  },
  {
    title: "rebuild challengeMe",
    deadline: new Date(),
    done: true,
    by: "Tomer",
  },
  {
    title: "Solve world Hunger",
    deadline: new Date(),
    done: true,
    by: "Society",
  },
];
export function ScheduleFidget() {
  return (
    <div>
      <b>Schedule</b>
      <p>today: checkpoint 16:00</p>
    </div>
  );
}
