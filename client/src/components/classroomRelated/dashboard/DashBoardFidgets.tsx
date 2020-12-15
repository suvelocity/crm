import {
  TitleWrapper,
  H1,
  Wrapper,
  Center,
} from "../../../styles/styledComponents";
const mockTasks = [
  {
    title: "Build challenge app",
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
    title: "Break into Penthagon's servers",
    deadline: new Date(),
    done: true,
    by: "Rotem",
  },
];

// export function Fidget({type, data}:{type:string,data: any[]}){
//   switch
// }

export function TasksFidget() {
  const allTasks: any[] = mockTasks;
  const completedTasks: any[] = [];
  const incompleteTasks: any[] = [];

  allTasks.forEach((task: any) => {
    if (task.done) completedTasks.push(task);
    else incompleteTasks.push(task);
  });

  return (
    <Wrapper style={{ height: "60%" }}>
      <Center>
        <TitleWrapper>
          <H1>Tasks</H1>
        </TitleWrapper>
      </Center>
      <p>
        <b>Completed Tasks</b>
        {completedTasks.map((task: any) => (
          <li>{task.title}</li>
        ))}
        <b>Incompleted Tasks</b>
        {incompleteTasks.map((task: any) => (
          <li>{task.title}</li>
        ))}
      </p>
    </Wrapper>
  );
}

const mockLessons = [
  {
    title: "React basics",
    Teacher: "Guy",
    time: "9:30",
  },
];
export function LessonsFidget() {
  const todayLessons: any[] = mockLessons;

  return (
    <Wrapper style={{ height: "60%" }}>
      <Center>
        <TitleWrapper>
          <H1>Lessons</H1>
        </TitleWrapper>
      </Center>
      <p>
        {todayLessons.map((lesson: any) => (
          <li>{lesson.title}</li>
        ))}{" "}
      </p>
    </Wrapper>
  );
}

export function ScheduleFidget() {
  return (
    <Wrapper style={{ height: "60%" }}>
      <Center>
        <TitleWrapper>
          <H1>Schedule</H1>
        </TitleWrapper>
      </Center>
      <p>checkpoint 16:00</p>
    </Wrapper>
  );
}
